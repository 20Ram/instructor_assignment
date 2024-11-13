// Simulated data for instructors with Indian names
const instructors = [
  { id: 1, name: "Arjun Mehta" },
  { id: 2, name: "Riya Patel" },
  { id: 3, name: "Anjali Sharma" },
  { id: 4, name: "Rajesh Gupta" },
  { id: 5, name: "Nisha Rao" },
  { id: 6, name: "Karan Singh" },
  { id: 7, name: "Pooja Joshi" },
  { id: 8, name: "Vikas Verma" },
  { id: 9, name: "Sneha Kapoor" },
  { id: 10, name: "Siddharth Nair" },
  { id: 11, name: "Aditi Deshmukh" },
  { id: 12, name: "Manish Choudhary" },
];

// Load instructors into both dropdowns on page load
window.onload = function () {
  const instructorSelectForBooking = document.getElementById("instructorSelect");
  const instructorSelectForAvailability = document.getElementById("instructorSelectForAvailability");

  instructors.forEach(instructor => {
    const option1 = document.createElement("option");
    option1.value = instructor.id;
    option1.textContent = instructor.name;
    instructorSelectForBooking.appendChild(option1);

    const option2 = option1.cloneNode(true);
    instructorSelectForAvailability.appendChild(option2);
  });

  updateBookedInstructors(); // Initialize booked instructors list on load
};

// Load availability for the selected instructor
function loadAvailability() {
  const instructorId = document.getElementById("instructorSelect").value;
  const availabilityTable = document.getElementById("availabilityTable");

  // Clear the table except for the header row
  availabilityTable.innerHTML = "<tr><th>Date</th><th>Time</th><th>Action</th></tr>";

  // Get saved availability from localStorage
  const savedAvailability = JSON.parse(localStorage.getItem("availability")) || {};

  // Check if the selected instructor has availability
  if (savedAvailability[instructorId]) {
    savedAvailability[instructorId].forEach(slot => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${slot.date}</td>
                <td>${slot.time}</td>
                <td>
                    <button onclick="bookSlot(${instructorId}, '${slot.date}', '${slot.time}')" 
                    ${slot.isBooked ? "disabled" : ""}>
                        ${slot.isBooked ? "Booked" : "Book"}
                    </button>
                </td>
            `;
      availabilityTable.appendChild(row);
    });
  }
}

// Add availability for an instructor
function addAvailability() {
  const instructorId = document.getElementById("instructorSelectForAvailability").value;
  const date = document.getElementById("availableDate").value;
  const time = document.getElementById("availableTime").value;

  if (!instructorId || !date || !time) {
    alert("Please select an instructor, date, and time.");
    return;
  }

  // Get saved availability from localStorage or create a new object
  const availability = JSON.parse(localStorage.getItem("availability")) || {};

  // Add new slot to the selected instructor's availability
  if (!availability[instructorId]) {
    availability[instructorId] = [];
  }
  availability[instructorId].push({ date, time, isBooked: false });

  // Save updated availability back to localStorage
  localStorage.setItem("availability", JSON.stringify(availability));

  alert("Availability added!");
  loadAvailability(); // Refresh the availability table if the instructor is selected
}

// Book a slot for the selected instructor
function bookSlot(instructorId, date, time) {
  const availability = JSON.parse(localStorage.getItem("availability")) || {};

  // Find and update the booking slot
  const instructorAvailability = availability[instructorId];
  const slot = instructorAvailability.find(slot => slot.date === date && slot.time === time);

  if (slot) {
    slot.isBooked = true;
    localStorage.setItem("availability", JSON.stringify(availability)); // Save updated availability
    alert("Booking confirmed!");
    loadAvailability(); // Refresh the availability table
    updateBookedInstructors(); // Update the booked instructors list
  } else {
    alert("Booking slot not found.");
  }
}

// Update the list of booked instructors
function updateBookedInstructors() {
  const bookedInstructorsList = document.getElementById("bookedInstructorsList");
  bookedInstructorsList.innerHTML = ""; // Clear existing list

  const availability = JSON.parse(localStorage.getItem("availability")) || {};

  // Loop through availability and find instructors with booked slots
  instructors.forEach(instructor => {
    const instructorAvailability = availability[instructor.id];

    // Check if instructor has any booked slots
    if (instructorAvailability && instructorAvailability.some(slot => slot.isBooked)) {
      const listItem = document.createElement("li");
      listItem.textContent = instructor.name;
      bookedInstructorsList.appendChild(listItem);
    }
  });
}
