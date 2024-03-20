function createMap(animalStations) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
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
  
  function createMarkers(response) {
  
    // Pull the "stations" property from response.data.
    let animals = response;
    console.log(animals);
  
    // Initialize an array to hold the bike markers.
    let animalMarkers = [];
    let marker_limit = 100;
    // To run all markers:
    // let marker_limit = animals.length;
  
    // Loop through the stations array.
    for (let index = 0; index < marker_limit; index++) {
      let animal = animals[index];
  
      // For each station, create a marker, and bind a popup with the station's name.
      let animalMarker = L.marker([animal.geopoint.lat, animal.geopoint.lon])
        .bindPopup("<h3>" + animal.animal_type + "<h3><h3>Sex: " + animal.sex + "</h3>");
  
      // Add the marker to the bikeMarkers array.
      animalMarkers.push(animalMarker);
    }
  
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(animalMarkers));
  }
  
  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  d3.json("../data/animal_data.json").then(createMarkers);