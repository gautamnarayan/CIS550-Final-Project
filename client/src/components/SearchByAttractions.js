import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default class SearchByAttractions extends React.Component {
  render() {    
    return (
      <div className="SearchByAttractions">

        <PageNavbar active="SearchByAttractions" />
 
        <div className="search-container">
					<div className="jumbotron">
						<div className="h1">Find Air BnBs by Attractions</div>
						<br></br>

					</div>
				</div>
       
        <div className="search-container">
					<div className="jumbotron">
						<div className="h5">Search by Restaurant</div>
						<br></br>
						<div className="dropdown">

           </div>
           </div>
        </div>

        <div className="search-container">
					<div className="jumbotron">
						<div className="h5">Search by Hospital</div>
						<br></br>
						<div className="dropdown">

           </div>
           </div>
        </div>
        
      </div>
    );
  };
};
