// Fixed Navigation bar scroll Effect
(() => {
    const navBar = document.querySelector('.nav-bar'),
        navItems = navBar.querySelectorAll('.nav-item');

    // active nav link
    navItems.forEach((item) => {
        item.addEventListener('click', (event) => {
            if (event.target.closest('.nav-link') && !event.target.classList.contains('active')) {
                navBar.querySelector('.active').classList.remove('active');
                event.target.classList.add('active');
            };
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