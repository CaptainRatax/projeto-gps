var apiBaseUrl;
$(() => {
    getAPIUrl();
    getTestemunhos();
})

async function getAPIUrl() {
    var file = "./apiBaseUrl.txt"
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
                    if (contador % 2 == 0) {
                        $("#testemunhos").append(
                            '<div class="row itemNoticia">' +
                            '<div class="col-md-5 descricao">' +
                            '<div class="tituloNoticia">' +
                            '<span>' + testemunho.nomePessoa + '</span>' +
                            '<h6>' + dataFormatada + '</h6>' +
                            '</div>' +
                            '<div class="textoNoticia">' +
                            '<span>' + testemunho.descricao + '</span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="col-md-7 containerImagem">' +
                            '<iframe width="740" height="420" src="' + testemunho.linkYoutube + '"></iframe>' +
                            '</div>' +
                            '<div class="foraSeparadorNoticia">' +
                            '<div class="separadorNoticia"></div>' +
                            '</div>' +
                            '</div>'
                        )
                    } else {
                        $("#testemunhos").append(
                            '<div class="row itemNoticia">' +
                            '<div class="col-md-7 containerImagem">' +
                            '<iframe width="740" height="420" src="' + testemunho.linkYoutube + '"></iframe>' +
                            '</div>' +
                            '<div class="col-md-5 descricao">' +
                            '<div class="tituloNoticia">' +
                            '<span>' + testemunho.nomePessoa + '</span>' +
                            '<h6>' + dataFormatada + '</h6>' +
                            '</div>' +
                            '<div class="textoNoticia">' +
                            '<span>' + testemunho.descricao + '</span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="foraSeparadorNoticia">' +
                            '<div class="separadorNoticia"></div>' +
                            '</div>' +
                            '</div>'
                        )
                    }

                    contador += 1;
                }

            )
        }
    })
}