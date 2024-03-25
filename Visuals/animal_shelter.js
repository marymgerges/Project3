let myMap; // Declare a variable to store the map object

// Function to create the map with layers
function createMap(animalStations) {
  // Remove the existing map if it exists
  if (myMap) {
    myMap.remove();
  }

  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the animalStations layer.
  let overlayMaps = {
    "Animal Stations": animalStations
  };

  // Create the map object with options.
  myMap = L.map("map", {
    center: [33.77, -118.19],
    zoom: 12,
    layers: [streetmap, animalStations]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

// Filter variables
let selectedYear = "all";
let selectedAnimalType = "all";
let selectedSex = "all";

// Function to filter data based on selected filters
function filterData(data) {
  return data.filter(animal => {
    // Filter by year
    if (selectedYear !== "all") {
      const intakeYear = new Date(animal.intake_date).getFullYear().toString();
      if (intakeYear !== selectedYear) return false;
    }
    // Filter by animal type
    if (selectedAnimalType !== "all") {
      if (animal.animal_type !== selectedAnimalType) return false;
    }
    if (selectedSex !== "all") {
      if (animal.sex !== selectedSex) return false;
    }
    return true;
    
  });
}

// Function to populate the select elements with available years, animal types, and sex
function populateFilters(data) {
  const years = new Set();
  const animalTypes = new Set();
  const sexes = new Set();
  data.forEach(animal => {
    years.add(new Date(animal.intake_date).getFullYear().toString());
    animalTypes.add(animal.animal_type);
    sexes.add(animal.sex);
  });



  const yearSelect = document.getElementById("year");
  const animalTypeSelect = document.getElementById("animalType");
  const sexSelect = document.getElementById("sex");


  // Clear existing options
  yearSelect.innerHTML = "<option value='all'>All</option>";
  animalTypeSelect.innerHTML = "<option value='all'>All</option>";
  sexSelect.innerHTML = "<option value='all'>All</option>";


  // Populate options
  years.forEach(year => {
    yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
  });

  animalTypes.forEach(type => {
    animalTypeSelect.innerHTML += `<option value="${type}">${type}</option>`;

  });
  sexes.forEach(sex => {
    sexSelect.innerHTML += `<option value="${sex}">${sex}</option>`;
  });
}

// Function to create markers based on filtered data
function createMarkers(data) {
  // Initialize an array to hold the markers
  let animalMarkers = [];

  // Loop through the data.
  data.forEach(animal => {
    // For each animal, create a marker, and bind a popup with the animal"s information.
    let animalMarker = L.marker([animal.geopoint.lat, animal.geopoint.lon])
      .bindPopup(`<h3>${animal.animal_type}</h3><h3>Sex: ${animal.sex}</h3>`);

    // Add the marker to the animalMarkers array.
    animalMarkers.push(animalMarker);
  });

  // Create a layer group that"s made from the animal markers array, and pass it to the createMap function.
  createMap(L.layerGroup(animalMarkers));
}

// Perform an API call to get the data and populate filters
d3.json("../data/animal_data.json").then(data => {
  populateFilters(data);
  createMarkers(data);
});

// Event listeners to handle filter changes
document.getElementById("year").addEventListener("change", function() {
  selectedYear = this.value;
  d3.json("../data/animal_data.json").then(data => {
    createMarkers(filterData(data));
  });
});

document.getElementById("animalType").addEventListener("change", function() {
  selectedAnimalType = this.value;
  d3.json("../data/animal_data.json").then(data => {
    createMarkers(filterData(data));
  });
});
// Event listener to handle filter change for sex
document.getElementById("sex").addEventListener("change", function() {
  selectedSex = this.value; // Update selected sex
  d3.json("../data/animal_data.json").then(data => {
    createMarkers(filterData(data)); // Apply filtering and recreate markers
  });
});