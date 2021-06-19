$(() => {
    console.log("ready");
    getDadosHomePage();
})

function getDadosHomePage() {
    $.get('http://localhost:3000/api/dadossite', (data) => {
        $("#tituloHomePage").text(data[0].valor)
        $("#subtituloHomePage").text(data[1].valor)
        $("#tituloSobreHome").text(data[2].valor)
        $("#textoSobre").text(data[3].valor)
    })
}