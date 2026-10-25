# Portfolio Website

This is a responsive portfolio website for Getasew Shumie, Full-Stack Web Developer.

**Live Site:** [https://gshumie.github.io/portfolio/](https://gshumie.github.io/portfolio/)

## Features
- **Responsive Design:** Polished layout across desktop, tablet, and mobile.
- **Theme Switching:** Dark mode and light mode toggle with local storage persistence.
- **Accessible Contact Form:** Fully validated contact form (Full Name, Email Address, Subject, and Message) with asynchronous email delivery integration via Formspree.
- **Project Showcase:** Highlights selected projects with active Live Demo and Source Code links.
- **SEO & Social Optimization:** Complete OpenGraph, Twitter Card, and Schema.org JSON-LD metadata with canonical URL.
- **Graceful Asset Delivery:** Verified resume download with client-side availability handling.

## Contact Form Setup (Formspree)
1. Register a free account at [formspree.io](https://formspree.io).
2. Create a new form in the Formspree dashboard to obtain your unique endpoint ID (e.g. `https://formspree.io/f/your_form_id`).
3. In `index.html`, update the `action` attribute on `<form id="contactForm">`:
   ```html
   <form id="contactForm" class="contact-form" action="https://formspree.io/f/xdeeaavo" method="POST" novalidate>
   ```
4. Form submissions will trigger direct email notifications to your inbox without page reloads.

## Deploy to GitHub Pages
1. Push this folder to the `main` branch of `https://github.com/gshumie/portfolio`.
2. In repository **Settings > Pages**, choose **GitHub Actions** as the source.
3. The included `.github/workflows/deploy.yml` workflow publishes the site automatically.
