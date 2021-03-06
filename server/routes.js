



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
//simple recommendations
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
//complex recommendations 
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
    SELECT id, latitude, longitude 
    FROM airbnb_main a
    WHERE borough = '${req.params.borough}'
         AND room_type = '${req.params.type}'
         AND accommodates='${req.params.people}'
         AND price <= ${req.params.price}
         AND rs_rating >= '${req.params.rating}'
    ),
    hospital_dists AS (
         SELECT  a.id, m.distance
         FROM airbnbs_condensed a
         JOIN airbnb_hospital_dists m ON 
             a.id=m.airbnb_id
    ),
    hospital_counts AS (
        SELECT id, COUNT(*) AS hospital_count
        FROM hospital_dists 
        WHERE distance < 1
        GROUP BY id
    ),
     airbnbs_condensed2 AS (
        SELECT a.id, a.latitude, a.longitude
        FROM airbnbs_condensed a
        JOIN hospital_counts h ON a.id=h.id
        WHERE hospital_count > ${hospital}
    ),
    restaurant_dists AS (
        SELECT a.id,m.distance
        FROM airbnbs_condensed a
        JOIN airbnb_restaurant_dists m ON 
            a.id=m.airbnb_id
    ),
    restaurant_counts AS (
        SELECT id, COUNT(*) AS rest_count 
        FROM restaurant_dists 
        WHERE distance < .4
        GROUP BY  id
    ),
    airbnbs_condensed3 AS (
        SELECT a.id, a.latitude, a.longitude 
        FROM airbnbs_condensed2 a
        JOIN restaurant_counts h ON a.id=h.id
        WHERE rest_count > ${restaurant}
    ),     
    small_crimes AS (
        SELECT OFNS_DESC, Latitude, Longitude 
        FROM recent_crimes
    ),
    crime_dists AS (
        SELECT a.id, c.ofns_desc,  ROUND( SQRT( 
            POW((69.1 * (a.latitude - c.latitude)), 2) +
            POW((53 * (a.longitude - c.longitude)), 2)), 1)
            AS distance
        FROM airbnbs_condensed3 a, small_crimes c
    ),
    crime_counts AS (
        SELECT id, COUNT(*) AS c_count
        FROM crime_dists 
        WHERE distance < .2 
        GROUP BY id
    )
    SELECT a.id, a.name, a.neighborhood, a.price, 
        a.rs_rating, a.latitude, a.longitude
    FROM airbnb_main a 
    JOIN crime_counts c ON a.id=c.id 
    WHERE c_count < ${crime} 
    LIMIT 10;
      
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
//get boroughs
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
//gets bnbs based on specific hospital
const getRecsByHospitals = (req, res) => {
  const query = `
    SELECT r.id, r.name, r.neighborhood, r.price, 
        r.rs_rating, distance
    FROM hospitals AS L
    JOIN airbnb_hospital_dists ahd ON ahd.hospital_id = 
        L.id 
    JOIN airbnb_main AS r ON ahd.airbnb_id=r.id
    WHERE distance < 0.25 AND L.name LIKE 
        '${req.params.hospital}%';


  `;
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.send(rows);
  });
};
//gets bnbs based on specific restaurants
const getRecsByRest = (req, res) => {
  const query = `
    
    SELECT r.id, r.name, r.neighborhood, r.price, 
        r.rs_rating, distance
    FROM restaurants AS L
    JOIN airbnb_restaurant_dists ard ON ard.restaurant_id 
        = L.id 
    JOIN airbnb_main as r ON ard.airbnb_id = r.id WHERE distance < 0.25 AND  L.name LIKE 
        '${req.params.restaurant}%'

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
//returns restaruants near a certain air bnb
const getRestsNearby = (req, res) => {
  const query = `
    
   SELECT rm.name, rm.PHONE
  FROM restaurants_main rm 
  JOIN airbnb_restaurant_dists ard ON ard.restaurant_id = 
      rm.id
  WHERE ard.airbnb_id=${req.params.id} AND distance < 0.25 LIMIT 20;

  `
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      res.send(rows)
    };
    //console.log(rows);
  });
}
//returns hospitals near a certain airbnb
const getHospsNearby = (req,res) => {
  const query = `
    SELECT h.name, h.phone, distance, 
        REPLACE(REPLACE(REPLACE(type, "'", ""), "[", 
        ""), "]", "") AS type
    FROM hospitals AS h
    JOIN airbnb_hospital_dists ahd ON ahd.airbnb_id = 
        ${req.params.id}
    WHERE distance < 0.25
    LIMIT 20;
  `
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      res.send(rows)
    };
  });
}
//returns crimes near a certain airbnb
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
//returns statistics of a borough
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

//how many starbucks within a 0.2  mile radius?
//how many starbucks within a 0.3  mile radius?
const getStarbucks = (req, res) => {
  const query = `
  SELECT count(*) as num_starbucks
  FROM airbnb_restaurant_dists AS D
  JOIN restaurants AS R ON D.restaurant_id = R.id
  WHERE airbnb_id = ${req.params.id} AND distance <= 0.5
      AND restaurant_id = ANY (
          SELECT id 
          FROM restaurants 
          WHERE name LIKE 'STARBUCKS'
      );`

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
  getStarbucks: getStarbucks
};
