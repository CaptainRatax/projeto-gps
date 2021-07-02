var apiBaseUrl, globalCandidaturas, globalStatus;
$(() => {
    getAPIUrl();
    getCandidaturas();
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


function aprovarCandidatura(i) {
    var confirmacao = confirm("Tem a certeza de que quer aprovar a candidatura de " + globalCandidaturas[i].nome + "?");
    if (confirmacao == true) {
        $.ajax({
            type: 'PUT',
            url: apiBaseUrl + '/candidaturas/aprovar/' + globalCandidaturas[i]._id,
            data: null,
            processData: false,
            contentType: 'application/json',
            success: function() {
                getCandidaturas(globalStatus);
                $(".success").empty();
                $(".success").append("Candidatura aprovada com sucesso!");
                $(".success").css("display", "block");
                $(".error").css("display", "none");
            },
            error: function(err) {
                $(".error").empty();
                $(".error").append("Ocurreu algum erro a tentar aprovar a candidatura. Por favor tente mais tarde.");
                $(".success").css("display", "none");
                $(".error").css("display", "block");
            }
        });
    }
}

function rejeitarCandidatura(i) {
    var confirmacao = confirm("Tem a certeza de que quer rejeitar a candidatura de " + globalCandidaturas[i].nome + "?");
    if (confirmacao == true) {
        $.ajax({
            type: 'PUT',
            url: apiBaseUrl + '/candidaturas/rejeitar/' + globalCandidaturas[i]._id,
            data: null,
            processData: false,
            contentType: 'application/json',
            success: function() {
                getCandidaturas(globalStatus);
                $(".success").empty();
                $(".success").append("Candidatura rejeitada com sucesso!");
                $(".success").css("display", "block");
                $(".error").css("display", "none");
            },
            error: function(err) {
                $(".error").empty();
                $(".error").append("Ocurreu algum erro a tentar rejeitar a candidatura. Por favor tente mais tarde.");
                $(".success").css("display", "none");
                $(".error").css("display", "block");
            }
        });
    }
}

function adicionaZero(numero) {
    if (numero <= 9)
        return "0" + numero;
    else
        return numero;
}

function getCandidaturas(status) {
    if (!status || (status != "porAprovar" && status != "aprovadas" && status != "rejeitadas")) {
        status = "porAprovar"
    }
    globalStatus = status;
    $.get(apiBaseUrl + "/candidaturas/" + status, (data) => {
        $("#areaCandidaturas").empty();
        if (status == "aprovadas") {
            $("#areaCandidaturas").append(
                '<div id="botoesStatus" class="botoesStatus">' +
                '<button id="porAprovar" onclick="getCandidaturas(\'porAprovar\')" type="button" class="btn btn-secondary">Por Aprovar</button>' +
                '<button id="aprovadas" onclick="getCandidaturas(\'aprovadas\')" type="button" class="btn btn-info">Aprovadas</button>' +
                '<button id="rejeitadas" onclick="getCandidaturas(\'rejeitadas\')" type="button" class="btn btn-secondary">Rejeitadas</button>' +
                '</div>'
            );
        } else if (status == "rejeitadas") {
            $("#areaCandidaturas").append(
                '<div id="botoesStatus" class="botoesStatus">' +
                '<button id="porAprovar" onclick="getCandidaturas(\'porAprovar\')" type="button" class="btn btn-secondary">Por Aprovar</button>' +
                '<button id="aprovadas" onclick="getCandidaturas(\'aprovadas\')" type="button" class="btn btn-secondary">Aprovadas</button>' +
                '<button id="rejeitadas" onclick="getCandidaturas(\'rejeitadas\')" type="button" class="btn btn-info">Rejeitadas</button>' +
                '</div>'
            );
        } else {
            $("#areaCandidaturas").append(
                '<div id="botoesStatus" class="botoesStatus">' +
                '<button id="porAprovar" onclick="getCandidaturas(\'porAprovar\')" type="button" class="btn btn-info">Por Aprovar</button>' +
                '<button id="aprovadas" onclick="getCandidaturas(\'aprovadas\')" type="button" class="btn btn-secondary">Aprovadas</button>' +
                '<button id="rejeitadas" onclick="getCandidaturas(\'rejeitadas\')" type="button" class="btn btn-secondary">Rejeitadas</button>' +
                '</div>'
            );
        }
        if (data.length == 0) {
            $("#areaCandidaturas").append("<h4>Sem candidaturas novas...</h4>");
        } else {
            let contador = 0;
            data.forEach(candidatura => {
                let dataCandidatura = new Date(candidatura.createdAt); //02/10/2020
                let dataFormatada = (adicionaZero(dataCandidatura.getDate().toString()) + "/" + (adicionaZero(dataCandidatura.getMonth() + 1).toString()) + "/" + dataCandidatura.getFullYear() + " " + adicionaZero(dataCandidatura.getHours()) + ":" + adicionaZero(dataCandidatura.getMinutes()));
                $("#areaCandidaturas").append(
                    '<div id="itemCandidaturas' + contador + '" class="row itemCandidaturas">' +
                    '<div id="areaInformacoes' + contador + '" class="col-md areaInformacoes">' +
                    '<div id="textoNome' + contador + '" class="textoNome">' +
                    '<span>' + candidatura.nome + '</span>' +
                    '</div>' +
                    '<div id="textoData' + contador + '" class="textoData">' +
                    '<span>' + dataFormatada + '</span>' +
                    '</div>' +
                    '<div id="textoEmail' + contador + '" class="textoEmail">' +
                    '<a href="mailto:' + candidatura.email + '"><span>' + candidatura.email + '</span></a>' +
                    '</div>' +
                    '<div id="textoNumero' + contador + '" class="textoNumero">' +
                    '<a href="tel:' + candidatura.telemovel + '">' + candidatura.telemovel + '</a>' +
                    '</div>' +
                    '<div id="textoEscola' + contador + '" class="textoEscola">' +
                    '<span id="escolaEstatico' + contador + '" class="escolaEstatico">Frequentou: </span>' +
                    '<span id="escolaDinamico' + contador + '" class="escolaDinamico">' + candidatura.escola + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div id="areaDescricao' + contador + '" class="col-md areaDescricao">' +
                    '<span>' + candidatura.descricao + '</span>' +
                    (status == "aprovadas" ? '<div id="botaoDesaprovar' + contador + '" class="botaoAprovar">' +
                        '<a id="linkBotaoDesaprovar' + contador + '" href="javascript:rejeitarCandidatura(' + contador + ')" class="btn btn-danger">Rejeitar</a>' +
                        '</div>' : "") +
                    (status == "rejeitadas" ? '<div id="botaoAprovar' + contador + '" class="botaoAprovar">' +
                        '<a id="linkBotaoAprovar' + contador + '" href="javascript:aprovarCandidatura(' + contador + ')" class="btn btn-success">Aprovar</a>' +
                        '</div>' : "") +
                    (status == "porAprovar" ? '<div id="botaoDesaprovar' + contador + '" class="botaoDesaprovar">' +
                        '<a id="linkBotaoDesaprovar' + contador + '" href="javascript:rejeitarCandidatura(' + contador + ')" class="btn btn-danger">Rejeitar</a>' +
                        '</div>' +
                        '<div id="botaoAprovar' + contador + '" class="botaoAprovar">' +
                        '<a id="linkBotaoAprovar' + contador + '" href="javascript:aprovarCandidatura(' + contador + ')" class="btn btn-success">Aprovar</a>' +
                        '</div>' : '') +
                    '</div>' +
                    '</div>'
                )
                contador += 1;
            });
        }
        globalCandidaturas = data;
    })
}