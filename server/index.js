const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

//simple getters
app.get('/roomtypes', routes.getRoomTypes);
app.get('/borough', routes.getBorough);
app.get('/people', routes.getNumPeople);
app.get('/hospitals', routes.getHospitals);
app.get('/r/r', routes.getR);


//Search Page recommendations
app.get('/:borough/:type/:people/:price/:rating', routes.getSimpleRecs);
app.get('/:borough/:type/:people/:price/:rating/:hospital/:restaurant/:crime', routes.getComplexRecs);

//get things nearby 
app.get('/restaurants/:id', routes.getRestsNearby);
app.get('/hospitals/:id', routes.getHospsNearby);
app.get('/crimes/:id', routes.getCrimesNearby);

//get unqie airbnb info
app.get('/Results/:id', routes.getInfo);


//search by attratction 
app.get('/:hospital', routes.getRecsByHospitals);
app.get('/byrest/:restaurant', routes.getRecsByRest);

//borough stats
app.get('/x/:borough', routes.getStatsByBorough);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});