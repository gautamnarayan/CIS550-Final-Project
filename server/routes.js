const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Q1a (Dashboard) ---- */
// Equivalent to: function getTop20Keywords(req, res) {}
const getTop20Keywords = (req, res) => {
  const query = `
    SELECT kwd_name
    FROM movie_keyword
    GROUP BY kwd_name
    ORDER BY COUNT(*) DESC
    LIMIT 20;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.send(rows);
  });
};


/* ---- Q1b (Dashboard) ---- */
const getTopMoviesWithKeyword = (req, res) => {
  const query = `
    SELECT movie.title, movie.rating, movie.num_ratings
    FROM movie_keyword
    JOIN movie ON movie.movie_id=movie_keyword.movie_id 
    WHERE movie_keyword.kwd_name = '${req.params.keyword}'
    ORDER BY rating DESC, num_ratings DESC 
    LIMIT 10;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.send(rows);
  });
};


/* ---- Q2 (Recommendations) ---- */
const getRecs = (req, res) => {
  const query = `
      WITH cast_in_movie AS(
      SELECT cast_in.cast_id FROM cast_in 
      JOIN movie ON movie.movie_id=cast_in.movie_id
      WHERE movie.title='${req.params.title}'),

      movie_counts AS (
      SELECT movie_id, COUNT(movie_id) AS cast_count FROM cast_in 
      WHERE cast_in.cast_id IN (SELECT cast_id FROM cast_in_movie)
      GROUP BY movie_id)

      SELECT movie.title, movie.movie_id,movie.rating, movie.num_ratings FROM movie
      LEFT JOIN movie_counts ON movie.movie_id=movie_counts.movie_id
      WHERE movie.title <> '${req.params.title}'
      ORDER BY cast_count DESC, rating DESC, num_ratings DESC LIMIT 10;
    `;

    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      else res.send(rows);
    });
};


/* ---- Q3a (Best Movies) ---- */
const getDecades = (req, res) => {
  //min and max and then divide by 10
  // const query = `
  //   SELECT MIN(release_year) as min, MAX(release_year) as max FROM movie;
  // `;
  const query = `
    SELECT DISTINCT(FLOOR(release_year/10)*10) AS decade
    FROM movie
    ORDER BY decade ASC;
  `;
  
  // res.json(_.range(0, 30, 5));
  connection.query(query, (err, rows, fields) => {
    if (err) {
       console.log(err);
    }
    else{
      
      // start = rows[0]['min'] - rows[0]['min'] % 10;
      // end = rows[0]['max'] - rows[0]['max'] % 10;
      // var ans = [];
      // for (let i = start; i <= end; i+=10) {
      //     ans.push({'decade': i.toString(10)});
      // }
      // console.log(ans);
      res.json(rows);
    } 
  });
};


/* ---- (Best Movies) ---- */
const getGenres = (req, res) => {
  const query = `
    SELECT name
    FROM genre
    WHERE name <> 'genres'
    ORDER BY name ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) {
       console.log(err);
    }
    else{
      res.json(rows);
    } 
  });
};


/* ---- Q3b (Best Movies) ---- */
const bestMoviesPerDecadeGenre = (req, res) => {
  // req.query.decade;
  // req.query.genre;
  var enddecade = (Number(req.query.decade) + 10).toString();
  const query = `
    WITH genrescores AS (
          SELECT movie_genre.genre_name, AVG(rating) as avgrating FROM movie
          JOIN movie_genre ON movie.movie_id=movie_genre.movie_id
          WHERE release_year >= ${req.query.decade} AND release_year <  ${enddecade}
          GROUP BY movie_genre.genre_name),
          max_avg_rating AS(
          SELECT movie.movie_id, MAX(avgrating) as avgrating FROM movie
          JOIN movie_genre ON movie.movie_id=movie_genre.movie_id
          JOIN genrescores ON movie_genre.genre_name=genrescores.genre_name
          WHERE release_year >= ${req.query.decade} AND release_year < ${enddecade}
          GROUP BY movie.movie_id)

          SELECT movie.movie_id, movie.title, movie.rating FROM movie
          JOIN movie_genre ON movie.movie_id=movie_genre.movie_id
          JOIN max_avg_rating ON movie.movie_id=max_avg_rating.movie_id
          WHERE movie.rating > max_avg_rating.avgrating AND movie_genre.genre_name='${req.query.genre}'
          ORDER BY movie.title ASC, movie.rating DESC LIMIT 100;
  `;
    connection.query(query, (err, rows, fields) => {
      if (err) {
         console.log(err);
      }
      else{
        console.log(rows);
        res.json(rows);
      } 
    });

};

module.exports = {
	getTop20Keywords: getTop20Keywords,
	getTopMoviesWithKeyword: getTopMoviesWithKeyword,
	getRecs: getRecs,
  getDecades: getDecades,
  getGenres: getGenres,
  bestMoviesPerDecadeGenre: bestMoviesPerDecadeGenre
};