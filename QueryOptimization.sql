#QUERY OPTIMIZATION

DROP TABLE recent_crimes;
CREATE TABLE recent_crimes as 
SELECT * FROM crimes where RIGHT(ARREST_DATE, 4) > 2015;

ALTER TABLE recent_crimes 
ADD PRIMARY KEY (ARREST_KEY);

ALTER TABLE airbnb_main 
ADD PRIMARY KEY (id);

ALTER TABLE hospitals 
ADD PRIMARY KEY (id);

CREATE TABLE restaurants_main as (
SELECT DISTINCT * FROM restaurants);

ALTER TABLE restaurants_main 
ADD PRIMARY KEY (id);

#----------------------- caching


CREATE table airbnb_hospital_dists as (
WITH temp as (SELECT  a.id as airbnb_id, h.id as hospital_id,
    ROUND( SQRT( POW((69.1 * (a.latitude - h.latitude)), 2) + 
      POW((53 * (a.longitude - h.longitude)), 2)), 1) 
     as distance
    FROM airbnb_main a, hospitals h)
   SELECT * FROM temp where distance < 5);
   
ALTER TABLE airbnb_hospital_dists 
ADD FOREIGN KEY (airbnb_id) REFERENCES airbnb_main(id);

ALTER TABLE airbnb_hospital_dists 
ADD FOREIGN KEY (hospital_id) REFERENCES hospitals(id);


CREATE table airbnb_restaurant_dists as (
WITH temp as (SELECT  a.id as airbnb_id, h.id as restaurant_id,
    ROUND( SQRT( POW((69.1 * (a.latitude - h.latitude)), 2) + 
      POW((53 * (a.longitude - h.longitude)), 2)), 1) 
     as distance
    FROM airbnb_main a, restaurants h)
   SELECT * FROM temp where distance < .35
  );
 
ALTER TABLE airbnb_restaurant_dists 
ADD FOREIGN KEY (airbnb_id) REFERENCES airbnb_main(id);

ALTER TABLE airbnb_restaurant_dists 
ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants_main(id);

#------------------------------ - INDEXING

ALTER TABLE recent_crimes MODIFY COLUMN arrest_boro VARCHAR(500);

  
CREATE INDEX crime_boro_index
ON recent_crimes (arrest_boro(500));

ALTER TABLE hospitals MODIFY COLUMN borough VARCHAR(500);

CREATE INDEX hospitals
ON hospitals (borough(500));

CREATE INDEX hospitals
ON hospitals (zipcode);

CREATE INDEX hospitals_zip
ON hospitals (zipcode);

CREATE INDEX restaurant_zip
ON restaurants (zipcode);
