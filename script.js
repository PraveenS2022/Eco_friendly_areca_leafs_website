document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-times');
            this.querySelector('i').classList.toggle('fa-bars');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
                mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
            }
        });
    });
    
    // Product Category Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const productCategories = document.querySelectorAll('.product-category');
    
    if (tabBtns.length && productCategories.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons and categories
                tabBtns.forEach(b => b.classList.remove('active'));
                productCategories.forEach(cat => cat.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show corresponding category
                const categoryId = this.getAttribute('data-category');
                document.getElementById(categoryId).classList.add('active');
            });
        });
    }
    
    // Gallery Tabs
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryTabs.length && galleryItems.length) {
        galleryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                galleryTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Filter gallery items
                const category = this.getAttribute('data-category');
                
                galleryItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Lightbox Gallery
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (lightbox) {
        // Open lightbox when clicking on gallery item
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                const caption = this.querySelector('h3').textContent;
                
                lightboxImg.src = imgSrc;
                lightboxCaption.textContent = caption;
                lightbox.classList.add('active');
                
                // Set current index for navigation
                lightbox.dataset.currentIndex = index;
            });
        });
        
        // Close lightbox
        closeBtn.addEventListener('click', function() {
            lightbox.classList.remove('active');
        });
        
        // Click outside image to close
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
        
        // Navigation between images
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                navigateGallery(-1);
            });
            
            nextBtn.addEventListener('click', function() {
                navigateGallery(1);
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (lightbox.classList.contains('active')) {
                    if (e.key === 'ArrowLeft') {
                        navigateGallery(-1);
                    } else if (e.key === 'ArrowRight') {
                        navigateGallery(1);
                    } else if (e.key === 'Escape') {
                        lightbox.classList.remove('active');
                    }
                }
            });
        }
        
        function navigateGallery(direction) {
            let currentIndex = parseInt(lightbox.dataset.currentIndex);
            let newIndex = currentIndex + direction;
            
            // Wrap around if at beginning or end
            if (newIndex < 0) {
                newIndex = galleryItems.length - 1;
            } else if (newIndex >= galleryItems.length) {
                newIndex = 0;
            }
            
            // Update lightbox with new image
            const newItem = galleryItems[newIndex];
            const imgSrc = newItem.querySelector('img').src;
            const caption = newItem.querySelector('h3').textContent;
            
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = caption;
            lightbox.dataset.currentIndex = newIndex;
        }
    }
    
    // Contact Form Validation with Email API Integration
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Reset error messages
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(msg => {
                msg.style.display = 'none';
                msg.textContent = '';
            });
            
            // Validate name
            const nameInput = document.getElementById('name');
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required');
                isValid = false;
            }
            
            // Validate email
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            }
            
            // Validate subject
            const subjectInput = document.getElementById('subject');
            if (subjectInput.value.trim() === '') {
                showError(subjectInput, 'Subject is required');
                isValid = false;
            }
            
            // Validate message
            const messageInput = document.getElementById('message');
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required');
                isValid = false;
            }
            
            // If form is valid, send via Email API
            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                try {
                    // Using SendGrid API - Configured for owner's email
                    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer YOUR_SENDGRID_API_KEY' // REPLACE WITH YOUR ACTUAL API KEY
                        },
                        body: JSON.stringify({
                            personalizations: [{
                                to: [{ 
                                    email: 'anuananya46442@gmail.com', // Owner's email
                                    name: 'SUKEEVEGEE Owner'
                                }],
                                subject: `New Website Inquiry: ${subjectInput.value.trim()}`
                            }],
                            from: { 
                                email: 'noreply@sukeevegee.com', // Your domain email
                                name: 'SUKEEVEGEE Website'
                            },
                            reply_to: {
                                email: emailInput.value.trim(),
                                name: nameInput.value.trim()
                            },
                            content: [{
                                type: 'text/html',
                                value: `
                                    <h3>New Contact Form Submission</h3>
                                    <p><strong>Name:</strong> ${nameInput.value.trim()}</p>
                                    <p><strong>Email:</strong> ${emailInput.value.trim()}</p>
                                    <p><strong>Subject:</strong> ${subjectInput.value.trim()}</p>
                                    <h4>Message:</h4>
                                    <p>${messageInput.value.trim().replace(/\n/g, '<br>')}</p>
                                    <hr>
                                    <p>This message was sent from the SUKEEVEGEE website contact form.</p>
                                `
                            }]
                        })
                    });
                    
                    if (response.ok) {
                        // Show success message
                        contactForm.reset();
                        contactForm.style.display = 'none';
                        formSuccess.style.display = 'block';
                        
                        // Hide success message after 5 seconds and show form again
                        setTimeout(() => {
                            formSuccess.style.display = 'none';
                            contactForm.style.display = 'block';
                        }, 5000);
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.errors?.[0]?.message || 'Failed to send email');
                    }
                } catch (error) {
                    console.error('Email API error:', error);
                    showError(null, `Failed to send message: ${error.message}. Please try again later or contact us directly at anuananya46442@gmail.com`);
                } finally {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
        
        function showError(input, message) {
            if (input) {
                const errorElement = input.nextElementSibling;
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                input.focus();
            } else {
                // For general errors not tied to a specific input
                const generalError = document.createElement('div');
                generalError.className = 'error-message';
                generalError.textContent = message;
                generalError.style.display = 'block';
                generalError.style.marginTop = '15px';
                generalError.style.textAlign = 'center';
                generalError.style.color = '#e53935';
                
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                contactForm.insertBefore(generalError, submitBtn.nextSibling);
                
                // Remove after 5 seconds
                setTimeout(() => {
                    generalError.remove();
                }, 5000);
            }
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Add shadow to header on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});