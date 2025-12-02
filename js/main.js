// ========================================
// FUNCIONALIDAD PRINCIPAL DEL SITIO WEB
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las funcionalidades
    initNavigation();
    initCarousel();
    initScrollAnimations();
    initGallery();
    initContactForm();
});

// ========================================
// NAVEGACIÓN
// ========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menú móvil
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Smooth scroll y actualizar enlace activo
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            // Cerrar menú móvil si está abierto
            navMenu.classList.remove('active');

            // Scroll suave a la sección
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }

            // Actualizar enlace activo
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Actualizar enlace activo al hacer scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - navbar.offsetHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ========================================
// CARRUSEL DE IMÁGENES
// ========================================
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    let currentIndex = 0;
    const totalItems = items.length;
    let autoPlayInterval;

    // Crear indicadores
    for (let i = 0; i < totalItems; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('carousel-indicator');
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }

    const indicators = document.querySelectorAll('.carousel-indicator');

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Actualizar items activos
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });

        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoPlay();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 1000); // Cambiar cada 1 segundo
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    // Pausar autoplay al pasar el mouse
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Soporte para gestos táctiles
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
        }
    }

    // Iniciar autoplay
    startAutoPlay();
}

// ========================================
// ANIMACIONES AL HACER SCROLL
// ========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ========================================
// FORMULARIO DE CONTACTO
// ========================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('.btn-submit');
    const messageDiv = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar formulario
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Obtener datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            evento: document.getElementById('evento').value,
            fecha: document.getElementById('fecha').value,
            mensaje: document.getElementById('mensaje').value,
            timestamp: new Date().toLocaleString('es-CO')
        };

        // Mostrar estado de carga
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        messageDiv.style.display = 'none';

        try {
            // Enviar formulario al backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                // Mostrar mensaje de éxito
                showMessage('success', '¡Mensaje enviado con éxito! Te contactaremos pronto.');

                // Limpiar formulario
                form.reset();

                // Redirigir a WhatsApp después de 2 segundos
                setTimeout(() => {
                    const whatsappMessage = `Hola! Soy ${formData.nombre}. ${formData.mensaje}`;
                    const whatsappUrl = `https://wa.me/573002326942?text=${encodeURIComponent(whatsappMessage)}`;
                    window.open(whatsappUrl, '_blank');
                }, 2000);
            } else {
                throw new Error(result.error || 'Error al enviar el mensaje');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', 'Hubo un problema al enviar tu mensaje. Por favor, intenta contactarnos por WhatsApp directamente.');

            // Ofrecer alternativa de WhatsApp
            setTimeout(() => {
                const whatsappMessage = `Hola! Soy ${formData.nombre}. ${formData.mensaje}`;
                const whatsappUrl = `https://wa.me/573002326942?text=${encodeURIComponent(whatsappMessage)}`;

                if (confirm('¿Deseas contactarnos directamente por WhatsApp?')) {
                    window.open(whatsappUrl, '_blank');
                }
            }, 1500);
        } finally {
            // Quitar estado de carga
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    function showMessage(type, text) {
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.display = 'block';

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// ========================================
// GALERÍA
// ======================================== 
function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');

    let currentImageIndex = 0;
    let galleryImages = [];

    // Cargar imágenes dinámicamente
    // Buscar imágenes img1.png, img2.png, etc.
    const imagePaths = [
        { src: 'images/img0.jpg', alt: 'Creación Bakevans 0' },
        { src: 'images/img1.png', alt: 'Creación Bakevans 1' },
        { src: 'images/img2.png', alt: 'Creación Bakevans 2' },
        { src: 'images/img3.png', alt: 'Creación Bakevans 3' },
        { src: 'images/img4.png', alt: 'Creación Bakevans 4' },
        { src: 'images/img5.png', alt: 'Creación Bakevans 5' },
        { src: 'images/img6.png', alt: 'Creación Bakevans 6' },
        { src: 'images/img7.png', alt: 'Creación Bakevans 7' },
        { src: 'images/img8.png', alt: 'Creación Bakevans 8' },
        { src: 'images/img9.png', alt: 'Creación Bakevans 9' },
        { src: 'images/img10.png', alt: 'Creación Bakevans 10' },
        { src: 'images/img11.png', alt: 'Creación Bakevans 11' },
        { src: 'images/img12.png', alt: 'Creación Bakevans 12' },
        { src: 'images/img13.png', alt: 'Creación Bakevans 13' },
        { src: 'images/img14.png', alt: 'Creación Bakevans 14' },
        { src: 'images/img15.png', alt: 'Creación Bakevans 15' },
        { src: 'images/img16.png', alt: 'Creación Bakevans 16' },
        { src: 'images/img17.png', alt: 'Creación Bakevans 17' },
        { src: 'images/pd1.png', alt: 'Pastel temático safari' },
        { src: 'images/pd2.png', alt: 'Galletas decoradas' },
        { src: 'images/pd3.png', alt: 'Pastel elegante' },
        { src: 'images/pd4.png', alt: 'Cupcakes gourmet' }
    ];

    // Crear elementos de galería
    imagePaths.forEach((imgData, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item animate-on-scroll';
        galleryItem.style.animationDelay = `${index * 0.1}s`;

        const img = document.createElement('img');
        img.src = imgData.src;
        img.alt = imgData.alt;
        img.loading = 'lazy';

        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);

        // Agregar evento click
        galleryItem.addEventListener('click', () => openModal(index));

        galleryImages.push(imgData);
    });

    // Funcones del modal
    function openModal(index) {
        currentImageIndex = index;
        showImage();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    function showImage() {
        const currentImage = galleryImages[currentImageIndex];
        modalImg.src = currentImage.src;
        modalImg.alt = currentImage.alt;
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        showImage();
    }

    // Event listeners
    modalClose.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', showPrevImage);
    modalNext.addEventListener('click', showNextImage);

    // Cerrar al hacer click fuera de la imagen
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
}

// ========================================
// UTILIDADES
// ========================================

// Detección de scroll para efectos adicionales
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Aquí se pueden agregar efectos adicionales basados en scroll

    lastScroll = currentScroll;
});
