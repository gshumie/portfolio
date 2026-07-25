const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const loadingScreen = document.getElementById('loadingScreen');
const typingText = document.getElementById('typingText');
const progressBars = document.querySelectorAll('.progress-bar span');

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
});

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => revealObserver.observe(item));

const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.width = `${entry.target.dataset.progress}%`;
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

progressBars.forEach((bar) => progressObserver.observe(bar));

const typingStrings = [' a web developer.', ' a student creator.', ' a problem solver.'];
const emailConfig = {
  publicKey: 'YOUR_PUBLIC_KEY',
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID'
};
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentText = typingStrings[typingIndex];

  if (!isDeleting) {
    typingText.textContent = currentText.slice(0, charIndex + 1);
    charIndex += 1;

    if (charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1300);
      return;
    }
  } else {
    typingText.textContent = currentText.slice(0, charIndex - 1);
    charIndex -= 1;

    if (charIndex === 0) {
      isDeleting = false;
      typingIndex = (typingIndex + 1) % typingStrings.length;
    }
  }

  setTimeout(typeLoop, isDeleting ? 70 : 110);
}

typeLoop();

window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 700);
});

function setStatus(message, isError = false) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${isError ? 'error' : 'success'}`;
}

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = contactForm.elements.name.value.trim();
  const email = contactForm.elements.email.value.trim();
  const message = contactForm.elements.message.value.trim();

  if (!name || !email || !message) {
    setStatus('Please fill in all the fields before sending.', true);
    return;
  }

  setStatus('Sending your message...');

  try {
    const isEmailjsConfigured = window.emailjs &&
      emailConfig.publicKey !== 'YOUR_PUBLIC_KEY' &&
      emailConfig.serviceId !== 'YOUR_SERVICE_ID' &&
      emailConfig.templateId !== 'YOUR_TEMPLATE_ID';

    if (isEmailjsConfigured) {
      emailjs.init(emailConfig.publicKey);
      await emailjs.send(emailConfig.serviceId, emailConfig.templateId, {
        from_name: name,
        from_email: email,
        message: message
      });
      setStatus('Thanks! Your message was sent successfully.');
      contactForm.reset();
      return;
    }

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:getasewshumie@example.com?subject=${subject}&body=${body}`;
    setStatus('Your email app has opened with the message prepared.');
    contactForm.reset();
  } catch (error) {
    setStatus('Something went wrong. Please try again later.', true);
    console.error(error);
  }
});
