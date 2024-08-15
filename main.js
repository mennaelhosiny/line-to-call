// header

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

function closeNavbar() {
    const navbarLinks = document.querySelector('.nav-links');
    navbarLinks.classList.remove('active');
}




//fillteration
document.addEventListener("DOMContentLoaded", function() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const slider  = document.querySelector(".slider");
    const slides =document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    let currentIndex = 0;
    let currentSlides = Array.from(slides); // Array to hold currently visible slides

    const updateSliderPosition = () => {
        const totalWidth = currentSlides[0].offsetWidth + 20;
        const offset = currentIndex * totalWidth; 
        slider.style.transform = `translateX(${offset}px)`; 
    };
    

    const showNextCard = () => {
        const slidesToShow = window.innerWidth >= 1024 ? 4 : 1; 
        if (currentIndex < currentSlides.length - slidesToShow) {
            currentIndex++;
            updateSliderPosition();
        } else {
            currentIndex = 0;  
            updateSliderPosition();
        }
    };
    

    const showPrevCard = () => {
        const slidesToShow = window.innerWidth >= 1024 ? 4 : 1; 
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        } else {
            currentIndex = currentSlides.length - slidesToShow;       
            updateSliderPosition();
        }
    };
    

    prevBtn.addEventListener("click", showPrevCard);
    nextBtn.addEventListener("click", showNextCard);

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.getAttribute("data-filter");
            currentIndex = 0;

            // Filter the slides based on data-category
            currentSlides = Array.from(slides).filter(slide => {
                if (filter === "all" || slide.getAttribute("data-category") === filter) {
                    slide.style.display = "block";
                    return true;
                } else {
                    slide.style.display = "none";
                    return false;
                }
            });

            // Reset the slider to the first slide of the filtered group
            updateSliderPosition();
        });
    });

    // Initialize by showing the first slide
    updateSliderPosition();
});



  // service   
let slideIndex = 0;
showSlides(slideIndex);

function changeSlide(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("testimoniall");
    if (n >= slides.length) { slideIndex = 0 }
    if (n < 0) { slideIndex = slides.length - 1 }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";
}

// Automatic slideshow
setInterval(function() {
    changeSlide(1);
}, 3000); // Change slide every 5 seconds
 




// carsoul

// carsoul
document.addEventListener("DOMContentLoaded", function() {
    const carousel = document.querySelector(".carousel");
    const firstCard = carousel.querySelector(".card");
    const firstCardWidth = firstCard.offsetWidth;

    let isDragging = false,
        startX,
        startScrollLeft,
        autoScrollInterval;

    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollInterval = setInterval(() => {
            carousel.scrollBy({ left: firstCardWidth, behavior: 'smooth' });

            if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth)) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            }
        }, 3000); // Adjust the interval as needed
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    const dragStart = (e) => {
        isDragging = true;
        carousel.classList.add("dragging");
        startX = e.pageX || e.touches[0].pageX;
        startScrollLeft = carousel.scrollLeft;
        stopAutoScroll();
    };

    const dragging = (e) => {
        if (!isDragging) return;
        const x = e.pageX || e.touches[0].pageX;
        const newScrollLeft = startScrollLeft - (x - startX);
        carousel.scrollLeft = newScrollLeft;
    };

    const dragStop = () => {
        isDragging = false;
        carousel.classList.remove("dragging");
        startAutoScroll();
    };

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    carousel.addEventListener("touchstart", dragStart);
    carousel.addEventListener("touchmove", dragging);
    document.addEventListener("touchend", dragStop);
    carousel.addEventListener("mouseenter", stopAutoScroll);
    carousel.addEventListener("mouseleave", startAutoScroll);

    startAutoScroll(); // Start autoplay on load
});

// other carousel logic
const $ = str => document.querySelector(str);
const $$ = str => document.querySelectorAll(str);

(function() {
    if (!window.app) {
        window.app = {};
    }
    app.carousel = {
        removeClass: function(el, classname='') {
            if (el) {
                if (classname === '') {
                    el.className = '';
                } else {
                    el.classList.remove(classname);
                }
                return el;
            }
            return;
        },
        reorder: function() {
            let childcnt = $("#carousel").children.length;
            let childs = $("#carousel").children;

            for (let j = 0; j < childcnt; j++) {
                childs[j].dataset.pos = j;
            }
        },
        move: function(el) {
            let selected = el;

            if (typeof el === "string") {
                selected = (el == "next") ? $(".selected").nextElementSibling : $(".selected").previousElementSibling;
            }

            let curpos = parseInt(app.selected.dataset.pos);
            let tgtpos = parseInt(selected.dataset.pos);

            let cnt = curpos - tgtpos;
            let dir = (cnt < 0) ? -1 : 1;
            let shift = Math.abs(cnt);

            for (let i = 0; i < shift; i++) {
                let el = (dir == -1) ? $("#carousel").firstElementChild : $("#carousel").lastElementChild;

                if (dir == -1) {
                    el.dataset.pos = $("#carousel").children.length;
                    $('#carousel').append(el);
                } else {
                    el.dataset.pos = 0;
                    $('#carousel').prepend(el);
                }

                app.carousel.reorder();
            }

            app.selected = selected;
            let next = selected.nextElementSibling;
            let prev = selected.previousElementSibling;
            let prevSecond = prev ? prev.previousElementSibling : selected.parentElement.lastElementChild;
            let nextSecond = next ? next.nextElementSibling : selected.parentElement.firstElementChild;

            selected.className = '';
            selected.classList.add("selected");

            app.carousel.removeClass(prev).classList.add('prev');
            app.carousel.removeClass(next).classList.add('next');

            app.carousel.removeClass(nextSecond).classList.add("nextRightSecond");
            app.carousel.removeClass(prevSecond).classList.add("prevLeftSecond");

            app.carousel.nextAll(nextSecond).forEach(item => { item.className = ''; item.classList.add('hideRight'); });
            app.carousel.prevAll(prevSecond).forEach(item => { item.className = ''; item.classList.add('hideLeft'); });

        },
        nextAll: function(el) {
            let els = [];

            if (el) {
                while (el = el.nextElementSibling) { els.push(el); }
            }

            return els;

        },
        prevAll: function(el) {
            let els = [];

            if (el) {
                while (el = el.previousElementSibling) { els.push(el); }
            }

            return els;
        },
        keypress: function(e) {
            switch (e.which) {
                case 37: // left
                    app.carousel.move('prev');
                    break;

                case 39: // right
                    app.carousel.move('next');
                    break;

                default:
                    return;
            }
            e.preventDefault();
            return false;
        },
        select: function(e) {
            let tgt = e.target;
            while (!tgt.parentElement.classList.contains('carousel')) {
                tgt = tgt.parentElement;
            }

            app.carousel.move(tgt);

        },
        previous: function(e) {
            app.carousel.move('prev');
        },
        next: function(e) {
            app.carousel.move('next');
        },
        doDown: function(e) {
            app.carousel.state.downX = e.pageX || e.touches[0].pageX;
        },
        doUp: function(e) {
            let direction = 0;

            if (app.carousel.state.downX) {
                direction = (app.carousel.state.downX > (e.pageX || e.changedTouches[0].pageX)) ? -1 : 1;

                if (Math.abs(app.carousel.state.downX - (e.pageX || e.changedTouches[0].pageX)) < 10) {
                    app.carousel.select(e);
                    return false;
                }
                if (direction === -1) {
                    app.carousel.move('next');
                } else {
                    app.carousel.move('prev');
                }
                app.carousel.state.downX = 0;
            }
        },
        init: function() {
            document.addEventListener("keydown", app.carousel.keypress);
            $("#carousel").addEventListener("mousedown", app.carousel.doDown);
            $("#carousel").addEventListener("touchstart", app.carousel.doDown);
            $("#carousel").addEventListener("mouseup", app.carousel.doUp);
            $("#carousel").addEventListener("touchend", app.carousel.doUp);

            app.carousel.reorder();
            $('#prev').addEventListener("click", app.carousel.previous);
            $('#next').addEventListener("click", app.carousel.next);
            app.selected = $(".selected");

        },
        state: {}

    }
    app.carousel.init();
})();





//   clint
const cards = document.querySelectorAll('.testimonial-card');
let index = 0;

function showCard(index) {
    cards.forEach((card, i) => {
        card.style.display = i === index ? 'block' : 'none';
    });
}

function showNextCard() {
    index = (index + 1) % cards.length;
    showCard(index);
}

function showPrevCard() {
    index = (index - 1 + cards.length) % cards.length;
    showCard(index);
}

document.querySelector('.more-testimonials-button').addEventListener('click', showNextCard);
document.querySelector('.prev-button').addEventListener('click', showPrevCard);

// Initialize by showing the first card
showCard(index);





