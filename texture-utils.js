import * as THREE from 'three';

export function createProceduralTexture(size = 256, color1 = 0x2194ce, color2 = 0x0077be) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    // Gradient background
    const gradient = context.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, `#${color1.toString(16).padStart(6, '0')}`);
    gradient.addColorStop(1, `#${color2.toString(16).padStart(6, '0')}`);

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    // Add some noise
    for (let i = 0; i < size * 10; i++) {
        context.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
        context.fillRect(
            Math.random() * size, 
            Math.random() * size, 
            Math.random() * 2, 
            Math.random() * 2
        );
    }

    return new THREE.CanvasTexture(canvas);
}

export function createRacerGeometry() {
    // Custom racer geometry
    const racerGeometry = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff6b6b,
        metalness: 0.3,
        roughness: 0.6
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    racerGeometry.add(body);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

    // Front wheels
    const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontLeftWheel.rotation.z = Math.PI / 2;
    frontLeftWheel.position.set(-0.7, -0.5, 0.5);
    racerGeometry.add(frontLeftWheel);

    const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontRightWheel.rotation.z = Math.PI / 2;
    frontRightWheel.position.set(-0.7, -0.5, -0.5);
    racerGeometry.add(frontRightWheel);

    // Back wheels
    const backLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backLeftWheel.rotation.z = Math.PI / 2;
    backLeftWheel.position.set(0.7, -0.5, 0.5);
    racerGeometry.add(backLeftWheel);

    const backRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backRightWheel.rotation.z = Math.PI / 2;
    backRightWheel.position.set(0.7, -0.5, -0.5);
    racerGeometry.add(backRightWheel);

    return racerGeometry;
}

export function createObstacleGeometry() {
    const obstacleGroup = new THREE.Group();

    // Main obstacle body
    const mainBodyGeometry = new THREE.IcosahedronGeometry(0.5, 1);
    const mainBodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2ecc71,
        metalness: 0.4,
        roughness: 0.6 
    });
    const mainBody = new THREE.Mesh(mainBodyGeometry, mainBodyMaterial);
    obstacleGroup.add(mainBody);

    // Add some spikes
    const spikeGeometry = new THREE.ConeGeometry(0.2, 0.5, 4);
    const spikeMaterial = new THREE.MeshStandardMaterial({ color: 0xe74c3c });

    const spikePositions = [
        [1, 0, 0], [-1, 0, 0],
        [0, 1, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1]
    ];

    spikePositions.forEach(pos => {
        const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
        spike.position.set(...pos.map(p => p * 0.7));
        spike.lookAt(mainBody.position);
        obstacleGroup.add(spike);
    });

    return obstacleGroup;
}
