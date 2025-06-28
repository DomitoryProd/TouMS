const WebSocket = require("ws");
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

// Create WebSocket server attached to the Express server
const server = app.listen(3000, () => {
    console.log('Express server is running on port 3000');
});

const wss = new WebSocket.Server({ server });
console.log("WebSocket server is live!");

var frontendconnected = 0;

wss.on("connection", ws => {
    frontendconnected++;
    console.log("Frontend number: " + frontendconnected + " has connected!");
    ws.on("message", data => {
        console.log(data);
    });
    ws.on("close", ()=>{
        console.log("Frontend number: " + frontendconnected + " has disconnected!");
        frontendconnected--;
    });
});

app.post('/cs2', (req, res) => {
    console.log('Listening for CS2 Game State data...');
    if(req.body != null) {
        let scorect = req.body && req.body.map ? req.body.map.team_ct.score : 0;
        let scoret = req.body && req.body.map ? req.body.map.team_t.score : 0;
        console.log(req.body);
        //console.log("CT Score: " + scorect + " T Score: " + scoret);
        // Create a message object to send
        const message = req.body;
        // Send the message to all connected WebSocket clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
    res.send('ok');
});

app.get('/toums', (req, res) => {
    // Send the HTML file as the response
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

