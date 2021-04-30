//connect to database 
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'cis550-proj.cd0wswllphq4.us-east-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'password',
  port     : 3306,
  database : "project"

});


connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

var q = `
WITH airbnbs_condensed AS (
    SELECT id, latitude, longitude FROM airbnb_main a
    where borough = "Brooklyn" AND room_type = "Private room"
    and accommodates=3 AND price < 300 AND rs_rating > 85
  ),
  hospital_dists AS (
    SELECT 
    a.id,h.type,
    ROUND( SQRT( POW((69.1 * (a.latitude - h.latitude)), 2) + 
      POW((53 * (a.longitude - h.longitude)), 2)), 1) 
     as distance
    FROM airbnbs_condensed a, hospitals h),
  hospital_counts as (
    SELECT id, COUNT(*) as hospital_count 
    FROM hospital_dists where distance < 1 group by id),
  airbnbs_condensed2 as (
  SELECT a.id, a.latitude, a.longitude FROM airbnbs_condensed a 
  JOIN hospital_counts h ON a.id=h.id 
  WHERE hospital_count > 2),
   
    
   restaurant_dists AS (
   SELECT a.id, r.name, 
   ROUND( SQRT( POW((69.1 * (a.latitude - r.latitude)), 2) + 
      POW((53 * (a.longitude - r.longitude)), 2)), 1) as distance 
     FROM restaurants r, airbnbs_condensed2 a),
    restaurant_counts AS (
    SELECT id, COUNT(*) as rest_count FROM restaurant_dists where distance < .4 group by 
    id ),
  airbnbs_condensed3 as (
  SELECT a.id, a.latitude, a.longitude FROM airbnbs_condensed2 a 
  JOIN restaurant_counts h ON a.id=h.id 
  WHERE rest_count > 70),
   
   small_crimes AS (
    SELECT OFNS_DESC, Latitude, Longitude FROM recent_crimes   ),
  crime_dists AS (
  SELECT a.id, c.ofns_desc, 
  ROUND( SQRT( POW((69.1 * (a.latitude - c.latitude)), 2) + 
      POW((53 * (a.longitude - c.longitude)), 2)), 1) 
     as distance
    FROM airbnbs_condensed3 a, small_crimes c),
  crime_counts AS (
    SELECT id, COUNT(*) as c_count FROM crime_dists where distance < .2 GROUP BY id
  )
    SELECT a.id, a.name, a.neighborhood, a.price, a.rs_rating
  FROM airbnb_main a JOIN crime_counts c ON a.id=c.id where c_count < 40 limit 10;
;
 
 
 
 
  `
// connection.query(q, (err, rows, fields) => {
//     if (err) console.log(err);
//     // else res.send(rows);
//     else console.log(rows);
//   });


  //

  // SELECT name, phone,
  // ROUND( SQRT( POW((69.1 * (40.832279848967 - latitude)), 2) + 
  // POW((53 * (-73.909534601874 - longitude)), 2)), 1) AS distance
  // FROM hospitals
  // ORDER BY distance ASC;  

// connection.query('select * from airbnb_main limit 10', (err, rows, fields) => {
//     if (err) console.log(err);
//     // else res.send(rows);
//     else console.log(rows);
//   });


// connection.query('select * from crimes limit 10', (err, rows, fields) => {
//     if (err) console.log(err);
//     // else res.send(rows);
//     else console.log(rows);
//   });




//Normal query
const getSimpleRecs = (req,res) => {
  var hospital, restaurant, crime;
  if (req.params.hospital == 'Indifferent') {
    hospital = "0";
  }  else if (req.params.hospital == 'Moderate') {
    hospital = "1";
  } else {
    hospital = "2";
  }
  if (req.params.restaurant == 'Indifferent') {
    restaurant = "0";
  }  else if (req.params.hospital == 'Moderate') {
    restaurant = "40";
  } else {
    restaurant = "90";
  }
  if (req.params.crime == 'Indifferent') {
    crime = "100000000";
  }  else if (req.params.crime == 'Moderate') {
    crime = "500";
  } else {
    crime = "200";
  }
  const q = `
    WITH airbnbs_condensed AS (
        SELECT id, latitude, longitude FROM airbnb_main a
        where borough = '${req.params.borough}'
        AND room_type = '${req.params.type}'
        AND accommodates='${req.params.people}' 
        AND price <= ${req.params.price}
         AND rs_rating >= '${req.params.rating}'
      ),
      hospital_dists AS (
        SELECT 
        a.id,h.type,
        ROUND( SQRT( POW((69.1 * (a.latitude - h.latitude)), 2) + 
          POW((53 * (a.longitude - h.longitude)), 2)), 1) 
         as distance
        FROM airbnbs_condensed a, hospitals h),
      hospital_counts as (
        SELECT id, COUNT(*) as hospital_count 
        FROM hospital_dists where distance < 1 group by id),
      airbnbs_condensed2 as (
      SELECT a.id, a.latitude, a.longitude FROM airbnbs_condensed a 
      JOIN hospital_counts h ON a.id=h.id 
      WHERE hospital_count > '${hospital}'),
       
        
       restaurant_dists AS (
       SELECT a.id, r.name, 
       ROUND( SQRT( POW((69.1 * (a.latitude - r.latitude)), 2) + 
          POW((53 * (a.longitude - r.longitude)), 2)), 1) as distance 
         FROM restaurants r, airbnbs_condensed2 a),
        restaurant_counts AS (
        SELECT id, COUNT(*) as rest_count FROM restaurant_dists where distance < .4 group by 
        id ),
      airbnbs_condensed3 as (
      SELECT a.id, a.latitude, a.longitude FROM airbnbs_condensed2 a 
      JOIN restaurant_counts h ON a.id=h.id 
      WHERE rest_count > ${restaurant}),
       
       small_crimes AS (
        SELECT OFNS_DESC, Latitude, Longitude FROM recent_crimes   ),
      crime_dists AS (
      SELECT a.id, c.ofns_desc, 
      ROUND( SQRT( POW((69.1 * (a.latitude - c.latitude)), 2) + 
          POW((53 * (a.longitude - c.longitude)), 2)), 1) 
         as distance
        FROM airbnbs_condensed3 a, small_crimes c),
      crime_counts AS (
        SELECT id, COUNT(*) as c_count FROM crime_dists where distance < .2 GROUP BY id
      )
        SELECT a.id, a.name, a.neighborhood, a.price, a.rs_rating, a.latitude, a.longitude
      FROM airbnb_main a JOIN crime_counts c ON a.id=c.id where c_count < ${crime} limit 20;`;
    connection.query(q, (err, rows, fields) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(rows);
      }
    });
}

//get room types
const getRoomTypes = (req, res) => {
  const query = `
    SELECT DISTINCT 
      IF( LOCATE('/',room_type)=0,
        room_type, 
        LEFT(room_type, LOCATE('/',room_type) - 1)
      ) as room_type
    FROM airbnb_main
    ORDER BY name ASC;
    
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

//get room types
const getBorough = (req, res) => {
  const query = `
    SELECT DISTINCT borough
    FROM airbnb_main
    ORDER BY name ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

//get room types
const getNumPeople = (req, res) => {
  const query = `
    SELECT DISTINCT accommodates
    FROM airbnb_main
    ORDER BY accommodates ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


// /* ---- Q3b (Best Movies) ---- */
// const bestMoviesPerDecadeGenre = (req, res) => {
//   // req.query.decade;
//   // req.query.genre;
//   var enddecade = (Number(req.query.decade) + 10).toString();
//   const query = `
//     WITH genrescores AS (
//           SELECT movie_genre.genre_name, AVG(rating) as avgrating FROM movie
//           JOIN movie_genre ON movie.movie_id=movie_genre.movie_id
//           WHERE release_year >= ${req.query.decade} AND release_year <  ${enddecade}
//           GROUP BY movie_genre.genre_name),
//           max_avg_rating AS(
//           SELECT movie.movie_id, MAX(avgrating) as avgrating FROM movie
//           JOIN movie_genre ON movie.movie_id=movie_genre.movie_id
//           JOIN genrescores ON movie_genre.genre_name=genrescores.genre_name
//           WHERE release_year >= ${req.query.decade} AND release_year < ${enddecade}
//           GROUP BY movie.movie_id)

//           SELECT movie.movie_id, movie.title, movie.rating FROM movie
//           JOIN movie_genre ON movie.movie_id=movie_genre.movie_id
//           JOIN max_avg_rating ON movie.movie_id=max_avg_rating.movie_id
//           WHERE movie.rating > max_avg_rating.avgrating AND movie_genre.genre_name='${req.query.genre}'
//           ORDER BY movie.title ASC, movie.rating DESC LIMIT 100;
//   `;
//     connection.query(query, (err, rows, fields) => {
//       if (err) {
//          console.log(err);
//       }
//       else{
//         console.log(rows);
//         res.json(rows);
//       } 
//     });

// };
// connection.end();


module.exports = {
  getRoomTypes: getRoomTypes,
  getSimpleRecs: getSimpleRecs,
  getBorough: getBorough,
  getNumPeople: getNumPeople
};