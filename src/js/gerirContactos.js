var apiBaseUrl, globalContactos, globalLatLengClick, globalUniversidadeSelecionadaId;
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

function inputChanged(contador) {
    if ($("#inputTitulo" + contador).val() != globalContactos[contador].chave || $("#inputdescricao" + contador).val() != globalContactos[contador].valor) {
        $("#botaoGuardar" + contador).removeClass("hidden")
    } else {
        $("#botaoGuardar" + contador).addClass("hidden")
    }

}

function guardarContacto(contactoId, contador) {
    $.get(apiBaseUrl + "/contactos/id/" + contactoId, (contacto) => {
        contacto.chave = $("#inputTitulo" + contador).val();
        contacto.valor = $("#inputdescricao" + contador).val();
        $.ajax({
            type: 'PATCH',
            url: apiBaseUrl + '/contactos/alterar',
            data: JSON.stringify(contacto),
            processData: false,
            contentType: 'application/json',
            success: function() {
                var sigla = $('select[name=selector] option').filter(':selected').val()
                idUniversidade = globalPolitecnicos[sigla]
                getContactos(idUniversidade);
                $(".success").alert('close')
                $(".error").alert('close')
                $(".warning").alert('close')
                $("#alerts").append(
                    '<div class="success alert alert-success alert-dismissible fade fixed" role="alert">' +
                    'Contacto guardado com sucesso!' +
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
                    'Ocurreu algum erro a tentar guardar o contacto. Por favor tente mais tarde.' +
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

function eliminarContacto(contactoId) {
    $.get(apiBaseUrl + "/contactos/id/" + contactoId, (contacto) => {
        var confirmacao = confirm("Tem a certeza de que quer eliminar o contacto \"" + contacto.chave + ": " + contacto.valor + "\"?");
        if (confirmacao) {
            $.ajax({
                type: 'DELETE',
                url: apiBaseUrl + '/contactos/eliminar/' + contactoId,
                data: null,
                processData: false,
                contentType: 'application/json',
                success: function() {
                    var sigla = $('select[name=selector] option').filter(':selected').val()
                    var idUniversidade = globalPolitecnicos[sigla]
                    getContactos(idUniversidade);
                    $(".success").alert('close')
                    $(".error").alert('close')
                    $(".warning").alert('close')
                    $("#alerts").append(
                        '<div class="success alert alert-success alert-dismissible fade fixed" role="alert">' +
                        'Contacto eliminado com sucesso!' +
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
                        'Ocurreu algum erro a tentar eliminar o contacto. Por favor tente mais tarde.' +
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

function adicionarContacto(contador) {
    var chave = $("#inputTitulo" + contador).val();
    var valor = $("#inputdescricao" + contador).val();
    $.get(apiBaseUrl + "/contactos/chavevalor?chave=" + chave + "&valor=" + valor, (contacto) => {
        if (contacto.length != 0) {
            var sigla = $('select[name=selector] option').filter(':selected').val()
            $(".success").alert('close')
            $(".error").alert('close')
            $(".warning").alert('close')
            if (sigla == contacto.universidade.sigla) {
                $("#alerts").append(
                    '<div class="warning alert alert-warning alert-dismissible fade fixed" role="alert">' +
                    'O contacto que está a tentar adicionar já existe nesta universidade!' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</div>'
                );
            } else {
                $("#alerts").append(
                    '<div class="warning alert alert-warning alert-dismissible fade fixed" role="alert">' +
                    'O contacto que está a tentar adicionar já existe na universidade: ' + contacto.universidade.sigla +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</div>'
                );
            }
            $(".warning").addClass("show");
        }
    }).fail(function(data) {
        if (data.status == 404) {
            var sigla = $('select[name=selector] option').filter(':selected').val()
            var idUniversidade = globalPolitecnicos[sigla]
            $.get(apiBaseUrl + "/universidades/id/" + idUniversidade, (universidade) => {
                var contacto = {
                    chave: chave,
                    valor: valor,
                    ordem: contador,
                    universidade: universidade
                }

                $.ajax({
                    type: 'POST',
                    url: apiBaseUrl + '/contactos/novo',
                    data: JSON.stringify(contacto),
                    processData: false,
                    contentType: 'application/json',
                    success: function() {
                        getContactos(idUniversidade);
                        $(".success").alert('close')
                        $(".error").alert('close')
                        $(".warning").alert('close')
                        $("#alerts").append(
                            '<div class="success alert alert-success alert-dismissible fade fixed" role="alert">' +
                            'Contacto adicionado com sucesso!' +
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
                            'Ocurreu algum erro a tentar adicionar o contacto. Por favor tente mais tarde.' +
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                            '<span aria-hidden="true">&times;</span>' +
                            '</button>' +
                            '</div>'
                        );
                        $(".error").addClass("show");
                    }
                });
            }).fail(function() {
                $(".success").alert('close')
                $(".error").alert('close')
                $(".warning").alert('close')
                $("#alerts").append(
                    '<div class="error alert alert-danger alert-dismissible fade fixed" role="alert">' +
                    'Ocurreu algum erro a tentar adicionar o contacto. Por favor tente mais tarde.' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</div>'
                );
                $(".error").addClass("show");
            })
        } else {
            $(".success").alert('close')
            $(".error").alert('close')
            $(".warning").alert('close')
            $("#alerts").append(
                '<div class="error alert alert-danger alert-dismissible fade fixed" role="alert">' +
                'Ocurreu algum erro a tentar adicionar o contacto. Por favor tente mais tarde.' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>'
            );
            $(".error").addClass("show");
        }
    })
}

function getContactos(idUniversidade) {
    if (!idUniversidade) {
        if (!globalUniversidadeSelecionadaId) {
            if (globalPolitecnicos.length == 0) {
                return;
            }
            var sigla = $('select[name=selector] option').filter(':selected').val()
            idUniversidade = globalPolitecnicos[sigla]
        } else {
            idUniversidade = globalUniversidadeSelecionadaId
        }
    }
    $.get(apiBaseUrl + "/contactos/morada/universidadeid/" + idUniversidade, (morada) => {
        $("#inlineFormInputName2").val(morada.valor);
        $.get(apiBaseUrl + "/contactos/universidadeid/" + idUniversidade, (contactos) => {
            let contador = 0;
            globalContactos = [];
            $("#contactoCampos").empty();
            contactos.forEach(contacto => {
                if (contacto.ordem != 0) {
                    $("#contactoCampos").append(
                        '<div id="itemContacto' + contador + '" class="itemContacto">' +
                        '<div id="divInputTitulo' + contador + '" class="divInputTitulo">' +
                        '<label id="labelInputTitulo' + contador + '" for="inputtitulo">Título</label>' +
                        '<input id="inputTitulo' + contador + '" onkeyup="inputChanged(' + contador + ')" type="text" value="' + contacto.chave + '" class="form-control" placeholder="Título do novo contacto">' +
                        '</div>' +
                        '<div id="divInputDescricao' + contador + '" class="divInputDescricao">' +
                        '<label id="labelInputdescricao' + contador + '" for="inputdescricao">Descrição</label>' +
                        '<input id="inputdescricao' + contador + '" onkeyup="inputChanged(' + contador + ')" type="text" value="' + contacto.valor + '" class="form-control" placeholder="Descrição do novo contacto">' +
                        '</div>' +
                        '<div id="divBotoes' + contador + '" class="divBotoes">' +
                        '<button id="botaoGuardar' + contador + '" onclick="guardarContacto(\'' + contacto._id + '\', ' + contador + ')" type="button" class="btn btn-info hidden">Guardar</button>' +
                        '<button id="botaoEliminar' + contador + '" onclick="eliminarContacto(\'' + contacto._id + '\')" type="button" class="btn btn-danger">Eliminar</button>' +
                        '</div>' +
                        '</div>'
                    )
                    globalContactos[contador] = contacto;
                    contador += 1;
                }
            });
            $("#contactoCampos").append(
                '<div id="itemContacto' + contador + '" class="itemContacto">' +
                '<div id="divInputTitulo' + contador + '" class="divInputTitulo">' +
                '<label id="labelInputTitulo' + contador + '" for="inputtitulo">Título</label>' +
                '<input id="inputTitulo' + contador + '" type="text" value="" class="form-control" placeholder="Título do novo contacto">' +
                '</div>' +
                '<div id="divInputDescricao' + contador + '" class="divInputDescricao">' +
                '<label id="labelInputdescricao' + contador + '" for="inputdescricao">Descrição</label>' +
                '<input id="inputdescricao' + contador + '" type="text" value="" class="form-control" placeholder="Descrição do novo contacto">' +
                '</div>' +
                '<div id="divBotoes' + contador + '" class="divBotoes">' +
                '<button id="botaoAdicionar" onclick="adicionarContacto(' + contador + ')" type="button" class="btn btn-info">Adicionar</button>' +
                '</div>' +
                '</div>'
            )
        })
    })
}

function onUnivesityChange() {
    var sigla = $('select[name=selector] option').filter(':selected').val()
    globalUniversidadeSelecionadaId = globalPolitecnicos[sigla]
    myMap()
    getContactos(globalUniversidadeSelecionadaId);
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
        getContactos(globalUniversidadeSelecionadaId);
    })
}

function guardarMorada() {
    var sigla = $('select[name=selector] option').filter(':selected').val()
    idUniversidade = globalPolitecnicos[sigla]
    var newMorada = $("#inlineFormInputName2").val();
    $.get(apiBaseUrl + "/contactos/morada/universidadeid/" + idUniversidade, (morada) => {
        console.log(newMorada);
        morada.valor = newMorada;
        $.ajax({
            type: 'PATCH',
            url: apiBaseUrl + '/contactos/alterar',
            data: JSON.stringify(morada),
            processData: false,
            contentType: 'application/json',
            success: function() {
                getContactos(idUniversidade);
                $(".success").alert('close')
                $(".error").alert('close')
                $(".warning").alert('close')
                $("#alerts").append(
                    '<div class="success alert alert-success alert-dismissible fade fixed" role="alert">' +
                    'Morada guardada com sucesso!' +
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
                    'Ocurreu algum erro a tentar guardar a morada. Por favor tente mais tarde.' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</div>'
                );
                $(".error").addClass("show");
            }
        });
    }).fail(function() {
        $(".success").alert('close')
        $(".error").alert('close')
        $(".warning").alert('close')
        $("#alerts").append(
            '<div class="error alert alert-danger alert-dismissible fade fixed" role="alert">' +
            'Ocurreu algum erro a tentar guardar a morada. Por favor tente mais tarde.' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>'
        );
        $(".error").addClass("show");
    })
}

$("#buttonChangeCordenadas").click(function() {
    try {
        var cords = document.getElementById("inputCordenadas").value.replace(/ /g, '');
        var splitedCords = cords.split(",");
        if (splitedCords.length == 2 & isNumeric(splitedCords[0]) & isNumeric(splitedCords[1]) & splitedCords[0] <= 89 & splitedCords[0] >= -89 & splitedCords[1] <= 179 & splitedCords[1] <= 179) {
            changeMarkerPos(parseFloat(splitedCords[0]), parseFloat(splitedCords[1]));
            var sigla = $('select[name=selector] option').filter(':selected').val()
            idUniversidade = globalPolitecnicos[sigla]
            var newCoordenadas = $("#inputCordenadas").val();
            $.get(apiBaseUrl + "/contactos/coordenadas/universidadeid/" + idUniversidade, (coordenadas) => {
                coordenadas.valor = newCoordenadas;
                $.ajax({
                    type: 'PATCH',
                    url: apiBaseUrl + '/contactos/alterar',
                    data: JSON.stringify(coordenadas),
                    processData: false,
                    contentType: 'application/json',
                    success: function() {
                        getContactos(idUniversidade);
                        $(".success").alert('close')
                        $(".error").alert('close')
                        $(".warning").alert('close')
                        $("#alerts").append(
                            '<div class="success alert alert-success alert-dismissible fade fixed" role="alert">' +
                            'Coordenadas guardadas com sucesso!' +
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
                            'Ocurreu algum erro a tentar guardar as coordenadas. Por favor tente mais tarde.' +
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                            '<span aria-hidden="true">&times;</span>' +
                            '</button>' +
                            '</div>'
                        );
                        $(".error").addClass("show");
                    }
                });
            })
        } else {
            $(".success").alert('close')
            $(".error").alert('close')
            $(".warning").alert('close')
            $("#alerts").append(
                '<div class="error alert alert-danger alert-dismissible fade fixed" role="alert">' +
                'Coordenadas inválidas.' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>'
            );
            $(".error").addClass("show");
        }
    } catch (error) {
        $(".success").alert('close')
        $(".error").alert('close')
        $(".warning").alert('close')
        $("#alerts").append(
            '<div class="error alert alert-danger alert-dismissible fade fixed" role="alert">' +
            'Coordenadas inválidas.' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>'
        );
        $(".error").addClass("show");
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
        $(".success").alert('close')
        $(".error").alert('close')
        $(".warning").alert('close')
        $("#alerts").append(
            '<div class="error alert alert-danger alert-dismissible fade fixed" role="alert">' +
            'Coordenadas inválidas.' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>'
        );
        $(".error").addClass("show");
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}