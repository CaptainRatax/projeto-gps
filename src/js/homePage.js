var apiBaseUrl;
$(() => {
    getAPIUrl();
    getDadosHomePage();
})

async function getAPIUrl() {
    var file = "./apiBaseUrl.txt"
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

function getDadosHomePage() {
    $.get(apiBaseUrl + '/dadossite', (data) => {
        $("#tituloHomePage").text(data[0].valor)
        $("#subtituloHomePage").text(data[1].valor)
        $("#tituloSobreHome").text(data[2].valor)
        var auxData = data[3].valor.replaceAll("\n", "<br>")
        $("#textoSobre").text("")
        $("#textoSobre").append(auxData)
    })
}