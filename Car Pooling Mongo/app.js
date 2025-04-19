const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();

// ======================
// CONFIGURATION (hardcoded values)
// ======================
const MONGODB_URI = 'mongodb://localhost:27017/carpoolDB';
const SESSION_SECRET = 'your-secret-key-123'; // Change this to a random string
const PORT = 3000;

// ======================
// MIDDLEWARE
// ======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// ======================
// DATABASE CONNECTION
// ======================
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// ======================
// USER MODEL
// ======================
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    vehicle: {
        hasVehicle: { type: Boolean, default: false },
        type: { type: String, default: null },
        seats: { type: Number, default: null },
        licensePlate: { type: String, default: null }
    }
});

const User = mongoose.model('User', userSchema);

// ======================
// STATIC FILES
// ======================
app.use(express.static('public'));

// ======================
// ROUTES
// ======================

// Home route redirect
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Login page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Login handler
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.redirect('/dashboard.html');
        } else {
            res.send(`
                <script>
                    alert('Invalid email or password');
                    window.location.href = '/login.html';
                </script>
            `);
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal server error');
    }
});

// Signup page
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Signup handler
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, hasVehicle, vehicleType, seats, licensePlate } = req.body;

        // Validation
        if (!name || !email || !password || !phone) {
            return res.send(`
                <script>
                    alert('All fields are required');
                    window.location.href = '/signup.html';
                </script>
            `);
        }

        if (password.length < 6) {
            return res.send(`
                <script>
                    alert('Password must be at least 6 characters');
                    window.location.href = '/signup.html';
                </script>
            `);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            vehicle: {
                hasVehicle: hasVehicle === 'on',
                type: hasVehicle === 'on' ? vehicleType : null,
                seats: hasVehicle === 'on' ? parseInt(seats) : null,
                licensePlate: hasVehicle === 'on' ? licensePlate : null
            }
        });

        await newUser.save();
        req.session.user = newUser;
        res.redirect('/dashboard.html');
    } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = 'Error creating account';
        
        if (error.code === 11000) {
            errorMessage = 'Email already in use';
        } else if (error.errors) {
            errorMessage = Object.values(error.errors).map(e => e.message).join(', ');
        }

        res.send(`
            <script>
                alert('${errorMessage.replace(/'/g, "\\'")}');
                window.location.href = '/signup.html';
            </script>
        `);
    }
});

// Dashboard
app.get('/dashboard.html', (req, res) => {
    if (!req.session.user) return res.redirect('/login.html');
    
    fs.readFile(path.join(__dirname, 'public', 'dashboard.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading dashboard.html:', err);
            return res.status(500).send('Internal server error');
        }

        const user = req.session.user;
        let dashboardHtml = data
            .replace(/<%= user.name %>/g, user.name)
            .replace('https://ui-avatars.com/api/?name=<%= user.name %>', `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`);

        if (user.vehicle.hasVehicle) {
            const vehicleHtml = `
                <div class="vehicle-card">
                    <h3>Your Vehicle</h3>
                    <p><strong>Type:</strong> ${user.vehicle.type || 'Not specified'}</p>
                    <p><strong>Seats:</strong> ${user.vehicle.seats || 'Not specified'}</p>
                    <p><strong>License:</strong> ${user.vehicle.licensePlate || 'Not specified'}</p>
                </div>
            `;
            dashboardHtml = dashboardHtml.replace('<!-- Vehicle card would be inserted here -->', vehicleHtml);
        }

        res.send(dashboardHtml);
    });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});