/*booking.js*/
document.getElementById("bookBtn").addEventListener("click", function () {

    const name = document.getElementById("fullName").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const test = document.getElementById("testName").value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;
    const address = document.getElementById("address").value.trim();
    const note = document.getElementById("message").value.trim();

    if(name==="" || mobile==="" || test===""){

        alert("Please enter Name, Mobile Number and Select Test.");

        return;

    }

    let message = `🩺 *NIROG Diagnostics Appointment Request*

👤 Name: ${name}

📱 Mobile: ${mobile}

📧 Email: ${email || "Not Provided"}

🧪 Test: ${test}

📅 Date: ${date || "Flexible"}

🕒 Time: ${time || "Any Time"}

🏠 Address:
${address || "Will Share Later"}

📝 Message:
${note || "N/A"}

Please confirm my appointment.

Thank You.`;

    const whatsappNumber = "919114124211";

    window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

});