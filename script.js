const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const loadingScreen = document.getElementById('loadingScreen');
const typingText = document.getElementById('typingText');
const progressBars = document.querySelectorAll('.progress-bar span');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const subjectError = document.getElementById('subjectError');
const messageError = document.getElementById('messageError');

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

// Resume link graceful missing file check
const resumeLink = document.getElementById('resumeDownloadBtn') || document.querySelector('a[href*="Getasew_Shumie_CV.pdf"]');
if (resumeLink) {
  resumeLink.addEventListener('click', async (event) => {
    if (window.location.protocol.startsWith('http')) {
      try {
        const response = await fetch(resumeLink.href, { method: 'HEAD' });
        if (response.status === 404) {
          event.preventDefault();
          alert('Resume file is temporarily unavailable. Please reach out to getasewshumie@gmail.com to request a copy directly.');
        }
      } catch (err) {
        // Fall back to standard browser download behavior
      }
    }
  });
}

// Contact form validation & email forwarding integration
function clearErrors() {
  [nameError, emailError, subjectError, messageError].forEach((el) => {
    if (el) el.textContent = '';
  });
  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (input) input.removeAttribute('aria-invalid');
  });
}

function setFieldError(input, errorEl, message) {
  if (input) input.setAttribute('aria-invalid', 'true');
  if (errorEl) errorEl.textContent = message;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  clearErrors();
  let isValid = true;
  let firstInvalidInput = null;

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const subject = subjectInput ? subjectInput.value.trim() : '';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!name || name.length < 2) {
    setFieldError(nameInput, nameError, 'Please enter your full name (at least 2 characters).');
    isValid = false;
    firstInvalidInput = firstInvalidInput || nameInput;
  }

  if (!email) {
    setFieldError(emailInput, emailError, 'Please enter your email address.');
    isValid = false;
    firstInvalidInput = firstInvalidInput || emailInput;
  } else if (!validateEmail(email)) {
    setFieldError(emailInput, emailError, 'Please enter a valid email address (e.g. name@example.com).');
    isValid = false;
    firstInvalidInput = firstInvalidInput || emailInput;
  }

  if (!subject || subject.length < 3) {
    setFieldError(subjectInput, subjectError, 'Please provide a subject (at least 3 characters).');
    isValid = false;
    firstInvalidInput = firstInvalidInput || subjectInput;
  }

  if (!message || message.length < 10) {
    setFieldError(messageInput, messageError, 'Please enter a message (at least 10 characters).');
    isValid = false;
    firstInvalidInput = firstInvalidInput || messageInput;
  }

  if (firstInvalidInput) {
    firstInvalidInput.focus();
  }

  return isValid;
}

// Real-time error removal when typing
[nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
  if (!input) return;
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') {
      input.removeAttribute('aria-invalid');
      const errEl = document.getElementById(`${input.id}Error`);
      if (errEl) errEl.textContent = '';
      if (formStatus && formStatus.classList.contains('error')) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }
    }
  });
});

function setStatus(message, type = 'info', isHtml = false) {
  if (!formStatus) return;
  if (isHtml) {
    formStatus.innerHTML = message;
  } else {
    formStatus.textContent = message;
  }
  formStatus.className = `form-status ${type}`;
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setStatus('Please correct the highlighted fields before submitting.', 'error');
      return;
    }

    const endpoint = contactForm.getAttribute('action');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      if (btnText) btnText.textContent = 'Sending...';
    }
    setStatus('Sending your message, please wait...', 'info');

    const formData = new FormData(contactForm);

    try {
      // Check if endpoint is unconfigured placeholder
      if (!endpoint || endpoint.includes('YOUR_FORM_ID') || endpoint.includes('your_form_id')) {
        await new Promise((r) => setTimeout(r, 600));
        const senderName = nameInput.value.trim();
        setStatus(
          `Thank you, ${senderName}! Form handler is ready. (To receive live email alerts, configure your active Formspree form ID in index.html). You can also email directly at <a href="mailto:getasewshumie@gmail.com">getasewshumie@gmail.com</a>.`,
          'success',
          true
        );
        contactForm.reset();
        clearErrors();
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        const senderName = nameInput.value.trim();
        setStatus(`Thank you, ${senderName}! Your message has been sent successfully. I'll get back to you soon.`, 'success');
        contactForm.reset();
        clearErrors();
      } else {
        let errorMsg = 'Oops! There was a problem submitting your form.';
        try {
          const result = await response.json();
          if (result && result.errors && Array.isArray(result.errors)) {
            errorMsg = result.errors.map((e) => e.message).join(', ');
          } else if (result && result.message) {
            errorMsg = result.message;
          }
        } catch (parseErr) {
          // ignore JSON parse error
        }
        setStatus(`${errorMsg} Please reach out directly at <a href="mailto:getasewshumie@gmail.com">getasewshumie@gmail.com</a>.`, 'error', true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus(
        `Unable to reach the email service. Please check your connection or email directly at <a href="mailto:getasewshumie@gmail.com">getasewshumie@gmail.com</a>.`,
        'error',
        true
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        if (btnText) btnText.textContent = 'Send Message';
      }
    }
  });
}
