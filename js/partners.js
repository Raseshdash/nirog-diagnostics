const labs = [

{
    name:"HOD Diagnostics",
    logo:"images/labs/hod.png",
    url:"lab.html?lab=hod"
},

{
    name:"GenX Diagnostics",
    logo:"images/labs/genx.png",
    url:"lab.html?lab=genx"
},

{
    name:"Dr Lal PathLabs",
    logo:"images/labs/pathlab.png",
    url:"lab.html?lab=lal"
},

{
    name:"Pathkind Labs",
    logo:"images/labs/pathkind.png",
    url:"lab.html?lab=pathkind"
},

{
    name:"General Diagnostics",
    logo:"images/labs/generalD.png",
    url:"lab.html?lab=general"
},

{
    name:"Thyrocare",
    logo:"images/labs/thyro.png",
    url:"lab.html?lab=thyro"
}

];

const radiology = [

{
    name:"HOD Diagnostics",
    logo:"images/labs/hod.png",
    url:"radiology.html?center=hod"
},

{
    name:"GenX Diagnostics",
    logo:"images/labs/genx.png",
    url:"radiology.html?center=genx"
},

{
    name:"Dr Lal PathLabs",
    logo:"images/labs/pathlab.png",
    url:"radiology.html?center=lal"
},

{
    name:"Pathkind Labs",
    logo:"images/labs/pathkind.png",
    url:"radiology.html?center=pathkind"
},

{
    name:"General Diagnostics",
    logo:"images/labs/generalD.png",
    url:"radiology.html?center=general"
},

{
    name:"Thyrocare",
    logo:"images/labs/thyro.png",
    url:"radiology.html?center=thyro"
}

];

function renderPartners(id,data){

    const grid = document.getElementById(id);

    grid.innerHTML = "";

    data.forEach(item=>{

        grid.innerHTML += `

        <a href="${item.url}" class="partner-card">

            <div class="partner-logo">
                <img src="${item.logo}" alt="${item.name}">
            </div>

            <h4>${item.name}</h4>

            <div class="partner-info">

                <span>
                    <i class="fa-solid fa-house-medical"></i>
                    Home Collection
                </span>

                <span>
                    <i class="fa-solid fa-circle-check"></i>
                    Reports Online
                </span>

            </div>

            <button class="partner-btn">

                View Tests

                <i class="fa-solid fa-arrow-right"></i>

            </button>

        </a>

        `;

    });

}


renderPartners("labs",labs);
renderPartners("radiology",radiology);



document.querySelectorAll(".partner-tab").forEach(tab=>{

    tab.addEventListener("click",function(){

        document.querySelectorAll(".partner-tab")
            .forEach(btn=>btn.classList.remove("active"));

        this.classList.add("active");

        document.querySelectorAll(".partner-grid")
            .forEach(grid=>grid.classList.remove("active-grid"));

        document
            .getElementById(this.dataset.target)
            .classList.add("active-grid");

    });

});