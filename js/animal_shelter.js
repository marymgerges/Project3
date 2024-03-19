// Define the path to the local JSON file containing animal data
var jsonFilePath = "data/animal_data.json";

// Use d3.json() to read the local JSON file
d3.json(jsonFilePath).then(function (data) {
  createMap(L.geoJSON(data, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>Animal Type: ${feature.properties.animal_type}</h3><hr><p>Primary Color: ${feature.properties.primary_color}</p><p>Sex: ${feature.properties.sex}</p><p>Intake Date: ${feature.properties.intake_date}</p><p>Outcome Type: ${feature.properties.outcome_type}</p>`);
    },
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng);
    }
  }));
});

// Function to create map
function createMap(animalLayer) {
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the bikeStations layer.
  let overlayMaps = {
    "Animal Layer": animalLayer
  };

  var myMap = L.map("map", {
    center: [33.77, -118.19], // Adjust center to match your data
    zoom: 12, // Adjust zoom level as needed
    layers: [streetmap, animalLayer]
  });

  // Legend specifics
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (createMap) {

    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<i style="background: #8cff75"></i><span>-10-10</span><br>';
    div.innerHTML += '<i style="background: #dbfd6c"></i><span>10-30</span><br>';
    div.innerHTML += '<i style="background: #f1c232"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: #f1b032"></i><span>50-70</span><br>';
    div.innerHTML += '<i style="background: #f17241"></i><span>70-90</span><br>';
    div.innerHTML += '<i style="background: #f82020"></i><span>90+</span><br>';

    return div;
  };

  legend.addTo(myMap);

}

function createMarkers(response) {

  // Pull .
  let animals = crossing;

  // Initialize an array to hold the .
  let animalLayer = [];

  // Loop through the  array.
  for (let index = 0; index < stations.length; index++) {
    let station = stations[index];

    // For each , create a marker, and bind a popup with the .
    let animalLayer = L.marker([geopoint.lat, geopoint.lon])
      .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "</h3>");

    // Add the marker to the animalLayer array.
    animalLayer.push(animalLayer);
  }

  // Create a layer group that's made from the animal layer array, and pass it to the createMap function.
  createMap(L.layerGroup(animalLayer));
}


// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(createMarkers);
