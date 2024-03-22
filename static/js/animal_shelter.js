function createMap(animalStations) {

  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };

  // Create an overlayMaps object to hold the animalStations layer.
  let overlayMaps = {
    "Animal Stations": animalStations
  };

  // Create the map object with options.
  let myMap = L.map("map", {
    center: [33.77, -118.19],
    zoom: 12,
    layers: [streetmap, animalStations]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

// Create a filter W/Animal Type & Sex/Added Code for MarkerCluster.
function createMarkers(response) {

  // Pull the "animalStations" property from response.data.
  let animals = response;
  console.log(animals);

  // Initialize the marker cluster group
  let markers = L.markerClusterGroup();

  // Loop through the stations array.
  for (let index = 0; index < animals.length; index++) {
    let animal = animals[index];

    // For each animalstation, create a marker, and bind a popup with the station's name.
    let animalMarker = L.marker([animal.geopoint.lat, animal.geopoint.lon])
      .bindPopup("<h3>" + animal.animal_type + "<h3><h3>Sex: " + animal.sex + "</h3>");

    // Add the marker to the marker cluster group.
    markers.addLayer(animalMarker);
  }

  // Add the marker cluster group to the map.
  createMap(markers);
}

// Call JSON File
d3.json("static/js/animal_data.json").then(createMarkers);