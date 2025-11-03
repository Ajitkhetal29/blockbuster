document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.querySelector('#mobile-menu');
    const handleHeaderStyle = () => {
        const isMenuOpen = !mobileMenu.classList.contains('hidden');
        // Add solid background if scrolled down OR if the mobile menu is open
        if (window.scrollY > 50 || isMenuOpen) {
            header.classList.add('bg-white', 'shadow-md');
            header.classList.remove('text-white'); // In case we want to change text color
        } else {
            header.classList.remove('bg-white', 'shadow-md');
            header.classList.add('text-white'); // For transparent state on top
        }
    };

    if (mobileNavToggle && mobileMenu) {
        mobileNavToggle.addEventListener('click', function () {
            // Toggles the 'hidden' class on the mobile menu
            mobileMenu.classList.toggle('hidden');
            // Re-run the style check after opening/closing the menu
            handleHeaderStyle();
        });
    }

    // Listen for scroll events to change header style
    window.addEventListener('scroll', handleHeaderStyle);
    // Initial check on page load
    handleHeaderStyle();

    // On-scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (lightbox && lightboxImage && lightboxClose && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imageUrl = item.getAttribute('src');
                lightboxImage.setAttribute('src', imageUrl);
                lightbox.classList.remove('hidden');
            });
        });

        const closeLightbox = () => {
            lightbox.classList.add('hidden');
            lightboxImage.setAttribute('src', ''); // Clear the image src
        };

        lightboxClose.addEventListener('click', closeLightbox);

        // Close lightbox if clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Check if the click is on the background overlay
                closeLightbox();
            }
        });
    }

    // Popup Form functionality
    const popUpForm = document.getElementById('popUpForm');
    const closePopupButton = document.getElementById('popup-close-btn');

    let popupClosedThisPageLoad = false;

    if (popUpForm && closePopupButton) {
        // Function to show the popup
        const showPopup = () => {
            // Only show if it hasn't been closed on this page load
            if (!popupClosedThisPageLoad) {
                popUpForm.classList.remove('hidden');
            }
        };

        // Function to close the popup
        const closePopup = () => {
            popUpForm.classList.add('hidden');
            // Set a flag so it doesn't re-appear on this page load
            popupClosedThisPageLoad = true;
        };

        // Show the popup after 10 seconds
        setTimeout(showPopup, 10000);

        // Event listener for the close button
        closePopupButton.addEventListener('click', closePopup);

        // Event listener to close when clicking outside the modal content
        popUpForm.addEventListener('click', (e) => {
            if (e.target === popUpForm) { // Check if the click is on the background overlay
                closePopup();
            }
        });
    }

    // EmailJS Contact Form functionality
    const contactForm = document.getElementById('contact-form');
    const popupForm = document.getElementById('popup-contact-form');
    const homeForm = document.getElementById('home-contact-form');

    const handleEmailJsForm = (formElement) => {
        if (!formElement) return;

        formElement.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission

            const submitButton = formElement.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;

            // Use the formElement passed to the function
            emailjs.sendForm("service_3qxauyp", "template_df894e6", formElement)
                .then(() => {
                    submitButton.innerHTML = 'Message Sent!';
                    submitButton.classList.remove('bg-amber-600', 'hover:bg-amber-700');
                    submitButton.classList.add('bg-green-500');
                    formElement.reset(); // Clear the form fields

                    // If the submitted form is the popup form, close the popup
                    if (formElement.id === 'popup-contact-form') {
                        const popUpContainer = document.getElementById('popUpForm');
                        popUpContainer.classList.add('hidden');
                        popupClosedThisPageLoad = true; // Prevent it from re-appearing
                    }

                    setTimeout(() => {
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                        submitButton.classList.remove('bg-green-500');
                        submitButton.classList.add('bg-amber-600', 'hover:bg-amber-700');
                    }, 5000); // Reset button after 5 seconds
                }, (error) => {
                    submitButton.innerHTML = 'Failed to Send';
                    submitButton.disabled = false;
                    submitButton.classList.add('bg-red-500');
                    console.error('FAILED...', error);
                });
        });
    };

    // Initialize EmailJS once, if at least one form exists
    if (contactForm || popupForm || homeForm) {
        emailjs.init("GoZgeEbgB3GxueDMC");
        handleEmailJsForm(contactForm); // Attach to the contact page form
        handleEmailJsForm(popupForm);   // Attach to the popup form
        handleEmailJsForm(homeForm);    // Attach to the home page form
    }
});
