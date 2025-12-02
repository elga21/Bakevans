// ========================================
// SISTEMA DE AURORA DE COLORES SUAVES
// Similar a aurora borealis con colores del sitio
// ========================================

class AuroraEffect {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.waves = [];
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 200 };
        this.time = 0;

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resizeCanvas();

        // Colores suaves del sitio: rosa, púrpura, dorado, menta, azul
        const colorPalette = [
            { h: 340, s: 60, l: 70, name: 'rosa' },      // Rosa suave
            { h: 280, s: 55, l: 75, name: 'púrpura' },   // Púrpura suave
            { h: 45, s: 70, l: 75, name: 'dorado' },     // Dorado suave
            { h: 160, s: 50, l: 70, name: 'menta' },     // Menta suave
            { h: 195, s: 60, l: 75, name: 'azul' }       // Azul suave
        ];

        // Crear múltiples capas de ondas de aurora
        for (let i = 0; i < 8; i++) {
            const color = colorPalette[i % colorPalette.length];
            this.waves.push({
                y: (this.canvas.height / 8) * i,
                amplitude: 80 + Math.random() * 120,
                frequency: 0.003 + Math.random() * 0.002,
                speed: 0.3 + Math.random() * 0.4,
                offset: Math.random() * Math.PI * 2,
                opacity: 0.08 + Math.random() * 0.12,
                color: color,
                thickness: 100 + Math.random() * 150
            });
        }

        // Crear partículas de estrellas pequeñas
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                opacity: Math.random() * 0.5,
                twinkleSpeed: 0.5 + Math.random() * 1.5
            });
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.documentElement.scrollHeight;
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y + window.scrollY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.init();
        });

        window.addEventListener('scroll', () => {
            if (this.mouse.y !== null) {
                this.mouse.y = event.clientY + window.scrollY;
            }
        });
    }

    drawWave(wave) {
        this.ctx.save();

        // Crear gradiente vertical para la onda
        const gradient = this.ctx.createLinearGradient(
            0, wave.y - wave.thickness / 2,
            0, wave.y + wave.thickness / 2
        );

        const color = wave.color;
        gradient.addColorStop(0, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);
        gradient.addColorStop(0.5, `hsla(${color.h}, ${color.s}%, ${color.l}%, ${wave.opacity})`);
        gradient.addColorStop(1, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();

        // Dibujar la onda con forma sinusoidal
        const points = [];
        for (let x = 0; x <= this.canvas.width; x += 5) {
            const radians = wave.frequency * x + this.time * wave.speed + wave.offset;
            const y = wave.y + Math.sin(radians) * wave.amplitude;
            points.push({ x, y });

            if (x === 0) {
                this.ctx.moveTo(x, y - wave.thickness / 2);
            }
        }

        // Parte superior de la onda
        points.forEach(point => {
            this.ctx.lineTo(point.x, point.y - wave.thickness / 2);
        });

        // Parte inferior de la onda (en reversa)
        for (let i = points.length - 1; i >= 0; i--) {
            this.ctx.lineTo(points[i].x, points[i].y + wave.thickness / 2);
        }

        this.ctx.closePath();
        this.ctx.fill();

        // Añadir brillo extra si el mouse está cerca
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const centerPoint = points[Math.floor(points.length / 2)];
            const distanceToMouse = Math.sqrt(
                Math.pow(this.mouse.x - centerPoint.x, 2) +
                Math.pow(this.mouse.y - centerPoint.y, 2)
            );

            if (distanceToMouse < this.mouse.radius) {
                const glowIntensity = 1 - (distanceToMouse / this.mouse.radius);
                const glowGradient = this.ctx.createRadialGradient(
                    this.mouse.x, this.mouse.y, 0,
                    this.mouse.x, this.mouse.y, this.mouse.radius
                );

                glowGradient.addColorStop(0, `hsla(${color.h}, ${color.s}%, ${color.l}%, ${glowIntensity * 0.3})`);
                glowGradient.addColorStop(1, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);

                this.ctx.fillStyle = glowGradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }

        this.ctx.restore();
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Efecto de parpadeo
            particle.opacity = 0.3 + Math.sin(this.time * particle.twinkleSpeed) * 0.3;

            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawMouseGlow() {
        if (this.mouse.x === null || this.mouse.y === null) return;

        // Brillo interactivo alrededor del cursor
        const gradient = this.ctx.createRadialGradient(
            this.mouse.x, this.mouse.y, 0,
            this.mouse.x, this.mouse.y, this.mouse.radius * 1.5
        );

        // Usar un color que cambia con el tiempo
        const hue = (this.time * 20) % 360;
        gradient.addColorStop(0, `hsla(${hue}, 70%, 75%, 0.15)`);
        gradient.addColorStop(0.5, `hsla(${hue + 60}, 70%, 75%, 0.08)`);
        gradient.addColorStop(1, `hsla(${hue + 120}, 70%, 75%, 0)`);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        this.time += 0.01;

        // Limpiar canvas con fondo oscuro
        this.ctx.fillStyle = 'rgb(15, 10, 20)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar ondas de aurora de atrás hacia adelante
        for (let i = this.waves.length - 1; i >= 0; i--) {
            this.drawWave(this.waves[i]);
        }

        // Dibujar partículas de estrellas
        this.drawParticles();

        // Dibujar brillo del mouse
        this.drawMouseGlow();

        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar la aurora cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AuroraEffect('particle-canvas');
});
