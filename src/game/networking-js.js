import * as Colyseus from 'colyseus.js';
import * as THREE from 'three';

export function setupNetworking(game, username) {
    // Note: Replace with actual Colyseus server URL
    const client = new Colyseus.Client('ws://localhost:2567');

    game.players = {};  // Ensure players object exists

    client.joinOrCreate('race_room', { username }).then(room => {
        console.log('Connected to room', room.id);

        // Store current player's ID
        game.currentPlayerId = room.sessionId;

        room.onMessage('playerUpdate', (data) => {
            const { id, x, y, z } = data;
            if (!game.players[id]) {
                // Create new player
                const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
                const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                const player = new THREE.Mesh(playerGeometry, playerMaterial);
                game.players[id] = player;
                game.scene.add(player);
            }

            game.players[id].position.set(x, y, z);
        });

        room.onStateChange((state) => {
            // Handle game state changes if needed
            console.log('Room state updated:', state);
        });

        // Send player movement periodically
        setInterval(() => {
            if (game.localPlayer) {
                room.send('playerMove', {
                    x: game.localPlayer.position.x,
                    y: game.localPlayer.position.y,
                    z: game.localPlayer.position.z
                });
            }
        }, 50);

        return room;
    }).catch(error => {
        console.error('Failed to connect to room:', error);
    });
}
