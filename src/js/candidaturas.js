var apiBaseUrl;

$(() => {
    getAPIUrl();
    getCandidaturasAbertas();
    $("#enviar").click(() => {
        submeterCandidatura();
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

function getCandidaturasAbertas() {
    $.get(apiBaseUrl + "/universidades/candidaturasAbertas", (politecnicos) => {
        if (politecnicos.length == 0) {
            $('#exampleModal').modal('show');
        } else {
            politecnicos.forEach(politecnico => {
                $("#politecnicos").append('<option value="' + politecnico.sigla + '">' + politecnico.nome + '</option>');
            });
        }
    })
}

function submeterCandidatura() {
    if ($("#inputNome").val() == "" || $("#inputEmail").val() == "" || $("#inputTelemovel").val() == "" || $("#inputEscola").val() == "" || $("#inputEscola").val() == "") {
        $(".warning").css("display", "block");
        $(".success").css("display", "none");
        $(".error").css("display", "none");
    } else {
        var sigla = $('select[name=selector] option').filter(':selected').val();
        $.get(apiBaseUrl + "/universidades/sigla/" + sigla, (politecnico) => {
            var candidatura = {
                nome: $("#inputNome").val(),
                email: $("#inputEmail").val(),
                telemovel: $("#inputTelemovel").val(),
                escola: $("#inputEscola").val(),
                descricao: $("#inputEscola").val(),
                imagem: "",
                aprovacao: null,
                universidade: politecnico
            }

            console.log(JSON.stringify(candidatura));

            $.ajax({
                type: 'POST',
                url: apiBaseUrl + '/candidaturas/nova',
                data: JSON.stringify(candidatura),
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