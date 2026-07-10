const labDetails = {

    hod:{

        name:"HOD Diagnostics",
        logo:"images/labs/hod.png",
        discount:"15% OFF",

        categories:{

            blood:[
                {name:"CBC",price:299},
                {name:"LFT",price:699},
                {name:"RFT",price:599}
            ],

            urine:[
                {name:"Routine Urine",price:250},
                {name:"Urine Culture",price:550},
                {name:"Protein Test",price:300}
            ],

            thyroid:[
                {name:"T3",price:350},
                {name:"T4",price:350},
                {name:"TSH",price:450},
                {name:"Thyroid Profile",price:899}
            ],

            packages:[
                {name:"Basic Health Package",price:1499},
                {name:"Executive Package",price:2999},
                {name:"Full Body Checkup",price:4999}
            ]

        }

    },

    genx:{

        name:"GenX Diagnostics",
        logo:"images/labs/genx.png",
        discount:"10% OFF",

        categories:{

            blood:[
                {name:"CBC",price:320},
                {name:"LFT",price:720}
            ],

            urine:[
                {name:"Routine Urine",price:280},
                {name:"Urine Culture",price:600}
            ],

            thyroid:[
                {name:"TSH",price:500},
                {name:"Thyroid Profile",price:950}
            ],

            packages:[
                {name:"Full Body Checkup",price:4500}
            ]

        }

    }

};

const params = new URLSearchParams(window.location.search);

const lab = params.get("lab") || "hod";

const data = labDetails[lab];

document.getElementById("labLogo").src = data.logo;
document.getElementById("labName").innerHTML = data.name;
document.getElementById("discount").innerHTML = data.discount;

let total = 0;

function loadCategory(category){

    const list = document.getElementById("testList");

    list.innerHTML = "";

    total = 0;
    document.getElementById("totalPrice").innerHTML = "₹0";

    data.categories[category].forEach(test=>{

        list.innerHTML += `

        <tr>

            <td>${test.name}</td>

            <td>₹${test.price}</td>

            <td>
                <input
                    type="checkbox"
                    class="testCheck"
                    value="${test.price}">
            </td>

        </tr>

        `;

    });

    bindCheckbox();

}

function bindCheckbox(){

    document.querySelectorAll(".testCheck").forEach(check=>{

        check.addEventListener("change",function(){

            total = 0;

            document.querySelectorAll(".testCheck:checked").forEach(item=>{

                total += Number(item.value);

            });

            document.getElementById("totalPrice").innerHTML = "₹" + total;

        });

    });

}

document.querySelectorAll(".category-btn").forEach(btn=>{

    btn.addEventListener("click",function(){

        document.querySelectorAll(".category-btn").forEach(b=>{

            b.classList.remove("active");

        });

        this.classList.add("active");

        loadCategory(this.dataset.category);

    });

});

loadCategory("blood");


document.getElementById("bookNowBtn").addEventListener("click", function () {

    const selectedTests = [];

    document.querySelectorAll(".testCheck:checked").forEach(check => {

        const row = check.closest("tr");

        selectedTests.push({
            name: row.cells[0].innerText,
            price: Number(check.value)
        });

    });

    if(selectedTests.length === 0){

        alert("Please select at least one test.");

        return;

    }

    let message = `🩺 *NIROG Diagnostics Test Booking*

🏥 *Lab:* ${data.name}

📋 *Selected Tests:*

`;

    selectedTests.forEach((test,index)=>{

        message += `${index+1}. ${test.name} - ₹${test.price}\n`;

    });

    message += `

💰 *Total Amount:* ₹${total}

🚑 Home Sample Collection Required.

Kindly confirm the booking and share your address for sample collection.

Thank you.`;

    const whatsappNumber = "919114124211";

    window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

});