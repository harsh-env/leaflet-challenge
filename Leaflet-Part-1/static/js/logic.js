// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
    center: [37, -95.71],
    zoom: 5
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
// id: 'mapbox/streets-v11',
id: 'mapbox/light-v10',
accessToken: api_key
}).addTo(map);
  
  // Use this link to get the GeoJSON data.

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Function that changes marker size depending on the magnitute values
function markerSize(mag){
    return mag * 4
}

// Function that gets colors for circle markers
function getColors(d) {
    if (d < 1){
      return "#B7DF5F"
    }
    else if ( d < 2){
      return "#DCED11"
    }
    else if (d < 3){
      return "#EDD911"
    }
    else if (d < 4){
      return "#EDB411"
    }
    else if (d < 5 ){
      return "#ED7211"
    }
    else {
      return "#ED4311"
    }
  };

  // create a function that creates markers
function createCircleMarker(feature, latlng){

    // Change the values of these options to change the symbol's appearance
      var markerOptions = {
        radius: markerSize(feature.properties.mag),
        fillColor: getColors(feature.properties.mag),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
    //   console.log(latlng)
      return L.circleMarker(latlng, markerOptions);
    };


d3.json(link).then(function(data) {
    console.log(data)
    // Creating a GeoJSON layer with the retrieved data
    var earthquakes = data.features

    // console.log(earthquakes)
  
  // loop through the data to create markers and popup
    earthquakes.forEach(function(result){
    //console.log(result.properties)
    L.geoJSON(result,{
      pointToLayer: createCircleMarker,
      
      // add popups to the circle markers to display data
    }).bindPopup("Date: " + new Date(result.properties.time) + "<br>Place: " + result.properties.place + "<br>Magnitude: " + result.properties.mag
    + "<br>Depth: " + result.geometry.coordinates[2]).addTo(map)
      
    });

    //create legends and add to the map
  var legend = L.control({position: "bottomright" });

  legend.onAdd = function(){
    // create div for the legend
    var div = L.DomUtil.create('div', 'info legend'),
        labels = ['<strong>Magnitude</strong>'];
        grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#B7DF5F",
            "#DCED11",
            "#EDD911",
            "#EDB411",
            "#ED7211",
            "#ED4311"
          ];
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            labels.push(
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1 ] ? '&ndash;' + grades[i + 1] + '<br>' : '+'));
        }
        // return div;
        div.innerHTML = labels.join('<br')
        return div;
    };
    legend.addTo(map)
    
});
