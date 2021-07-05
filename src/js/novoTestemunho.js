var apiBaseUrl;
var testemunho;

$(() => {
    getAPIUrl();
    getTestemunhos();
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
    if ($("#Estudante").val() == "" || $("#Descricao").val() == "" || $("#YoutubeLink").val() == "") {
        $(".success").alert('close')
        $(".error").alert('close')
        $(".warning").alert('close')
        $("#alerts").append(
            '<div class="warning alert alert-warning alert-dismissible fade fixed" role="alert">' +
            'Vá lá... Preenche os dados por favor! 😒😐' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>'
        );
        $(".warning").addClass("show");
    } else {
        if (localStorage.getItem("novoTestemunho") != "") { // EDITAR TESTEMUNHO
            var sigla = $('select[name=selector] option').filter(':selected').val()
            $.get(apiBaseUrl + "/universidades/sigla/" + sigla, (universidade) => {
                testemunho.nomePessoa = $("#Estudante").val()
                testemunho.descricao = $("#Descricao").val()
                testemunho.linkYoutube = $("#YoutubeLink").val()
                testemunho.universidade = universidade
                $.ajax({
                    type: 'PATCH',
                    url: apiBaseUrl + '/testemunhos/alterar',
                    data: JSON.stringify(testemunho),
                    processData: false,
                    contentType: 'application/json',
                    success: function() {
                        getTestemunhos();
                        $(".success").alert('close')
                        $(".error").alert('close')
                        $(".warning").alert('close')
                        $("#alerts").append(
                            '<div class="success alert alert-success alert-dismissible fade fixed" role="alert">' +
                            'Testemunho alterado com sucesso!' +
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
                            'Ocurreu algum erro a tentar guardar o testemunho. Por favor tente mais tarde.' +
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                            '<span aria-hidden="true">&times;</span>' +
                            '</button>' +
                            '</div>'
                        );
                        $(".error").addClass("show");
                    }
                });
            })

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
}

function getTestemunhos() {
    if (localStorage.getItem("novoTestemunho") != "") { // EDITAR TESTEMUNHO
        $("#titulo").text("Editar Testemunho");
        $.get(apiBaseUrl + '/testemunhos', (data) => {
            procurarTestemunho();
        })
    } else {
        $("#titulo").text("Novo Testemunho");
    }
}

function cancelar() {
    window.location.href = "/administracao/testemunhos";
}

function procurarTestemunho() {
    let id = localStorage.getItem("novoTestemunho");
    $.get(apiBaseUrl + '/testemunhos/id/' + id, (data) => {
        $("#Estudante").val(data.nomePessoa);
        $("#YoutubeLink").val(data.linkYoutube);
        $("#Descricao").val(data.descricao);
        $("#politecnicos").val(data.universidade.sigla).change();
        testemunho = data;
    })
}