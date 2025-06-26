// Three.js Data Mountain Animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('data-mountain'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Data Points (Cubes forming a mountain)
const dataPoints = [];
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

for (let x = -5; x <= 5; x += 0.5) {
    for (let z = -5; z <= 5; z += 0.5) {
        const height = Math.exp(-(x * x + z * z) / 10); // Gaussian for mountain shape
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, height * 5, z);
        scene.add(cube);
        dataPoints.push({ mesh: cube, baseHeight: height * 5 });
    }
}

camera.position.z = 10;

// Animation: Data points rise to form mountain
function animate() {
    requestAnimationFrame(animate);
    dataPoints.forEach(point => {
        point.mesh.position.y = point.baseHeight * (1 - Math.exp(-performance.now() / 2000)); // Gradual rise
    });
    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Fade-In Animation for Sections
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});
