// Function to show the corresponding section when a navigation link is clicked
function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");

  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  document.getElementById(sectionId).classList.remove("hidden");
}

// Form validation
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear previous error messages
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    let valid = true;

    // Validate name
    if (name === "") {
      document.getElementById("nameError").textContent = "Name is required.";
      valid = false;
    }

    // Validate email
    if (email === "") {
      document.getElementById("emailError").textContent = "Email is required.";
      valid = false;
    } else if (emailRegex.test(email)) {
      document.getElementById("emailError").textContent =
        "Please enter a valid email.";
      valid = false;
    }

    // If the form is valid, submit it
    if (valid) {
      alert("Form submitted successfully!");
      // You can add form submission logic here
    }
  });

const emailRegex = new RegExp(
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
);
