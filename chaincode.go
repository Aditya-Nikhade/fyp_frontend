package main

import (
	"encoding/json"
	"fmt"
	"math"
	"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

const (
	numProducers         = 3
	numConsumers         = 6
	convergenceThreshold = 0.00009                      // From Python/MATLAB script (epsPrice in your demo.txt)
	stepL                = 0.005                        // Price update step from Python/MATLAB
	stepU                = 0.0001                       // Dual variable step for demand bounds from Python/MATLAB
	latestResultKey      = "LATEST_OPTIMIZATION_RESULT" // Key to store the latest result on ledger
)

// EnergyMarketContract provides functions for the energy market optimization.
type EnergyMarketContract struct {
	contractapi.Contract
}

// OptimizationResult stores the output of the optimization algorithm.
// The JSON tags match what your serverserver.js expects from 'data'.
type OptimizationResult struct {
	Objective           float64     `json:"objective"`
	P                   []float64   `json:"p"` // Productions, will be data.p
	Q                   [][]float64 `json:"q"` // Demands, will be data.q
	L                   []float64   `json:"l"` // Prices, will be data.l
	IterationsPerformed int         `json:"iterations_performed"`
}

// --- Helper Functions (from your previous standalone Go script) ---

// clip mimics numpy.clip
func clip(val, minVal, maxVal float64) float64 {
	if val < minVal {
		return minVal
	}
	if val > maxVal {
		return maxVal
	}
	return val
}

// sumAxis0 sums columns of a 2D slice
func sumAxis0(matrix [][]float64) []float64 {
	if len(matrix) == 0 {
		return []float64{}
	}
	cols := len(matrix[0])
	sums := make([]float64, cols)
	for j := 0; j < cols; j++ {
		colSum := 0.0
		for i := 0; i < len(matrix); i++ {
			colSum += matrix[i][j]
		}
		sums[j] = colSum
	}
	return sums
}

// sumAxis1 sums rows of a 2D slice
func sumAxis1(matrix [][]float64) []float64 {
	rows := len(matrix)
	sums := make([]float64, rows)
	for i := 0; i < rows; i++ {
		rowSum := 0.0
		for j := 0; j < len(matrix[i]); j++ {
			rowSum += matrix[i][j]
		}
		sums[i] = rowSum
	}
	return sums
}

// sumSlice sums elements of a 1D slice
func sumSlice(slice []float64) float64 {
	total := 0.0
	for _, val := range slice {
		total += val
	}
	return total
}

// copySlice creates a deep copy of a 1D float64 slice
func copySlice(original []float64) []float64 {
	copied := make([]float64, len(original))
	copy(copied, original)
	return copied
}

// --- Chaincode Functions ---

// InitLedger is called when the chaincode is instantiated.
// It can be used to set up initial state, though for this version,
// parameters are hardcoded in the Optimize function.
// We'll store an initial placeholder result so QueryResult doesn't fail.
func (s *EnergyMarketContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	exists, err := ctx.GetStub().GetState(latestResultKey)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if exists != nil {
		// Idempotent: if already initialized, do nothing or update if needed.
		// For this case, we assume if it exists, it's fine.
		fmt.Printf("Ledger already initialized for key: %s\n", latestResultKey)
		return nil
	}

	// Store an initial empty/placeholder result
	initialQ := make([][]float64, numConsumers)
	for i := range initialQ {
		initialQ[i] = make([]float64, numProducers)
	}
	initialResult := OptimizationResult{
		Objective:           0.0,
		P:                   make([]float64, numProducers),
		Q:                   initialQ,
		L:                   make([]float64, numProducers),
		IterationsPerformed: 0,
	}

	resultJSON, err := json.Marshal(initialResult)
	if err != nil {
		return fmt.Errorf("failed to marshal initial result: %v", err)
	}

	err = ctx.GetStub().PutState(latestResultKey, resultJSON)
	if err != nil {
		return fmt.Errorf("failed to put initial result to world state: %v", err)
	}
	fmt.Printf("Ledger initialized with placeholder for key: %s\n", latestResultKey)
	return nil
}

// Optimize runs the energy market optimization algorithm.
// It takes maxIterationsStr as a string argument from the client.
func (s *EnergyMarketContract) Optimize(ctx contractapi.TransactionContextInterface, maxIterationsStr string) (*OptimizationResult, error) {
	maxIterations, err := strconv.Atoi(maxIterationsStr)
	if err != nil {
		return nil, fmt.Errorf("failed to parse maxIterations '%s': %v", maxIterationsStr, err)
	}
	if maxIterations <= 0 {
		return nil, fmt.Errorf("maxIterations must be a positive integer, got %d", maxIterations)
	}

	// Parameters (hardcoded, derived from MATLAB/Python script's effective usage)
	alphaPEff := []float64{0.0080, 0.0080, 0.0080}
	betaPCoeffsEff := []float64{2.25, 2.25, 2.25}
	pMin := []float64{10, 20, 15}
	pMax := []float64{350, 290, 400}

	thetaCEff := []float64{0.0720, 0.0720, 0.0660, 0.0660, 0.0700, 0.0700}
	betaCEff := []float64{8.25, 8.25, 7.90, 7.90, 7.55, 7.55}
	qMinC := []float64{60, 50, 90, 60, 50, 70}
	qMaxC := []float64{150, 100, 145, 140, 150, 170}

	// Initialization of variables
	pProd := make([]float64, numProducers)
	qConsum := make([][]float64, numConsumers)
	for i := range qConsum {
		qConsum[i] = make([]float64, numProducers)
	}
	uminC := make([]float64, numConsumers) // Initialized to zeros
	umaxC := make([]float64, numConsumers) // Initialized to zeros
	lLagrange := make([]float64, numProducers)
	cCost := make([]float64, numProducers)

	// Initialization of production value (as per Python/standalone Go)
	for i := 0; i < numProducers; i++ {
		lLagrange[i] = 2*alphaPEff[i]*pMin[i] + betaPCoeffsEff[i]
		pProd[i] = (lLagrange[i] - betaPCoeffsEff[i]) / (2 * alphaPEff[i])
		pProd[i] = clip(pProd[i], pMin[i], pMax[i])
		cCost[i] = alphaPEff[i]*math.Pow(pProd[i], 2) + betaPCoeffsEff[i]*pProd[i]
	}

	// Initialization of consumer parameters (as per Python/standalone Go)
	for j := 0; j < numConsumers; j++ {
		for i := 0; i < numProducers; i++ {
			qConsum[j][i] = (betaCEff[j] + uminC[j] - umaxC[j] - lLagrange[i]) / thetaCEff[j]
			// Apply MATLAB's/Python's specific bounding logic for q_consum[j,i]
			if qConsum[j][i] < 0 {
				qConsum[j][i] = qMinC[j] // Uses total q_min for consumer j
			} else if qConsum[j][i] > qMaxC[j] { // Uses total q_max for consumer j
				qConsum[j][i] = qMaxC[j]
			}
		}
	}

	s2DemandPerConsumer := sumAxis1(qConsum)
	s1DemandPerProducerMarket := sumAxis0(qConsum)

	var objective float64
	iterationsPerformed := 0

	// Main iteration loop
	for k := 0; k < maxIterations; k++ {
		iterationsPerformed = k + 1 // Current iteration number
		lLagrangeAtIterStart := copySlice(lLagrange)

		// --- Producer Sub-loop (Price and Production Updation) ---
		for i := 0; i < numProducers; i++ {
			lLagrange[i] = lLagrange[i] - (stepL * (pProd[i] - s1DemandPerProducerMarket[i]))
			if lLagrange[i] < 0 {
				lLagrange[i] = 0
			}
			pProd[i] = (lLagrange[i] - betaPCoeffsEff[i]) / (2 * alphaPEff[i])
			pProd[i] = clip(pProd[i], pMin[i], pMax[i])
			cCost[i] = alphaPEff[i]*math.Pow(pProd[i], 2) + betaPCoeffsEff[i]*pProd[i]
		}
		cTotalCost := sumSlice(cCost)
		// tgTotalGeneration := sumSlice(pProd) // Calculated but not directly in objective

		// --- Consumer Sub-loop (Demand Side Updation) ---
		mUtilityPerConsumer := make([]float64, numConsumers)
		for j := 0; j < numConsumers; j++ {
			uminC[j] = uminC[j] + (stepU * (qMinC[j] - s2DemandPerConsumer[j]))
			if uminC[j] < 0 {
				uminC[j] = 0
			}
			umaxC[j] = umaxC[j] + (stepU * (s2DemandPerConsumer[j] - qMaxC[j]))
			if umaxC[j] < 0 {
				umaxC[j] = 0
			}

			currentConsumerTotalUtility := 0.0
			for i := 0; i < numProducers; i++ {
				qConsum[j][i] = (betaCEff[j] + uminC[j] - umaxC[j] - lLagrange[i]) / thetaCEff[j]
				// Apply bounding logic again after update
				if qConsum[j][i] < 0 {
					qConsum[j][i] = qMinC[j]
				} else if qConsum[j][i] > qMaxC[j] {
					qConsum[j][i] = qMaxC[j]
				}
				utilityJI := (betaCEff[j]*qConsum[j][i] - 0.5*thetaCEff[j]*math.Pow(qConsum[j][i], 2))
				currentConsumerTotalUtility += utilityJI
			}
			mUtilityPerConsumer[j] = currentConsumerTotalUtility
		}
		zTotalUtility := sumSlice(mUtilityPerConsumer)

		// Update demand sums for the next iteration
		s1DemandPerProducerMarket = sumAxis0(qConsum)
		s2DemandPerConsumer = sumAxis1(qConsum)
		// tdTotalDemand := sumSlice(s2DemandPerConsumer) // Calculated but not directly in objective

		objective = zTotalUtility - cTotalCost

		// Convergence Check (based on MATLAB/Python: abs(l(3)-x(3)) <= threshold)
		// Note: lLagrange has 3 elements (index 0, 1, 2). lLagrange[2] is l(3).
		diffL3 := math.Abs(lLagrange[2] - lLagrangeAtIterStart[2])
		if diffL3 <= convergenceThreshold {
			// Log to peer console if needed
			// fmt.Printf("Chaincode: Converged at iteration %d with diff_l3 = %.6e\n", iterationsPerformed, diffL3)
			break
		}
	} // End main iteration loop

	// Prepare the result
	finalResult := &OptimizationResult{
		Objective:           objective,
		P:                   pProd,
		Q:                   qConsum,
		L:                   lLagrange,
		IterationsPerformed: iterationsPerformed,
	}

	// Store the result on the ledger
	resultJSON, err := json.Marshal(finalResult)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal final result: %v", err)
	}
	err = ctx.GetStub().PutState(latestResultKey, resultJSON)
	if err != nil {
		return nil, fmt.Errorf("failed to put final result to world state: %v", err)
	}

	// Return the result (Fabric Contract API will marshal this struct to JSON for the client)
	return finalResult, nil
}

// QueryResult retrieves the latest optimization result stored on the ledger.
func (s *EnergyMarketContract) QueryResult(ctx contractapi.TransactionContextInterface) (*OptimizationResult, error) {
	resultJSON, err := ctx.GetStub().GetState(latestResultKey)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state for key '%s': %v", latestResultKey, err)
	}
	if resultJSON == nil {
		return nil, fmt.Errorf("no optimization result found for key '%s'. Run Optimize first", latestResultKey)
	}

	var storedResult OptimizationResult
	err = json.Unmarshal(resultJSON, &storedResult)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal stored result: %v", err)
	}

	return &storedResult, nil
}

// main function starts up the chaincode in the container during instantiate
func main() {
	chaincode, err := contractapi.NewChaincode(&EnergyMarketContract{})
	if err != nil {
		fmt.Printf("Error creating EnergyMarketContract chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting EnergyMarketContract chaincode: %s", err.Error())
	}
}