
mapboxgl.accessToken = map_token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinate, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 13 // starting zoom
});

//custom url
const customElement = document.createElement('div');
customElement.className = 'custom-marker';
customElement.style.position = 'relative'; // Allows positioning child elements

// Add the red circular area
const radius = document.createElement('div');
radius.style.width = '100px'; // Adjust the radius size
radius.style.height = '100px';
radius.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; // Semi-transparent red
radius.style.borderRadius = '50%';
radius.style.position = 'absolute';
radius.style.top = '50%';
radius.style.left = '50%';
radius.style.transform = 'translate(-50%, -50%)'; // Center the radius

// Add the image in the center
const image = document.createElement('img');
image.src = `${url}`; // Replace with your image URL
image.style.width = '30px'; // Adjust the image size
image.style.height = '30px';
image.style.borderRadius = '50%'; // Optional: Makes the image circular
image.style.position = 'absolute';
image.style.top = '50%';
image.style.left = '50%';
image.style.transform = 'translate(-50%, -50%)'; // Center the image

// Append the radius and image to the custom element
customElement.appendChild(radius);
customElement.appendChild(image);
//popup marker
const popup = new mapboxgl.Popup({ offset: 20, closeButton: false, })
    .setHTML("<p>Exact location provided after booking<p>");

// Set marker options.
let coordinates = coordinate
const marker = new mapboxgl.Marker({ element: customElement }
).setLngLat(coordinates)
    .addTo(map);


// Show popup on hover
customElement.addEventListener('mouseenter', () => {
    popup.setLngLat(coordinates).addTo(map);
});

// Hide popup when not hovering
customElement.addEventListener('mouseleave', () => {
    popup.remove();
});