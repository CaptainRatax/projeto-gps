var apiBaseUrl, globalFaqs, globalUniversidadeSelecionadaId;
var globalPolitecnicos = [];

$(() => {
    getAPIUrl();
    getAuthorization();
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

function getAuthorization() {
    if (localStorage.getItem("loginToken") != "") {
        token = {
            token: localStorage.getItem("loginToken")
        }
        $.ajax({
            type: 'POST',
            url: apiBaseUrl + '/verifyToken',
            data: JSON.stringify(token),
            processData: false,
            contentType: 'application/json',
            statusCode: {
                200: function(response) {
                    if (response.success) {
                        var nome = response.user.nome.split(" ");
                        $("#navbarHere").append(
                            '<li class="nav-item userInfo">' +
                            '<a class="nav-link">' + nome[0] + ' ' + nome[nome.length - 1] + '</a>' +
                            '<a href="javascript:localStorage.setItem(\'loginToken\', \'\'); window.location.href = \'/\';"><img class="logoutIcon" src="../src/Images/logout.svg"></a>' +
                            '</li>'
                        )
                        getFaqs();
                    } else {
                        localStorage.setItem('loginToken', "");
                        window.location.href = "/administracao/login";
                    }
                },
                401: function(response) {
                    localStorage.setItem('loginToken', "");
                    window.location.href = "/administracao/login";
                },
                400: function(response) {
                    localStorage.setItem('loginToken', "");
                    window.location.href = "/administracao/login";
                },
                500: function(response) {
                    localStorage.setItem('loginToken', "");
                    window.location.href = "/administracao/login";
                }
            }
        });
    } else {
        localStorage.setItem('loginToken', "");
        window.location.href = "/administracao/login";
    }
}

function inputChanged(contador) {
    if ($("#inputPergunta" + contador).val() != globalFaqs[contador].pergunta || $("#inputResposta" + contador).val() != globalFaqs[contador].resposta) {
        $("#botaoGuardar" + contador).removeClass("hidden")
    } else {
        $("#botaoGuardar" + contador).addClass("hidden")
    }
}

function adicionarFaq(contador) {
    var pergunta = $("#inputPergunta" + contador).val();
    var resposta = $("#inputResposta" + contador).val();
    $.get(apiBaseUrl + "/faqs/perguntaresposta?pergunta=" + pergunta + "?&resposta=" + resposta, (faq) => {
        if (faq.length != 0) {
            $(".success").alert('close')
            $(".error").alert('close')
            $(".warning").alert('close')
            $("#alerts").append(
                '<div class="warning alert alert-warning alert-dismissible fade fixed" role="alert">' +
                'A faq que está a tentar adicionar já existe!' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>'
            );
            $(".warning").addClass("show");
        }
    }).fail(function(data) {
        if (data.status == 404) {
            var faq = {
                pergunta: pergunta,
                resposta: resposta,
                ordem: contador,
            }
            $.ajax({
                type: 'POST',
                url: apiBaseUrl + '/faqs/novo',
                data: JSON.stringify(faq),
                processData: false,
                contentType: 'application/json',
                success: function() {
                    getFaqs();
                    $(".success").alert('close')
                    $(".error").alert('close')
                    $(".warning").alert('close')
                    $("#alerts").append(
                        '<div class="success alert alert-success alert-dismissible fade fixed" role="alert">' +
                        'Faq adicionada com sucesso!' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '</div>'
                    );
                    $(".success").addClass("show");
                },
                error: function() {
                    $(".success").alert('close')
                    $(".error").alert('close')
                    $(".warning").alert('close')
                    $("#alerts").append(
                        '<div class="error alert alert-danger alert-dismissible fade fixed" role="alert">' +
                        'Ocurreu algum erro a tentar adicionar a faq. Por favor tente mais tarde.' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '</div>'
                    );
                    $(".error").addClass("show");
                }
            });
        } else {
            $(".success").alert('close')
            $(".error").alert('close')
            $(".warning").alert('close')
            $("#alerts").append(
                '<div class="error alert alert-danger alert-dismissible fade fixed" role="alert">' +
                'Ocurreu algum erro a tentar adicionar a faq. Por favor tente mais tarde.' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>'
            );
            $(".error").addClass("show");
        }
    })
}

function eliminarFaq(faqId) {
    $.get(apiBaseUrl + "/faqs/id/" + faqId, (faq) => {
        var confirmacao = confirm("Tem a certeza de que quer eliminar a pergunta \"" + faq.pergunta + "\"?");
        if (confirmacao) {
            $.ajax({
                type: 'DELETE',
                url: apiBaseUrl + '/faqs/eliminar/' + faqId,
                data: null,
                processData: false,
                contentType: 'application/json',
                success: function() {
                    getFaqs();
                    $(".success").alert('close')
                    $(".error").alert('close')
                    $(".warning").alert('close')
                    $("#alerts").append(
                        '<div class="success alert alert-success alert-dismissible fade fixed" role="alert">' +
                        'Faq eliminada com sucesso!' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '</div>'
                    );
                    $(".success").addClass("show");
                },
                error: function(err) {
                    $(".success").alert('close')
                    $(".error").alert('close')
                    $(".warning").alert('close')
                    $("#alerts").append(
                        '<div class="error alert alert-danger alert-dismissible fade fixed" role="alert">' +
                        'Ocurreu algum erro a tentar eliminar a faq. Por favor tente mais tarde.' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '</div>'
                    );
                    $(".error").addClass("show");
                }
            });
        }
    })
}

function guardarFaq(faqId, contador) {
    $.get(apiBaseUrl + "/faqs/id/" + faqId, (faq) => {
        faq.pergunta = $("#inputPergunta" + contador).val();
        faq.resposta = $("#inputResposta" + contador).val();
        $.ajax({
            type: 'PATCH',
            url: apiBaseUrl + '/faqs/alterar',
            data: JSON.stringify(faq),
            processData: false,
            contentType: 'application/json',
            success: function() {
                getFaqs();
                $(".success").alert('close')
                $(".error").alert('close')
                $(".warning").alert('close')
                $("#alerts").append(
                    '<div class="success alert alert-success alert-dismissible fade fixed" role="alert">' +
                    'Faq guardada com sucesso!' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</div>'
                );
                $(".success").addClass("show");
            },
            error: function(err) {
                $(".success").alert('close')
                $(".error").alert('close')
                $(".warning").alert('close')
                $("#alerts").append(
                    '<div class="error alert alert-danger alert-dismissible fade fixed" role="alert">' +
                    'Ocurreu algum erro a tentar guardar a faq. Por favor tente mais tarde.' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</div>'
                );
                $(".error").addClass("show");
            }
        });
    })
}

function getFaqs() {
    $.get(apiBaseUrl + "/faqs", (faqs) => {
        let contador = 0;
        globalFaqs = [];
        $("#areaFaqs").empty();
        faqs.forEach(faq => {
            $("#areaFaqs").append(
                '<div id="itemFaq' + contador + '" class="itemFaq">' +
                '<div id="divInputPergunta' + contador + '" class="divInputPergunta">' +
                '<label id="labelInputPergunta' + contador + '" for="inputPergunta">Pergunta</label>' +
                '<input id="inputPergunta' + contador + '" onkeyup="inputChanged(' + contador + ')" type="text" value="' + faq.pergunta + '" class="form-control" placeholder="Pergunta">' +
                '</div>' +
                '<div id="divInputResposta' + contador + '" class="divInputResposta">' +
                '<label id="labelInputResposta' + contador + '" for="inputResposta">Resposta</label>' +
                '<textarea id="inputResposta' + contador + '" onkeyup="inputChanged(' + contador + ')" class="form-control" placeholder="Resposta"></textarea>' +
                '</div>' +
                '<div id="divBotoes' + contador + '" class="divBotoes">' +
                '<button id="botaoGuardar' + contador + '" onclick="guardarFaq(\'' + faq._id + '\', ' + contador + ')" type="button" class="btn btn-info hidden">Guardar</button>' +
                '<button id="botaoEliminar' + contador + '" onclick="eliminarFaq(\'' + faq._id + '\')" type="button" class="btn btn-danger">Eliminar</button>' +
                '</div>' +
                '</div>'
            )
            $("#inputResposta" + contador).val(faq.resposta);
            globalFaqs[contador] = faq;
            contador += 1;
        });
        $("#areaFaqs").append(
            '<div id="itemFaq' + contador + '" class="itemFaq">' +
            '<div id="divInputPergunta' + contador + '" class="divInputPergunta">' +
            '<label id="labelInputPergunta' + contador + '" for="inputPergunta">Pergunta</label>' +
            '<input id="inputPergunta' + contador + '" onkeyup="inputChanged(' + contador + ')" type="text" value="" class="form-control" placeholder="Nova pergunta">' +
            '</div>' +
            '<div id="divInputResposta' + contador + '" class="divInputResposta">' +
            '<label id="labelInputResposta' + contador + '" for="inputResposta">Resposta</label>' +
            '<textarea id="inputResposta' + contador + '" onkeyup="inputChanged(' + contador + ')" class="form-control" placeholder="Nova resposta"></textarea>' +
            '</div>' +
            '<div id="divBotoes' + contador + '" class="divBotoes">' +
            '<button id="botaoAdicionar' + contador + '" onclick="adicionarFaq(' + contador + ')" type="button" class="btn btn-info">Adicionar</button>' +
            '</div>' +
            '</div>'
        )
    })
}