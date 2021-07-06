var apiBaseUrl;
$(async() => {
    getAPIUrl();
    getAuthorization();
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