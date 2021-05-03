import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import BnbRow from './BnbRow';
import '../style/BnbRow.css';

export default class SearchByAttractions extends React.Component {
  constructor(props) {
		super(props);

		this.state = {
      selectedHosp : "",
      selectedHospID: "",
      hospitals : [],
      bnbs: []
		};

		//change requests
		this.handleHospitalChange = this.handleHospitalChange.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
	};

  handleHospitalChange(e) {
		this.setState({
			selectedHosp: e.target.value
		});
	};
	componentDidMount() {
        fetch("http://localhost:8081/hospitals", {  // get hospital names
            method: 'GET'
        })
        .then(res => {
            return res.json();      
        }, err => {
            console.log(err); 
        })
        .then(hospList => {
            if (!hospList) return;
 
            let hospDivs = hospList.map((hosp, i) =>
              <option className="hospOption" key={hosp.id} value={hosp.name}>{hosp.name}</option>
            );
            
            this.setState({
                hospitals: hospDivs
            });
              
        }, err => {
            console.log(err);
        });
    };


    submitRequest() {
      //request for decades
      fetch(`http://localhost:8081/${this.state.selectedHosp}`, {
        method: 'GET'
      })
  
      .then(res => {
        return res.json();      // Convert the response data to a JSON.
      }, err => {
        console.log(err);       // Print the error if there is one.
      })
      .then(bnbList => {
        if (!bnbList) return;
  
        let bnbDivs = bnbList.map((recObj, i) => 
          <BnbRow
            key={recObj.id}
            id = {recObj.id}
            name = {recObj.name}
            neighborhood = {recObj.neighborhood}
            price = {recObj.price}
            rating = {recObj.rs_rating}
          />
        );
  
        this.setState({
          bnbs: bnbDivs
        });
      }, err => {
        console.log(err);
      });
    };
  //'/hospitals'
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
              <div className="header"><strong>Hospital</strong>
                <select value={this.state.selectedHosp} 
                  onChange={this.handleHospitalChange} 
                  className="dropdown-content" id="hospitalDropdown">
                  {this.state.hospitals}
                </select>
              </div>
           </div>
           <br></br>
           <button className="submit-button" id="submitBtn" onClick={this.submitRequest}>Submit</button>
        </div>

        <div className="search-container">
				<div className="jumbotron">
					<div className="recs-container">
					<div className="h5">Air Bnbs Found Based on your Criteria:</div>
					<div className="rec">
							<div className="header"><strong> Id </strong></div>
					  		<div className="header"><strong>Name </strong></div>
					  		<div className="header"><strong>Neighborhood </strong></div>
					  		<div className="header"><strong>Price </strong></div>
							<div className="header"><strong>Rating </strong></div>

					  	</div>
					<table class="table table-hover row-clickable">
    				<tbody>
              <tr>
              <div className= "recs-container" id="results" > {this.state.bnbs[0]} 
              </div>
              </tr>
              <tr>
              <div className= "recs-container" id="results"> {this.state.bnbs[1]} </div>
              </tr>
              <tr>
              <div className= "recs-container" id="results"> {this.state.bnbs[2]} </div>
              </tr>
              <tr>
              <div className= "recs-container" id="results"> {this.state.bnbs[3]} </div>
              </tr>
              <tr>
              <div className= "recs-container" id="results"> {this.state.bnbs[4]} </div>
              </tr>
              <tr>
              <div className= "recs-container" id="results"> {this.state.bnbs[5]} </div>
              </tr>
              <tr>
              <div className= "recs-container" id="results"> {this.state.bnbs[6]} </div>
              </tr>	
    				</tbody>
					</table>


					</div>
          </div>
          </div>
        
        
      </div>
      </div>
    );
  };
};
