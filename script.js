/**
 * DRAVEN - DIGITAL AGENCY
 * Interactive Features & Functionality
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('section[id]');

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    function initMobileMenu() {
        if (!mobileMenuToggle || !navMenu) return;

        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navMenu.contains(event.target) || 
                                mobileMenuToggle.contains(event.target);
            
            if (!isClickInside && navMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // Navbar Scroll Effect
    // ========================================
    function initNavbarScroll() {
        if (!navbar) return;

        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#' || targetId === '') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // Active Navigation Link
    // ========================================
    function initActiveNav() {
        if (!sections.length) return;

        window.addEventListener('scroll', function() {
            const scrollPos = window.pageYOffset;
            const navHeight = navbar ? navbar.offsetHeight : 0;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - navHeight - 100;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    // ========================================
    // Scroll Animations
    // ========================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Elements to animate
        const animateElements = document.querySelectorAll(
            '.service-card, .pricing-card, .work-card, .process-step, .addon-item'
        );

        animateElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ========================================
    // Contact Form Handling
    // ========================================
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                business: document.getElementById('business').value.trim(),
                whatsapp: document.getElementById('whatsapp').value.trim(),
                requirement: document.getElementById('requirement').value.trim()
            };

            // Validate form
            if (!validateForm(formData)) {
                return;
            }

            // Create WhatsApp message
            const message = createWhatsAppMessage(formData);
            const whatsappURL = generateWhatsAppURL(message);

            // Open WhatsApp
            window.open(whatsappURL, '_blank');

            // Show success notification
            showNotification('Opening WhatsApp...', 'success');

            // Reset form
            contactForm.reset();
        });
    }

    // ========================================
    // Form Validation
    // ========================================
    function validateForm(data) {
        // Check if all fields are filled
        if (!data.name || !data.business || !data.whatsapp || !data.requirement) {
            showNotification('Please fill in all fields', 'error');
            return false;
        }

        // Validate WhatsApp number
        const whatsappRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        if (!whatsappRegex.test(data.whatsapp)) {
            showNotification('Please enter a valid WhatsApp number', 'error');
            return false;
        }

        return true;
    }

    // ========================================
    // WhatsApp Message & URL Generation
    // ========================================
    function createWhatsAppMessage(data) {
        return `Hi Draven,

Name: ${data.name}
Business: ${data.business}
WhatsApp: ${data.whatsapp}

Requirement:
${data.requirement}`;
    }

    function generateWhatsAppURL(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '917208533219'; // Draven's WhatsApp number
        return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    }

    // ========================================
    // Notification System
    // ========================================
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Styling
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            backgroundColor: type === 'success' ? '#25D366' : '#B91C1C',
            color: '#FFFFFF',
            padding: '1rem 1.5rem',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: '600',
            fontSize: '0.9375rem',
            zIndex: '9999',
            animation: 'slideInRight 0.3s ease',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            maxWidth: '300px'
        });

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // ========================================
    // Service Card Hover Effects
    // ========================================
    function initServiceCardEffects() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            const number = card.querySelector('.service-number');
            
            if (!number) return;
            
            card.addEventListener('mouseenter', function() {
                number.style.transition = 'color 0.3s ease';
            });
        });
    }

    // ========================================
    // Form Input Focus Effects
    // ========================================
    function initFormEffects() {
        const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
                this.parentElement.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });
    }

    // ========================================
    // Performance: Debounce Function
    // ========================================
    function debounce(func, wait = 100) {
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

    // ========================================
    // Lazy Load Images
    // ========================================
    function initLazyLoad() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    // ========================================
    // Add Dynamic Animations CSS
    // ========================================
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(30px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // Console Branding
    // ========================================
    function initConsoleBranding() {
        const styles = [
            'font-size: 40px',
            'font-weight: bold',
            'color: #B91C1C',
            'text-shadow: 2px 2px 0px rgba(0,0,0,0.5)'
        ].join(';');

        console.log('%cDRAVEN', styles);
        console.log('%cWebsites that bring customers, not just clicks.', 'font-size: 14px; color: #737373;');
        console.log('%cInterested in working with us? Visit #contact', 'font-size: 12px; color: #A3A3A3;');
    }

    // ========================================
    // Prevent Form Resubmission
    // ========================================
    function preventFormResubmission() {
        if (window.history.replaceState) {
            window.history.replaceState(null, null, window.location.href);
        }
    }

    // ========================================
    // Handle Browser Back Button
    // ========================================
    function initBackButtonHandler() {
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                window.location.reload();
            }
        });
    }

    // ========================================
    // Initialize All Functions
    // ========================================
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
    }

    function initializeApp() {
        // Core functionality
        initMobileMenu();
        initNavbarScroll();
        initSmoothScroll();
        initActiveNav();
        initScrollAnimations();
        initContactForm();
        
        // UI enhancements
        initServiceCardEffects();
        initFormEffects();
        initLazyLoad();
        
        // Utilities
        addAnimationStyles();
        preventFormResubmission();
        initBackButtonHandler();
        
        // Development
        initConsoleBranding();

        // Log initialization
        console.log('Draven website initialized successfully');
    }

    // ========================================
    // Start Application
    // ========================================
    init();

})();

// ========================================
// Custom Cursor Effect (Optional)
// ========================================

// Uncomment to enable custom cursor
(function() {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #B91C1C;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.15s ease;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    document.addEventListener('mousedown', function() {
        cursor.style.transform = 'scale(0.8)';
    });

    document.addEventListener('mouseup', function() {
        cursor.style.transform = 'scale(1)';
    });
})();


// ========================================
// Export for Testing (if needed)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Export functions if needed for testing
    };
}
