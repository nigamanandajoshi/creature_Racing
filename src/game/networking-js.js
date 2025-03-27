import * as Colyseus from 'colyseus.js';

export function setupNetworking(game) {
    // Note: Replace with actual Colyseus server URL
    const client = new Colyseus.Client('ws://localhost:2567');

    client.joinOrCreate('race_room').then(room => {
        console.log('Connected to room', room.id);

        room.onMessage('playerUpdate', (data) => {
            // Handle player updates from server
            const { id, x, y, z } = data;
            if (!game.players[id]) {
                // Create new player
                const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
                const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                const player = new THREE.Mesh(playerGeometry, playerMaterial);
                game.players[id] = player;
                game.scene.add(player);
            }

            game.players[id].position.set(x, y, z);
        });

        room.onStateChange((state) => {
            // Handle game state changes
        });

        // Send player movement
        setInterval(() => {
            const player = game.players[game.currentPlayerId];
            if (player) {
                room.send('playerMove', {
                    x: player.position.x,
                    y: player.position.y,
                    z: player.position.z
                });
            }
        }, 50);
    });
}
