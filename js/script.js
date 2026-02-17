(function ($) {
  "use strict";

  window.addEventListener("load", () => {
    // Slide preloader up
    $(".preloader").addClass("loaded");

    // Wait for animation to finish before removing it
    setTimeout(() => {
      $(".preloader").remove();
      AOS.refresh(); // Refresh AOS after preloader disappears
    }, 600); // Match CSS transition duration
  });

  /* Button hover effect */
  document.querySelectorAll('.button').forEach(button => {
    button.onmousemove = function (e) {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      e.target.style.setProperty('--x', x + 'px');
      e.target.style.setProperty('--y', y + 'px');
    };
  });

  $(document).ready(function () {

    $('.counter-value').each(function () {
      var $this = $(this),
        countTo = $this.attr('data-count');

      $this.prop('Counter', 0).animate({
        Counter: countTo
      }, {
        duration: 2000,
        easing: 'swing',
        step: function (now) {
          $this.text(Math.floor(now));
        },
        complete: function () {
          $this.text(countTo);
        }
      });
    });

    // Isotope Initialization
    var $container = $('.isotope-container');
    if ($container.length) {
      $container.isotope({
        itemSelector: '.item',
        layoutMode: 'masonry'
      });
    }

    // Chocolat Lightbox Init
    if ($('.image-link').length) {
      Chocolat(document.querySelectorAll('.image-link'), {
        imageSize: 'contain',
        loop: true,
      });
    }

    // Animate On Scroll (AOS) Init
    AOS.init({
      duration: 5000,
      once: true,
    });

    // Swiper Slider Init
    if ($('.portfolio-swiper').length) {
      new Swiper('.portfolio-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: { el: '.swiper-pagination', clickable: true },
      });
    }

    // Swiper Slider Init
    if ($('.testimonial-swiper').length) {
      new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: { el: '.swiper-pagination', clickable: true },
      });
    }

    // Filter Buttons Active State & Filtering
    $('.filter-button').click(function () {
      $('.filter-button').removeClass('active');
      $(this).addClass('active');

      var filterValue = $(this).attr('data-filter');
      $container.isotope({ filter: filterValue === '*' ? '*' : filterValue });

      // Reinitialize AOS after filtering
      AOS.refresh();
    });

    //  Advanced Real-Time Validation

    const form = document.getElementById('contactForm');

    if (form) {

      const fields = form.querySelectorAll('input, textarea');

      const validators = {
        name: value => /^[A-Za-z\s]{3,}$/.test(value),
        email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        phone: value => value === "" || /^[0-9]{10}$/.test(value),
        subject: value => value.length === 0 || value.length >= 5,
        message: value => value.length >= 10
      };

      const errorMessages = {
        name: "Name must contain at least 3 letters only.",
        email: "Enter a valid email address.",
        phone: "Phone must be 10 digits.",
        subject: "Subject must be at least 5 characters.",
        message: "Message must be at least 10 characters."
      };

      function validateField(field) {
        const name = field.getAttribute('name');
        const value = field.value.trim();
        const feedback = field.nextElementSibling;

        if (!validators[name]) return true;

        if (validators[name](value)) {
          field.classList.remove('is-invalid');
          field.classList.add('is-valid');
          if (feedback) feedback.textContent = "";
          return true;
        } else {
          field.classList.remove('is-valid');
          field.classList.add('is-invalid');
          if (feedback) feedback.textContent = errorMessages[name];
          return false;
        }
      }

      // Real-time validation
      fields.forEach(field => {
        field.addEventListener('input', () => {
          validateField(field);
        });
      });

      // Submit handler
      form.addEventListener('submit', function (e) {
        e.preventDefault(); // stop default submit

        let isFormValid = true;

        fields.forEach(field => {
          if (!validateField(field)) {
            isFormValid = false;
          }
        });

        if (!isFormValid) return;

        const scriptURL = 'https://script.google.com/macros/s/AKfycbw4z3PFFOaCH62aZ-c_3odFWTsts1aD_irrSj_yXzhrnHpBlmCMKs27YvkoniT3npA0HA/exec';
        const msg = document.getElementById('msg');

        fetch(scriptURL, {
          method: 'POST',
          body: new FormData(form)
        })
          .then(response => response.json())
          .then(data => {
            msg.innerHTML = "Message sent successfully!";
            msg.style.color = "green";

            form.reset();
            fields.forEach(field => field.classList.remove('is-valid'));

            setTimeout(() => {
              msg.innerHTML = "";
            }, 4000);
          })
          .catch(error => {
            msg.innerHTML = "Something went wrong!";
            msg.style.color = "red";
            console.error("Error!", error.message);
          });

      });
    }


  });

})(jQuery);
