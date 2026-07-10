async function loadFragment(id, file) {

    const response = await fetch(file);
    const html = await response.text();

    document.getElementById(id).innerHTML = html;

    // Highlight current page after header loads
    if (id === "header") {

        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        document.querySelectorAll(".nav-link").forEach(link => {

            const href = link.getAttribute("href");

            link.classList.remove("active");

            if (href === currentPage) {
                link.classList.add("active");
            }

        });

    }

}

loadFragment("topbar", "fragments/topbar.html");
loadFragment("header", "fragments/header.html");
loadFragment("footer", "fragments/footer.html");