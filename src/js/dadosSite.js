var apiBaseUrl;
$(async() => {
    getAPIUrl();
    getDadosSite();
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

function getDadosSite() {
    var chaveTituloHome = $("#labelTituloHome").text()
    $.get(apiBaseUrl + "/dadossite/chave/" + chaveTituloHome, (data) => {
        $("#tituloHome").val(data.valor)
    })

    var chaveSubtituloHome = $("#labelSubtituloHome").text()
    $.get(apiBaseUrl + "/dadossite/chave/" + chaveSubtituloHome, (data) => {
        $("#subtituloHome").val(data.valor)
    })

    var chaveTituloSobre = $("#labelTituloSobre").text()
    $.get(apiBaseUrl + "/dadossite/chave/" + chaveTituloSobre, (data) => {
        $("#tituloSobre").val(data.valor)
    })

    var chaveTextoSobre = $("#labelTextoAreaSobre").text()
    $.get(apiBaseUrl + "/dadossite/chave/" + chaveTextoSobre, (data) => {
        $("#textoAreaSobre").val(data.valor)
    })
}

function updateDadosSite() {
    var erro = false;
    var confirmacao = confirm("Tem a certeza que quer alterar os dados do site?");
    if (confirmacao == true) {
        var chaveSubtituloHome = $("#labelSubtituloHome").text()
        $.get(apiBaseUrl + "/dadossite/chave/" + chaveSubtituloHome, (data) => {
            data.valor = $("#subtituloHome").val()
            console.log(JSON.stringify(data))
            $.ajax({
                type: 'PATCH',
                url: apiBaseUrl + '/dadossite/alterar',
                data: JSON.stringify(data),
                processData: false,
                contentType: 'application/json',
                error: function(err) {
                    erro = true;
                },
                /* success and error handling omitted for brevity */
            });
        })

        var chaveTituloSobre = $("#labelTituloSobre").text()
        $.get(apiBaseUrl + "/dadossite/chave/" + chaveTituloSobre, (data) => {
            data.valor = $("#tituloSobre").val()
            console.log(JSON.stringify(data))
            $.ajax({
                type: 'PATCH',
                url: apiBaseUrl + '/dadossite/alterar',
                data: JSON.stringify(data),
                processData: false,
                contentType: 'application/json',
                error: function(err) {
                    erro = true;
                },
                /* success and error handling omitted for brevity */
            });
        })

        var chaveTituloHome = $("#labelTituloHome").text()
        $.get(apiBaseUrl + "/dadossite/chave/" + chaveTituloHome, (data) => {
            data.valor = $("#tituloHome").val()
            console.log(JSON.stringify(data))
            $.ajax({
                type: 'PATCH',
                url: apiBaseUrl + '/dadossite/alterar',
                data: JSON.stringify(data),
                processData: false,
                contentType: 'application/json',
                error: function(err) {
                    erro = true;
                },
                /* success and error handling omitted for brevity */
            });
        })

        var chaveTextoSobre = $("#labelTextoAreaSobre").text()
        $.get(apiBaseUrl + "/dadossite/chave/" + chaveTextoSobre, (data) => {
            data.valor = $("#textoAreaSobre").val()
            console.log(JSON.stringify(data))
            $.ajax({
                type: 'PATCH',
                url: apiBaseUrl + '/dadossite/alterar',
                data: JSON.stringify(data),
                processData: false,
                contentType: 'application/json',
                error: function(err) {
                    erro = true;
                },
                /* success and error handling omitted for brevity */
            });
        })
        if (erro) {
            $(".error").empty();
            $(".error").append("Ocurreu algum erro ao guardar os dados. Por favor tente mais tarde.");
            $(".success").css("display", "none");
            $(".error").css("display", "block");
        } else {
            $(".success").empty();
            $(".success").append("Dados guardados com sucesso!");
            $(".success").css("display", "block");
            $(".error").css("display", "none");
        }
    }
}