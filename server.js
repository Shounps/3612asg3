// Importing required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Data storage arrays for circuits, results, races, drivers, and constructors
let circuits = [];
let results = [];
let drivers = [];
let constructors = [];

// Attempt to load JSON data from files
try {
    circuits = JSON.parse(fs.readFileSync("./data/circuits.json", 'utf-8'));
    results = JSON.parse(fs.readFileSync("./data/results.json", 'utf-8'));
    races = JSON.parse(fs.readFileSync("./data/races.json", 'utf-8'));
    drivers = JSON.parse(fs.readFileSync('./data/drivers.json', 'utf-8'));
    constructors = JSON.parse(fs.readFileSync('./data/constructors.json', 'utf-8'));

}
catch (err) {
    console.error('Error - could not open data files.', err);
}

// Start the server and log the port it's running on
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

/*--------------------------------------------------Circuits-----------------------------------------*/

// Endpoint to get all circuits
app.get('/api/circuits', (req, res) => {
    res.json(circuits);
});

// Endpoint to get a specific circuit by its ID
app.get('/api/circuits/:id', (req, res) => {
    const circuit = circuits.filter(c => c.circuitId == req.params.id);

    if (circuit) {
        res.json(circuit);
    } else {
        res.status(404).json({ error: 'Circuit id not found' });
    }
});


/*--------------------------------------------------Results-----------------------------------------*/

// Endpoint to get all race results
app.get('/api/results', (req, res) => {
    res.json(results);
});

// Endpoint to get results for a specific race by raceId
app.get('/api/results/race/:raceId', (req, res) => {

    const raceId = parseInt(req.params.raceId, 10);

    const filteredResults = results.filter(result => result.race.id === raceId);

    if (filteredResults.length > 0) {
        res.json(filteredResults);
    } else {
        res.status(404).json({
            error: 'No results found',
            message: `No results found for raceId '${raceId}'.`
        });
    }
});

// Endpoint to get results for a specific season by year
app.get('/api/results/season/:year', (req, res) => {
    const year = parseInt(req.params.year, 10);

    const filteredResults = results.filter(result => result.race.year === year);

    if (filteredResults.length > 0) {
        res.json(filteredResults);
    } else {
        res.status(404).json({
            error: 'No results found',
            message: `No results found for season '${year}'.`
        });
    }
});

/*--------------------------------------------------Races-----------------------------------------*/

// Endpoint to get all races
app.get('/api/races', (req, res) => {
    res.json(races);
});

// Endpoint to get a specific race by its ID
app.get('/api/races/id/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const race = races.find(race => race.id === id);
    if (race) {
        res.json(race);
    } else {
        res.status(404).json({ error: 'Race id not found' });
    }
});

// Endpoint to get all races for a specific season by year
app.get('/api/races/season/:year', (req, res) => {
    const year = parseInt(req.params.year, 10);

    const filteredRaces = races.filter(race => race.year === year);

    if (filteredRaces.length > 0) {
        res.json(filteredRaces);
    } else {
        res.status(404).json({
            error: 'No races found',
            message: `No races found for the season '${year}'.`
        });
    }
});

// Catch-all route for invalid race API endpoints
app.use('/api/races/*', (req, res) => {
    res.status(404).json({
        error: 'Invalid route',
        message: `The route '${req.originalUrl}' does not exist.`
    });
});

/*--------------------------------------------------Drivers-----------------------------------------*/

// Endpoint to get all drivers
app.get('/api/drivers', (req, res) => {
    res.json(drivers);
});

// Endpoint to get a specific driver by their reference (driverRef)
app.get('/api/drivers/:ref', (req, res) => {
    const driver = drivers.find(d => d.driverRef.toLowerCase() === req.params.ref.toLowerCase());
    if (driver) {
        res.json(driver);
    } else {
        res.status(404).json({ error: 'Driver not found' });
    }
});

/*--------------------------------------------------Constructor -----------------------------------------*/

// Endpoint to get all constructors
app.get('/api/constructors', (req, res) => {
    res.json(constructors);
});

// Endpoint to get a specific constructor by their reference (constructorRef)
app.get('/api/constructors/:ref', (req, res) => {
    const constructor = constructors.find((c) => c.constructorRef.toLowerCase() === req.params.ref.toLowerCase());
    if (constructor) {
        res.json(constructor);
    } else {
        res.status(404).json({ error: 'Constructor not found' });
    }
});

// Endpoint to get results for a specific constructor in a specific year
app.get('/api/constructors/:ref/:year', (req, res) => {
    const { ref, year } = req.params;

    const filteredResults = results.filter(result =>
        result.constructor.ref.toLowerCase() === ref.toLowerCase() &&
        result.race.year === parseInt(year, 10)
    );

    if (filteredResults.length > 0) {
        res.json(filteredResults);
    } else {
        res.status(404).json({
            error: 'No results found',
            message: `No results for constructor '${ref}' in year '${year}'.`
        });
    }
});

/*--------------------------------------------------Constructor Results-----------------------------------------*/

// Endpoint to get results for a specific constructor in a specific year
app.get('/api/constructorResults/:ref/:year', (req, res) => {
    const { ref, year } = req.params;

    const filteredResults = results.filter(result =>
        result.constructor.ref.toLowerCase() === ref.toLowerCase() &&
        result.race.year === parseInt(year, 10)
    );

    if (filteredResults.length > 0) {
        res.json(filteredResults);
    } else {
        res.status(404).json({
            error: 'No results found',
            message: `No results for constructor '${ref}' in year '${year}'.`
        });
    }
});

/*--------------------------------------------------Driver Results-----------------------------------------*/

// Endpoint to get results for a specific driver in a specific year
app.get('/api/driverResults/:ref/:year', (req, res) => {
    const { ref, year } = req.params;

    const filteredResults = results.filter(result =>
        result.driver.ref.toLowerCase() === ref.toLowerCase() &&
        result.race.year === parseInt(year, 10)
    );

    if (filteredResults.length > 0) {
        res.json(filteredResults);
    } else {
        res.status(404).json({
            error: 'No results found',
            message: `No results for driver '${ref}' in year '${year}'.`
        });
    }
});

// Catch-all route for unmatched API endpoints
app.use((req, res) => {
    res.send("Welcome to my COMP3612 Assignment 3");
});