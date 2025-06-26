// Three.js Particles
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('particles'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Particles (1,000+ with orbits, glow, and mouse interaction)
const particleCount = 1000;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    velocities[i * 3] = (Math.random() - 0.5) * 0.03;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.03;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
}
particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.15, transparent: true, opacity: 0.8 });
const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

camera.position.z = 15;

// Mouse Interaction
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation: Particles orbiting
function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        // Orbit and mouse repulsion
        positions[i * 3] += 0.02 * Math.sin(time + i);
        positions[i * 3 + 2] += 0.02 * Math.cos(time + i);
        const dx = positions[i * 3] - mouseX * 10;
        const dz = positions[i * 3 + 2] - mouseY * 10;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 5) {
            velocities[i * 3] += dx * 0.001;
            velocities[i * 3 + 2] += dz * 0.001;
        }
        if (Math.abs(positions[i * 3]) > 15) velocities[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 15) velocities[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 15) velocities[i * 3 + 2] *= -1;
    }
    particles.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Neural Cursor with Enhanced Trail
const cursor = document.querySelector('.cursor');
const trails = [];
const trailCount = 20;
for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    trails.push({ element: trail, x: 0, y: 0, opacity: 1 - i / trailCount });
}
document.addEventListener('mousemove', e => {
    gsap.to(cursor, { duration: 0.1, x: e.clientX, y: e.clientY });
    trails.forEach((trail, i) => {
        gsap.to(trail.element, {
            duration: 0.3 + i * 0.05,
            x: e.clientX,
            y: e.clientY,
            opacity: trail.opacity,
            scale: 1 - i * 0.05,
            boxShadow: `0 0 ${20 - i * 1}px rgba(255, 0, 0, ${trail.opacity})`
        });
    });
});
document.querySelectorAll('.magnetic, .btn, .social-icon, .project-card, .skill-tile').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        // Particle burst on hover
        for (let i = 0; i < 10; i++) {
            const burst = document.createElement('div');
            burst.className = 'cursor-trail';
            burst.style.left = elem.getBoundingClientRect().left + 'px';
            burst.style.top = elem.getBoundingClientRect().top + 'px';
            document.body.appendChild(burst);
            gsap.to(burst, {
                duration: 0.5,
                x: elem.getBoundingClientRect().left + (Math.random() - 0.5) * 100,
                y: elem.getBoundingClientRect().top + (Math.random() - 0.5) * 100,
                opacity: 0,
                scale: 0.5,
                onComplete: () => burst.remove()
            });
        }
    });
    elem.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// GSAP Text Split Animation
document.querySelectorAll('.text-split').forEach(text => {
    text.innerHTML = text.textContent.replace(/\S+/g, '<span>$&</span>');
    gsap.to(text.querySelectorAll('span'), {
        y: 0,
        scale: 1,
        rotate: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: text, start: 'top 80%' }
    });
});

// Fade-In Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });
document.querySelectorAll('.fade-in').forEach(element => observer.observe(element));

// VanillaTilt for Project Cards
VanillaTilt.init(document.querySelectorAll('.project-card'), {
    max: 25,
    speed: 300,
    glare: true,
    'max-glare': 0.7,
    scale: 1.1
});

// VanillaTilt for Skill Tiles
VanillaTilt.init(document.querySelectorAll('.skill-tile'), {
    max: 30,
    speed: 200,
    glare: true,
    'max-glare': 0.8,
    scale: 1.2
});
