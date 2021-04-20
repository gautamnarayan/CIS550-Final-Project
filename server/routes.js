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
    WITH kwd_num(kwd_name, counter)
    AS ( 
    SELECT kwd_name, count(kwd_name) as counter
    FROM movie_keyword
    GROUP BY kwd_name
    ORDER BY counter DESC
    )
    SELECT kwd_name
    FROM kwd_num
    ORDER BY counter DESC
    LIMIT 20;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });


};


/* ---- Q1b (Dashboard) ---- */
const getTopMoviesWithKeyword = (req, res) => {
  const query = `
    SELECT title, rating, num_ratings
    FROM movie
    JOIN movie_keyword on movie_keyword.movie_id = movie.movie_id
    WHERE movie_keyword.kwd_name = '${req.params.keyword}'
    ORDER BY movie.rating DESC, movie.num_ratings DESC
    LIMIT 10;
  `;
  
  connection.query(query, (err, rows, fields) => {
     if (err) console.log(err);
     else res.json(rows);
  });

};

  

/* ---- Q2 (Recommendations) ---- */
const getRecs = (req, res) => {
  const query = `
    WITH cast_list(cast_id, title)
    AS (
      SELECT cast_id, title
      FROM cast_in 
      JOIN movie on movie.movie_id = cast_in.movie_id
      WHERE movie.title = '${req.params.movieName}'
    )
    SELECT DISTINCT m.title, m.movie_id, m.rating, m.num_ratings
    FROM movie m
    JOIN cast_in on cast_in.movie_id = m.movie_id
    WHERE m.title <> '${req.params.movieName}' AND cast_in.cast_id IN (
      SELECT cast_id
      FROM cast_list
    )
    GROUP BY m.movie_id
    ORDER BY count(cast_id) DESC, rating DESC, num_ratings DESC
    LIMIT 10;
  `;

connection.query(query, (err, rows, fields) => {
   if (err) console.log(err);
   else res.json(rows);
});


};


/* ---- Q3a (Best Movies) ---- */
const getDecades = (req, res) => {
  const query = `
    SELECT DISTINCT (FLOOR(release_year / 10) * 10)  as FloorValue
    FROM movie
    ORDER BY FloorValue ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
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
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- Q3b (Best Movies) ---- */
const bestMoviesPerDecadeGenre = (req, res) => {

  result = 9;
  decadename = req.query.decade

  const query = `
  WITH genre_rating(genre, avg_genre_rating) 
  AS (
    SELECT movie_genre.genre_name, AVG(movie.rating) as avg_genre_rating
    FROM movie_genre 
    JOIN movie on movie.movie_id = movie_genre.movie_id
    WHERE movie.release_year >= '${req.query.decade}' 
    AND movie.release_year <= '${parseInt(decadename, 10) + parseInt(result,10)}'
    GROUP BY movie_genre.genre_name
    ORDER BY avg_genre_rating DESC
  ),
    
  movie_list(movie_id, genre) AS (
    SELECT movie.movie_id, movie_genre.genre_name
    FROM movie
    JOIN movie_genre on movie_genre.movie_id = movie.movie_id
    WHERE movie_genre.genre_name = '${req.query.genre}' AND movie.release_year >= '${req.query.decade}' 
    AND movie.release_year <= '${parseInt(decadename, 10) + parseInt(result,10)}'
  ),

  num_genres(movie_id, genre_count) AS (
    SELECT movie_genre.movie_id, count(movie_genre.genre_name) as genre_count
    FROM movie_genre
    GROUP BY movie_id
  ), 

  num_genres_after(movie_id, genre_count) AS (
    SELECT movie.movie_id, count(movie_genre.genre_name) as genre_count
    FROM movie_genre
    JOIN movie on movie.movie_id = movie_genre.movie_id
    JOIN genre_rating on genre_rating.genre = movie_genre.genre_name
    WHERE movie.rating > genre_rating.avg_genre_rating AND movie.movie_id IN (
        SELECT movie_list.movie_id
        FROM movie_list)
    GROUP BY movie.movie_id
  )

  SELECT DISTINCT movie.movie_id, movie.title, movie.rating
  FROM movie
  JOIN num_genres on num_genres.movie_id = movie.movie_id
  JOIN num_genres_after on num_genres_after.movie_id = movie.movie_id
  WHERE num_genres.genre_count = num_genres_after.genre_count
  GROUP BY movie.movie_id
  ORDER BY movie.title ASC    
  LIMIT 100;

  `;
  result = 9;
  decadename = req.query.decade
  console.log(parseInt(decadename, 10) + parseInt(result,10))

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
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