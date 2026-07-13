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

const whatsappNumber = "918908079448";

function downloadReportWhatsApp(event) {
    event.preventDefault();

    const message =
`Hi NIROG Diagnostics,

I want to get my diagnostic report.

Please help me with my report.

Thank you.`;

    window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}

function uploadPrescriptionWhatsApp(event) {
    event.preventDefault();

    const message =
`Hi NIROG Diagnostics,

I want to book tests based on my prescription.

I will attach my prescription here. Please check it and share the test details and pricing.

Thank you.`;

    window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}
