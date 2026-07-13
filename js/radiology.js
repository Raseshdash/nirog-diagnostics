let allData = null;
let currentCenter = null;
let currentCategory = "xray";
let cart = {};
let selectedLab = null;

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

    const locked = isLocked(currentCenter);

    (center.categories[category] || []).forEach(test => {
        const cartKey = `${currentCenter}|${test.id}`;
        const checked = cart[cartKey] ? "checked" : "";

        list.innerHTML += `
        <tr class="${locked ? 'locked-row' : ''}">
            <td>${test.name}</td>
            <td>₹${test.price}</td>
            <td>
                <input type="checkbox"
                       class="testCheck"
                       data-key="${cartKey}"
                       data-lab="${currentCenter}"
                       data-name="${test.name}"
                       data-price="${test.price}"
                       ${checked}
                       ${locked ? "disabled" : ""}>
            </td>
        </tr>`;
    });

    bindCheckbox();
}

function isLocked(labKey) {
    return selectedLab !== null && selectedLab !== labKey;
}

function handleCheckToggle(checkboxEl) {
    const key = checkboxEl.dataset.key;
    const labKey = checkboxEl.dataset.lab;

    if (checkboxEl.checked) {
        if (selectedLab !== null && selectedLab !== labKey) {
            checkboxEl.checked = false;
            alert(
                `You can only book services from one center at a time.\n\n` +
                `You already have services selected from "${allData.radiology[selectedLab].name}". ` +
                `Please remove those first if you want to switch to "${allData.radiology[labKey].name}".`
            );
            return;
        }

        selectedLab = labKey;
        cart[key] = {
            labName: allData.radiology[labKey].name,
            testName: checkboxEl.dataset.name,
            price: Number(checkboxEl.dataset.price)
        };

    } else {
        delete cart[key];
        if (Object.keys(cart).length === 0) {
            selectedLab = null;
        }
    }

    updateTotal();
    loadCategory(currentCategory);
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

    const lockNote = document.getElementById("lockNote");
    if (lockNote) {
        lockNote.innerHTML = selectedLab
            ? `Booking with: <strong>${allData.radiology[selectedLab].name}</strong> — clear cart to switch centers.`
            : "";
    }
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
    const labName = items[0].labName;

    let message = `🏥 *NIROG Diagnostics Radiology Booking*\n\n📍 *Center:* ${labName}\n\n🩻 *Selected Services*\n\n`;

    items.forEach((item, index) => {
        message += `${index + 1}. ${item.testName} - ₹${item.price}\n`;
    });

    message += `\n💰 *Total:* ₹${total}\n\nKindly confirm the appointment and share the available time slot.\n\nThank you.`;

    window.open(`https://wa.me/919114124211?text=${encodeURIComponent(message)}`, "_blank");
});

init();