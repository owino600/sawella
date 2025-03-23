document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip empty hash links
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu after clicking a link
                navLinks.classList.remove('active');
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                message: this.querySelector('textarea').value
            };

            try {
                // For now, just show a success message since we don't have a backend
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error sending your message. Please try again later.');
            }
        });
    }

    // Scroll-based navigation highlight
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Service card interactions
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const links = card.querySelectorAll('.service-details a');
        
        // Prevent default link behavior when clicking on the card
        card.addEventListener('click', (e) => {
            // If clicking on a link, let it work normally
            if (e.target.tagName === 'A') {
                return;
            }
            // Otherwise, toggle the active state
            card.classList.toggle('active');
        });

        // Handle link clicks
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                // The link will now work normally
            });
        });
    });

    // Mobile service card interaction
    if (window.innerWidth <= 768) {
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all cards
                serviceCards.forEach(c => c.classList.remove('active'));
                // Add active class to clicked card
                card.classList.add('active');
            });
        });
    }

    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Update stats section
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateStats(startValue, endValue, element) {
        const duration = 2000;
        const step = (endValue - startValue) / (duration / 16);
        let current = startValue;

        const updateNumber = () => {
            if (current < endValue) {
                current += step;
                element.textContent = Math.round(current);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = endValue;
            }
        };

        updateNumber();
    }

    try {
        // Comment out or remove the stats fetching code
        /*
        fetch(`${BACKEND_URL}/get-stats`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                stats.forEach(stat => {
                    const key = stat.getAttribute('data-stat-key');
                    if (data[key]) {
                        const currentValue = parseInt(stat.textContent) || 0;
                        const newValue = data[key];
                        if (!animated) {
                            animateStats(0, newValue, stat);
                        } else {
                            animateStats(currentValue, newValue, stat);
                        }
                    }
                });
                animated = true;
            }
        });
        */
    } catch (error) {
        console.error('Error fetching stats:', error);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });

    // Modal functionality
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const switchButtons = document.querySelectorAll('.switch-modal');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal('loginModal'));
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', () => openModal('signupModal'));
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    switchButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const currentModal = button.closest('.modal');
            const targetModal = button.dataset.modal === 'login' ? loginModal : signupModal;
            closeModal(currentModal);
            if (targetModal) {
                openModal(targetModal.id);
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Handle form submissions
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your login logic here
            alert('Login functionality to be implemented');
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your signup logic here
            alert('Signup functionality to be implemented');
        });
    }

    // Review form handling
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.dataset.rating;
                highlightStars(rating);
            });

            star.addEventListener('mouseout', function() {
                highlightStars(selectedRating);
            });

            star.addEventListener('click', function() {
                selectedRating = this.dataset.rating;
                highlightStars(selectedRating);
            });
        });
    }

    function highlightStars(rating) {
        stars.forEach(star => {
            star.classList.toggle('active', star.dataset.rating <= rating);
        });
    }

    // Call the function on page load
    // updateReviewStats();

    // Enhanced Slideshow Animation
    const slides = document.querySelectorAll('.slide');
    const hero = document.querySelector('.hero');
    const totalSlides = slides.length;

    if (totalSlides > 0) {
        let currentSlide = 0;

        function showNextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].classList.add('active');
            
            // Keep the overlay faded out for all slides
            hero.classList.add('fade-overlay');
        }

        // Initialize first slide
        slides[0].classList.add('active');
        hero.classList.add('fade-overlay');
        setInterval(showNextSlide, 5000);
    }

    // Gallery Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        if (lightbox) {
            const lightboxImage = lightbox.querySelector('.lightbox-image');
            const lightboxCaption = lightbox.querySelector('.lightbox-caption');
            const closeLightbox = lightbox.querySelector('.close-lightbox');

            galleryItems.forEach(item => {
                item.addEventListener('click', () => {
                    const img = item.querySelector('img');
                    const title = item.querySelector('h3')?.textContent || '';
                    const description = item.querySelector('p')?.textContent || '';

                    if (lightboxImage) lightboxImage.src = img.src;
                    if (lightboxImage) lightboxImage.alt = img.alt;
                    if (lightboxCaption) {
                        const titleEl = lightboxCaption.querySelector('h3');
                        const descEl = lightboxCaption.querySelector('p');
                        if (titleEl) titleEl.textContent = title;
                        if (descEl) descEl.textContent = description;
                    }
                    lightbox.classList.add('active');
                });
            });

            if (closeLightbox) {
                closeLightbox.addEventListener('click', () => {
                    lightbox.classList.remove('active');
                });
            }

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.classList.remove('active');
                }
            });

            // Close lightbox with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    lightbox.classList.remove('active');
                }
            });
        }
    }

    // Handle Booking Forms
    const roomBookingForm = document.getElementById('room-booking-form');
    const conferenceBookingForm = document.getElementById('conference-booking-form');
    const mealBookingForm = document.getElementById('meal-booking-form');

    async function handleBookingForm(form, type) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${BACKEND_URL}/book-${type}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                
                if (result.status === 'success') {
                    alert(`Thank you for your ${type} booking! We will confirm your reservation shortly.`);
                    form.reset();
                } else {
                    alert('Sorry, there was an error processing your booking. Please try again later.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error processing your booking. Please try again later.');
            }
        });
    }

    // Initialize booking form handlers
    handleBookingForm(roomBookingForm, 'room');
    handleBookingForm(conferenceBookingForm, 'conference');
    handleBookingForm(mealBookingForm, 'meal');

    // Date validation for booking forms
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const daysInput = document.getElementById('days');

    if (checkInInput && checkOutInput && daysInput) {
        checkInInput.addEventListener('change', () => {
            const checkInDate = new Date(checkInInput.value);
            const minCheckOutDate = new Date(checkInDate);
            minCheckOutDate.setDate(checkInDate.getDate() + 1);
            checkOutInput.min = minCheckOutDate.toISOString().split('T')[0];
        });

        daysInput.addEventListener('change', () => {
            const checkInDate = new Date(checkInInput.value);
            const checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkInDate.getDate() + parseInt(daysInput.value));
            checkOutInput.value = checkOutDate.toISOString().split('T')[0];
        });
    }

    // Handle all booking buttons
    function handleBookingButtons() {
        // Main CTA booking button in hero section
        const mainBookingBtn = document.querySelector('.booking-btn');
        if (mainBookingBtn) {
            mainBookingBtn.addEventListener('click', () => {
                window.location.href = 'booking.html';
            });
        }

        // Room booking buttons
        const roomBookingBtns = document.querySelectorAll('.room-description .cta-button');
        roomBookingBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const roomType = btn.closest('.room-description').querySelector('h2').textContent;
                window.location.href = `booking.html?type=room&room=${encodeURIComponent(roomType)}`;
            });
        });

        // Service booking buttons
        const serviceBookingBtns = document.querySelectorAll('.service-description .cta-button');
        serviceBookingBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const serviceType = btn.closest('.service-description').querySelector('h2').textContent;
                let bookingUrl = 'booking.html?type=';
                
                if (serviceType.includes('Dining')) {
                    bookingUrl += 'dining';
                } else if (serviceType.includes('Spa')) {
                    bookingUrl += 'spa';
                } else if (serviceType.includes('Conference')) {
                    bookingUrl += 'conference';
                }
                
                window.location.href = bookingUrl;
            });
        });

        // Generic CTA buttons that should lead to booking
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(btn => {
            if (!btn.closest('.room-description') && !btn.closest('.service-description')) {
                btn.addEventListener('click', () => {
                    window.location.href = 'booking.html';
                });
            }
        });
    }

    // Initialize booking buttons
    handleBookingButtons();

    // Handle booking type selection
    const bookingTypeSelect = document.getElementById('booking-type');
    if (bookingTypeSelect) {
        console.log('Found booking type select element');
        bookingTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            console.log('Selected booking type:', selectedType);
            
            const contactFields = document.getElementById('contact-fields');
            const allForms = document.querySelectorAll('.booking-type-form');
            
            console.log('Number of booking forms found:', allForms.length);
            
            // Hide all forms first
            allForms.forEach(form => {
                console.log('Hiding form:', form.id);
                form.style.cssText = 'display: none !important;';
            });
            
            // Hide contact fields
            if (contactFields) {
                console.log('Hiding contact fields');
                contactFields.style.cssText = 'display: none !important;';
            }
            
            // Show the selected form and contact fields if a type is selected
            if (selectedType) {
                const selectedForm = document.getElementById(`${selectedType}-booking-form`);
                console.log('Looking for form:', `${selectedType}-booking-form`);
                
                if (selectedForm) {
                    console.log('Found form, displaying it');
                    selectedForm.style.cssText = 'display: block !important; opacity: 1 !important; visibility: visible !important;';
                    if (contactFields) {
                        contactFields.style.cssText = 'display: block !important; opacity: 1 !important; visibility: visible !important;';
                    }
                    
                    // Scroll to the form
                    selectedForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.warn(`Form not found for type: ${selectedType}`);
                }
            }
        });

        // Trigger change event if URL has type parameter
        const params = new URLSearchParams(window.location.search);
        const bookingType = params.get('type');
        if (bookingType) {
            console.log('URL has booking type:', bookingType);
            bookingTypeSelect.value = bookingType;
            // Create and dispatch the change event
            const event = new Event('change');
            bookingTypeSelect.dispatchEvent(event);
        }
    } else {
        console.warn('Booking type select element not found');
    }

    // Handle form submissions
    const bookingForms = document.querySelectorAll('.booking-type-form');
    bookingForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get contact information
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            
            if (!name || !email || !phone) {
                alert('Please fill in all contact information');
                return;
            }
            
            // Collect form data
            const formData = new FormData(this);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            
            const bookingData = Object.fromEntries(formData.entries());
            
            try {
                // Here you would typically send this to your backend
                console.log('Booking data:', bookingData);
                alert('Thank you for your booking request! We will contact you shortly to confirm your reservation.');
                
                // Reset the forms
                this.reset();
                document.getElementById('contact-fields').style.display = 'none';
                this.style.display = 'none';
                document.getElementById('booking-type').value = '';
                
            } catch (error) {
                console.error('Error submitting booking:', error);
                alert('Sorry, there was an error processing your booking. Please try again later.');
            }
        });
    });

    // Handle URL parameters for booking page
    if (window.location.pathname.includes('booking.html')) {
        const params = new URLSearchParams(window.location.search);
        const bookingType = params.get('type');
        const roomType = params.get('room');

        if (bookingType && bookingTypeSelect) {
            // Set the booking type
            bookingTypeSelect.value = bookingType;
            
            // Trigger the change event to show the appropriate form
            const changeEvent = new Event('change');
            bookingTypeSelect.dispatchEvent(changeEvent);
            
            // If it's a room booking and we have a room type, set it
            if (bookingType === 'room' && roomType) {
                const roomTypeSelect = document.getElementById('room-type');
                if (roomTypeSelect) {
                    const option = Array.from(roomTypeSelect.options).find(opt => 
                        opt.text.toLowerCase() === roomType.toLowerCase()
                    );
                    if (option) {
                        roomTypeSelect.value = option.value;
                    }
                }
            }
        }
    }
}); 