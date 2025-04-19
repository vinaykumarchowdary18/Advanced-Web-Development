document.addEventListener('DOMContentLoaded', function() {
    const hasVehicleCheckbox = document.getElementById('hasVehicle');
    const vehicleInfoSection = document.getElementById('vehicleInfo');
    
    // Toggle vehicle info based on checkbox
    hasVehicleCheckbox.addEventListener('change', function() {
        vehicleInfoSection.style.display = this.checked ? 'block' : 'none';
    });
    
    // Initialize based on current checkbox state
    vehicleInfoSection.style.display = hasVehicleCheckbox.checked ? 'block' : 'none';
    
    // Form submission
    const form = document.getElementById('profileForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Profile updated successfully!');
        // In a real app, you would send this data to your server
    });
});