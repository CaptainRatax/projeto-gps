var apiBaseUrl;
$(async() => {
    getAPIUrl();
    getCandidaturas();
    $("#btnSubmeterDadosSite").click(() => {
        updateDadosSite();
    })
})

async function getAPIUrl() {
    var file = "../../apiBaseUrl.txt"
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                apiBaseUrl = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}

function getCandidaturas() {
    
}