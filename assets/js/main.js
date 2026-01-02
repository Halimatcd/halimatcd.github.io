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
        document.body.style.overflow = 'hidden';
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        document.body.style.overflow = '';
    });
}

// ===== REMOVE MENU ON CLICK =====
const navLinks = document.querySelectorAll('.nav__link');
const linkAction = () => {
    navMenu.classList.remove('show-menu');
    document.body.style.overflow = '';
};
navLinks.forEach(link => link.addEventListener('click', linkAction));

// ===== DARK/LIGHT THEME =====
const darkTheme = 'dark-theme';
const iconTheme = 'bx-sun';

// Check for saved theme preference or use dark theme as default
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('selected-theme');
const savedIcon = localStorage.getItem('selected-icon');

// Get current theme
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun';

// Set initial theme
if (savedTheme) {
    document.body.classList[savedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[savedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme);
} else {
    // Default to dark theme if no preference saved
    document.body.classList.add(darkTheme);
    themeButton.classList.remove(iconTheme);
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

// Throttle scroll event for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            scrollActive();
            scrollTimeout = null;
        }, 100);
    }
});

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
            typingSpeed = isDeleting ? 50 : 1200;
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
        console.warn('Chart.js not loaded. Skills chart disabled.');
        return;
    }
    
    try {
        const skillsChart = new Chart(ctx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Cloud Security', 'DevSecOps', 'Network Security', 'Threat Intelligence', 'Incident Response', 'Compliance'],
                datasets: [{
                    label: 'Expertise Level',
                    data: [95, 92, 88, 85, 90, 87],
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
                            color: '#fff',
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
        
        // Store chart instance for potential updates
        window.skillsChart = skillsChart;
        
    } catch (error) {
        console.error('Error creating skills chart:', error);
        // Fallback: Hide canvas and show message
        ctx.parentElement.innerHTML = '<p style="color: var(--primary-color); text-align: center;">Skills visualization not available</p>';
    }
};

// ===== ANIMATE SKILL BARS =====
const animateSkillBars = () => {
    const skillItems = document.querySelectorAll('.skill__item');
    
    if (!skillItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target.querySelector('.skill__percentage');
                const width = skillBar.style.width || skillBar.getAttribute('data-width');
                
                if (width) {
                    // Reset to 0 then animate to target width
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
};

// ===== FORM VALIDATION =====
const initFormValidation = () => {
    const contactForm = document.querySelector('.contact__form');
    
    if (!contactForm) return;
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('.contact__input, .contact__textarea');
    inputs.forEach(input => {
        // Add placeholder for floating labels
        if (!input.hasAttribute('placeholder')) {
            input.setAttribute('placeholder', ' ');
        }
        
        input.addEventListener('blur', () => {
            validateInput(input);
        });
        
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.style.borderColor = 'var(--primary-color)';
            }
        });
    });
    
    const validateInput = (input) => {
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
    };
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = contactForm.querySelectorAll('.contact__input, .contact__textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Show success message
            const submitButton = contactForm.querySelector('.contact__button');
            const originalText = submitButton.innerHTML;
            const originalBg = submitButton.style.background;
            
            submitButton.innerHTML = '<i class="bx bx-check"></i> Message Sent Successfully';
            submitButton.style.background = 'var(--success-color)';
            submitButton.disabled = true;
            
            // In a real application, you would send the form data to a server here
            console.log('Form submitted:', {
                name: contactForm.querySelector('[placeholder=" "]').value,
                email: contactForm.querySelector('[type="email"]').value,
                subject: contactForm.querySelectorAll('[placeholder=" "]')[2]?.value,
                message: contactForm.querySelector('textarea').value
            });
            
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.style.background = originalBg;
                submitButton.disabled = false;
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
};

// ===== SMOOTH SCROLL =====
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navMenu.classList.contains('show-menu')) {
                    navMenu.classList.remove('show-menu');
                    document.body.style.overflow = '';
                }
                
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
};

// Add CSS for reveal animation
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .experience__item.revealed,
    .project__card.revealed,
    .certification__card.revealed,
    .skills__group.revealed,
    .about__detail.revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(revealStyle);

// ===== DEBOUNCE FUNCTION =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functions
    initSmoothScroll();
    initFormValidation();
    initRevealOnScroll();
    
    // Initialize skills chart
    if (typeof Chart !== 'undefined') {
        initSkillsChart();
    } else {
        console.warn('Chart.js not loaded. Loading now...');
        // Dynamically load Chart.js if not loaded
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = initSkillsChart;
        document.head.appendChild(script);
    }
    
    // Scroll to top on page refresh
    window.scrollTo(0, 0);
    
    // Set initial active nav link
    scrollActive();
    
    // Set initial scroll up button state
    scrollUpShow();
});

// ===== WINDOW LOAD EVENT =====
window.addEventListener('load', () => {
    // Animate skill bars
    animateSkillBars();
});

// ===== RESIZE HANDLER =====
const handleResize = debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && navMenu.classList.contains('show-menu')) {
        navMenu.classList.remove('show-menu');
        document.body.style.overflow = '';
    }
    
    // Reinitialize charts if needed
    if (window.skillsChart && typeof window.skillsChart.resize === 'function') {
        window.skillsChart.resize();
    }
}, 250);

window.addEventListener('resize', handleResize);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Script error:', e.error);
});

// ===== EXPORT FOR MODULES (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSkillsChart,
        animateSkillBars,
        initFormValidation
    };
}