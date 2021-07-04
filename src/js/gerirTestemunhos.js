var apiBaseUrl;
$(() => {
    getAPIUrl();
    getTestemunhos();
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
                        '<img  class="edit" src="https://img.icons8.com/material-outlined/24/4a90e2/edit--v1.png" />' +
                        '<img class="delete" src="https://img.icons8.com/material-outlined/24/4a90e2/trash--v1.png" />' +
                        '</div>' +
                        '</div>'
                    )

                    contador += 1;
                }

            )
        }
    })
}