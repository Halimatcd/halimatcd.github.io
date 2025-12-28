// Menu toggle for small screens
const navToggle = document.getElementById('nav-toggle');
const navList = document.getElementById('nav-menu');
if(navToggle && navList){
  navToggle.addEventListener('click', ()=> navList.classList.toggle('show'))
}

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(l => l.addEventListener('click', ()=>{ if(navList) navList.classList.remove('show')}))

// Active section on scroll
const sections = document.querySelectorAll('section[id]')
const scrollActive = () =>{
  const scrollY = window.pageYOffset
  sections.forEach(current =>{
    const sectionHeight = current.offsetHeight
    const sectionTop = current.offsetTop - 70
    const sectionId = current.getAttribute('id')
    const selector = `.nav__list a[href*="${sectionId}"]`
    const link = document.querySelector(selector)
    if(link){
      if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
        link.classList.add('active-link')
      } else { link.classList.remove('active-link') }
    }
  })
}
window.addEventListener('scroll', scrollActive)

// Scroll reveal (using included ScrollReveal)
const sr = ScrollReveal({origin:'top',distance:'30px',duration:900,delay:120})
sr.reveal('.hero__left, .hero__right, .portrait img',{interval:120})
sr.reveal('.about__grid > div, .timeline__item, .project-card, .contact__form, .contact__info',{interval:120,origin:'bottom'})

// Footer year
const footerYear = document.getElementById('footer-year')
if(footerYear) footerYear.textContent = new Date().getFullYear()

// Contact (mailto) — basic handler
const contactBtn = document.querySelector('.contact__button')
if(contactBtn){
  contactBtn.addEventListener('click', ()=>{
    const form = document.querySelector('.contact__form')
    if(!form) return
    const name = form.querySelector('input[type="text"]')?.value.trim() || ''
    const email = form.querySelector('input[type="email"]')?.value.trim() || ''
    const message = form.querySelector('textarea')?.value.trim() || ''
    if(!email || !message){
      alert('Please provide your email and a short message.')
      return
    }
    const to = 'aminuhalimat.o@gmail.com'
    const subject = encodeURIComponent('Contact from portfolio — ' + (name || email))
    const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' <' + email + '>')
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
  })
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle')
function applyTheme(theme){
  if(theme === 'dark') document.documentElement.classList.add('dark-theme')
  else document.documentElement.classList.remove('dark-theme')
}
// initialize
const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
applyTheme(savedTheme)
if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    const active = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light'
    const next = active === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    localStorage.setItem('theme', next)
    // update icon
    themeToggle.querySelector('i').className = next === 'dark' ? 'bx bx-sun' : 'bx bx-moon'
  })
}
/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if(sectionId && sectionsClass){
            if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
                sectionsClass.classList.add('active-link')
            }else{
                sectionsClass.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 

/* ===== Footer year (dynamic) ===== */
const footerYear = document.getElementById('footer-year');
if(footerYear) footerYear.textContent = new Date().getFullYear();

/* ===== Contact form handler (mailto) ===== */
const contactBtn = document.querySelector('.contact__button');
if(contactBtn){
    contactBtn.addEventListener('click', ()=>{
        const form = document.querySelector('.contact__form');
        if(!form) return;
        const name = form.querySelector('input[type="text"]')?.value || '';
        const email = form.querySelector('input[type="mail"]')?.value || '';
        const message = form.querySelector('textarea')?.value || '';
        const to = 'aminuhalimat.o@gmail.com';
        const subject = encodeURIComponent('Website contact from ' + (name || email));
        const body = encodeURIComponent(message + "\n\nFrom: " + name + " <" + email + ">");
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    })
}
