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

    const coordinates = { lat: 40.64654781049706, lng: -7.92019846053499 };

    const map = new google.maps.Map(document.getElementById("googleMap"), {
        zoom: 17,
        center: coordinates,
    });

    const marker = new google.maps.Marker({
        position: coordinates,
        map: map,
    });
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