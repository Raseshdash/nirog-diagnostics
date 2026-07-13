console.log("NIROG Diagnostics Website Loaded");
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
// Simple search redirect — sends the query to your tests page
document.querySelector(".booking-search").addEventListener("submit", function () {
    const query = document.getElementById("testSearch").value.trim();
    if (query) {
        window.location.href = "tests.html?search=" + encodeURIComponent(query);
    }
});

const contactNumber = "918908079448";
const displayNumber = "+91 89080 79448";

// Call links
document.querySelectorAll(".footer-call-link").forEach(link => {
    link.href = `tel:+${contactNumber}`;
});

// WhatsApp links
document.querySelectorAll(".footer-whatsapp-link").forEach(link => {
    link.href = `https://wa.me/${contactNumber}`;
});

// Display phone number
document.querySelectorAll(".phone-display").forEach(element => {
    element.textContent = displayNumber;
});

// Display WhatsApp number
document.querySelectorAll(".whatsapp-display").forEach(element => {
    element.textContent = displayNumber;
});

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