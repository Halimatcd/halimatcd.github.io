// ===== MAIN JS FILE =====

// ===== DOM ELEMENTS =====
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const themeButton = document.getElementById('theme-button');
const scrollUp = document.getElementById('scroll-up');

// ===== MENU SHOW/HIDE =====
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// ===== REMOVE MENU ON CLICK =====
const navLinks = document.querySelectorAll('.nav__link');
const linkAction = () => {
    navMenu.classList.remove('show-menu');
};
navLinks.forEach(link => link.addEventListener('click', linkAction));

// ===== DARK/LIGHT THEME =====
const darkTheme = 'dark-theme';
const iconTheme = 'bx-sun';

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

// Get current theme
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun';

// Validate if user previously chose a theme
if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme);
}

// Toggle theme
if (themeButton) {
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle(darkTheme);
        themeButton.classList.toggle(iconTheme);
        
        localStorage.setItem('selected-theme', getCurrentTheme());
        localStorage.setItem('selected-icon', getCurrentIcon());
    });
}

// ===== SCROLL SECTIONS ACTIVE LINK =====
const sections = document.querySelectorAll('section[id]');
const scrollActive = () => {
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
};
window.addEventListener('scroll', scrollActive);

// ===== SHOW SCROLL UP =====
const scrollUpShow = () => {
    if (window.scrollY >= 350) {
        scrollUp.classList.add('show-scroll');
    } else {
        scrollUp.classList.remove('show-scroll');
    }
};
window.addEventListener('scroll', scrollUpShow);

// ===== TYPING ANIMATION =====
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const professions = ['Cybersecurity Engineer', 'DevSecOps Specialist', 'Cloud Security Architect', 'Chief Technology Officer'];
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentProfession = professions[professionIndex];
        
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
                professionIndex = (professionIndex + 1) % professions.length;
            }
            typingSpeed = 1200;
        }
        
        setTimeout(typeEffect, typingSpeed);
    };

    // Start typing animation after page load
    setTimeout(typeEffect, 1000);
}

// ===== SKILLS RADAR CHART =====
const initSkillsChart = () => {
    const ctx = document.getElementById('skillsRadar');
    
    if (!ctx) return;
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded yet. Retrying...');
        setTimeout(initSkillsChart, 500);
        return;
    }
    
    try {
        const skillsChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Cloud Security', 'DevSecOps', 'Network Security', 'Threat Intelligence', 'Incident Response', 'Compliance'],
                datasets: [{
                    label: 'Expertise Level',
                    data: [95, 92, 88, 85, 90, 87],
                    backgroundColor: 'rgba(0, 212, 255, 0.2)',
                    borderColor: 'rgba(0, 212, 255, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(0, 212, 255, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#fff',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 12
                            }
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
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating skills chart:', error);
    }
};

// ===== ANIMATE SKILL BARS =====
const animateSkillBars = () => {
    const skillItems = document.querySelectorAll('.skill__item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target.querySelector('.skill__percentage');
                const width = skillBar.style.width || skillBar.getAttribute('data-width');
                
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
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
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
};

// ===== FORM VALIDATION =====
const initFormValidation = () => {
    const contactForm = document.querySelector('.contact__form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = contactForm.querySelectorAll('.contact__input, .contact__textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--danger-color)';
                isValid = false;
            } else {
                input.style.borderColor = 'var(--primary-color)';
            }
        });
        
        if (isValid) {
            // Show success message
            const submitButton = contactForm.querySelector('.contact__button');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="bx bx-check"></i> Message Sent Successfully';
            submitButton.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.style.background = '';
                contactForm.reset();
                
                // Reset labels
                const labels = contactForm.querySelectorAll('.contact__label');
                labels.forEach(label => {
                    label.style.top = '1rem';
                    label.style.left = '1rem';
                    label.style.fontSize = '1rem';
                    label.style.background = '';
                    label.style.padding = '';
                    label.style.color = '';
                });
            }, 3000);
        }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('.contact__input, .contact__textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.style.borderColor = 'var(--primary-color)';
            }
        });
        
        // Add placeholder for floating labels
        if (!input.hasAttribute('placeholder')) {
            input.setAttribute('placeholder', ' ');
        }
    });
};

// ===== SMOOTH SCROLL =====
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ===== REVEAL ON SCROLL =====
const initRevealOnScroll = () => {
    const revealElements = document.querySelectorAll('.experience__item, .project__card, .certification__card, .skills__group, .about__detail');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
};

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functions
    initSmoothScroll();
    initFormValidation();
    initRevealOnScroll();
    animateSkillBars();
    
    // Initialize skills chart after a delay (wait for Chart.js to load)
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            initSkillsChart();
        } else {
            console.warn('Chart.js not loaded. Skills chart will not display.');
        }
    }, 1000);
    
    // Scroll to top on page refresh
    window.scrollTo(0, 0);
});

// ===== WINDOW LOAD EVENT =====
window.addEventListener('load', () => {
    // Animate skill bars on load
    setTimeout(animateSkillBars, 500);
    
    // Update active nav link
    scrollActive();
    
    // Show/hide scroll up button
    scrollUpShow();
});

// ===== RESIZE HANDLER =====
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && navMenu.classList.contains('show-menu')) {
        navMenu.classList.remove('show-menu');
    }
});