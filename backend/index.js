const express = require('express');
const app = express();
app.use(express.json());

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5671 });
console.log("Server is live!");

wss.on("connection", ws => {
    console.log("Player one has connected!");
    
    
    ws.on("message", data => {
        console.log(data);
    });

   
    ws.on("close", ()=>{
        console.log("player one has left");
    });
});


app.post('/cs2', (req, res) => {
    

    console.log('Listening for CS2 Game State data...');
    if(req.body != null) {

        let scorect = req.body && req.body.map ? req.body.map.team_ct.score : 0;
        let scoret = req.body && req.body.map ? req.body.map.team_t.score : 0;
        console.log("CT Score: " + scorect + " T Score: " + scoret);
        // Create a message object to send
        const message = {
            type: "update_scores",
            scores: {
                ct: scorect,
                t: scoret
            }
        };
        // Send the message to all connected WebSocket clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
    
    res.send('ok');
});

app.listen(3000, () => {
    console.log('Game is connected!');
});

