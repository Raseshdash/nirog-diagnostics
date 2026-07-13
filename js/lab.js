let allData = null;
let currentLab = null;
let currentCategory = "blood";
let cart = {};           // key: "labKey|testId" -> {labName, testName, price}
let selectedLab = null;  // the ONE lab the user is currently booking with; null = no restriction yet

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
        const locked = isLocked(currentLab);

        list.innerHTML += `
        <tr class="${locked ? 'locked-row' : ''}">
            <td>${test.name}</td>
            <td>₹${test.price}</td>
            <td>
                <input type="checkbox"
                       class="testCheck"
                       data-key="${cartKey}"
                       data-lab="${currentLab}"
                       data-name="${test.name}"
                       data-price="${test.price}"
                       ${checked}
                       ${locked ? "disabled" : ""}>
            </td>
        </tr>`;
    });

    bindCheckbox();
}

/* Returns true if this lab is currently blocked from selection
   (i.e. the user already has items from a DIFFERENT lab in the cart) */
function isLocked(labKey) {
    return selectedLab !== null && selectedLab !== labKey;
}

function handleCheckToggle(checkboxEl) {
    const key = checkboxEl.dataset.key;
    const labKey = checkboxEl.dataset.lab;

    if (checkboxEl.checked) {

        // Block selection from a second lab
        if (selectedLab !== null && selectedLab !== labKey) {
            checkboxEl.checked = false;
            alert(
                `You can only book tests from one lab at a time.\n\n` +
                `You already have tests selected from "${allData.labs[selectedLab].name}". ` +
                `Please remove those first if you want to switch to "${allData.labs[labKey].name}".`
            );
            return;
        }

        selectedLab = labKey;
        cart[key] = {
            labName: allData.labs[labKey].name,
            testName: checkboxEl.dataset.name,
            price: Number(checkboxEl.dataset.price)
        };

    } else {
        delete cart[key];

        // If cart is now empty, release the lab lock so user can pick a different lab
        if (Object.keys(cart).length === 0) {
            selectedLab = null;
        }
    }

    updateTotal();
    refreshLockState();
}

function bindCheckbox() {
    document.querySelectorAll(".testCheck").forEach(check => {
        check.addEventListener("change", function () {
            handleCheckToggle(this);
        });
    });
}

function updateTotal() {
    const total = Object.values(cart).reduce((sum, item) => sum + item.price, 0);
    document.getElementById("totalPrice").innerHTML = "₹" + total;

    // Show which lab is currently locked in, so the user understands why other labs are greyed out
    const lockNote = document.getElementById("lockNote");
    if (lockNote) {
        lockNote.innerHTML = selectedLab
            ? `Booking with: <strong>${allData.labs[selectedLab].name}</strong> — clear cart to switch labs.`
            : "";
    }
}

/* Re-renders the main table + compare table so disabled states stay in sync
   after any checkbox change, without needing a full page reload. */
function refreshLockState() {
    loadCategory(currentCategory);
    renderCompareTable(currentCategory);
}

function bindCategoryTabs() {
    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            loadCategory(this.dataset.category);
            renderCompareTable(this.dataset.category);
        });
    });
}

/* ---------- COMPARISON TABLE ---------- */
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
        const lockedHeader = isLocked(labKey) ? "text-muted" : "";
        html += `<th class="${lockedHeader}">${allData.labs[labKey].name}</th>`;
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
                const locked = isLocked(labKey);
                html += `<td class="${locked ? 'locked-cell' : ''}">
                    ₹${price}
                    <br>
                    <input type="checkbox"
                           class="compareCheck"
                           data-key="${cartKey}"
                           data-lab="${labKey}"
                           data-name="${row.name}"
                           data-price="${price}"
                           ${checked}
                           ${locked ? "disabled" : ""}>
                </td>`;
            }
        });
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    box.innerHTML = html;

    document.querySelectorAll(".compareCheck").forEach(check => {
        check.addEventListener("change", function () {
            handleCheckToggle(this);
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
        if (isHidden) renderCompareTable(currentCategory);
    });
}

document.getElementById("bookNowBtn").addEventListener("click", function () {
    const items = Object.values(cart);

    if (items.length === 0) {
        alert("Please select at least one test.");
        return;
    }

    const total = items.reduce((sum, item) => sum + item.price, 0);
    const labName = items[0].labName; // all items are guaranteed to be from the same lab now

    let message = `🩺 *NIROG Diagnostics Test Booking*\n\n🏥 *Lab:* ${labName}\n\n📋 *Selected Tests:*\n\n`;

    items.forEach((item, index) => {
        message += `${index + 1}. ${item.testName} - ₹${item.price}\n`;
    });

    message += `\n💰 *Total Amount:* ₹${total}\n\n🚑 Home Sample Collection Required.\n\nKindly confirm the booking and share your address for sample collection.\n\nThank you.`;

    const whatsappNumber = "919114124211";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
});

init();