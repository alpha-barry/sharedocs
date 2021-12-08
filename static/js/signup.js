document.querySelector("#signup").onclick = () => {
    document.querySelector("#conTxt").style.visibility = "hidden";
    document.querySelector("#spinner").style.visibility = "visible";

    fetch("http://localhost:8080/signup", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            email: document.querySelector("#email").value,
            password: document.querySelector("#password").value,
            confirmation: document.querySelector("#confirmation").value,
        })
    }).then(function (res) {
        return res.json();
    }).then(function (json) {
        
        document.querySelector("#conTxt").style.visibility = "visible";
        document.querySelector("#spinner").style.visibility = "hidden";

           // document.querySelector("#emailErr").textContent = json.emailErr;
            //document.querySelector("#passwordErr").textContent = json.passwordErr;
            //document.querySelector("#confirmationErr").textContent = json.confirmationErr;
    })
}