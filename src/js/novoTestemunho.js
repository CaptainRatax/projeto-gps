var apiBaseUrl;
$(() => {
    getAPIUrl();
    //getTestemunhos();
    getUniversidades();
})

function getAPIUrl() {
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

function getUniversidades() {
    $.get(apiBaseUrl + "/universidades", (politecnicos) => {
        politecnicos.forEach(politecnico => {
            $("#politecnicos").append('<option value="' + politecnico.sigla + '">' + politecnico.nome + '</option>');
        });
    })
}

function guardar() {
    if (localStorage.getItem("novoTestemunho") != "") { // EDITAR TESTEMUNHO

    } else { // ADICIONAR TESTEMUNHO
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        var sigla = $('select[name=selector] option').filter(':selected').val();
        $.get(apiBaseUrl + "/universidades/sigla/" + sigla, (universidade) => {
            var testemunho = {
                nomePessoa: $("#Estudante").val(),
                descricao: $("#Descricao").val(),
                data: today,
                linkYoutube: $("#YoutubeLink").val(),
                universidade: universidade
            }

            $.ajax({
                type: 'POST',
                url: apiBaseUrl + '/testemunhos/novo',
                data: JSON.stringify(testemunho),
                processData: false,
                contentType: 'application/json',
                success: function() {
                    $(".success").css("display", "block");
                    $(".error").css("display", "none");
                    $(".warning").css("display", "none");
                },
                error: function() {
                    $(".error").css("display", "block");
                    $(".warning").css("display", "none");
                    $(".success").css("display", "none");
                }
            });
        })
    }
}

function getTestemunhos() {
    if (localStorage.getItem("novoTestemunho") != "") { // EDITAR TESTEMUNHO
        $.get(apiBaseUrl + '/testemunhos', (data) => {

        })
    }
}