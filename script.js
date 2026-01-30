// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
    }, 1500);

    // Envelope interaction
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const mainContent = document.getElementById('main-content');
    const heartsBackground = document.getElementById('hearts-bg');

    envelopeOverlay.addEventListener('click', function() {
        envelopeOverlay.classList.add('hidden');
        setTimeout(() => {
            mainContent.classList.add('visible');
            heartsBackground.classList.add('active');
            document.body.style.overflow = 'auto';
            startHeartAnimation();
        }, 500);
    });

    // Prevent scroll before envelope is clicked
    document.body.style.overflow = 'hidden';

    // Floating hearts animation
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '♥';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heartsBackground.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 20000);
    }

    function startHeartAnimation() {
        setInterval(createHeart, 3000);
    }

    // Countdown Timer
    const weddingDate = new Date('2024-09-29T16:00:00').getTime();
    const circumference = 2 * Math.PI * 85;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        // Update circle progress
        updateCircle('days-circle', days, 365);
        updateCircle('hours-circle', hours, 24);
        updateCircle('minutes-circle', minutes, 60);
        updateCircle('seconds-circle', seconds, 60);
    }

    function updateCircle(id, value, max) {
        const circle = document.getElementById(id);
        if (circle) {
            const progress = value / max;
            const offset = circumference - (progress * circumference);
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = offset;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll animations for sections
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-wrapper').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(section);
    });

    // Timeline items animation
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.3
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });

    // Back to top button
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Photo frame tilt effect (only on desktop)
    if (window.innerWidth > 768) {
        const photoFrames = document.querySelectorAll('[data-tilt]');
        photoFrames.forEach(frame => {
            frame.addEventListener('mousemove', (e) => {
                const rect = frame.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            frame.addEventListener('mouseleave', () => {
                frame.style.transform = '';
            });
        });
    }

    // Calendar day hover effect
    const calendarDays = document.querySelectorAll('.calendar-day:not(.header):not(.empty):not(.special)');
    calendarDays.forEach(day => {
        day.addEventListener('mouseenter', function() {
            this.style.background = 'var(--accent-soft)';
        });
        day.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Parallax effect for hero section (only on desktop)
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero && scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                hero.style.opacity = 1 - (scrolled / hero.offsetHeight);
            }
        });
    }

    // Add sparkle effect to special elements
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = 'var(--accent-gold)';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.animation = 'sparkle 1s ease-out forwards';
        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
    }

    // Add sparkle animation CSS
    if (!document.querySelector('#sparkle-animation')) {
        const style = document.createElement('style');
        style.id = 'sparkle-animation';
        style.textContent = `
            @keyframes sparkle {
                0% {
                    transform: scale(0) translateY(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1.5) translateY(-30px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Sparkles on special date click
    const specialDate = document.querySelector('.calendar-day.special');
    if (specialDate) {
        specialDate.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 50;
                    const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 50;
                    createSparkle(x, y);
                }, i * 50);
            }
        });
    }

    // Console message
    console.log('%c💍 Денис & Влада 💍', 'font-size: 20px; color: #d4af37; font-weight: bold;');
    console.log('%c29 сентября 2024', 'font-size: 14px; color: #666;');
});

// Map function
function openMap() {
    // Opens Google Maps with the venue address
    window.open('https://www.google.com/maps/search/Зелёная+ул.,+1,+городской+посёлок+Фёдоровское', '_blank');
}

// Preload images (if you add real images later)
function preloadImages() {
    const images = [
        // Add your image URLs here
    ];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call preload when needed
// preloadImages();
