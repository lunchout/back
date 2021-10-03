const cors = require('cors');
const request = require('request');
const jwt = require('jsonwebtoken');
const auth = require("./auth");
const validatePrice = require('./validatePrice');

require('dotenv').config();

const app = require('./init').init();
const port = process.env.PORT || 8080;

const corsOptions = {
    origin: app.get('env') === 'production' ? process.env.APP_URL : '*',
    optionsSuccessStatus: 200,
}

app.post('/login', cors(corsOptions), (req, res) => {
    const {username, password} = req.body;
    const users = process.env.APP_USERS.toUpperCase().split(',');
    
    if (!(users.includes(username.toUpperCase()))) res.status(400).send('User not found');
    if (password !== process.env.APP_PASSWORD) res.status(401).send('Incorrect password');

    const user = {username: username.toLowerCase()};

    const token = jwt.sign(
        user,
        process.env.TOKEN_KEY,
        {
            expiresIn: "24h",
        }
    );

    res.send(JSON.stringify({...user, token}));
});

app.post('/restaurants', auth, async (req, res) => {
    const { location, range, cuisines, price } = req.body;

    if (!location) {
        res.status(400).send("Missing argument: location.")
    } else if (!range) {
        res.status(400).send("Missing argument: range (in meters).")
    } else if (!cuisines) {
        res.status(400).send("Missing argument: cuisines (comma separated list of yelp-valid tags for restaurants).")
    } else if (!price) {
        res.status(400).send("Missing argument: price (comma separated list of 1,2,3 and 4).")
    } else if (!(location.hasOwnProperty("longitude") && location.hasOwnProperty("latitude"))) {
        res.status(400).send("Incorrect location. Location must be { longitude : x, latitude : y }.");
    } else if (Number.isNaN(parseInt(range))) {
        res.status(400).send("Incorrect range. Range must be an integer.");
    } else if (!validatePrice(price)) {
        res.status(400).send("Incorrect price. Price must be comma separated list of 1,2,3 and 4.");
    } else {
        let params = "?term=restaurants";

        params += `&latitude=${location.latitude}`;
        params += `&longitude=${location.longitude}`;
        params += `&radius=${range}`;
        params += `&price=${price}`;

        params += '&sort_by=rating';
        params += '&limit=10';
        
        if (cuisines.length) {
            params += '&categories='
            cuisines.forEach((cuis, i) => {
                if (i) params += ',';
                params += cuis.taste;
            });
        }

        request({
            url: `${process.env.YELP_API_URL}/businesses/search${params}`,
            headers: {
                'Authorization': `Bearer ${process.env.YELP_API_KEY}`
            }
        }, (error, stream, yelpRes) => {
            res.status(200).send(yelpRes);
        })
    }
});

app.listen((port), () => {
    console.log(`Welcome to Lunch-Out's API, listening on port ${port}`);
});