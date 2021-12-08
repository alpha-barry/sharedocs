  //let url = URL.createObjectURL(blob);

  document.querySelector("#sendFile").addEventListener('click', function (event) {
    event.preventDefault();

    const form = document.querySelector('#form');
    const formData = new FormData(form);

    fetch("http://localhost:8080/sendFile", {
        method: "post",
        body: formData,
    }).then(function (res) {
      // return res.blob();
    });
})

document.querySelector("#getFile").addEventListener('click', function (event) {
    event.preventDefault();

    const form = document.querySelector('#form');
    const formData = new FormData(form);

    fetch("http://localhost:8080/getFile").then(function (res) {
       return res.json();
    }).then(function (json) {
        var array = new Uint8Array(json.file.data);
        var blob = new Blob([array], {type: json.mimetype});
        const iframe = document.querySelector("embed");
        const url = URL.createObjectURL(blob);
        iframe.src = url;
       // document.querySelector('#downloadBtn').href = url;
    });
})

/*document.querySelector("#getFile").addEventListener('click', function (event) {
    event.preventDefault();

    const form = document.querySelector('#form');
    const formData = new FormData(form);

    fetch("http://localhost:8080/getFile", {
        method: "post",
        body: formData,
    }).then(function (res) {
       return res.blob();
    }).then(function (blob) {
      /*  const file = new File([blob], "tt.pdf", {type: blob.type, lastModified: Date.now()});
        const iframe = document.querySelector("iframe");
        const url = URL.createObjectURL(blob);
        iframe.src = url;
        document.querySelector('#downloadBtn').href = url; 
    });
})*/