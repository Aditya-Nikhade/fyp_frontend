// -----------------------------------------------------------------------------
// server2.js – Express API for the Energy‑Market Hyperledger Fabric demo
// -----------------------------------------------------------------------------
// * keeps CHANNEL_NAME, CHAINCODE_NAME, CCP_PATH and WALLET_PATH **unchanged**
// * exposes exactly two REST routes:
//     POST /api/optimize   ⇒ runs the Optimize tx (optional {iterations})
//     GET  /api/result    ⇒ evaluates QueryResult to get latest optimization
// -----------------------------------------------------------------------------

'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Gateway, Wallets } = require('fabric-network');

// -----------------------------------------------------------------------------
// CONSTANTS – do **NOT** rename or move (user requirement)
// -----------------------------------------------------------------------------
const CHANNEL_NAME = process.env.CHANNEL_NAME || 'testchannel';
const CHAINCODE_NAME = process.env.CHAINCODE_NAME || 'property';                    // <‑‑ leave as‑is
const CCP_PATH = path.resolve(
    __dirname,
    '..', 'finalyearproject', 'fabric-samples', 'test-network',
    'organizations', 'peerOrganizations',
    'org1.example.com', 'connection-org1.json'
);
const WALLET_PATH = path.join(process.cwd(), 'wallet');
const ORG1_USER_ID = process.env.ORG1_USER_ID || 'appUser';

// -----------------------------------------------------------------------------
// FABRIC HELPER – returns a connected Gateway object
// -----------------------------------------------------------------------------
async function getGateway() {
    const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);
    const identity = await wallet.get(ORG1_USER_ID);
    if (!identity) {
        throw new Error(`Identity "${ORG1_USER_ID}" not found in wallet. Register the user first.`);
    }
    const gateway = new Gateway();
    const ccp = JSON.parse(fs.readFileSync(CCP_PATH, 'utf8'));
    await gateway.connect(ccp, {
        wallet,
        identity: ORG1_USER_ID,
        discovery: { enabled: true, asLocalhost: true }
    });
    return gateway;
}

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// POST /api/optimize
app.post('/api/optimize', async (req, res) => {
    const { iterations_to_run = 1000 } = req.body;

    if (isNaN(parseInt(iterations_to_run)) || parseInt(iterations_to_run) <= 0) {
        return res.status(400).json({ error: 'iterations_to_run must be a positive integer.' });
    }

    let gateway;
    try {
        gateway = await getGateway();
        const network = await gateway.getNetwork(CHANNEL_NAME);
        const contract = network.getContract(CHAINCODE_NAME);

        console.log(`Submitting Optimize transaction with ${iterations_to_run} max iterations...`);
        const resultBytes = await contract.submitTransaction(
            'Optimize',
            iterations_to_run.toString()
        );
        const data = JSON.parse(resultBytes.toString());

        // Keep the original field names from chaincode for consistency
        res.json({
            message: 'Optimization submitted and completed successfully.',
            max_iterations_requested: parseInt(iterations_to_run),
            iterations_performed: data.iterations_performed,
            objective: data.objective,
            // Use original field names from chaincode
            l: data.l,          // Prices
            p: data.p,          // Productions
            q: data.q,          // Demands
            // Plotting data
            objective_plot: data.objective_plot,
            l_plot: data.l_plot,
            p_plot: data.p_plot,
            sd_plot: data.sd_plot
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
        const resultBytes = await contract.evaluateTransaction('QueryResult');
        const data = JSON.parse(resultBytes.toString());

        // Keep the original field names from chaincode for consistency
        res.json({
            message: 'Latest optimization result retrieved successfully.',
            iterations_performed: data.iterations_performed,
            objective: data.objective,
            // Use original field names from chaincode
            l: data.l,          // Prices
            p: data.p,          // Productions
            q: data.q,          // Demands
            // Plotting data
            objective_plot: data.objective_plot,
            l_plot: data.l_plot,
            p_plot: data.p_plot,
            sd_plot: data.sd_plot
        });

    } catch (err) {
        console.error(`[GET /api/result] Failed to evaluate transaction: ${err}`);
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
// SERVE REACT FRONTEND (assumes Vite/CRA build in ./client/dist)
// -----------------------------------------------------------------------------
const CLIENT_BUILD = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(CLIENT_BUILD)) {
    app.use(express.static(CLIENT_BUILD));
    app.get('*', (_, res) => res.sendFile(path.join(CLIENT_BUILD, 'index.html')));
}

// -----------------------------------------------------------------------------
// START SERVER
// -----------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`API listening at http://localhost:${PORT}`));