let allData = null;
let currentCenter = null;
let currentCategory = "xray";
let cart = {};

async function init() {
    allData = await loadLabData();

    const params = new URLSearchParams(window.location.search);
    currentCenter = params.get("center") || "hod";

    const center = allData.radiology[currentCenter];
    if (!center) return;

    document.getElementById("labLogo").src = center.logo;
    document.getElementById("labName").innerHTML = center.name;
    document.getElementById("discount").innerHTML = center.discount;

    bindCategoryTabs();
    loadCategory(currentCategory);
}

function loadCategory(category) {
    currentCategory = category;
    const center = allData.radiology[currentCenter];
    const list = document.getElementById("testList");
    list.innerHTML = "";

    (center.categories[category] || []).forEach(test => {
        const cartKey = `${currentCenter}|${test.id}`;
        const checked = cart[cartKey] ? "checked" : "";

        list.innerHTML += `
        <tr>
            <td>${test.name}</td>
            <td>₹${test.price}</td>
            <td>
                <input type="checkbox"
                       class="testCheck"
                       data-key="${cartKey}"
                       data-name="${test.name}"
                       data-price="${test.price}"
                       ${checked}>
            </td>
        </tr>`;
    });

    bindCheckbox();
}

function bindCheckbox() {
    document.querySelectorAll(".testCheck").forEach(check => {
        check.addEventListener("change", function () {
            const key = this.dataset.key;
            if (this.checked) {
                cart[key] = {
                    labName: allData.radiology[currentCenter].name,
                    testName: this.dataset.name,
                    price: Number(this.dataset.price)
                };
            } else {
                delete cart[key];
            }
            updateTotal();
        });
    });
}

function updateTotal() {
    const total = Object.values(cart).reduce((sum, item) => sum + item.price, 0);
    document.getElementById("totalPrice").innerHTML = "₹" + total;
}

function bindCategoryTabs() {
    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            loadCategory(this.dataset.category);
        });
    });
}

document.getElementById("bookNowBtn").addEventListener("click", function () {
    const items = Object.values(cart);
    if (items.length === 0) {
        alert("Please select at least one service.");
        return;
    }

    const total = items.reduce((sum, item) => sum + item.price, 0);
    let message = `🏥 *NIROG Diagnostics Radiology Booking*\n\n🩻 *Selected Services*\n\n`;

    items.forEach((item, index) => {
        message += `${index + 1}. ${item.testName} (${item.labName}) - ₹${item.price}\n`;
    });

    message += `\n💰 *Total:* ₹${total}\n\nKindly confirm the appointment and share the available time slot.\n\nThank you.`;

    window.open(`https://wa.me/919114124211?text=${encodeURIComponent(message)}`, "_blank");
});

init();