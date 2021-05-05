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

var q1 = `
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

var q = `
WITH per_borough AS (
  SELECT arrest_boro, count(*) as num
  from recent_crimes
  group by arrest_boro
),
total AS (
    SELECT sum(num) as t
    FROM per_borough
),
rest_per_borough AS (
    SELECT borough, count(*) as num
    from restaurants
    group by borough
),
rest_total AS (
    SELECT sum(num) as t
    FROM rest_per_borough
), 
hosp_per_borough AS (
    SELECT borough, count(*) as num
    from hospitals
    group by borough
),
hosp_total AS (
    SELECT sum(num) as t
    FROM hosp_per_borough
)

SELECT 'Crimes' as section, ROUND(100 * num / total.t, 2) as percent
FROM per_borough, total
WHERE arrest_boro = 'M'
UNION
SELECT 'Restaurants' as section, ROUND(100 * num / rest_total.t, 2) as percent
FROM rest_per_borough, rest_total
WHERE borough = 'Manhattan'
UNION
SELECT 'Hospitals' as section, ROUND(100 * num / hosp_total.t, 2) as percent
FROM hosp_per_borough, hosp_total
WHERE borough = 'Manhattan';
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
  const query = `
      SELECT id, name, neighborhood, price, rs_rating as rating
      FROM airbnb_main
      WHERE borough = '${req.params.borough}' AND
          room_type LIKE '${req.params.type}%' AND
          accommodates < '${req.params.people}' + 1 AND 
          accommodates > '${req.params.people}' - 1 AND 
          price <= '${req.params.price}' AND 
          rs_rating >= '${req.params.rating}'
      ORDER BY rating DESC
      LIMIT 25;
    `;
    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      else res.send(rows);
    });
}

const getComplexRecs = (req,res) => {
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
      FROM airbnb_main a JOIN crime_counts c ON a.id=c.id where c_count < ${crime} limit 10;
      
      `;
    connection.query(q, (err, rows, fields) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(rows);
      }
      console.log(rows)
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

//get hospitals
const getHospitals = (req, res) => {
  const query = `
    SELECT DISTINCT name
    FROM hospitals
    ORDER BY name ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.send(rows);
  });
};

//get bnbs based on specific hospital
const getRecsByHospitals = (req, res) => {
  const query = `
    SELECT r.id, r.name, r.neighborhood, r.price, r.rs_rating
    FROM airbnb_main as r
    JOIN (
      SELECT latitude as lat, longitude as lon
      FROM hospitals
      WHERE name LIKE '${req.params.hospital}%'
    ) as L
    WHERE ROUND( SQRT( POW((69.1 * (L.lat - r.latitude)), 2) + 
                POW((53 * (L.lon - r.longitude)), 2)), 1) < 0.25;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.send(rows);
  });
};

//get bnbs based on specific restaurants
const getRecsByRest = (req, res) => {
  const query = `
    SELECT r.id, r.name, r.neighborhood, r.price, r.rs_rating
    FROM airbnb_main as r
    JOIN (
      SELECT latitude as lat, longitude as lon
      FROM restaurants
      WHERE name LIKE '${req.params.restaurant}%'
    ) as L
    WHERE ROUND( SQRT( POW((69.1 * (L.lat - r.latitude)), 2) + 
                POW((53 * (L.lon - r.longitude)), 2)), 1) < 0.25;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.send(rows);
  });
};

//get restaurants
const getR = (req, res) => {
  const query = `
    SELECT name
    FROM restaurants
    LIMIT 50;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.send(rows);
  });
};

//get info about the air bnb
const getInfo = (req,res) => {
  const query = `
      SELECT *
      FROM airbnb_main
      WHERE id = ${req.params.id}
    `;
    connection.query(query, (err, rows, fields) => {

      if (err) console.log(err);
      else {
        res.send(rows);
      };
    });
}

const getRestsNearby = (req, res) => {
  const query = `
    SELECT r.name, r.PHONE
    FROM restaurants as r
    JOIN (SELECT latitude as lat, longitude as lon
          FROM airbnb_main
          WHERE id = ${req.params.id}
          ) AS L
    WHERE ROUND( SQRT( POW((69.1 * (L.lat - r.latitude)), 2) + 
        POW((53 * (L.lon - r.longitude)), 2)), 1) < 0.25
    LIMIT 20;
  `
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      res.send(rows)
    };
    //console.log(rows);
  });

}

const getHospsNearby = (req,res) => {
  const query = `
    SELECT h.name, h.phone, REPLACE(REPLACE(REPLACE(type, "'", ""), "[", ""), "]", "") as type
    FROM hospitals as h
    JOIN (SELECT latitude as lat, longitude as lon
          FROM airbnb_main
          WHERE id = ${req.params.id}
          ) AS L
    WHERE ROUND( SQRT( POW((69.1 * (L.lat - h.latitude)), 2) + 
        POW((53 * (L.lon - h.longitude)), 2)), 1) < 0.25
  `
  connection.query(query, (err, rows, fields) => {

    if (err) console.log(err);
    else {
      res.send(rows)
    };
  });
}


const getCrimesNearby = (req,res) => {
  const query = `
    SELECT OFNS_DESC as offense, COUNT(*) as count
    FROM recent_crimes as r
    JOIN (  SELECT latitude as lat, longitude as lon
          FROM airbnb_main
          WHERE id = ${req.params.id}
      ) AS L 
    WHERE ROUND( SQRT( POW((69.1 * (L.lat - r.latitude)), 2) + 
                  POW((53 * (L.lon - r.longitude)), 2)), 1) < 1
    GROUP BY offense
    ORDER BY count DESC;
  `
  connection.query(query, (err, rows, fields) => {

    if (err) console.log(err);
    else {
      res.send(rows)
    };
  });
}


const getStatsByBorough = (req,res) => {
  var b;
  if (req.params.borough == 'Manhattan') {
    b = "M";
  }  else if (req.params.borough == 'Bronx') {
    b = "B";
  } else if (req.params.borough == 'Staten Island') {
    b = "S";
  } else if (req.params.borough == 'Brooklyn') {
    b = "K";
  } else if (req.params.borough == 'Queens') {
    b = "Q";
  }

  const query = `
  WITH per_borough AS (
    SELECT arrest_boro, count(*) as num
    from recent_crimes
    group by arrest_boro
  ),
  total AS (
      SELECT sum(num) as t
      FROM per_borough
  ),
  rest_per_borough AS (
      SELECT borough, count(*) as num
      from restaurants
      group by borough
  ),
  rest_total AS (
      SELECT sum(num) as t
      FROM rest_per_borough
  ), 
  hosp_per_borough AS (
      SELECT borough, count(*) as num
      from hospitals
      group by borough
  ),
  hosp_total AS (
      SELECT sum(num) as t
      FROM hosp_per_borough
  )

  SELECT 'Crimes' as section, ROUND(100 * num / total.t, 2) as percent
  FROM per_borough, total
  WHERE arrest_boro = '${b}'
  UNION
  SELECT 'Restaurants' as section, ROUND(100 * num / rest_total.t, 2) as percent
  FROM rest_per_borough, rest_total
  WHERE borough = '${req.params.borough}'
  UNION
  SELECT 'Hospitals' as section, ROUND(100 * num / hosp_total.t, 2) as percent
  FROM hosp_per_borough, hosp_total
  WHERE borough = '${req.params.borough}';
`
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.send(rows);
  });
};



module.exports = {
  getRoomTypes: getRoomTypes,
  getSimpleRecs: getSimpleRecs,
  getBorough: getBorough,
  getNumPeople: getNumPeople,
  getComplexRecs: getComplexRecs,
  getInfo: getInfo,
  getRestsNearby: getRestsNearby,
  getHospsNearby : getHospsNearby,
  getHospitals: getHospitals,
  getR: getR,
  getRecsByHospitals: getRecsByHospitals,
  getCrimesNearby: getCrimesNearby,
  getRecsByRest: getRecsByRest,
  getStatsByBorough: getStatsByBorough,
};