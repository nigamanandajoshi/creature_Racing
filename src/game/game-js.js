import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createProceduralTexture, createRacerGeometry } from './texture-utils.js';
import { createObstacles } from './obstacles.js';
import { setupNetworking } from './networking.js';

class CreatureRaceGame {
    constructor() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('game-canvas'),
            antialias: true 
        });

        // Renderer configuration
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB);  // Sky blue background

        // Camera positioning
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);

        // Orbit controls for better interaction
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        // Scene preparation
        this.setupScene();
        this.setupLights();
    }

    setupScene() {
        // Ground with procedural texture
        const groundTexture = createProceduralTexture(512, 0x2ecc71, 0x27ae60);
        const groundGeometry = new THREE.PlaneGeometry(100, 500);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            map: groundTexture,
            side: THREE.DoubleSide 
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // Add obstacles
        this.obstacles = createObstacles(this.scene);

        // Skybox
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x87CEEB, 
            side: THREE.BackSide 
        });
        const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(skybox);
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Directional light (sun-like)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(directionalLight);
    }

    start(username) {
        // Create player racer
        this.localPlayer = createRacerGeometry();
        this.scene.add(this.localPlayer);

        // Setup networking
        this.networkManager = setupNetworking(this);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Update controls
            this.controls.update();

            // Render scene
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new CreatureRaceGame();
    
    const usernameModal = document.getElementById('username-modal');
    const startGameButton = document.getElementById('start-game');

    startGameButton.addEventListener('click', () => {
        const username = document.getElementById('username-input').value.trim();
        if (username) {
            usernameModal.style.display = 'none';
            game.start(username);
        }
    });
});

export default CreatureRaceGame;