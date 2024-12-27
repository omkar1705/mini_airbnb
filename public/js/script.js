// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()




// Access the stars
let stars = document.getElementsByClassName("star");
let output = document.getElementById("output");
let ratingInput = document.getElementById("ratingInput"); // Hidden input field

// Function to update rating
function gfg(n) {
  remove();
  for (let i = 0; i < n; i++) {
    let cls;
    if (n == 1) cls = "one";
    else if (n == 2) cls = "two";
    else if (n == 3) cls = "three";
    else if (n == 4) cls = "four";
    else if (n == 5) cls = "five";
    stars[i].className = "star " + cls;
  }
  // Update the output text
  output.innerText = "Rating is: " + n + "/5";

  // Update the hidden input field with the selected rating
  ratingInput.value = n;
}

// To remove the pre-applied styling
function remove() {
  for (let i = 0; i < 5; i++) {
    stars[i].className = "star";
  }
}


document.addEventListener("DOMContentLoaded", () => {
  // Select all elements with the 'rating' class
  const ratings = document.querySelectorAll(".rating");

  ratings.forEach((ratingElement) => {
    const ratingValue = parseFloat(ratingElement.getAttribute("data-rating"));

    // Generate stars for each rating element (left to right)
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.innerHTML = "★"; // Using the star symbol

      // Check if the star should be filled, half-filled, or empty
      if (ratingValue >= i) {
        star.classList.add("filled"); // Full star
      } else if (ratingValue + 0.5 >= i) {
        star.classList.add("filled");
        star.style.clipPath = "inset(0 50% 0 0)"; // Half star effect
      }

      ratingElement.appendChild(star); // Append the star in order
    }
  });
});

