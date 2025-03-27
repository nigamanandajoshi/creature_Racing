import * as THREE from 'three';

export function createProceduralTexture(size = 512, color1 = 0x2ecc71, color2 = 0x27ae60) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    // Create gradient
    const gradient = context.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#' + color1.toString(16).padStart(6, '0'));
    gradient.addColorStop(1, '#' + color2.toString(16).padStart(6, '0'));

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    // Add some noise
    for (let i = 0; i < size * 2; i++) {
        context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        context.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }

    return new THREE.CanvasTexture(canvas);
}

export function createRacerGeometry() {
    const racerGeometry = new THREE.BoxGeometry(1, 2, 1);
    const racerMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });
    return new THREE.Mesh(racerGeometry, racerMaterial);
}

export function createObstacleGeometry() {
    const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2);
    const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    return new THREE.Mesh(obstacleGeometry, obstacleMaterial);
}
