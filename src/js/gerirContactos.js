var apiBaseUrl, globalLatLengClick, globalUniversidadeSelecionadaId;
var globalPolitecnicos = [];

$(() => {
    getAPIUrl();
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

function onUnivesityChange() {
    var sigla = $('select[name=selector] option').filter(':selected').val()
    globalUniversidadeSelecionadaId = globalPolitecnicos[sigla]
    myMap()
}

function getUniversidades() {
    $.get(apiBaseUrl + "/universidades", (politecnicos) => {
        globalPolitecnicos = {};
        politecnicos.forEach(politecnico => {
            globalPolitecnicos[politecnico.sigla] = politecnico._id;
            $("#politecnicos").append('<option value="' + politecnico.sigla + '">' + politecnico.nome + '</option>');
        });
        globalUniversidadeSelecionadaId = politecnicos[0]._id
        myMap()
    })
}

$("#buttonChangeCordenadas").click(function() {
    try {
        var cords = document.getElementById("inputCordenadas").value.replace(/ /g, '');
        var splitedCords = cords.split(",");
        if (splitedCords.length == 2 & isNumeric(splitedCords[0]) & isNumeric(splitedCords[1]) & splitedCords[0] <= 89 & splitedCords[0] >= -89 & splitedCords[1] <= 179 & splitedCords[1] <= 179) {
            changeMarkerPos(parseFloat(splitedCords[0]), parseFloat(splitedCords[1]));
        } else {
            alert("Cordenadas inválidas!");
        }
    } catch (error) {
        alert("Cordenadas inválidas!");
    }
});

function myMap() {
    if (globalUniversidadeSelecionadaId) {
        $.get(apiBaseUrl + "/contactos/coordenadas/universidadeid/" + globalUniversidadeSelecionadaId, (data) => {
            var auxCoordinates = data.valor.split(", ");
            var coordinates;
            if (!isNaN(auxCoordinates[0]) && !isNaN(auxCoordinates[1])) {
                coordinates = { lat: parseFloat(auxCoordinates[0]), lng: parseFloat(auxCoordinates[1]) };
                $("#inputCordenadas").val(auxCoordinates[0] + ", " + auxCoordinates[1]);
            } else {
                coordinates = { lat: 40.64654781049706, lng: -7.92019846053499 };
                $("#inputCordenadas").val("40.64654781049706" + ", " + "-7.92019846053499")
            }
            const map = new google.maps.Map(document.getElementById("googleMap"), {
                zoom: 17,
                center: coordinates,
            });

            var marker = new google.maps.Marker({
                position: coordinates,
                map: map,
            });
            map.addListener("click", (mapsMouseEvent) => {
                globalLatLengClick = mapsMouseEvent.latLng;
                marker.setPosition(globalLatLengClick);
                $("#inputCordenadas").val(globalLatLengClick.lat() + ", " + globalLatLengClick.lng());
            })
        })
    }
}

function changeMarkerPos(lat, lon) {
    try {
        myLatLng = new google.maps.LatLng(lat, lon)
        const map = new google.maps.Map(document.getElementById("googleMap"), {
            zoom: 17,
            center: myLatLng,
        });
        const marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
        });
    } catch (error) {
        alert("Cordenadas inválidas!");
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}