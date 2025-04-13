const { Server } = require('ws');
const wss = new Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.send('Hello from Node.js server!');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Broadcast to all clients
        wss.clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(`Echo: ${message}`);
            }
        });
    });
});

console.log('WebSocket server running on ws://localhost:8080');