import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default class Home extends React.Component {
  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />
 

        <div className="search-container">
					<div className="jumbotron">
						<div className="h1">Welcome to NYC Air BnB Locator!</div>

            <br></br>

            <div className="Geneva"><strong>Tired of looking through endless Air BnB listings that miss the mark in one 
            way or another? With NYC Air BnB locator, we take into account all of your specifications so that 
            we can find the Air BnB that satisfies <i > all </i> your needs, in seconds.</strong></div>

            <br></br>
            <br></br>
            <br></br>


            <div className="Geneva"> We want to make finding your best-suited Air BnB as easily and enjoyable as possible. Navigate to our 
              Search page to input your specifications for borough, room type, number of people, price, and rating. If you'd
              like, you can choose to check the "Advanced Search" checkbox, which will allow you to make additional specifications, 
              such as if you'd like to be near a lot of hospitals or a lot of restaurants. We know that safety is also of
              the utmost importance, so we've also included an option to request only Air BnBs in moderate or low crime areas.
            </div>

            <br></br>    <br></br>
            <div className="Geneva"> Looking instead to find a place to stay near your favorite restaurants, or your hospital of choice?
            Use our Restaurant Search and Hospital Search pages to input destinations you'd like to be close to, and we will show you
            the Air BnBs in the neighborhood. For example, If you are traveling to NYC and need to be near the Corona Child Health Clinic,
            our application can help you do so. 
            </div>

            <br></br>    <br></br>
            <div className="Geneva"> Upon clicking any AirBNB that is shown to you, you then see a personalized page for that residence.
            You can see its information, restaurants and hospitals within a quarter mile radius, crime counts within a mile radius, 
            and even see a map illustrating the location of the place. 
            </div>

            
					</div>

				</div>

     
        
      </div>
    );
  };
};
