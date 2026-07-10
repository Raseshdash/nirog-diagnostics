const radiologyDetails = {

    hod:{

        name:"HOD Diagnostics",

        logo:"images/labs/hod.png",

        discount:"20% OFF",

        categories:{

            xray:[

                {name:"Chest X-Ray",price:500},
                {name:"Spine X-Ray",price:650},
                {name:"Knee X-Ray",price:600}

            ],

            ultrasound:[

                {name:"Whole Abdomen",price:1200},
                {name:"Pregnancy Scan",price:1500},
                {name:"Pelvis Scan",price:1000}

            ],

            ctscan:[

                {name:"CT Brain",price:3200},
                {name:"CT Chest",price:3800},
                {name:"CT Abdomen",price:4200}

            ],

            mri:[

                {name:"MRI Brain",price:6500},
                {name:"MRI Spine",price:7000},
                {name:"MRI Knee",price:6000}

            ]

        }

    },

    genx:{

        name:"GenX Diagnostics",

        logo:"images/labs/genx.png",

        discount:"15% OFF",

        categories:{

            xray:[

                {name:"Chest X-Ray",price:550},
                {name:"Hand X-Ray",price:450}

            ],

            ultrasound:[

                {name:"Whole Abdomen",price:1300},
                {name:"Pelvis Scan",price:1100}

            ],

            ctscan:[

                {name:"CT Brain",price:3400},
                {name:"CT Chest",price:3900}

            ],

            mri:[

                {name:"MRI Brain",price:6800},
                {name:"MRI Spine",price:7200}

            ]

        }

    }

};

const params = new URLSearchParams(window.location.search);

const center = params.get("center") || "hod";

const data = radiologyDetails[center];

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

            document.getElementById("totalPrice").innerHTML = "₹"+total;

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

loadCategory("xray");

document.getElementById("bookNowBtn").addEventListener("click",function(){

    const selected=[];

    document.querySelectorAll(".testCheck:checked").forEach(check=>{

        const row=check.closest("tr");

        selected.push({

            name:row.cells[0].innerText,

            price:Number(check.value)

        });

    });

    if(selected.length===0){

        alert("Please select at least one service.");

        return;

    }

    let message=`🏥 *NIROG Diagnostics Radiology Booking*

📍 *Center:* ${data.name}

🩻 *Selected Services*

`;

    selected.forEach((item,index)=>{

        message+=`${index+1}. ${item.name} - ₹${item.price}\n`;

    });

    message+=`

💰 *Total:* ₹${total}

Kindly confirm the appointment and share the available time slot.

Thank you.`;

    window.open(

        `https://wa.me/919114124211?text=${encodeURIComponent(message)}`,

        "_blank"

    );

});