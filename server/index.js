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

//getters
app.get('/roomtypes', routes.getRoomTypes);
app.get('/borough', routes.getBorough);
app.get('/people', routes.getNumPeople);


// example for how to use a specific id
// app.get('/recommendations/:title', routes.getRecs);

app.get('/:borough/:type/:people/:price/:rating', routes.getSimpleRecs);
app.get('/:borough/:type/:people/:price/:rating/:hospital/:restaurant/:crime', routes.getComplexRecs);

//get info
app.get('/Results/:id', routes.getInfo);
app.get('/restaurants/:id', routes.getRestsNearby);
app.get('/hospitals/:id', routes.getHospsNearby);

app.get('/hospitals', routes.getHospitals);
app.get('/:hospital', routes.getRecsByHospitals);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});