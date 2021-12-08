document.querySelector("#login").onclick = () => {
    document.querySelector("#conTxt").style.visibility = "hidden";
    document.querySelector("#spinner").style.visibility = "visible";

    fetch("http://localhost:8080/login", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            email: document.querySelector("#email").value,
            password: document.querySelector("#password").value,
        })
    }).then(function (res) {
        return res.json();
    }).then(function (json) {

        if (json.type === "email") {
            document.querySelector("#email").insertAdjacentHTML('afterend', `<div class='err'>${json.msg}</div>`);
        } else if (json.type === "pwd") {
            document.querySelector("#password").insertAdjacentHTML('afterend', `<div class='err'>${json.msg}</div>`);
        } else if (json.type === "serveur") {
            document.querySelector("#login").insertAdjacentHTML('afterend', `<div class='err'>${json.msg}</div>`);
        }

        document.querySelector("#conTxt").style.visibility = "visible";
        document.querySelector("#spinner").style.visibility = "hidden";

  //          document.querySelector("#passwordErr").textContent = json.passwordErr;
    })
}