var map;
var bounds;
var geocoder;
var marker;

$(document).ready(function () {
    map = setMap();
    setStyle();
    addListeners();
});


function setStyle() {
    $("input[type=submit], a, button")
        .button()
        .click(function (event) {
        });

    $("#tabs").tabs();
};

function setMap() {
    var myLatlng = new google.maps.LatLng(45.74931859146165, 4.8442840576171875);
    var myOptions = {
        zoom: 11,
        scrollwheel: true,
        center: myLatlng,
        scaleControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    geocoder = new google.maps.Geocoder();
    bounds = new google.maps.LatLngBounds();


    return map;
}

function addListeners() {
    $('#btn_add_Member').click(function () {
        setListenerToAddMember();
    });
}

function setListenerToAddMember() {

    $('#add_member_instructions').dialog({
        modal: true,
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
            }
        }
    });
    google.maps.event.addListener(map, 'click', function (event) {
        placeMarker(event.latLng);
        console.log(event.latLng);
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
    });
}

function placeMarker(location) {
    if (marker) {

        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            title: 'test',
            map: map
        });
    }

    // afffichage formulaire
    setTimeout(function () {
        $('#add_member_form_container').dialog({
            modal: true,
            buttons: {
                "Replacer le point": function () {
                    $(this).dialog("close");
                },
                "Valider": function () {
                    addMemberFormValidation($(this));
                },
            }
        });
    }, 500);
}


// validation du formulaire.
function addMemberFormValidation($form) {

    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    $form.find('input[name="lng"]').val(lng);
    $form.find('input[name="lat"]').val(lat);

    var data_serialized = $('#add_member_form').serialize();
    $.ajax({
        url: "member/add",
        data: data_serialized,
        type: "POST",
        dataType: "json"

    }).done(function (data) {
            if (console && console.log) {
                console.log("Sample of data:", data.slice(0, 100));
            }
        });
}
/*
function addMarker(lat, lng, id) {
    var myLatLng = new google.maps.LatLng(lat, lng);
    bounds.extend(myLatLng);
    var marker = new google.maps.Marker({
        map: map,
        position: myLatLng,
        icon: 'img/map/moreno_marker.png'
    });
    marker.morenoid = id;
    salons_markers.push(marker);

    google.maps.event.addListener(marker, 'click', function () {
        map.setZoom(14);
        map.setCenter(marker.getPosition());
        var id = marker.morenoid;
        makeSalonSelection(id);
    });
}
*/
