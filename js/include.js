async function loadFragment(id, file) {

    const response = await fetch(file);

    const html = await response.text();

    document.getElementById(id).innerHTML = html;

}

loadFragment("topbar", "fragments/topbar.html");

loadFragment("header", "fragments/header.html");

loadFragment("footer", "fragments/footer.html");