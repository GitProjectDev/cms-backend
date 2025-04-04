// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');

  // Check if elements exist to avoid errors
  if (!navToggle || !navMenu) {
    console.error('Navigation toggle or menu not found in the DOM');
    return;
  }

  // Add click event listener to toggle the menu
  navToggle.addEventListener('click', function() {
    navMenu.classList.toggle('show');
    // Update the icon based on menu state
    const icon = navToggle.querySelector('i');
    if (navMenu.classList.contains('show')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times'); // Change to "X" when menu is open
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars'); // Back to hamburger when closed
    }
    console.log('Menu toggled, show class:', navMenu.classList.contains('show'));
  });
});