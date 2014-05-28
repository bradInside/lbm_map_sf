var map;
var bounds;
var geocoder;
var marker;
var infowindow;

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
        map.setCenter(marker.getPosition());
        smoothZoom(map, 14, map.getZoom());
        marker.infowindow.open(map,marker);
    });
    infowindow = new google.maps.InfoWindow({
        content: '<div id="content"><b>'+member.pseudo+'</b></div>'
    });
    array_infowindow.push(infowindow);
    marker.infowindow = infowindow;
    infowindow.open(map,marker);
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
