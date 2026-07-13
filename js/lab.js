let allData = null;
let currentLab = null;
let currentCategory = "blood";
let cart = {};   // key: "labKey|testId" -> {labName, testName, price}

async function init() {
    allData = await loadLabData();

    const params = new URLSearchParams(window.location.search);
    currentLab = params.get("lab") || "hod";

    const lab = allData.labs[currentLab];
    if (!lab) {
        console.error("Lab not found:", currentLab);
        return;
    }

    document.getElementById("labLogo").src = lab.logo;
    document.getElementById("labName").innerHTML = lab.name;
    document.getElementById("discount").innerHTML = lab.discount;

    bindCategoryTabs();
    bindCompareToggle();
    loadCategory(currentCategory);
}

function loadCategory(category) {
    currentCategory = category;
    const lab = allData.labs[currentLab];
    const list = document.getElementById("testList");
    list.innerHTML = "";

    (lab.categories[category] || []).forEach(test => {
        const cartKey = `${currentLab}|${test.id}`;
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
    renderCompareTable(category);
}

function bindCheckbox() {
    document.querySelectorAll(".testCheck").forEach(check => {
        check.addEventListener("change", function () {
            const key = this.dataset.key;
            if (this.checked) {
                cart[key] = {
                    labName: allData.labs[currentLab].name,
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

/* ---------- COMPARISON TABLE ----------
   Shows the same category's tests across ALL labs side by side,
   so the user can pick the cheapest lab per test. */
function renderCompareTable(category) {
    const box = document.getElementById("compareBox");
    if (!box) return;

    const labKeys = Object.keys(allData.labs);
    let rows = {};

    labKeys.forEach(labKey => {
        const tests = allData.labs[labKey].categories[category] || [];
        tests.forEach(t => {
            if (!rows[t.id]) rows[t.id] = { name: t.name, prices: {} };
            rows[t.id].prices[labKey] = t.price;
        });
    });

    let html = `<table class="table table-bordered compare-table">
        <thead><tr><th>Test</th>`;
    labKeys.forEach(labKey => {
        html += `<th>${allData.labs[labKey].name}</th>`;
    });
    html += `</tr></thead><tbody>`;

    Object.entries(rows).forEach(([testId, row]) => {
        html += `<tr><td>${row.name}</td>`;
        labKeys.forEach(labKey => {
            const price = row.prices[labKey];
            if (price === undefined) {
                html += `<td class="text-muted">—</td>`;
            } else {
                const cartKey = `${labKey}|${testId}`;
                const checked = cart[cartKey] ? "checked" : "";
                html += `<td>
                    ₹${price}
                    <br>
                    <input type="checkbox"
                           class="compareCheck"
                           data-key="${cartKey}"
                           data-lab="${labKey}"
                           data-name="${row.name}"
                           data-price="${price}"
                           ${checked}>
                </td>`;
            }
        });
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    box.innerHTML = html;

    document.querySelectorAll(".compareCheck").forEach(check => {
        check.addEventListener("change", function () {
            const key = this.dataset.key;
            if (this.checked) {
                cart[key] = {
                    labName: allData.labs[this.dataset.lab].name,
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

function bindCompareToggle() {
    const toggleBtn = document.getElementById("toggleCompare");
    const compareBox = document.getElementById("compareBox");
    if (!toggleBtn || !compareBox) return;

    toggleBtn.addEventListener("click", () => {
        const isHidden = compareBox.style.display === "none" || !compareBox.style.display;
        compareBox.style.display = isHidden ? "block" : "none";
        toggleBtn.textContent = isHidden ? "Hide Price Comparison" : "Compare Prices Across Labs";
    });
}

document.getElementById("bookNowBtn").addEventListener("click", function () {
    const items = Object.values(cart);

    if (items.length === 0) {
        alert("Please select at least one test.");
        return;
    }

    const total = items.reduce((sum, item) => sum + item.price, 0);

    let message = `🩺 *NIROG Diagnostics Test Booking*\n\n📋 *Selected Tests:*\n\n`;

    items.forEach((item, index) => {
        message += `${index + 1}. ${item.testName} (${item.labName}) - ₹${item.price}\n`;
    });

    message += `\n💰 *Total Amount:* ₹${total}\n\n🚑 Home Sample Collection Required.\n\nKindly confirm the booking and share your address for sample collection.\n\nThank you.`;

    const whatsappNumber = "919114124211";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
});

init();