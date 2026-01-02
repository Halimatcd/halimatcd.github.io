// ===== MAIN JS FILE =====
// Consolidated all functionality for all pages

// ===== CONFIGURATION =====
const CONFIG = {
    formspreeId: 'xdojqyvz', // Replace with your actual Formspree ID
    siteName: 'Halimat Aminu',
    currentYear: new Date().getFullYear(),
    professions: [
        'Cybersecurity Engineer',
        'DevSecOps Specialist', 
        'Cloud Security Architect',
        'Chief Technology Officer'
    ],
    skillsData: {
        labels: ['Cloud Security', 'DevSecOps', 'Network Security', 'Threat Intelligence', 'Incident Response', 'Compliance'],
        data: [95, 92, 88, 85, 90, 87]
    }
};

// ===== DOM ELEMENTS =====
const DOM = {
    navMenu: document.getElementById('nav-menu'),
    navToggle: document.getElementById('nav-toggle'),
    navClose: document.getElementById('nav-close'),
    themeButton: document.getElementById('theme-button'),
    scrollUp: document.getElementById('scroll-up'),
    currentYear: document.getElementById('current-year')
};

// ===== STATE MANAGEMENT =====
const STATE = {
    currentPage: window.location.pathname.split('/').pop() || 'index.html',
    currentTheme: localStorage.getItem('selected-theme') || 'dark',
    currentIcon: localStorage.getItem('selected-icon') || 'bx-moon',
    typingAnimation: null
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    },

    setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__menu a[href*="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active-link');
                } else {
                    navLink.classList.remove('active-link');
                }
            }
        });

        // Also set active link based on current page
        const currentPage = STATE.currentPage;
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            const href = link.getAttribute('href');
            if (currentPage === 'index.html' && href.startsWith('#')) {
                if (href === '#home' && scrollY < 100) {
                    link.classList.add('active-link');
                }
            } else if (href === currentPage || (currentPage === 'index.html' && href === '#')) {
                link.classList.add('active-link');
            }
        });
    }
};

// ===== THEME MANAGEMENT =====
const Theme = {
    init() {
        this.setTheme(STATE.currentTheme);
        if (DOM.themeButton) {
            DOM.themeButton.addEventListener('click', () => this.toggleTheme());
        }
    },

    setTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        document.body.classList.toggle('light-theme', theme === 'light');
        
        if (DOM.themeButton) {
            DOM.themeButton.classList.toggle('bx-sun', theme === 'dark');
            DOM.themeButton.classList.toggle('bx-moon', theme === 'light');
        }
        
        STATE.currentTheme = theme;
        STATE.currentIcon = theme === 'dark' ? 'bx-moon' : 'bx-sun';
        
        localStorage.setItem('selected-theme', theme);
        localStorage.setItem('selected-icon', STATE.currentIcon);
    },

    toggleTheme() {
        const newTheme = STATE.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    getCurrentTheme() {
        return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    },

    getCurrentIcon() {
        return DOM.themeButton.classList.contains('bx-sun') ? 'bx-moon' : 'bx-sun';
    }
};

// ===== NAVIGATION MANAGEMENT =====
const Navigation = {
    init() {
        if (DOM.navToggle) {
            DOM.navToggle.addEventListener('click', () => this.showMenu());
        }
        
        if (DOM.navClose) {
            DOM.navClose.addEventListener('click', () => this.hideMenu());
        }
        
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.handleNavClick(link));
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (DOM.navMenu && DOM.navMenu.classList.contains('show-menu') && 
                !DOM.navMenu.contains(e.target) && 
                !DOM.navToggle.contains(e.target)) {
                this.hideMenu();
            }
        });
    },

    showMenu() {
        if (DOM.navMenu) {
            DOM.navMenu.classList.add('show-menu');
            document.body.style.overflow = 'hidden';
        }
    },

    hideMenu() {
        if (DOM.navMenu) {
            DOM.navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        }
    },

    handleNavClick(link) {
        const href = link.getAttribute('href');
        
        // Close mobile menu
        this.hideMenu();
        
        // Handle internal anchor links
        if (href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e?.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
        
        // Update active link
        document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active-link'));
        link.classList.add('active-link');
    }
};

// ===== TYPING ANIMATION =====
const TypingAnimation = {
    init() {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;

        let professionIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const typeEffect = () => {
            const currentProfession = CONFIG.professions[professionIndex];
            
            if (!isDeleting && charIndex <= currentProfession.length) {
                typingText.textContent = currentProfession.substring(0, charIndex);
                charIndex++;
                typingSpeed = 100;
            } else if (isDeleting && charIndex >= 0) {
                typingText.textContent = currentProfession.substring(0, charIndex);
                charIndex--;
                typingSpeed = 50;
            } else {
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    professionIndex = (professionIndex + 1) % CONFIG.professions.length;
                }
                typingSpeed = isDeleting ? 50 : 1200;
            }
            
            STATE.typingAnimation = setTimeout(typeEffect, typingSpeed);
        };

        // Start typing animation after page load
        setTimeout(typeEffect, 1000);
    },

    stop() {
        if (STATE.typingAnimation) {
            clearTimeout(STATE.typingAnimation);
        }
    }
};

// ===== SKILLS CHART =====
const SkillsChart = {
    chart: null,

    init() {
        const ctx = document.getElementById('skillsRadar');
        if (!ctx) return;

        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded. Loading dynamically...');
            this.loadChartJS().then(() => this.createChart(ctx));
            return;
        }

        this.createChart(ctx);
    },

    loadChartJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.integrity = 'sha256-7lWo7cjryponOJcS6Xv7kFQkqVr4k1Q5+5U5q5k5F5E=';
            script.crossOrigin = 'anonymous';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    createChart(ctx) {
        try {
            this.chart = new Chart(ctx.getContext('2d'), {
                type: 'radar',
                data: {
                    labels: CONFIG.skillsData.labels,
                    datasets: [{
                        label: 'Expertise Level',
                        data: CONFIG.skillsData.data,
                        backgroundColor: 'rgba(48, 249, 7, 0.2)',
                        borderColor: 'rgba(48, 249, 7, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(48, 249, 7, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            pointLabels: {
                                color: 'var(--light-color)',
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 12
                                },
                                padding: 10
                            },
                            ticks: {
                                display: false,
                                maxTicksLimit: 5,
                                backdropColor: 'transparent'
                            },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(10, 14, 23, 0.9)',
                            titleColor: 'rgba(48, 249, 7, 1)',
                            bodyColor: '#fff',
                            borderColor: 'rgba(48, 249, 7, 0.3)',
                            borderWidth: 1
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating skills chart:', error);
            // Fallback
            ctx.parentElement.innerHTML = '<p style="color: var(--primary-color); text-align: center; padding: 2rem;">Skills visualization available with JavaScript enabled</p>';
        }
    },

    destroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
};

// ===== ANIMATIONS =====
const Animations = {
    init() {
        this.animateSkillBars();
        this.initRevealOnScroll();
        this.animateOnLoad();
    },

    animateSkillBars() {
        const skillItems = document.querySelectorAll('.skill__item');
        if (!skillItems.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target.querySelector('.skill__percentage');
                    const width = skillBar.getAttribute('data-width') || skillBar.style.width;
                    
                    if (width) {
                        skillBar.style.width = '0';
                        setTimeout(() => {
                            skillBar.style.width = width;
                        }, 300);
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        skillItems.forEach(item => {
            const skillBar = item.querySelector('.skill__percentage');
            if (skillBar) {
                const width = skillBar.style.width;
                if (width) {
                    skillBar.setAttribute('data-width', width);
                    skillBar.style.width = '0';
                    observer.observe(item);
                }
            }
        });
    },

    initRevealOnScroll() {
        const revealElements = document.querySelectorAll(
            '.experience__item, .project__card, .certification__card, .skills__group, .about__detail, .contact__detail, .blog-card'
        );
        
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        revealElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    },

    animateOnLoad() {
        // Animate elements that should appear on load
        const loadElements = document.querySelectorAll('.home__title, .home__description');
        loadElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
};

// ===== FORM HANDLING =====
const FormHandler = {
    init() {
        this.initContactForm();
        this.initNewsletterForms();
        this.initBlogFilters();
    },

    initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        // Real-time validation
        const inputs = contactForm.querySelectorAll('.contact__input, .contact__textarea');
        inputs.forEach(input => {
            if (!input.hasAttribute('placeholder')) {
                input.setAttribute('placeholder', ' ');
            }
            
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.style.borderColor = 'var(--primary-color)';
                }
            });
        });

        contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e, contactForm));
    },

    initNewsletterForms() {
        const newsletterForms = document.querySelectorAll('.newsletter-form, .footer__newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleNewsletterSubmit(e, form));
        });
    },

    initBlogFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const categoryItems = document.querySelectorAll('.category-item');
        const blogCards = document.querySelectorAll('.blog-card');

        if (!filterBtns.length || !blogCards.length) return;

        const filterBlogs = (filter) => {
            blogCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });

            filterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
            });
        };

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                filterBlogs(filter);
            });
        });

        categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = item.getAttribute('data-filter');
                filterBlogs(filter);
                
                // Also update filter buttons
                filterBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
                });
            });
        });
    },

    validateInput(input) {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--danger-color)';
            return false;
        }
        
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                input.style.borderColor = 'var(--warning-color)';
                return false;
            }
        }
        
        input.style.borderColor = 'var(--primary-color)';
        return true;
    },

    async handleFormSubmit(e, form) {
        e.preventDefault();
        
        const inputs = form.querySelectorAll('.contact__input, .contact__textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        const originalBg = submitButton.style.background;

        // Show loading state
        submitButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
        submitButton.style.background = 'var(--warning-color)';
        submitButton.disabled = true;

        try {
            const formData = new FormData(form);
            
            // Use Formspree
            const response = await fetch(`https://formspree.io/f/${CONFIG.formspreeId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                submitButton.innerHTML = '<i class="bx bx-check"></i> Message Sent!';
                submitButton.style.background = 'var(--success-color)';
                
                // Reset form
                form.reset();
                
                // Reset labels
                const labels = form.querySelectorAll('.contact__label');
                labels.forEach(label => {
                    label.style.top = '1rem';
                    label.style.left = '1rem';
                    label.style.fontSize = '1rem';
                    label.style.background = '';
                    label.style.padding = '';
                    label.style.color = '';
                });

                // Show success message
                this.showNotification('Message sent successfully!', 'success');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            submitButton.innerHTML = '<i class="bx bx-error"></i> Error!';
            submitButton.style.background = 'var(--danger-color)';
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.style.background = originalBg;
                submitButton.disabled = false;
            }, 3000);
        }
    },

    handleNewsletterSubmit(e, form) {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const button = form.querySelector('button[type="submit"]');
        
        if (!this.validateInput(input)) return;

        const originalHtml = button.innerHTML;
        button.innerHTML = '<i class="bx bx-check"></i>';
        button.style.background = 'var(--success-color)';
        
        // In a real application, you would send this to your newsletter service
        console.log('Newsletter subscription:', input.value);
        
        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.style.background = '';
            input.value = '';
            this.showNotification('Subscribed to newsletter!', 'success');
        }, 2000);
    },

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i>
            <span>${message}</span>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--dark-color-alt);
                color: var(--light-color);
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 9999;
                box-shadow: var(--box-shadow);
                border-left: 4px solid var(--primary-color);
                transform: translateX(120%);
                transition: transform 0.3s ease;
            }
            .notification--success { border-color: var(--success-color); }
            .notification--error { border-color: var(--danger-color); }
            .notification.show { transform: translateX(0); }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 5000);
    }
};

// ===== SCROLL MANAGEMENT =====
const ScrollManager = {
    init() {
        this.initSmoothScroll();
        this.initScrollUp();
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
            Utils.setActiveNavLink();
        }, 100));
    },

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || href === '#!') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    Navigation.hideMenu();
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    initScrollUp() {
        if (!DOM.scrollUp) return;
        
        DOM.scrollUp.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },

    handleScroll() {
        // Show/hide scroll up button
        if (DOM.scrollUp) {
            if (window.scrollY >= 350) {
                DOM.scrollUp.classList.add('show-scroll');
            } else {
                DOM.scrollUp.classList.remove('show-scroll');
            }
        }
    }
};

// ===== PERFORMANCE OPTIMIZATION =====
const Performance = {
    init() {
        this.optimizeBackgrounds();
        this.lazyLoadImages();
        this.setCurrentYear();
    },

    optimizeBackgrounds() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Remove parallax effect if user prefers reduced motion
        if (prefersReducedMotion) {
            const sections = document.querySelectorAll('.home, .experience.section');
            sections.forEach(section => {
                section.style.backgroundAttachment = 'scroll';
            });
        }
        
        // Optimize for mobile
        if (window.innerWidth < 768) {
            const homeSection = document.querySelector('.home');
            const experienceSection = document.querySelector('.experience.section');
            
            if (homeSection) {
                homeSection.style.backgroundImage = `linear-gradient(135deg, rgba(2, 11, 40, 0.9), rgba(19, 24, 42, 0.95))`;
            }
            
            if (experienceSection) {
                experienceSection.style.backgroundImage = `linear-gradient(135deg, rgba(10, 14, 23, 0.95), rgba(19, 24, 42, 0.98))`;
            }
        }
    },

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        if (!images.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    },

    setCurrentYear() {
        if (DOM.currentYear) {
            DOM.currentYear.textContent = CONFIG.currentYear;
        }
        
        // Also update any other year elements
        document.querySelectorAll('[data-current-year]').forEach(el => {
            el.textContent = CONFIG.currentYear;
        });
    }
};

// ===== ERROR HANDLING =====
const ErrorHandler = {
    init() {
        window.addEventListener('error', (e) => {
            console.error('Script error:', e.error);
            this.logError(e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.logError(e.reason);
        });
    },

    logError(error) {
        // In a production app, you would send this to an error tracking service
        console.error('Error logged:', {
            error: error?.message || error,
            stack: error?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Theme.init();
    Navigation.init();
    ScrollManager.init();
    Animations.init();
    FormHandler.init();
    Performance.init();
    ErrorHandler.init();
    
    // Initialize page-specific features
    if (STATE.currentPage === 'index.html') {
        TypingAnimation.init();
        SkillsChart.init();
    }
    
    // Scroll to top on initial load (but not on refresh with hash)
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }
    
    // Set current year in footer
    if (DOM.currentYear) {
        DOM.currentYear.textContent = CONFIG.currentYear;
    }
});

// ===== WINDOW LOAD EVENT =====
window.addEventListener('load', () => {
    // Additional optimizations after everything loads
    Performance.lazyLoadImages();
    
    // Add loaded class to body for any post-load animations
    document.body.classList.add('loaded');
});

// ===== RESIZE HANDLER =====
window.addEventListener('resize', Utils.debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && DOM.navMenu && DOM.navMenu.classList.contains('show-menu')) {
        Navigation.hideMenu();
    }
    
    // Reinitialize charts if needed
    if (SkillsChart.chart && typeof SkillsChart.chart.resize === 'function') {
        SkillsChart.chart.resize();
    }
    
    // Re-optimize backgrounds
    Performance.optimizeBackgrounds();
}, 250));

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
    TypingAnimation.stop();
    SkillsChart.destroy();
});

// Export for modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Theme,
        Navigation,
        TypingAnimation,
        SkillsChart,
        Animations,
        FormHandler,
        ScrollManager,
        Performance,
        ErrorHandler,
        Utils,
        CONFIG,
        STATE,
        DOM
    };
}