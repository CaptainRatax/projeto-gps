var apiBaseUrl;
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
                        getTestemunhos();
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

function adicionaZero(numero) {
    if (numero <= 9)
        return "0" + numero;
    else
        return numero;
}

function abrirNovoTestemunho() {
    localStorage.setItem('novoTestemunho', "");
    window.location.href = "/administracao/testemunho";
}

function editarTestemunho(id) {
    localStorage.setItem('novoTestemunho', id);
    window.location.href = "/administracao/testemunho";
}

function getTestemunhos() {
    $.get(apiBaseUrl + '/testemunhos', (data) => {
        $("#testemunhos").empty();
        if (data.length == 0) {
            $("#testemunhos").append("<h2>Sem testemunhos...</h2>");
        } else {
            let contador = 0;
            data.forEach(testemunho => {
                    let dataTestemunho = new Date(testemunho.data);
                    let dataFormatada = (adicionaZero(dataTestemunho.getDate().toString()) + "/" + (adicionaZero(dataTestemunho.getMonth() + 1).toString()) + "/" + dataTestemunho.getFullYear());
                    console.log(testemunho)
                    let codigo = testemunho.linkYoutube.split('/')[4];
                    $("#testemunhos").append(
                        '<div class="row">' +
                        '<div class="col-md-2">' +
                        '<img class="thumbnail" src="https://img.youtube.com/vi/' + codigo + '/sddefault.jpg" />' +
                        '</div>' +
                        '<div class="col-md-8">' +
                        '<h3>' + testemunho.nomePessoa + '</h3>' +
                        '<h5 class="descricao">' + testemunho.descricao + '</h5>' +
                        '</div>' +
                        '<div class="col-md-2 icons">' +
                        '<img onclick="editarTestemunho(\'' + testemunho._id + '\')" class="edit" src="https://img.icons8.com/material-outlined/24/4a90e2/edit--v1.png" />' +
                        '<img onclick="apagar(\'' + testemunho._id + '\')"class="delete" src="https://img.icons8.com/material-outlined/24/4a90e2/trash--v1.png" />' +
                        '</div>' +
                        '</div>'
                    )
                    contador += 1;
                }

            )
        }
    })
}

function apagar(id) {
    var confirmacao = confirm("Tem a certeza de que quer este testemunho?");
    if (confirmacao) {
        $.ajax({
            type: 'DELETE',
            url: apiBaseUrl + '/testemunhos/eliminar/' + id,
            data: null,
            processData: false,
            contentType: 'application/json',
            success: function() {
                getTestemunhos();
                $(".success").alert('close')
                $(".error").alert('close')
                $(".warning").alert('close')
                $("#alerts").append(
                    '<div class="success alert alert-success alert-dismissible fade fixed" role="alert">' +
                    'Testemunho eliminado com sucesso!' +
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
                    'Ocurreu algum erro a tentar eliminar o testemunho. Por favor tente mais tarde.' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</div>'
                );
                $(".error").addClass("show");
            }
        });
    }
}