import * as THREE from 'three';
import { createObstacleGeometry } from './texture-utils.js';

class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = [];
    }

    generateObstacles(count = 20, maxWidth = 50, maxDepth = 300) {
        for (let i = 0; i < count; i++) {
            const obstacle = createObstacleGeometry();
            
            obstacle.position.set(
                Math.random() * maxWidth - (maxWidth / 2),
                0.5,
                -Math.random() * maxDepth
            );

            // Random rotation
            obstacle.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );

            this.scene.add(obstacle);
            this.obstacles.push(obstacle);
        }

        return this.obstacles;
    }
}

export function createObstacles(scene) {
    const obstacleManager = new ObstacleManager(scene);
    return obstacleManager.generateObstacles();
}