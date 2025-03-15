// Setup scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Tambahkan pencahayaan
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 5);
scene.add(light);

// Buat pemain (kotak hijau)
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);
player.position.y = -3;

// Array untuk peluru dan musuh
const bullets = [];
const enemies = [];

// Senjata
let weaponType = "pistol"; // Default

// Fungsi membuat musuh
function createEnemy() {
    const enemyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
    enemy.position.set(Math.random() * 6 - 3, 3, 0);
    scene.add(enemy);
    enemies.push(enemy);
}

// Kontrol pemain
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Ganti senjata
window.addEventListener("keydown", (e) => {
    if (e.key === "1") weaponType = "pistol";
    if (e.key === "2") weaponType = "shotgun";
    if (e.key === "3") weaponType = "laser";
});

// Fungsi menembak
function shoot() {
    if (weaponType === "pistol") {
        createBullet(player.position.x, 0xffff00, 0.2);
    } else if (weaponType === "shotgun") {
        createBullet(player.position.x - 0.3, 0xff8800, 0.2);
        createBullet(player.position.x, 0xff8800, 0.2);
        createBullet(player.position.x + 0.3, 0xff8800, 0.2);
    } else if (weaponType === "laser") {
        createBullet(player.position.x, 0x00ffff, 0.5);
    }
}

// Fungsi membuat peluru
function createBullet(x, color, size) {
    const bulletGeometry = new THREE.BoxGeometry(size, 0.5, size);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: color });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.set(x, player.position.y + 0.5, player.position.z);
    scene.add(bullet);
    bullets.push(bullet);
}

// Loop game
function update() {
    if (keys["ArrowLeft"] && player.position.x > -3) player.position.x -= 0.1;
    if (keys["ArrowRight"] && player.position.x < 3) player.position.x += 0.1;
    if (keys[" "] && bullets.length < 10) shoot();

    // Gerakan peluru
    bullets.forEach((bullet, index) => {
        bullet.position.y += 0.1;
        if (bullet.position.y > 3) {
            scene.remove(bullet);
            bullets.splice(index, 1);
        }
    });

    // Tambah musuh
    if (Math.random() < 0.01) createEnemy();

    // Gerakan musuh
    enemies.forEach((enemy, index) => {
        enemy.position.y -= 0.02;
        if (enemy.position.y < -3) {
            scene.remove(enemy);
            enemies.splice(index, 1);
        }
    });

    // Deteksi tabrakan
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (bullet.position.distanceTo(enemy.position) < 0.5) {
                scene.remove(bullet);
                bullets.splice(bIndex, 1);
                scene.remove(enemy);
                enemies.splice(eIndex, 1);
            }
        });
    });

    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

// Posisi awal kamera
camera.position.z = 5;

// Mulai game
update();
