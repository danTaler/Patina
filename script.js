document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════════════
    // CMS CONTENT LOADER
    // Fetches _data/*.json and populates DOM elements by ID.
    // Falls back gracefully to static HTML if fetch fails.
    // ═══════════════════════════════════════════════════════

    async function fetchJSON(path) {
        try {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn(`[CMS] Could not load ${path}:`, e.message);
            return null;
        }
    }

    function set(id, value) {
        const el = document.getElementById(id);
        if (el && value !== undefined && value !== null && value !== '') {
            el.textContent = value;
        }
    }

    function setHref(id, href) {
        const el = document.getElementById(id);
        if (el && href) {
            el.setAttribute('href', href);
            el.textContent = href; // display URL text (for email/social)
        }
    }

    function setAttr(id, attr, value) {
        const el = document.getElementById(id);
        if (el && value) el.setAttribute(attr, value);
    }

    function buildProjectsGrid(projects) {
        const grid = document.getElementById('cms-projects-grid');
        if (!grid || !projects?.length) return;
        grid.innerHTML = projects.map(p => `
            <div class="project-card${p.featured ? ' large' : ''}">
                <img src="${p.image}" alt="${p.image_alt || p.name}" loading="lazy">
                <div class="project-info">
                    <h3>${p.name}</h3>
                    <p>${p.category}</p>
                </div>
            </div>
        `).join('');
    }

    function buildServicesList(services) {
        const list = document.getElementById('cms-services-list');
        if (!list || !services?.length) return;
        list.innerHTML = services.map(s => `
            <div class="service-item">
                <span class="number">${s.number}</span>
                <div class="service-content">
                    <h3>${s.title}</h3>
                    <p>${s.description}</p>
                </div>
            </div>
        `).join('');
    }

    function updateDOM(cmsData) {
        if (!cmsData) return;
        const { hero, studio, projects, services, settings } = cmsData;

        // ── Hero ───────────────────────────────────────────
        if (hero) {
            set('cms-hero-headline', hero.headline);
            set('cms-hero-headline-em', hero.headline_em);
            set('cms-hero-sub', hero.subheadline);
            const bg = document.getElementById('cms-hero-bg');
            if (bg && hero.background_image) {
                bg.style.backgroundImage = `url('${hero.background_image}')`;
            }
        }

        // ── Studio / About ─────────────────────────────────
        if (studio) {
            set('cms-studio-title', studio.title);
            set('cms-studio-lead', studio.lead);
            set('cms-studio-body', studio.body);
            const cta = document.getElementById('cms-studio-cta');
            if (cta) {
                cta.textContent = studio.cta_label || 'Our Process →';
                cta.setAttribute('href', studio.cta_href || '#process');
            }
            setAttr('cms-studio-img', 'src', studio.image);
            setAttr('cms-studio-img', 'alt', studio.image_alt || 'Studio Detail');
        }

        // ── Projects ───────────────────────────────────────
        if (projects) {
            const projectsArray = Array.isArray(projects) ? projects : projects.projects;
            if (projectsArray) buildProjectsGrid(projectsArray);
        }

        // ── Services ───────────────────────────────────────
        if (services) {
            const servicesArray = Array.isArray(services) ? services : services.services;
            if (servicesArray) buildServicesList(servicesArray);
        }

        // ── Settings ───────────────────────────────────────
        if (settings) {
            // Header
            const studioNameEl = document.getElementById('cms-studio-name');
            if (studioNameEl && settings.studio_name) {
                // Show only the first word in the logo mark
                studioNameEl.textContent = settings.studio_name.split(' ')[0].toUpperCase();
            }

            // CTA section
            set('cms-cta-heading', settings.cta_heading);
            set('cms-cta-sub', settings.cta_subheading);
            set('cms-cta-btn', settings.cta_button_label);
            const ctaBg = document.getElementById('cms-cta-bg');
            if (ctaBg && settings.cta_background_image) {
                ctaBg.style.backgroundImage = `url('${settings.cta_background_image}')`;
            }

            // Footer
            set('cms-footer-name', settings.studio_name?.split(' ')[0]?.toUpperCase());
            set('cms-footer-tagline', settings.tagline);
            set('cms-footer-location', settings.location);
            set('cms-footer-year', settings.copyright_year);
            set('cms-footer-copy-name', settings.studio_name);

            const emailEl = document.getElementById('cms-footer-email');
            if (emailEl && settings.email) {
                emailEl.textContent = settings.email;
                emailEl.setAttribute('href', `mailto:${settings.email}`);
            }

            const igEl = document.getElementById('cms-footer-instagram');
            if (igEl) {
                igEl.textContent = 'Instagram';
                if (settings.instagram_url) igEl.setAttribute('href', settings.instagram_url);
            }
            const piEl = document.getElementById('cms-footer-pinterest');
            if (piEl) {
                piEl.textContent = 'Pinterest';
                if (settings.pinterest_url) piEl.setAttribute('href', settings.pinterest_url);
            }
        }

        // Re-observe newly built cards (after grid/list rebuild)
        document.querySelectorAll(
            '.project-card, .service-item, .stagger-child'
        ).forEach(el => {
            el.classList.remove('visible');
            revealObserver.observe(el);
        });
        document.querySelectorAll('.services-list, .footer-grid').forEach(el => {
            el.querySelectorAll(':scope > *').forEach(child => {
                child.classList.add('stagger-child');
            });
            staggerObserver.observe(el);
        });
    }

    async function loadContent() {
        // Setup message listener for real-time Wix Velo updates
        window.addEventListener('message', (event) => {
            const msg = event.data;
            if (msg && msg.type === 'WIX_CMS_UPDATE') {
                console.log('[Wix Sync] Received CMS data update from Wix Velo:', msg.data);
                updateDOM(msg.data);
            }
        });

        // Inform Wix parent page that iframe is loaded and ready to receive data
        try {
            window.parent.postMessage({ type: 'WIX_IFRAME_READY' }, '*');
        } catch (e) {
            console.warn('[Wix Sync] Standalone mode: Cannot reach window.parent');
        }

        // Fetch local JSON files as fallback for local dev / standalone mode
        const [hero, studio, projectsData, servicesData, settings] = await Promise.all([
            fetchJSON('_data/hero.json'),
            fetchJSON('_data/studio.json'),
            fetchJSON('_data/projects.json'),
            fetchJSON('_data/services.json'),
            fetchJSON('_data/settings.json'),
        ]);

        if (hero || studio || projectsData || servicesData || settings) {
            updateDOM({
                hero,
                studio,
                projects: projectsData?.projects,
                services: servicesData?.services,
                settings
            });
        }
    }

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
    const heroBg = document.getElementById('cms-hero-bg');
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

    // ═══════════════════════════════════════════════════════
    // KICK OFF CONTENT LOAD
    // ═══════════════════════════════════════════════════════
    loadContent();

});
