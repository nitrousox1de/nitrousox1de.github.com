var map;

var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat,myLng);
var myMarker;

var carmenLat = 0;
var carmenLng = 0;
var carmen = new google.maps.LatLng(carmenLat,carmenLng);
var carmenMarker;
var carmenNote;
var carmenFound = false;

var waldoLat = 0;
var waldoLng = 0;
var waldo = new google.maps.LatLng(waldoLat,waldoLng);
var waldoMarker;
var waldoNote;
var waldoFound = false;

var options = {
    zoom: 12,
    center: me,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var infowindow = new google.maps.InfoWindow();
var places;

var request = null;

function init_map(){
    init_ajax_request();
    map = new google.maps.Map(document.getElementById("map_div"), options);
    getLocations();
}

function init_ajax_request(){
    try{
        request = new XMLHttpRequest();
    } catch(ms1){
        try{
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(ms2){
            try{
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(ex){
                request = null;
            }
        }
    }
    if(request == null){
        alert("Error - Ajax not supported");
    }
}

function getLocations(){
    // Initialize your position 
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
            renderMap();
        });
    } else {
        alert("Geolocation not supported!");
    }

    // Initialize Carmen/Waldo location
    if(request != null){
        try{
            request.open("GET","http://messagehub.herokuapp.com/a3.json", false);
            request.send();
        } catch(err) {
            // REMOVE THIS LATER!!! *************
            console.log("404'd");
        } finally {
            if(request.status == 200){
                var parsed = JSON.parse(request.responseText);
                for(var i = 0; i < parsed.length; i++){
                    if(parsed[i]['name'] == 'Waldo'){
                        waldoLat = parsed[i]['loc']['latitude'];
                        waldoLng = parsed[i]['loc']['longitude'];
                        waldoNote = parsed[i]['loc']['note'];
                        waldoFound = true;

                        console.log("Waldo lat: " + waldoLat);
                        console.log("Waldo lng: " + waldoLng);
                        console.log("Waldo note: " + waldoNote);
                    } else {
                        carmenLat = parsed[i]['loc']['latitude'];
                        carmenLng = parsed[i]['loc']['longitude'];
                        carmenNote = parsed[i]['loc']['note'];
                        carmenFound = true;

                        console.log("Carmen lat: " + carmenLat);
                        console.log("Carmen lng: " + carmenLng);
                        console.log("Carmen note: " + carmenNote);
                    }
                }
            }
        }
    }

    // Initialize MBTA

}

function renderMap(){
    me = new google.maps.LatLng(myLat,myLng);
    map.panTo(me);
    marker = new googlemaps.Marker({
        position: me,
        title: "Your location"
    });
    marker.setMap(map);
    google.maps.event.addListener(marker,'click', function(){
        infowindow.setContent(marker.title);
        infowindow.open(map,marker);
    });

    var myRequest = {
        location: me,
        radius: '500',
        types: ['food']
    };
    service = new google.maps.places.PlacesService(map);
    service.search(myRequest, callback);
}

// Taken from http://code.google.com/apis/maps/documentation/javascript/places.html
function callback(results, status)
{
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        alert("Got places back!");
        places = results;
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}