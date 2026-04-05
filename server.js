const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let rooms = {};

server.on('connection', (ws, req) => {
    let currentRoom = null;
    let userName = null;
    
    ws.on('message', (data) => {
        const msg = JSON.parse(data);
        
        if (msg.type === 'join') {
            currentRoom = msg.roomId || 'default';
            userName = msg.username;
            if (!rooms[currentRoom]) rooms[currentRoom] = { players: [], messages: [] };
            rooms[currentRoom].players.push(ws);
            
            // إرسال اللاعبين الحاليين
            ws.send(JSON.stringify({
                type: 'players',
                players: rooms[currentRoom].players.map(() => userName)
            }));
        }
        
        if (msg.type === 'chat') {
            if (rooms[currentRoom]) {
                rooms[currentRoom].players.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'chat',
                            user: userName,
                            message: msg.message
                        }));
                    }
                });
            }
        }
        
        if (msg.type === 'move') {
            if (rooms[currentRoom]) {
                rooms[currentRoom].players.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'move',
                            user: userName,
                            x: msg.x,
                            y: msg.y
                        }));
                    }
                });
            }
        }
    });
    
    ws.on('close', () => {
        if (currentRoom && rooms[currentRoom]) {
            rooms[currentRoom].players = rooms[currentRoom].players.filter(p => p !== ws);
        }
    });
});

console.log('🚀 سيرفر الأونلاين شغال على http://localhost:8080');
