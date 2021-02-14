// Fixed Navigation bar scroll Effect
(() => {
    const navBar = document.querySelector('.nav-bar'),
        nav = navBar.querySelector('.nav'),
        navItems = navBar.querySelectorAll('.nav-item'),
        hamburgerMenu = navBar.querySelector('.hamburger-menu'),
        bars = hamburgerMenu.querySelector('i');

    // Nav hide & show
    hamburgerMenu.addEventListener('click', () => {
        navToggle();
    });

    function navToggle() {
        if (bars.classList.contains('fa-bars')) {
            bars.classList.remove('fa-bars');
            bars.classList.add('fa-times');
        } else {
            bars.classList.remove('fa-times');
            bars.classList.add('fa-bars');
        }
        nav.classList.toggle('open')
    };

    // active nav link
    navItems.forEach((item) => {
        item.addEventListener('click', (event) => {
            if (event.target.closest('.nav-link') && !event.target.classList.contains('active')) {
                navBar.querySelector('.active').classList.remove('active');
                event.target.classList.add('active');
            };
            navToggle();
        });
    });

    // window scroll effect
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            navBar.classList.add('fixed')
        } else {
            navBar.classList.remove('fixed')
        }

        let navLinks = document.querySelectorAll(".nav-link");

        let fromTop = window.scrollY;

        navLinks.forEach(link => {
            let section = document.querySelector(link.hash);
            let navHeight = document.querySelector('.nav-bar').offsetHeight;

            if (section.offsetTop <= fromTop + navHeight && section.offsetTop + section.offsetHeight > fromTop + navHeight) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }

            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href'),
                    offsetTop = document.querySelector(href).offsetTop;

                scroll({ top: offsetTop - navHeight, behavior: 'smooth' });
            });
        });

        // Window scroll navigation menu hide
        if (bars.classList.contains('fa-times')) {
            bars.classList.remove('fa-times');
            bars.classList.add('fa-bars');
            nav.classList.toggle('open')
        }

    });
})();


/* Portfolio Item Activate */
(() => {
    const filterContainer = document.querySelector('.portfolio-filter'),
        portfolioItemsContainer = document.querySelector('.portfolio-items'),
        portfolioItems = portfolioItemsContainer.querySelectorAll('.portfolio-item'),
        popup = document.querySelector('.portfolio-popup'),
        projectDetailsContainer = popup.querySelector('.pp-details'),
        prevBtn = popup.querySelector('.pp-prev'),
        nextBtn = popup.querySelector('.pp-next'),
        popupDetailsBtn = popup.querySelector('.pp-details-btn'),
        closeBtn = popup.querySelector('.pp-close-btn');

    let itemIndex, slideIndex, screenshots;

    // filter Portfolio Items 
    filterContainer.addEventListener('click', (event) => {
        //Checking filter item contains 'filter-item' class name and not 'active' class
        if (event.target.classList.contains('filter-item') && !event.target.classList.contains('active')) {
            // deactivate existing active class
            filterContainer.querySelector('.active').classList.remove('active');

            //add new item 'active' class
            event.target.classList.add('active');

            const target = event.target.getAttribute('data-target');

            portfolioItems.forEach((item) => {
                if (target === item.getAttribute('data-category') || target === 'all') {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        }
    });

    portfolioItemsContainer.addEventListener('click', (event) => {
        if (event.target.closest('.portfolio-item-inner')) {
            const portfolioItem = event.target.closest('.portfolio-item-inner').parentElement;

            //get the portfolio item index
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
            screenshots = portfolioItems[itemIndex].querySelector('.portfolio-img img').getAttribute('data-screenshot');

            // convert screenshots into array
            screenshots = screenshots.split(',');

            if (screenshots === 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            } else {
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
            }
            slideIndex = 0;

            popupToggle();
            popupSlideShow();
            popupDetails();
        }
    });

    closeBtn.addEventListener('click', () => {
        popupToggle();
        if (projectDetailsContainer.classList.contains('active')) {
            popupDetailsToggle();
        };
    });

    function popupDetails() {
        //if portfolio item details not exists
        if (!portfolioItems[itemIndex].querySelector('.portfolio-item-details')) {
            popupDetailsBtn.style.display = 'none';
            return;
        } else {
            //get the project Details
            popupDetailsBtn.style.display = 'block';

            const details = portfolioItems[itemIndex].querySelector('.portfolio-item-details').innerHTML;
            const title = portfolioItems[itemIndex].querySelector('.portfolio-item-title').innerHTML;
            const category = portfolioItems[itemIndex].getAttribute('data-category').split('-').join(' ');

            popup.querySelector('.pp-project-details').innerHTML = details;
            popup.querySelector('.pp-title h2').innerHTML = title;
            popup.querySelector('.pp-project-category').innerHTML = category;
        };
    };

    function popupDetailsToggle() {
        if (projectDetailsContainer.classList.contains('active')) {
            projectDetailsContainer.classList.remove('active');
            projectDetailsContainer.style.maxHeight = 0 + 'px';
            popupDetailsBtn.querySelector('i').classList.remove('fa-minus');
            popupDetailsBtn.querySelector('i').classList.add('fa-plus');
        } else {
            popupDetailsBtn.querySelector('i').classList.remove('fa-plus');
            popupDetailsBtn.querySelector('i').classList.add('fa-minus');
            projectDetailsContainer.classList.add('active');
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + 'px';
            popup.scrollTo(0, projectDetailsContainer.offsetTop);
        }
    };
    popupDetailsBtn.addEventListener('click', () => {
        popupDetailsToggle();
    });

    function popupSlideShow() {
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector('.pp-img');

        // activate the loader until the img load
        popup.querySelector('.pp-loader').classList.add('active');
        popupImg.src = imgSrc;

        popupImg.onload = () => {
            // deactivate loader
            popup.querySelector('.pp-loader').classList.remove('active');
        };
        popup.querySelector('.pp-counter').innerHTML = (slideIndex + 1) + " of " + screenshots.length;
    };

    function popupToggle() {
        popup.classList.toggle('open');
        bodyNoScrolling();
    };

    // Next Slide
    nextBtn.addEventListener('click', () => {
        if (slideIndex === screenshots.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        popupSlideShow();
    });

    // Prev Slide
    prevBtn.addEventListener('click', () => {
        if (slideIndex === 0) {
            slideIndex = screenshots.length - 1;
        } else {
            slideIndex--;
        }
        popupSlideShow();
    });

})();

// body no scrolling
function bodyNoScrolling() {
    document.body.classList.toggle('hide-scrolling');
}

// form Validation 
(() => {
    //declare with variable
    const contact = document.querySelector('.contact-section'),
        form = contact.querySelector('form'),
        Submit = form.querySelector('#submit');

    // after form submitting 
    form.addEventListener('submit', (e) => {
        formValidation(e);
    });


    // after click submit button
    Submit.addEventListener('click', (e) => {
        formValidation(e);
    });


    // Validation Main function
    function formValidation(e) {
        e.preventDefault();

        var name = form.querySelector('#name'),
            email = form.querySelector('#email'),
            message = form.querySelector('#message'),
            success = form.querySelector('.form-right .success'),

            nameValue = form.querySelector('#name').value,
            emailValue = form.querySelector('#email').value,
            messageValue = form.querySelector('#message').value,

            nameNumber = parseFloat(nameValue),

            errorName = form.querySelector('.name .error'),
            errorEmail = form.querySelector('.email .error'),
            errorMsg = form.querySelector('.message .error'),

            errorNameMessage,
            errorEmailMessage,
            errorMessage;


        // if user input empty or message length is less than or equal 5
        if (messageValue == "" || messageValue.length <= 5) {
            errorMessage = "Please Enter Message";
            errorMsg.classList.add('show');
            errorMsg.innerText = errorMessage;
            message.classList.add('error-color');
        } else {
            message.value = "";
            errorMessage = "";
            errorMsg.classList.remove('show');
            errorMsg.innerText = errorMessage;
            message.classList.remove('error-color');
            successPopup();
        }

        // If user input empty String in Name
        if (nameValue == "" || nameValue.length === 0) {
            nameEmpty();
        } else if (nameNumber || nameValue.length <= 5) {
            isNumber();
        } else {
            name.value = "";
            errorName.classList.remove('show');
            errorName.innerText = "";
            name.classList.remove('error-color');
            successPopup();
        }

        // Email Validation
        validateEmail(emailValue)

        function validateEmail(emailValue) {
            var mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (emailValue.match(mailFormat)) {
                email.value = "";
                errorEmailMessage = "";
                errorEmail.classList.remove('show');
                errorEmail.innerText = errorEmailMessage;
                email.classList.remove('error-color');
                successPopup();
            } else {
                errorEmailMessage = "Please Enter a Valid Email";
                errorEmail.classList.add('show');
                errorEmail.innerText = errorEmailMessage;
                email.classList.add('error-color');
            }
        }

        // if user input a blank Name
        function nameEmpty() {
            errorNameMessage = "Please Enter a Name";
            showMessage();
        }

        // if user input a number
        function isNumber() {
            errorNameMessage = "Please Enter a Valid Name";
            showMessage();
        }


        // Showing Message
        function showMessage() {
            errorName.classList.add('show');
            errorName.innerText = errorNameMessage;
            name.classList.add('error-color')
        }

        // success popup
        function successPopup() {
            if (success.classList.contains('hide')) {
                success.classList.remove('hide')
            }

            setTimeout(function() {
                if (!success.classList.contains('hide')) {
                    success.classList.add('hide')
                }
            }, 3000)
        }
    };

})();