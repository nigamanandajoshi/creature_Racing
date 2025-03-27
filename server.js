const { Server } = require('colyseus');
const { WebSocketTransport } = require('@colyseus/ws-transport');
const http = require('http');

class RaceRoom extends Room {
    onCreate (options) {
        this.setState({
            players: {}
        });
    }

    onJoin (client, options) {
        this.state.players[client.sessionId] = {
            username: options.username,
            x: 0,
            y: 0,
            z: 0
        };
    }

    onLeave (client) {
        delete this.state.players[client.sessionId];
    }

    onMessage (client, type, message) {
        if (type === 'playerMove') {
            const player = this.state.players[client.sessionId];
            player.x = message.x;
            player.y = message.y;
            player.z = message.z;
        }
    }
}

const httpServer = http.createServer();
const gameServer = new Server({
    transport: new WebSocketTransport({
        server: httpServer
    })
});

gameServer.define('race_room', RaceRoom);

httpServer.listen(2567, () => {
    console.log('Colyseus server listening on port 2567');
});
