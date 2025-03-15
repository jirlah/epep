// Buat Scene, Kamera, dan Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Tambah Kontrol Kamera (Bisa lihat sekitar)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Tambah Cahaya
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Tambah Lantai
const floorTexture = new THREE.TextureLoader().load("assets/textures/floor.jpg");
const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Tambah Langit
const skyTexture = new THREE.TextureLoader().load("assets/textures/sky.jpg");
scene.background = skyTexture;

// Posisi Kamera
camera.position.set(0, 2, 5);

// Load Model Senjata
const loader = new THREE.GLTFLoader();
let weapon;
loader.load("assets/models/weapon.glb", function (gltf) {
    weapon = gltf.scene;
    scene.add(weapon);
    weapon.position.set(0, 1.5, -1.5);
});

// Array Musuh
const enemies = [];

// Fungsi Buat Musuh
function createEnemy() {
    loader.load("assets/models/enemy.gltf", function (gltf) {
        const enemy = gltf.scene;
        enemy.position.set(Math.random() * 6 - 3, 1, -10);
        scene.add(enemy);
        enemy.scale.set(5, 5, 5); // Besarkan karakter
        enemies.push(enemy);
    });
}

// Musuh Muncul Setiap 3 Detik
setInterval(createEnemy, 10000);

// Peluru & Suara
const bullets = [];
const gunshotSound = new Audio("assets/sounds/gunshot.mp3");

// Event Klik untuk Menembak
window.addEventListener("click", () => {
    if (!weapon) return;

    gunshotSound.play(); // Mainkan suara tembakan

    const bullet = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    bullet.position.set(weapon.position.x, weapon.position.y, weapon.position.z - 0.5);
    scene.add(bullet);
    bullets.push(bullet);
});

// Loop Game
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Gerakan Peluru
    bullets.forEach((bullet, index) => {
        bullet.position.z -= 0.2;
        if (bullet.position.z < -20) {
            scene.remove(bullet);
            bullets.splice(index, 1);
        }
    });

    // Gerakan Musuh
    enemies.forEach((enemy, index) => {
        enemy.position.z += 0.02;

        // Cek tabrakan peluru dengan musuh
        bullets.forEach((bullet, bIndex) => {
            if (bullet.position.distanceTo(enemy.position) < 0.5) {
                scene.remove(enemy);
                scene.remove(bullet);
                enemies.splice(index, 1);
                bullets.splice(bIndex, 1);
            }
        });

        // Jika musuh sampai ke pemain
        if (enemy.position.z > 2) {
            console.log("Kena Musuh!");
            scene.remove(enemy);
            enemies.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}
animate();
