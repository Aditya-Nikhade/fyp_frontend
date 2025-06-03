// -----------------------------------------------------------------------------
// server.js – minimal Express API for the Energy‑Market Hyperledger Fabric demo
// -----------------------------------------------------------------------------
// * keeps CHANNEL_NAME, CHAINCODE_NAME, CCP_PATH and WALLET_PATH **unchanged**
// * strips out sockets, MongoDB, auth routes, graphs, etc.
// * exposes exactly two REST routes:
//     POST /api/optimize   ⇒ runs the Optimize tx (optional {iterations})
//     GET  /api/result/:it ⇒ evaluates Optimize at a given iteration count
// -----------------------------------------------------------------------------

'use strict';

const path               = require('path');
const fs                 = require('fs');
const express            = require('express');
const bodyParser         = require('body-parser');
const cors               = require('cors');
const http               = require('http');
const { Gateway, Wallets } = require('fabric-network');

// -----------------------------------------------------------------------------
// CONSTANTS – do **NOT** rename or move (user requirement)
// -----------------------------------------------------------------------------
const CHANNEL_NAME   = 'testchannel';
const CHAINCODE_NAME = 'property';                    // <‑‑ leave as‑is
const CCP_PATH       = path.resolve(
  __dirname,
  '..', 'finalyearproject', 'fabric-samples', 'test-network',
  'organizations', 'peerOrganizations',
  'org1.example.com', 'connection-org1.json'
);
const WALLET_PATH    = path.join(process.cwd(), 'wallet');

// -----------------------------------------------------------------------------
// FABRIC HELPER – returns a connected Gateway object
// -----------------------------------------------------------------------------
async function getGateway() {
  const wallet   = await Wallets.newFileSystemWallet(WALLET_PATH);
  const identity = await wallet.get('appUser');
  if (!identity) {
    throw new Error('Identity "appUser" not found in wallet. Register the user first.');
  }
  const gateway = new Gateway();
  const ccp     = JSON.parse(fs.readFileSync(CCP_PATH, 'utf8'));
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true }
  });
  return gateway;
}

// -----------------------------------------------------------------------------
// EXPRESS APP
// -----------------------------------------------------------------------------
const app    = express();
const server = http.createServer(app);

// CORS & JSON
app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json());

// -----------------------------------------------------------------------------
// ROUTES
// -----------------------------------------------------------------------------


// POST /api/optimize - Runs the optimization and stores the result on the ledger
app.post('/api/optimize', async (req, res) => {
    // iterations_to_run will be passed as argument to chaincode's Optimize function
    const { iterations_to_run = 1000 } = req.body; // Default to 1000 as per chaincode safety cap or Python

    if (isNaN(parseInt(iterations_to_run)) || parseInt(iterations_to_run) <= 0) {
        return res.status(400).json({ error: 'iterations_to_run must be a positive integer.' });
    }

    let gateway;
    try {
        gateway = await getGateway();
        const network = await gateway.getNetwork(CHANNEL_NAME);
        const contract = network.getContract(CHAINCODE_NAME);

        console.log(`Submitting Optimize transaction with ${iterations_to_run} max iterations...`);
        // 'Optimize' is the chaincode function name
        // iterations_to_run.toString() is the argument expected by the chaincode
        const resultBytes = await contract.submitTransaction(
            'Optimize',
            iterations_to_run.toString()
        );

        // The chaincode function Optimize directly returns the OptimizationResult struct
        // which the contract-api automatically marshals to JSON.
        const data = JSON.parse(resultBytes.toString());

        // The response structure should match what the frontend expects
        // The chaincode now also returns 'iterations_performed'
        res.json({
            message: 'Optimization submitted and completed successfully.',
            max_iterations_requested: parseInt(iterations_to_run), // Requested iterations
            iterations_performed: data.iterations_performed,     // Actual iterations performed by chaincode
            objective: data.objective,
            prices: data.l,          // 'l' from chaincode result
            productions: data.p,     // 'p' from chaincode result
            demands: data.q          // 'q' from chaincode result
        });

    } catch (err) {
        console.error(`[POST /api/optimize] Failed to submit transaction: ${err}`);
        res.status(500).json({ error: `Failed to submit optimization: ${err.message}` });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

// GET /api/result - Retrieves the last stored optimization result from the ledger
app.get('/api/result', async (req, res) => {
    let gateway;
    try {
        gateway = await getGateway();
        const network = await gateway.getNetwork(CHANNEL_NAME);
        const contract = network.getContract(CHAINCODE_NAME);

        console.log('Querying for the latest optimization result...');
        // 'QueryResult' is the chaincode function name, takes no arguments
        const resultBytes = await contract.evaluateTransaction(
            'QueryResult'
        );

        // The chaincode function QueryResult directly returns the OptimizationResult struct
        const data = JSON.parse(resultBytes.toString());

        // Structure the response. Note that 'iterations_performed' refers to the
        // iterations of the optimization run that produced this stored result.
        res.json({
            message: 'Latest optimization result retrieved successfully.',
            iterations_performed: data.iterations_performed,
            objective: data.objective,
            prices: data.l,
            productions: data.p,
            demands: data.q
        });

    } catch (err) {
        console.error(`[GET /api/result] Failed to evaluate transaction: ${err}`);
        // Handle specific error if result not found (e.g., from chaincode: "no optimisation result found")
        if (err.message && err.message.includes("no optimisation result found")) {
            return res.status(404).json({ error: "No optimization result found on the ledger. Run optimization first." });
        }
        res.status(500).json({ error: `Failed to retrieve result: ${err.message}` });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});




// -----------------------------------------------------------------------------
// SERVE REACT FRONTEND (assumes Vite/CRA build in ./client/dist)
// -----------------------------------------------------------------------------
const CLIENT_BUILD = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(CLIENT_BUILD)) {
  app.use(express.static(CLIENT_BUILD));
  app.get('*', (_, res) => res.sendFile(path.join(CLIENT_BUILD, 'index.html')));
}

// -----------------------------------------------------------------------------
// START SERVER
// -----------------------------------------------------------------------------
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`API listening at http://localhost:${PORT}`));
