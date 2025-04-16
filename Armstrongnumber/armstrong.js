var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML file
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/armstrong.html');
});

// Handle form submission
app.post('/submit', function (req, res) {
    var num = parseInt(req.body.num1);
    var temp = num; // Store original number
    var sum = 0;

    if (isNaN(num)) {
        return res.send("Invalid input. Please enter a number.");
    }

    while (num > 0) {
        var rem = num % 10;
        sum += Math.pow(rem, 3);
        num = Math.floor(num / 10);
    }

    if (temp === sum) {
        res.send(temp + " is an Armstrong number.");
    } else {
        res.send(temp + " is not an Armstrong number.");
    }
});

// Start server
app.listen(3008, () => console.log("Server running on http://localhost:3008"));
