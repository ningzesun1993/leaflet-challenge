// set up the background of grayscale, satellite and outdoors background
let graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibmluZ3plc3VuMTk5MyIsImEiOiJjazM4MmJjbnIwNTB6M21rejF3a2dxNjB0In0.OcvghXxUcCtEVuCspVO02A");

let satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibmluZ3plc3VuMTk5MyIsImEiOiJjazM4MmJjbnIwNTB6M21rejF3a2dxNjB0In0.OcvghXxUcCtEVuCspVO02A");

let outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibmluZ3plc3VuMTk5MyIsImEiOiJjazM4MmJjbnIwNTB6M21rejF3a2dxNjB0In0.OcvghXxUcCtEVuCspVO02A");

// set up and put map object into L.
let map = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [graymap, satellitemap, outdoors]
});

graymap.addTo(map);

// layers for earthquakes.
let earthquakes = new L.LayerGroup();

// base layers
let baseMaps = {
  Satellite: satellitemap,
  Grayscale: graymap,
  Outdoors: outdoors
};


// control which layers are visible.
L.control.layers(baseMaps).addTo(map);

// get earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {


  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Define the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#ea2c2c";
      case magnitude > 4:
        return "#ea822c";
      case magnitude > 3:
        return "#ee9c00";
      case magnitude > 2:
        return "#eecc00";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }

  // define the radius of the earthquake marker based on its magnitude.

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }

  // add GeoJSON layer to the map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);


  let legend = L.control({
    position: "bottomright"
  });


  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

    let grades = [0, 1, 2, 3, 4, 5];
    let colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];


    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(map);
});
