$(() => {
    console.log("ready");
    getDadosSite();
    $("#btnSubmeterDadosSite").click(() => {
        updateDadosSite();
    })
})

function getDadosSite() {
    var chaveTituloHome = $("#labelTituloHome").text()
    $.get("http://localhost:3000/api/dadossite/chave/" + chaveTituloHome, (data) => {
        $("#tituloHome").val(data.valor)
    })

    var chaveSubtituloHome = $("#labelSubtituloHome").text()
    $.get("http://localhost:3000/api/dadossite/chave/" + chaveSubtituloHome, (data) => {
        $("#subtituloHome").val(data.valor)
    })

    var chaveTituloSobre = $("#labelTituloSobre").text()
    $.get("http://localhost:3000/api/dadossite/chave/" + chaveTituloSobre, (data) => {
        $("#tituloSobre").val(data.valor)
    })

    var chaveTextoSobre = $("#labelTextoAreaSobre").text()
    $.get("http://localhost:3000/api/dadossite/chave/" + chaveTextoSobre, (data) => {
        $("#textoAreaSobre").val(data.valor)
    })
}

function updateDadosSite() {

    var chaveTextoSobre = $("#labelTextoAreaSobre").text()
    $.get("http://localhost:3000/api/dadossite/chave/" + chaveTextoSobre, (data) => {
        data.valor = $("#textoAreaSobre").val()
        console.log(JSON.stringify(data))
        $.ajax({
            type: 'PATCH',
            url: 'http://localhost:3000/api/dadossite/alterar',
            data: JSON.stringify(data),
            processData: false,
            contentType: 'application/json',

            /* success and error handling omitted for brevity */
        });
    })


}