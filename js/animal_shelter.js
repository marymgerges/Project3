// Define the path to the local JSON file containing animal data
var jsonFilePath = "data/animal_data.json";

// Use d3.json() to read the local JSON file
d3.json(jsonFilePath).then(function(data) {
  createMap(L.geoJSON(data, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>Animal Type: ${feature.properties.animal_type}</h3><hr><p>Primary Color: ${feature.properties.primary_color}</p><p>Sex: ${feature.properties.sex}</p><p>Intake Date: ${feature.properties.intake_date}</p><p>Outcome Type: ${feature.properties.outcome_type}</p>`);
    },
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng);
    }
  }));
});

// Function to create map
function createMap(animalLayer) {
  var grayscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  var myMap = L.map("map", {
    center: [33.86, -118.17], // Adjust center to match your data
    zoom: 12, // Adjust zoom level as needed
    layers: [grayscale, animalLayer]
  });

  // Add a legend if necessary
}