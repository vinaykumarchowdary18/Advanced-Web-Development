document.addEventListener('DOMContentLoaded', function() {
    // Login/Signup form validation
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            // Basic validation
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                e.preventDefault();
                alert('Please fill in all fields');
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            // Basic validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const phone = document.getElementById('phone').value;
            
            if (!name || !email || !password || !phone) {
                e.preventDefault();
                alert('Please fill in all required fields');
                return;
            }
            
            if (password.length < 6) {
                e.preventDefault();
                alert('Password must be at least 6 characters');
                return;
            }
        });
        
        // Show/hide vehicle fields based on checkbox
        const hasVehicleCheckbox = document.getElementById('hasVehicle');
        const vehicleFields = document.querySelectorAll('.vehicle-info input:not(#hasVehicle)');
        
        hasVehicleCheckbox.addEventListener('change', function() {
            vehicleFields.forEach(field => {
                field.disabled = !this.checked;
                if (!this.checked) {
                    field.value = '';
                }
            });
        });
        
        // Initially disable fields if checkbox isn't checked
        if (!hasVehicleCheckbox.checked) {
            vehicleFields.forEach(field => {
                field.disabled = true;
            });
        }
    }
    
    // Dashboard functionality
    if (document.getElementById('ridesList')) {
        // Simulate loading rides (in a real app, this would be a fetch to your API)
        setTimeout(() => {
            const ridesList = document.getElementById('ridesList');
            ridesList.innerHTML = '';
            
            // Sample ride data
            const sampleRides = [
                {
                    driver: 'John Doe',
                    from: 'Downtown',
                    to: 'Tech Park',
                    date: '2023-06-15',
                    time: '08:30 AM',
                    seats: 3,
                    price: '$12',
                    car: 'Toyota Camry',
                    license: 'ABC123'
                },
                {
                    driver: 'Jane Smith',
                    from: 'University',
                    to: 'Airport',
                    date: '2023-06-16',
                    time: '02:00 PM',
                    seats: 2,
                    price: '$15',
                    car: 'Honda Civic',
                    license: 'XYZ789'
                }
            ];
            
            sampleRides.forEach(ride => {
                const rideCard = document.createElement('div');
                rideCard.className = 'ride-card';
                rideCard.innerHTML = `
                    <div class="ride-header">
                        <div class="ride-driver">
                            <img src="https://ui-avatars.com/api/?name=${ride.driver}&background=random" alt="${ride.driver}">
                            <span>${ride.driver}</span>
                        </div>
                        <div class="ride-price">${ride.price}</div>
                    </div>
                    <div class="ride-details">
                        <div class="ride-route">
                            <p><i class="fas fa-map-marker-alt"></i> ${ride.from}</p>
                            <p><i class="fas fa-arrow-down"></i></p>
                            <p><i class="fas fa-map-marker-alt"></i> ${ride.to}</p>
                        </div>
                        <div class="ride-meta">
                            <div><i class="fas fa-calendar-alt"></i> ${ride.date}</div>
                            <div><i class="fas fa-clock"></i> ${ride.time}</div>
                            <div><i class="fas fa-user-friends"></i> ${ride.seats} seats</div>
                            <div><i class="fas fa-car"></i> ${ride.car} (${ride.license})</div>
                        </div>
                    </div>
                    <div class="ride-actions">
                        <button class="btn-secondary">Request Ride</button>
                    </div>
                `;
                ridesList.appendChild(rideCard);
            });
        }, 1500);
        
        // Search form submission
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // In a real app, this would fetch matching rides from the server
                alert('Search functionality would fetch matching rides in a real implementation');
            });
        }
    }
});