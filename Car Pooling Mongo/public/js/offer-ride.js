document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('offerRideForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Ride offer submitted!');
        // In a real app, you would send this data to your server
    });
});