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
    SELECT * FROM airbnb_main am
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
  small_crimes AS (
    SELECT OFNS_DESC, Latitude, Longitude FROM crimes where OFNS_DESC IN 
    ("RAPE", "FELONY ASSAULT", 
    "DANGEROUS DRUGS", "ROBBERY",
    "ARSON", "PROSTITUTION & RELATED OFFENSES")
  )
  SELECT a.id, c.ofns_desc, 
  ROUND( SQRT( POW((69.1 * (a.latitude - c.latitude)), 2) + 
      POW((53 * (a.longitude - c.longitude)), 2)), 1) 
     as distance
    FROM airbnbs_condensed a, small_crimes c limit 10;
  `
connection.query(q, (err, rows, fields) => {
    if (err) console.log(err);
    // else res.send(rows);
    else console.log(rows);
  });


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
  const query = `
      SELECT id, name, listing_url, neighborhood, price
      FROM airbnb_main
      WHERE borough = '${req.params.borough}' AND
          room_type = '${req.params.type}' AND
          accommodates = '${req.params.people}' AND 
          price < '${req.params.price}' AND 
          rs_rating > '${req.params.rating}'
      LIMIT 30;
    `;
    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      else res.send(rows);
    });
}

//get room types
const getRoomTypes = (req, res) => {
  const query = `
    SELECT DISTINCT room_type
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

// /* ---- Q1b (Dashboard) ---- */
// const getTopMoviesWithKeyword = (req, res) => {
//   const query = `
//     SELECT movie.title, movie.rating, movie.num_ratings
//     FROM movie_keyword
//     JOIN movie ON movie.movie_id=movie_keyword.movie_id 
//     WHERE movie_keyword.kwd_name = '${req.params.keyword}'
//     ORDER BY rating DESC, num_ratings DESC 
//     LIMIT 10;
//   `;

//   connection.query(query, (err, rows, fields) => {
//     if (err) console.log(err);
//     else res.send(rows);
//   });
// };


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
  getBorough: getBorough
};