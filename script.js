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
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: this.querySelector('input[type="text"]').value,
            email: this.querySelector('input[type="email"]').value,
            message: this.querySelector('textarea').value
        };

        try {
            const response = await fetch(`${BACKEND_URL}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (result.status === 'success') {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Sorry, there was an error sending your message. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Sorry, there was an error sending your message. Please try again later.');
        }
    });

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
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    loginBtn.addEventListener('click', () => openModal('loginModal'));
    signupBtn.addEventListener('click', () => openModal('signupModal'));

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
            openModal(targetModal.id);
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

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your login logic here
        alert('Login functionality to be implemented');
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your signup logic here
        alert('Signup functionality to be implemented');
    });

    // Review form handling
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

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

    function highlightStars(rating) {
        stars.forEach(star => {
            star.classList.toggle('active', star.dataset.rating <= rating);
        });
    }

    function updateReviewStats() {
        fetch(`${BACKEND_URL}/get-stats`)
            .then(response => response.json())
            .then(data => {
                // Assuming your API returns something like:
                // { total_reviews: 150, average_rating: 4.8 }
                const ratingNumberEl = document.querySelector('.rating-number');
                const starsEl = document.querySelector('.stars');
                const totalReviewsEl = document.querySelector('.total-reviews');

                if (ratingNumberEl && starsEl && totalReviewsEl) {
                    // Use average_rating if available; otherwise, you might show a default value
                    const averageRating = data.average_rating !== undefined ? data.average_rating : 'N/A';
                    const totalReviews = data.total_reviews || 0;
                    
                    ratingNumberEl.textContent = averageRating;
                    
                    // Generate stars dynamically if averageRating is numeric
                    if (typeof averageRating === 'number') {
                        let fullStars = Math.floor(averageRating);
                        let halfStar = (averageRating - fullStars) >= 0.5;
                        let stars = "★".repeat(fullStars);
                        if (halfStar) {
                            stars += "½"; // Alternatively, use a custom half-star icon
                        }
                        starsEl.textContent = stars;
                    } else {
                        starsEl.textContent = "";
                    }
                    
                    totalReviewsEl.textContent = `Based on ${totalReviews} reviews`;
                }
            })
            .catch(error => {
                console.error('Error fetching review stats:', error);
            });
    }

    // Call the function on page load
    updateReviewStats();


    // Handle review submission
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const selectedServices = Array.from(this.querySelectorAll('input[name="services"]:checked'))
            .map(checkbox => checkbox.value);
        
        const reviewData = {
            rating: selectedRating,
            services: selectedServices,
            feedback: this.querySelector('textarea[name="feedback"]').value
        };

        try {
            const response = await fetch(`${BACKEND_URL}/submit-review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert('Thank you for your review!');
                reviewForm.reset();
                selectedRating = 0;
                highlightStars(0);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Sorry, there was an error submitting your review.');
        }
    });

    // Enhanced Slideshow Animation
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    }

    // Initialize first slide
    slides[0].classList.add('active');
    setInterval(showNextSlide, 5000);

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

    // Gallery Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

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

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeLightbox = lightbox.querySelector('.close-lightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h3').textContent;
            const description = item.querySelector('p').textContent;

            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCaption.querySelector('h3').textContent = title;
            lightboxCaption.querySelector('p').textContent = description;
            lightbox.classList.add('active');
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

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
}); 