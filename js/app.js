console.log("NIROG Diagnostics Website Loaded");
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
const heroSwiper = new Swiper(".heroSwiper", {
    loop: true,
    speed: 800,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true
    }
});

// Simple search redirect — sends the query to your tests page
document.querySelector(".booking-search").addEventListener("submit", function () {
    const query = document.getElementById("testSearch").value.trim();
    if (query) {
        window.location.href = "tests.html?search=" + encodeURIComponent(query);
    }
});