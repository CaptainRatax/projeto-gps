var apiBaseUrl;
$(() => {
    getAPIUrl();
    faq();
    getFaq();
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

function faq() {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("activated");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
}

function getFaq() {
    $.get(apiBaseUrl + '/faqs', (data) => {
        $("#Faqs").empty();
        if (data.length == 0) {
            $("#Faqs").append("<h2>Não existe nenhuma FAQ para apresentar</h2>");
        } else {
            data.forEach(faq => {
                console.log(faq)
                $("#Faqs").append(
                    '<button class="accordion">' + faq.pergunta + '</button>' +
                    '<div class="panel">' +
                    '<p>' + faq.resposta + '</p>' +
                    '</div>'
                )
            })
        }
        faq();
    })
}