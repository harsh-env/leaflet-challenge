// Use this link to get the GeoJSON data.

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(link).then(function(data) {
  // console.log(data)
  createFeatures(data.features);
})

d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data2) {
  tectonicPlates = L.geoJSON(data2.features, {
      color: "orange"
      
  })
  console.log(tectonicPlates)
});


// Function that changes marker size depending on the magnitute values
function markerSize(mag){
    return mag * 4
}

// Function that gets colors for circle markers
function getColors(d) {
    // if (d < 1){
      if (d > 90){
        return "#a84a4a"
      }
      else if ( d >= 70){
        return "#f6a6a6"
      }
      else if (d >= 50){
        return "#ff9400"
      }
      else if (d >= 30){
        return "#ffc000"
      }
      else if (d >= 10){
        return "#ffff00"
      }
      else {
        return "#79eb00"
      }
  };

  // create a function that creates markers
function createCircleMarker(feature, latlng){

    // Change the values of these options to change the symbol's appearance
      var markerOptions = {
        radius: markerSize(feature.properties.mag),
        // fillColor: getColors(feature.properties.mag),
        fillColor: getColors(feature.geometry.coordinates[2]),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
    //   console.log(latlng)
      return L.circleMarker(latlng, markerOptions);
    };

// Func that adds circles and popups to layer
function createFeatures(earthquakeData) {
    console.log(earthquakeData)
    // Creating a GeoJSON layer with the retrieved data
    function onEachFeature(feature, layer){
      layer.bindPopup("Location: " + feature.properties.place + "<br>" 
      + "Date: " + new Date(feature.properties.time) + "<br>" + "Magnitude: " + feature.properties.mag);
    }
    
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: createCircleMarker
    });
  
    // Call earthquakes layer to the createMap function
    createMap(earthquakes, tectonicPlates);
  }
    

    //create legends and add to the map
  
    // create the function that cretes the map and adds the layers to the map
function createMap(earthquakes, tectonicPlates) {
 
  // Define streetmap and darkmap layers
  var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/outdoors-v11',
    accessToken: api_key
  });

  var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: 'mapbox/light-v10',
  accessToken: api_key
  });

  // var grayscale = L.tileLayer.grayscale('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>", 
  //  maxZoom: 18,
  //  });

  var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/satellite-v9',
    accessToken: api_key
 })

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": light,
    "Outdoors": outdoors,
    "Satellite" : satellite,
    // "Grayscale" : grayscale
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicPlates
  };

  var map = L.map('map', {
    center: [37, -95.71],
    zoom: 4
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  let legend = L.control({
    position: "bottomright" 
  });

  legend.onAdd = function(){
    // create div for the legend
    var div = L.DomUtil.create('div', 'info legend'),
        labels = ['<strong>Depth of EarthQuake</strong>'];
        // labels = [];
        grades = [-10, 10, 30, 50, 70, 90];
        var colors = [
            "#79eb00",
            "#ffff00",
            "#ffc000",
            "#ff9400",
            "#f6a6a6",
            "#a84a4a"
          ];
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            // labels.push("<li style=\background-color: " + colors[i] + "'></li>"+ grades[i] +(grades[i + 1]) ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            labels.push("<li style= \'background: " + colors[i] + "'></li> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "</br>" : "+"));
        }
        // return div;
        div.innerHTML = labels.join('<br')
        return div;
    };
    legend.addTo(map)
    
}

