// Three.js Particles with Custom Shader for Glowing Orbs
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('particles'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Custom Shader for Glowing Orbs
const vertexShader = `
    attribute float size;
    varying vec3 vColor;
    void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    varying vec3 vColor;
    void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float intensity = 1.0 - smoothstep(0.0, 0.5, dist);
        gl_FragColor = vec4(vColor, intensity * 0.8);
    }
`;

const particleCount = 800; // Reduced for performance
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);
const colors = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    sizes[i] = 0.2 + Math.random() * 0.3;
    colors[i * 3] = 0.23; // Blue R
    colors[i * 3 + 1] = 0.51; // Blue G
    colors[i * 3 + 2] = 0.96; // Blue B
    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending
});

const particleSystem = new THREE.Points(particles, shaderMaterial);
scene.add(particleSystem);

camera.position.z = 15;

// Mouse Interaction
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation: Particles with Orbital Paths
function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        // Subtle orbital paths
        positions[i * 3] += 0.01 * Math.sin(time + i * 0.1);
        positions[i * 3 + 2] += 0.01 * Math.cos(time + i * 0.1);
        // Mouse repulsion
        const dx = positions[i * 3] - mouseX * 8;
        const dz = positions[i * 3 + 2] - mouseY * 8;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 4) {
            velocities[i * 3] += dx * 0.0005;
            velocities[i * 3 + 2] += dz * 0.0005;
        }
        // Boundary checks
        if (Math.abs(positions[i * 3]) > 10) velocities[i * 3] *= -0.8;
        if (Math.abs(positions[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -0.8;
        if (Math.abs(positions[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -0.8;
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

// Neural Cursor with Sparkle Effect
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
    gsap.to(cursor, { duration: 0.2, x: e.clientX, y: e.clientY });
});
document.querySelectorAll('.magnetic, .btn, .social-icon, .project-card, .skill-tile').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        // Sparkle effect
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'cursor-trail';
            sparkle.style.left = elem.getBoundingClientRect().left + 'px';
            sparkle.style.top = elem.getBoundingClientRect().top + 'px';
            document.body.appendChild(sparkle);
            gsap.to(sparkle, {
                duration: 0.6,
                x: elem.getBoundingClientRect().left + (Math.random() - 0.5) * 50,
                y: elem.getBoundingClientRect().top + (Math.random() - 0.5) * 50,
                opacity: 0,
                scale: 0.3,
                onComplete: () => sparkle.remove()
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
        stagger: 0.06,
        duration: 1.2,
        ease: 'power4.out',
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
    max: 12,
    speed: 400,
    glare: true,
    'max-glare': 0.5,
    scale: 1.05
});

// VanillaTilt for Skill Tiles
VanillaTilt.init(document.querySelectorAll('.skill-tile'), {
    max: 15,
    speed: 300,
    glare: true,
    'max-glare': 0.6,
    scale: 1.1
});
