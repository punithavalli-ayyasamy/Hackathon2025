// Function to show only the selected tab's section
function showSection(sectionId, event) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  // Remove active class from all buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected section and mark button as active
  document.getElementById(sectionId).classList.add("active");
  event.target.classList.add("active");
}

// Toggle individual FAQ answer
function toggleAnswer(button) {
  const answer = button.nextElementSibling;
  answer.classList.toggle("open");
}

// Expand all FAQ answers
function expandAll() {
  document.querySelectorAll(".faq-answer").forEach((answer) => {
    answer.classList.add("open");
  });
}

// Collapse all FAQ answers
function collapseAll() {
  document.querySelectorAll(".faq-answer").forEach((answer) => {
    answer.classList.remove("open");
  });
}
