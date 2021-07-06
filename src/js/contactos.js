var apiBaseUrl;
var globalPolitecnicos = [];

$(() => {
    getAPIUrl();
    getUniversidades();
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
                            '<li class="nav-item">' +
                            '<a class="nav-link" href="/administracao">Área de administrador</a>' +
                            '</li>' +
                            '<li class="nav-item userInfo">' +
                            '<a class="nav-link">' + nome[0] + ' ' + nome[nome.length - 1] + '</a>' +
                            '<a href="javascript:localStorage.setItem(\'loginToken\', \'\'); window.location.href = \'/\';"><img class="logoutIcon" src="./src/Images/logout.svg"></a>' +
                            '</li>'
                        )
                        $("#navbarHere2").append(
                            '<li><a href="/administracao">Área de adimistrador</a></li>'
                        )
                    }
                }
            }
        });
    }
}

function getUniversidades() {
    $.get(apiBaseUrl + "/universidades", (politecnicos) => {
        globalPolitecnicos = {};
        politecnicos.forEach(politecnico => {
            globalPolitecnicos[politecnico.sigla] = politecnico._id;
            $("#politecnicos").append('<option value="' + politecnico.sigla + '">' + politecnico.nome + '</option>');
        });
        getContactos(politecnicos[0]._id);
    })
}

function onUnivesityChange() {
    var sigla = $('select[name=selector] option').filter(':selected').val()
    getContactos(globalPolitecnicos[sigla]);
}

function getContactos(idUniversidade) {
    if (!idUniversidade) {
        if (globalPolitecnicos.length == 0) {
            return;
        }
        var sigla = $('select[name=selector] option').filter(':selected').val()
        idUniversidade = globalPolitecnicos[sigla]
    }
    $.get(apiBaseUrl + "/contactos/morada/universidadeid/" + idUniversidade, (morada) => {
        var auxData = morada.valor.replaceAll("\n", "<br>")
        $("#moradaContactos").text("")
        $("#moradaContactos").append(auxData)
        $.get(apiBaseUrl + "/contactos/universidadeid/" + idUniversidade, (contactos) => {
            let contador = 0;
            globalContactos = [];
            $("#contactoCampos").empty();
            contactos.forEach(contacto => {
                if (contacto.ordem != 0) {
                    $("#contactoCampos").append(
                        '<div id="itemContacto' + contador + '" class="itemContacto">' +
                        '<div id="tituloItemContacto' + contador + '" class="tituloItemContacto">' +
                        '<span id="chave' + contador + '">' + contacto.chave + '</span>' +
                        '</div>' +
                        '<div id="valorItemContacto' + contador + '" class="valorItemContacto">' +
                        '<span id="valor' + contador + '">' + contacto.valor + '</span>' +
                        '</div>' +
                        '</div>'
                    )
                    globalContactos[contador] = contacto;
                    contador += 1;
                }
            });
        })
        myMap();
    })
}

function myMap() {
    if (globalPolitecnicos.length != 0) {
        var sigla = $('select[name=selector] option').filter(':selected').val();
        $.get(apiBaseUrl + "/contactos/coordenadas/universidadeid/" + globalPolitecnicos[sigla], (data) => {
            var auxCoordinates = data.valor.split(", ");
            var coordinates;
            if (!isNaN(auxCoordinates[0]) && !isNaN(auxCoordinates[1])) {
                coordinates = { lat: parseFloat(auxCoordinates[0]), lng: parseFloat(auxCoordinates[1]) };
            } else {
                coordinates = { lat: 40.64654781049706, lng: -7.92019846053499 };
            }
            const map = new google.maps.Map(document.getElementById("googleMap"), {
                zoom: 17,
                center: coordinates,
            });

            var marker = new google.maps.Marker({
                position: coordinates,
                map: map,
            });
        })
    }
}