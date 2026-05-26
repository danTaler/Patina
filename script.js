document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════════════
    // HEADER SCROLL EFFECT
    // ═══════════════════════════════════════════════════════
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ═══════════════════════════════════════════════════════
    // MOBILE MENU TOGGLE
    // ═══════════════════════════════════════════════════════
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav  = document.querySelector('nav');

    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.classList.toggle('open');
        mobileNav.classList.toggle('mobile-open', isOpen);
        document.body.classList.toggle('menu-active', isOpen);
    });

    document.querySelectorAll('.nav-link, .cta-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            mobileNav.classList.remove('mobile-open');
            document.body.classList.remove('menu-active');
        });
    });

    // ═══════════════════════════════════════════════════════
    // SMOOTH SCROLL
    // ═══════════════════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // ═══════════════════════════════════════════════════════
    // PARALLAX HERO
    // ═══════════════════════════════════════════════════════
    const heroBg = document.getElementById('hero-bg-img');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            heroBg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
        }, { passive: true });
    }

    // ═══════════════════════════════════════════════════════
    // SCROLL REVEAL (Intersection Observer)
    // ═══════════════════════════════════════════════════════
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll(
        '.reveal-text, .fade-in, .reveal, .project-card, .service-item, .section-header'
    ).forEach(el => revealObserver.observe(el));

    // ═══════════════════════════════════════════════════════
    // STAGGERED CHILDREN
    // ═══════════════════════════════════════════════════════
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll(':scope > *');
                children.forEach((child, i) => {
                    setTimeout(() => child.classList.add('visible'), i * 150);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.services-list, .footer-grid').forEach(el => {
        el.querySelectorAll(':scope > *').forEach(child => child.classList.add('stagger-child'));
        staggerObserver.observe(el);
    });

    // ═══════════════════════════════════════════════════════
    // HERO ENTRY ANIMATION
    // ═══════════════════════════════════════════════════════
    setTimeout(() => {
        const heroText = document.querySelector('.reveal-text');
        const heroPara = document.querySelector('.fade-in');
        if (heroText) heroText.classList.add('visible');
        if (heroPara) setTimeout(() => heroPara.classList.add('visible'), 600);
    }, 400);

    // ═══════════════════════════════════════════════════════
    // CUSTOM CURSOR (Desktop only)
    // ═══════════════════════════════════════════════════════
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor    = document.createElement('div'); cursor.id    = 'cursor';
        const cursorDot = document.createElement('div'); cursorDot.id = 'cursor-dot';
        document.body.append(cursor, cursorDot);

        let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        });

        const animateDot = () => {
            dotX += (mouseX - dotX) * 0.1;
            dotY += (mouseY - dotY) * 0.1;
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top  = dotY + 'px';
            requestAnimationFrame(animateDot);
        };
        animateDot();

        document.querySelectorAll('a, button, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-grow'));
        });
    }


});

