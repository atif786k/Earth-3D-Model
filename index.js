import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/starField.js";
import { getFresnelMat } from "./src/glowlight.js";

const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 3;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const earthGrp = new THREE.Group();
earthGrp.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGrp);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1.0, 16);
const material = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/8081_earthmap4k.jpg"),
});

const earthMesh = new THREE.Mesh(geometry, material);
earthGrp.add(earthMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const lightMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/8081_earthlights4k.jpg"),
  blending: THREE.AdditiveBlending,
  opacity: 0.2,
});
const lightMesh = new THREE.Mesh(geometry, lightMaterial);
earthGrp.add(lightMesh);

const cloudMaterial = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/8081_earthcloud4k.jpg"),
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
});
const cloudMesh = new THREE.Mesh(geometry, cloudMaterial);
cloudMesh.scale.setScalar(1.005);
earthGrp.add(cloudMesh);

const glowEarth = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, glowEarth);
glowMesh.scale.setScalar(1.01);
earthGrp.add(glowMesh);

const bumpMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/8081_earthbump4k.jpg"),
  blending: THREE.AdditiveBlending,
  opacity: 0.2,
});
const bumpMesh = new THREE.Mesh(geometry, bumpMaterial);
bumpMesh.scale.setScalar(1.002);
earthGrp.add(bumpMesh);

// const wireMat = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     wireframe: true
// });
// const wireMesh = new THREE.Mesh(geometry, wireMat);
// wireMesh.scale.setScalar(1.101);
// mesh.add(wireMesh);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-1, 0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.0005;
  lightMesh.rotation.y += 0.0005;
  bumpMesh.rotation.y += 0.0005;
  cloudMesh.rotation.y += 0.0007;
  renderer.render(scene, camera);
  controls.update();
}

animate();