const WebSocket = require("ws");
const Database = require('better-sqlite3');

const db = new Database('./tournament.sqlite');
// Create tables if they don't already exist
db.exec(`
CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant1_id INTEGER NOT NULL,
    participant2_id INTEGER NOT NULL,
    score1 INTEGER DEFAULT 0,
    score2 INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (participant1_id) REFERENCES participants(id),
    FOREIGN KEY (participant2_id) REFERENCES participants(id)
);
`);

const wss = new WebSocket.Server({ port: 5671 });
console.log("Server is live!");

wss.on("connection", ws => {
    console.log("Player one has connected!");
    
    ws.on("message", data => {
        const message = JSON.parse(data);
        if (message.type === "add_participant") {
            const stmt = db.prepare("INSERT INTO participants (name) VALUES (?)");
            const info = stmt.run(message.name);
            ws.send(`Participant added with id ${info.lastInsertRowid}`);
        }

        if (message.type === "update_score") {
            const stmt = db.prepare("UPDATE matches SET score1=?, score2=?, status=? WHERE id=?");
            stmt.run(message.score1, message.score2, message.status, message.matchId);
            ws.send(`Updated match ${message.matchId}`);
        }

        console.log(`finally some data here: ${data}`);
        ws.send("We recorded your message: " + data);
    });

    ws.on("close", ()=>{
        console.log("player one has left");
    });
});