var map;
var bounds;
var geocoder;
var marker;
var infowindow;
var autocomplete;

var array_infowindow =[];
var test;
$(document).ready(function () {
    map = setMap();
    setStyle();
    addListeners();
    buildBaseMarkers();
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
    var input = /** @type {HTMLInputElement} */(document.getElementById('map_adress_input'));
    autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        codeAddress();
    });
    return map;
}

function addListeners() {
    $('#btn_add_Member').click(function () {
        setListenerToAddMember();
    });
    $('#btn_close_infowindows').click(function() {
        var lg = array_infowindow.length;
        for (i=0;i<lg;i++) {
            array_infowindow[i].close();
        }
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
                }
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
            test = data.member;
            console.log(data);
            if(data.result == 'success' ){
                $('#add_member_form_container').dialog('close');
                member = data.member;
                lbm_members.push(member);
                addMarker(member);
                marker.setMap(null);
                $('body').toastmessage('showSuccessToast', "Ajout réussi");
            }else {
                $('body').toastmessage('showErrorToast', data.message);
            }
        });

}

function buildBaseMarkers(){
    console.log('start building marker');
    if(lbm_members != null ) {
       var lg = lbm_members.length;
       for(i=0;i<lg;i++) {
           var member = lbm_members[i];
           var gmapMarker =  addMarker(member);
           member['gmap'] = gmapMarker;
       }
    }
}

function addMarker(member) {
    var myLatLng = new google.maps.LatLng(member.lat, member.lng);
    bounds.extend(myLatLng);
    var marker = new google.maps.Marker({
        map: map,
        position: myLatLng,
        icon: markerImageUrl,
        title: member.pseudo,
        labelContent: member.pseudo,
    });
    marker.lbmId = member.id;
    google.maps.event.addListener(marker, 'click', function () {
        //map.setCenter(marker.getPosition());
        //smoothZoom(map, 14, map.getZoom());
        marker.infowindow.open(map,marker);
    });
    infowindow = new google.maps.InfoWindow({
        content: '<div class="infowindow_content"><b>'+member.pseudo+'</b></div>'
    });
    array_infowindow.push(infowindow);
    marker.infowindow = infowindow;
    //infowindow.open(map,marker);
    return marker;
}

// the smooth zoom function
function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}


function zoomOnMarker(markerId) {
    var lg = lbm_members.length;
    for (i=0;i<lg;i++) {
       if(lbm_members[i].id == markerId){
           var member = lbm_members[i];
           var marker = member['gmap'];
           map.setCenter(marker.getPosition());
           marker.infowindow.open(map,marker);
       }
    }
}

function checkCodePostal(cp)
{
    // on test si c'est un code postal francais.
    return cp.match(/^((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}$/);
}

function codeAddress() {
    /* Récupération de la valeur de l'adresse saisie */
    var address = $('#map_adress_input').val();

    if(checkCodePostal(address))
    {
        // si c'est un code postal, on modifie en rajoutant France derrière.
    }

    /* Appel au service de geocodage avec l'adresse en paramètre */
    geocoder.geocode( { 'address': address,region:'fr' }, function(results, status) {
        /* Si l'adresse a pu être géolocalisée */
        if (status == google.maps.GeocoderStatus.OK) {
            /* Récupération de sa latitude et de sa longitude */
            var lat = results[0].geometry.location.lat();
            var lng =  results[0].geometry.location.lng();

            map.setCenter(results[0].geometry.location); // on centre la carte sur la recherche.
            map.setZoom(14);
            /* TEST GEOCODE */
            /*
             map.setCenter(results[0].geometry.location);
             var marker = new google.maps.Marker({
             map: map,
             position: results[0].geometry.location
             });
                */
            //DoSearch({'lat':lat,'lng':lng});
        }else
        {
            alert('Cette ville n\'a pas été trouvée');
        }
    });
}



