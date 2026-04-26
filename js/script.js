// DOM Elements
const navbar = document.getElementById('navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('section, header');
const navItems = document.querySelectorAll('.nav-link');

// Scroll Event for Navbar & Active Links
window.addEventListener('scroll', () => {
    // Navbar styling on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active Link Highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    });
});

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('ph-list');
        icon.classList.add('ph-x');
    } else {
        icon.classList.remove('ph-x');
        icon.classList.add('ph-list');
    }
});

// Close Mobile Menu on Link Click
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('ph-x');
        icon.classList.add('ph-list');
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger number counter if it exists inside the element
            const counter = entry.target.querySelector('.counter');
            if (counter) {
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
            }

            // Trigger autoplay for videos when their section scrolls into view
            const video = entry.target.querySelector('video');
            if (video) {
                video.muted = true; 
                video.play().catch(err => console.log("Autoplay prevented:", err));
            }
            
            observer.unobserve(entry.target); // Run animation only once
        }
    });
}, observerOptions);

// Observe all elements with .fade-in-up class
document.addEventListener('DOMContentLoaded', () => {
    const animationElements = document.querySelectorAll('.fade-in-up');
    animationElements.forEach(el => observer.observe(el));
});

// Form Submission Prevention (Demo)
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = 'Sending... <i class="ph ph-spinner-gap ph-spin"></i>';
        
        setTimeout(() => {
            btn.innerHTML = 'Message Sent! <i class="ph ph-check-circle"></i>';
            btn.classList.replace('btn-primary', 'btn-outline');
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.replace('btn-outline', 'btn-primary');
            }, 3000);
        }, 1500);
    });
}

// --- VR Interactive Effects ---

// 1. VR Holodeck Perspective Grid Background
const createVRGrid = () => {
    const grid = document.createElement('div');
    grid.className = 'vr-grid-bg';
    document.body.appendChild(grid);
};

// 2. Custom VR Pointer/Cursor
const createCursor = () => {
    // Only apply on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'vr-cursor';
    const cursorDot = document.createElement('div');
    cursorDot.className = 'vr-cursor-dot';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate dot update
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth trailing animation for outer ring
    const render = () => {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        cursor.style.transform = `translate(${cursorX - 15}px, ${cursorY - 15}px)`;
        requestAnimationFrame(render);
    };
    render();
    
    // Add hover effects for links/buttons
    const attachHoverEvents = () => {
        const interactiveElements = document.querySelectorAll('a, button, .feature-card, .list-item, .impact-card, .tech-item, .gallery-item, .lightbox-close');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
    attachHoverEvents();
    
    // Attempt re-attach after brief delay to catch dynamically loaded DOM elements
    setTimeout(attachHoverEvents, 500);
};

// 3. 3D Tilt Effect on Cards (VR Spatial feel)
const apply3DTilt = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cards = document.querySelectorAll('.feature-card, .domain-card, .list-item, .impact-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8; // Max 8 deg rotation
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = `${-rotateY}px ${rotateX}px 30px rgba(212, 175, 55, 0.15)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.boxShadow = '';
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    // --- Advanced VR Background: Neural Network / Data Constellation ---
    const createVRNetworkBackground = () => {
        const canvas = document.createElement('canvas');
        canvas.id = 'vr-network-canvas';
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        let width, height;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const particles = [];
        const particleCount = typeof window.matchMedia !== "undefined" && window.matchMedia("(max-width: 768px)").matches ? 35 : 75;
        const maxDistance = 160;

        // Interactive Mouse Hub
        const mouse = { x: null, y: null, radius: 200 };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 0.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(212, 175, 55, 0.6)'; // Teal nodes
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Advanced Interaction: Repel + Connection Map
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        // "Forcefield" Repel mechanism
                        const pushForce = (mouse.radius - distance) / mouse.radius;
                        particles[i].x += (dx / distance) * pushForce * 1.5;
                        particles[i].y += (dy / distance) * pushForce * 1.5;

                        // Connection laser to cursor
                        const opacity = 1 - (distance / mouse.radius);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.4})`; // Teal connection
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < maxDistance) {
                        const opacity = 1 - (distance / maxDistance);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(166, 75, 42, ${opacity * 0.35})`; // Emerald lines
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };
        animate();
    };

    createVRNetworkBackground();
    createVRGrid();
    createCursor();
    apply3DTilt();

    const isHomePage = document.getElementById('home') !== null;

    // --- 3D VR Parallax on Hero Background ---
    const heroSection = document.getElementById('home');
    const heroBg = document.getElementById('vr-hero-bg');
    if (heroSection && heroBg) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Move opposite to mouse to simulate depth (window panning effect)
            const moveX = (x - centerX) / centerX * -40; // Max 40px shift
            const moveY = (y - centerY) / centerY * -20;
            
            heroBg.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px) scale(1.03)`;
        });
        heroSection.addEventListener('mouseleave', () => {
            heroBg.style.transform = `translate3d(0px, 0px, 0px) scale(1)`;
        });
    }

    // --- Immersive VR World Entering Engine ---
    // The Hero section accelerates towards the camera to simulate "diving into" the VR world,
    // while the rest of the site's sections simply scroll normally for a practical, readable UX.
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    const vrCanvas = document.getElementById('vr-network-canvas');

    if (isHomePage) {
        let currentScroll = window.scrollY;
        let targetScroll = window.scrollY;
        
        // Listen for scroll but use requestAnimationFrame for silky smooth interpolation
        window.addEventListener('scroll', () => {
            targetScroll = window.scrollY;
        });

        const updateParallax = () => {
            // Lerp for buttery smoothness
            currentScroll += (targetScroll - currentScroll) * 0.08;
            
            // 1. Z-Axis VR Entry Effect for Hero Section ONLY
            if (heroContent && heroVisual) {
                // Determine progress based on how far we've scrolled
                const progress = Math.min(1, Math.max(0, currentScroll / (window.innerHeight * 0.6)));
                
                // Disintegrate into transparency rapidly to avoid overlapping next sections
                const opacity = 1 - (progress * 1.8);
                
                // Subtle Z push but mostly translate UP so it physically moves out of the way
                const yOffset = -(progress * 300);
                const zOffsetVisual = progress * 400; 
                const zOffsetContent = progress * 200;
                
                // Hide completely when faded to prevent any rendering over other elements
                const visibility = opacity <= 0 ? 'hidden' : 'visible';

                heroContent.style.transition = 'none';
                heroContent.style.transform = `perspective(1000px) translate3d(0px, ${yOffset}px, ${zOffsetContent}px)`;
                heroContent.style.opacity = Math.max(0, opacity);
                heroContent.style.visibility = visibility;

                heroVisual.style.transition = 'none';
                heroVisual.style.transform = `perspective(1000px) translate3d(0px, ${yOffset}px, ${zOffsetVisual}px)`;
                heroVisual.style.opacity = Math.max(0, opacity);
                heroVisual.style.visibility = visibility;
            }

            // 2. Practical Background Network Layer
            // It is fixed positioned now to span the whole website background
            if (vrCanvas) {
                vrCanvas.style.transform = 'none';
            }

            requestAnimationFrame(updateParallax);
        };
        
        requestAnimationFrame(updateParallax);
    }

    // --- Draggable Floating Picture-in-Picture Video (Home Page Only) ---
    const videoContainer = document.querySelector('.video-container');
    const introVideo = document.querySelector('.video-container video');
    
    if (isHomePage && videoContainer && introVideo) {
        
        // Wrap video dynamically to support close button
        const pipWrapper = document.createElement('div');
        pipWrapper.className = 'pip-wrapper';
        introVideo.parentNode.insertBefore(pipWrapper, introVideo);
        pipWrapper.appendChild(introVideo);

        const closePiPBtn = document.createElement('div');
        closePiPBtn.className = 'pip-close-btn';
        closePiPBtn.innerHTML = '<i class="ph ph-x"></i>';
        pipWrapper.appendChild(closePiPBtn);
        
        let pipDismissed = false;

        closePiPBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag mousedown
            pipDismissed = true;
            dockPiP();
        });

        // 1. Drag and Drop Logic
        let isDragging = false;
        let startX, startY, initialX, initialY;

        pipWrapper.addEventListener('mousedown', (e) => {
            if (!pipWrapper.classList.contains('floating-video')) return; // Only draggable when floating
            
            isDragging = true;
            pipWrapper.style.cursor = 'grabbing';
            
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = pipWrapper.getBoundingClientRect();
            pipWrapper.style.bottom = 'auto';
            pipWrapper.style.right = 'auto';
            pipWrapper.style.left = rect.left + 'px';
            pipWrapper.style.top = rect.top + 'px';
            
            initialX = rect.left;
            initialY = rect.top;
            
            e.preventDefault(); 
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            pipWrapper.style.left = (initialX + dx) + 'px';
            pipWrapper.style.top = (initialY + dy) + 'px';
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                pipWrapper.style.cursor = 'grab';
            }
        });

        // Docking and Floating functions
        const floatPiP = () => {
            if (!pipWrapper.classList.contains('floating-video')) {
                videoContainer.style.height = `${videoContainer.offsetHeight}px`;
                pipWrapper.classList.add('floating-video');
                introVideo.classList.add('floating-video'); // So CSS mask goes away
                pipWrapper.style.cursor = 'grab';
                introVideo.removeAttribute('controls');
                
                pipWrapper.style.left = 'auto';
                pipWrapper.style.top = 'auto';
                pipWrapper.style.bottom = '2rem';
                pipWrapper.style.right = '2rem';

                const wasPlaying = !introVideo.paused;
                const cachedTime = introVideo.currentTime;
                
                document.body.appendChild(pipWrapper);
                videoContainer.classList.add('hide-curve');

                setTimeout(() => {
                    introVideo.currentTime = cachedTime;
                    if (wasPlaying) introVideo.play().catch(e => console.log('Autoplay recovered', e));
                }, 50);
            }
        };

        const dockPiP = () => {
            if (pipWrapper.classList.contains('floating-video')) {
                pipWrapper.classList.remove('floating-video');
                introVideo.classList.remove('floating-video');
                pipWrapper.style.cursor = ''; 
                introVideo.setAttribute('controls', '');
                
                pipWrapper.style.left = '';
                pipWrapper.style.top = '';
                pipWrapper.style.bottom = '';
                pipWrapper.style.right = '';

                const wasPlaying = !introVideo.paused;
                const cachedTime = introVideo.currentTime;
                
                videoContainer.appendChild(pipWrapper);
                videoContainer.style.height = 'auto'; 
                videoContainer.classList.remove('hide-curve');
                
                if(pipDismissed) {
                    introVideo.pause(); // Pause video when user dismisses it
                }

                setTimeout(() => {
                    introVideo.currentTime = cachedTime;
                    if (wasPlaying && !pipDismissed) introVideo.play().catch(e => console.log('Autoplay recovered', e));
                }, 50);
            }
        };

        // 2. PiP Trigger Logic 
        window.addEventListener('scroll', () => {
            const containerRect = videoContainer.getBoundingClientRect();
            
            // Reset pipDismissed if user scrolls back up to the video container
            if (containerRect.bottom >= 0) {
                pipDismissed = false;
                dockPiP();
            } else if (containerRect.bottom < 0 && !pipDismissed) {
                floatPiP();
            }
        });
    }

    // --- Gallery Lightbox Logic ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        galleryItems.forEach(item => {
            // Auto play preview video on hover
            const video = item.querySelector('video');
            if (video) {
                item.addEventListener('mouseenter', () => video.play());
                item.addEventListener('mouseleave', () => video.pause());
            }

            item.addEventListener('click', () => {
                const src = item.getAttribute('data-src');
                const type = item.getAttribute('data-type');
                
                lightboxContent.innerHTML = ''; // clear
                
                if (type === 'image') {
                    const img = document.createElement('img');
                    img.src = src;
                    lightboxContent.appendChild(img);
                } else if (type === 'video') {
                    const vid = document.createElement('video');
                    vid.src = src;
                    vid.controls = true;
                    vid.autoplay = true;
                    lightboxContent.appendChild(vid);
                }
                
                lightbox.classList.add('active');
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            // Stop video if playing
            setTimeout(() => {
                lightboxContent.innerHTML = '';
            }, 400); // wait for transition
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});
