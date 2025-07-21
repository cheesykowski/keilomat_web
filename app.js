import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

let camper;
const loader = new GLTFLoader();
loader.load('volkswagen_t2_campervan.glb', function(gltf) {
  camper = gltf.scene;
  camper.scale.set(0.5, 0.5, 0.5);
  scene.add(camper);
}, undefined, function(error) {
  console.error('Fehler beim Laden des Modells:', error);
});

camera.position.z = 5;

let offset = { alpha: 0, beta: 0, gamma: 0 };
let lastOrientation = { alpha: 0, beta: 0, gamma: 0 };

function angleDiff(a, b) {
  let diff = a - b;
  diff = (diff + 540) % 360 - 180;
  return diff;
}

if (localStorage.getItem('orientationOffset')) {
  offset = JSON.parse(localStorage.getItem('orientationOffset'));
}

document.getElementById('calibrateBtn').addEventListener('click', () => {
  offset = { ...lastOrientation };
  localStorage.setItem('orientationOffset', JSON.stringify(offset));
  alert('Kalibrierung gespeichert!');
});

window.addEventListener('deviceorientation', function(event) {
  lastOrientation = {
    alpha: event.alpha || 0,
    beta: event.beta || 0,
    gamma: event.gamma || 0
  };

  if (camper) {
    const alpha = THREE.MathUtils.degToRad(angleDiff(event.alpha || 0, offset.alpha));
    const beta = THREE.MathUtils.degToRad(angleDiff(event.beta || 0, offset.beta));
    const gamma = THREE.MathUtils.degToRad(angleDiff(event.gamma || 0, offset.gamma));
    camper.rotation.set(beta, gamma, alpha);
  }
}, true);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
