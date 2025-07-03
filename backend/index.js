const WebSocket = require("ws");
const express = require('express');
const path = require('path');
const Rcon = require('rcon');
const app = express();

// Serve static files from the frontend folder, primarily index.html for the quick startup instructions
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

// WebSocket server attached to the Express server listening to frontend connections on port 3000. It's needed because wewbsocket needs to be adressed with a certain port, not only via address.
const server = app.listen(3000, () => {
    console.log('Express server is running on port 3000');
});

const wss = new WebSocket.Server({ server });
console.log("WebSocket server is live!");




// frontend pages

app.get('/toums', (req, res) => {
    // Send the HTML file as the response
    res.sendFile(path.join(__dirname, '../frontend/hud.html'));
});

app.get('/admin', (req, res) => {
    // Send the HTML file as the response
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// cs2 listening

app.post('/cs2', (req, res) => {
    console.log('Listening for CS2 Game State data...');
    if(req.body != null) {
        let scorect = req.body && req.body.map ? req.body.map.team_ct.score : 0;
        let scoret = req.body && req.body.map ? req.body.map.team_t.score : 0;

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

// cs2 rcon

const rconc = new Rcon('192.168.0.3', 27015, '123');

rconc.on('auth', () => {
    console.log('Authenticated to RCON');
    rconc.send('say "hello toums!"');
    rconc.send('sv_cheats 1');
});

rconc.on('response', (str) => {
    console.log('RCON Response:', str);
});

rconc.on('error', (err) => {
    console.error('RCON Error:', err);
});

rconc.on('end', () => {
    console.log('RCON connection closed');
});

rconc.connect();

wss.on("connection", ws => {
    console.log("Frontend has connected!");
    ws.on("message", data => {
        
        let dataadm = JSON.parse(data.toString());
        console.log(dataadm);
        if(dataadm.type == "rcon") {
            rconc.send(dataadm.message);
        }
    });
    ws.on("close", ()=>{
        console.log("Frontend disconnected!");
    });
});
