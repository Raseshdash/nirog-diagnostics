let packages = [];

// ==========================================
// Categories
// ==========================================

const categories = [
    "All",
    "Heart Care",
    "Diabetes",
    "Women",
    "Men",
    "Senior Citizen",
    "Full Body"
];

// ==========================================
// Load Packages
// ==========================================

fetch("data/package-data.json")
.then(res => res.json())
.then(data => {

    packages = data;

    loadCategories();

    displayPackages(packages);

});

// ==========================================
// Load Category Buttons
// ==========================================

function loadCategories(){

    const container = document.getElementById("categoryContainer");

    container.innerHTML = categories.map((cat,index)=>`

        <div
            class="category-card ${index===0 ? "active" : ""}"
            onclick="filterCategory('${cat}',this)">

            <span>${cat}</span>

        </div>

    `).join("");

}

// ==========================================
// Filter Category
// ==========================================

function filterCategory(category,element){

    document
    .querySelectorAll(".category-card")
    .forEach(card=>card.classList.remove("active"));

    element.classList.add("active");

    if(category==="All"){

        displayPackages(packages);

        return;

    }

    const filtered = packages.filter(pkg=>pkg.category===category);

    displayPackages(filtered);

}

// ==========================================
// Search
// ==========================================

document
.getElementById("search")
.addEventListener("keyup",function(){

    const value = this.value.toLowerCase();

    const filtered = packages.filter(pkg=>

        pkg.name.toLowerCase().includes(value)

    );

    displayPackages(filtered);

});

// ==========================================
// Display Packages
// ==========================================
function displayPackages(list){

    const container = document.getElementById("packageContainer");

    if(list.length === 0){

        container.innerHTML = `
            <div class="text-center py-5">
                <h3>No Package Found</h3>
            </div>
        `;

        return;
    }

    container.innerHTML = list.map(pkg => `

        <div class="package-card">

            ${pkg.badge ? `
                <div class="package-badge">
                    ${pkg.badge}
                </div>
            ` : ""}

            <h3>${pkg.name}</h3>

            <p class="package-description">
                ${pkg.description}
            </p>

            <div class="package-price">
                ₹${pkg.price}
                <span>₹${pkg.oldPrice}</span>
            </div>

            <div class="package-buttons">

                <button
                    class="outline-btn"
                    onclick="showDetails(${pkg.id})">

                    Read More

                </button>

                <button class="primary-btn"  onclick="bookPackage('${pkg.name}',${pkg.price})">

                    Book Now

                </button>

            </div>

        </div>

    `).join("");

}
// ==========================================
// WhatsApp Booking
// ==========================================

function bookPackage(packageName, price){

    const phone = "919114124211";   // Replace with your WhatsApp number

    const message =
`Hello Nirog Diagnostics,

I would like to book the following health package.

Package : ${packageName}
Price : ₹${price}

Please share the available slots.

Thank you.`;

    const url =
`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

}
// ==========================================
// Show Package Details
// ==========================================
function showDetails(id){

    const pkg = packages.find(p => p.id === id);

    document.getElementById("modalPackageName").innerHTML =
        pkg.name;

    document.getElementById("modalPrice").innerHTML =
        pkg.price;

    document.getElementById("modalSampleType").innerHTML =
        pkg.sampleType.map(sample => `

            <li class="list-group-item">

                ${sample}

            </li>

        `).join("");

    document.getElementById("modalTests").innerHTML =
        pkg.tests.map(test => `

            <li class="list-group-item">

                ${test}

            </li>

        `).join("");

    const modal =
        new bootstrap.Modal(
            document.getElementById("packageModal")
        );

    modal.show();

}

// ==========================================
// Responsive Refresh
// ==========================================

window.addEventListener("resize",()=>{

    const active=document.querySelector(".category-card.active");

    if(active){

        const category=active.innerText.trim();

        if(category==="All"){

            displayPackages(packages);

        }else{

            displayPackages(

                packages.filter(pkg=>pkg.category===category)

            );

        }

    }

});