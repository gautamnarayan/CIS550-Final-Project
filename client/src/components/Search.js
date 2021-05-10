import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/Search.css';
import BnbRow from './BnbRow';
import ResultsRow from './ResultsRow';
import '../style/BnbRow.css';


import 'bootstrap/dist/css/bootstrap.min.css';

export default class Search extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedBorough: "Manhattan",
			selectedRoomType: "Private room",
			selectedNumPeople: 3,
			selectedPrice: 100,
			selectedRating: 80,
			selectedCrime: "Indifferent",
			selectedRestaurant: "Indifferent",
			selectedHospital: "Indifferent",
			borough: [],
			roomType: [],
			numPeople: [],
			price: [],
			crime: [], 
			restaurants: [], 
			hospitals: [],
			recs: [],
			checked: false,
			info: [],
			searchId : 0
		};

		//change requests
		this.handleBoroughChange = this.handleBoroughChange.bind(this);
		this.handleRoomTypeChange = this.handleRoomTypeChange.bind(this);
		this.handleNumPeopleChange = this.handleNumPeopleChange.bind(this);
		this.handlePriceChange = this.handlePriceChange.bind(this);
		this.handleRatingChange = this.handleRatingChange.bind(this);
		this.handleCrimeChange = this.handleCrimeChange.bind(this);
		this.handleRestaurantChange = this.handleRestaurantChange.bind(this);
		this.handleHospitalChange = this.handleHospitalChange.bind(this);
		this.handleCheckChange = this.handleCheckChange.bind(this);
		this.submitSimpleRequest = this.submitSimpleRequest.bind(this);
		this.submitComplexRequest = this.submitComplexRequest.bind(this);
		this.submitRequest = this.submitRequest.bind(this);
		this.submitGetInfo = this.submitGetInfo.bind(this);
	};



	componentDidMount() {
        fetch("http://localhost:8081/roomtypes", {  // get room types

            method: 'GET'
        })
        .then(res => {
            return res.json();      
        }, err => {
            console.log(err); 
        })
        .then(roomTypeList => {
            if (!roomTypeList) return;
 
            let roomTypeDivs = roomTypeList.map((room, i) =>
              <option className="roomTypesOption" key={i} value={room.room_type}>{room.room_type}</option>
            );
            
            this.setState({
                roomType: roomTypeDivs
            });
              
        }, err => {
            console.log(err);
        });
 
        // get the boroughs
		fetch("http://localhost:8081/borough", {
            method: 'GET'
        })
        .then(res => {
            return res.json();      // Convert the response data to a JSON.
        }, err => {
            console.log(err);       // Print the error if there is one.
        })
        .then(boroughList => {
            if (!boroughList) return;
 
            let boroughDivs = boroughList.map((borough, i) =>
              <option className="boroughOption" key={i} value={borough.borough}>{borough.borough}</option>
            );
            
            this.setState({
                borough: boroughDivs
            });
              
        }, err => {
            console.log(err);
        });

		//set prices
		const pricelist = [50, 100, 150, 200, 500, 1000]
		let priceDivs = pricelist.map((v, i) =>
			<option className="priceOption" key={v} value={v}>{v}</option>
		);
		
		this.setState({
			price: priceDivs
		});

		//set num peopl
		fetch("http://localhost:8081/people", {
            method: 'GET'
        })
        .then(res => {
            return res.json();      // Convert the response data to a JSON.
        }, err => {
            console.log(err);       // Print the error if there is one.
        })
        .then(peopleList => {
            if (!peopleList) return;
 
            let peopleDivs = peopleList.map((accommodates, i) =>
              <option className="numPeopleOption" key={i} value={accommodates.accommodates}>{accommodates.accommodates}</option>
            );
            
            this.setState({
                numPeople: peopleDivs
            });
              
        }, err => {
            console.log(err);
        });

		//set hospital
		const hospitalList = ["Indifferent" , "Moderate", "Lots"]
		let hospitalDivs = hospitalList.map((v, i) =>
			<option className="hospitalOption" key={v} value={v}>{v}</option>
		);
		
		this.setState({
			hospital: hospitalDivs
		});

		//set restaurant
		const restaurantList = ["Indifferent" , "Moderate", "Lots"]
		let restaurantDivs = restaurantList.map((v, i) =>
			<option className="restaurantOption" key={v} value={v}>{v}</option>
		);
		
		this.setState({
			restaurant: restaurantDivs
		});

		//set crimes
		const crimeList = ["Indifferent" , "Moderate", "Few"]
		let crimeDivs = crimeList.map((v, i) =>
			<option className="crimeOption" key={v} value={v}>{v}</option>
		);
		
		this.setState({
			crime: crimeDivs
		});
    };


	submitSimpleRequest() {
		//request for decades
		fetch(`http://localhost:8081/${this.state.selectedBorough}/${this.state.selectedRoomType}/${this.state.selectedNumPeople}/${this.state.selectedPrice}/${this.state.selectedRating}`, {
			method: 'GET'
		})

		.then(res => {
			return res.json();      // Convert the response data to a JSON.
		}, err => {
			console.log(err);       // Print the error if there is one.
		})
		.then(recList => {
			if (!recList) return;

			let recDivs = recList.map((recObj, i) => 
				<BnbRow
					key={recObj.id}
					id = {recObj.id}
					name = {recObj.name}
					neighborhood = {recObj.neighborhood}
					price = {recObj.price}
					rating = {recObj.rating}
					onClick={() => this.submitGetInfo(recObj.id)} 

				/>
			);

			this.setState({
				recs: recDivs
			});
		}, err => {
			console.log(err);
		});
	};

	submitGetInfo(id) {
		
		fetch(`http://localhost:8081/Results/${id}`, {
		  method: "GET",
		})
		.then(res => {
			return res.json();      // Convert the response data to a JSON.
		}, err => {
			console.log(err);       // Print the error if there is one.
		})
		.then(infoList => {
			if (!infoList) return;
			let infoDivs = infoList.map((recObj, i) =>
				<ResultsRow
					key={recObj.id}
					id = {recObj.id}
					name = {recObj.name}
					url={recObj.listing_url}
					neighborhood = {recObj.neighborhood}
					price = {recObj.price}
					borough = {recObj.borough}
					latitude = {recObj.latitude}
					longitude = {recObj.longitude}
					room_type = {recObj.room_type}
					rating = {recObj.rs_rating}
					accommodates = {recObj.accommodates}
					min_nights = {recObj.min_nights}
					max_nights = {recObj.max_nights}
				/>
				
			);

			this.setState({ info: infoDivs, searchId: id})
	
		}, err => {
			console.log(err);
		});

	  };
	submitComplexRequest() {
		//request for decades
		fetch(`http://localhost:8081/${this.state.selectedBorough}/${this.state.selectedRoomType}/${this.state.selectedNumPeople}/${this.state.selectedPrice}/${this.state.selectedRating}/${this.state.selectedHospital}/${this.state.selectedRestaurant}/${this.state.selectedCrime}`, {
			method: 'GET'
		})

		.then(res => {
			return res.json();      // Convert the response data to a JSON.
		}, err => {
			console.log(err);       // Print the error if there is one.
		})
		.then(recList => {
			if (!recList) return;
			let recDivs = recList.map((recObj, i) =>
				<BnbRow
					key={recObj.id}
					id = {recObj.id}
					name = {recObj.name}
					neighborhood = {recObj.neighborhood}
					price = {recObj.price}
					rating = {recObj.rs_rating}
					onClick={() => this.submitGetInfo(recObj.id)} 
				/>
			);

			this.setState({
				recs: recDivs
			});
		}, err => {
			console.log(err);
		});
		
	};

	submitRequest() {
		if (this.state.checked) return this.submitComplexRequest();
			this.submitSimpleRequest();
	}


	
//HANDLERS
	handleBoroughChange(e) {
		this.setState({
			selectedBorough: e.target.value
		});
	};
	handleRoomTypeChange(e) {
		this.setState({
			selectedRoomType: e.target.value
		});
	};
	handleNumPeopleChange(e) {
		this.setState({
			selectedNumPeople: e.target.value
		});
	};
	handlePriceChange(e) {
		this.setState({
			selectedPrice: e.target.value
		});
	};
	handleRatingChange(e) {
		this.setState({
			selectedRating: e.target.value
		});
	};
	handleCrimeChange(e) {
		this.setState({
			selectedCrime: e.target.value
		});
	};
	handleRestaurantChange(e) {
		this.setState({
			selectedRestaurant: e.target.value
		});
	};
	handleHospitalChange(e) {
		this.setState({
			selectedHospital: e.target.value
		});
	};

	handleCheckChange(e) {
		if (this.state.checked) {
			this.setState({
				checked: false
			});
		} else {
			this.setState({
				checked: true
			});
		}
	};

//render
	render() {
		return (
			<div className="Search">
				
				<PageNavbar/>

				<div className="search-container">
					<div className="jumbotron">
						<div className="h1">Find your Air BnB</div>
						<br></br>
					</div>
				</div>
				<div className="search-container">
					<div className="jumbotron">
						<div className="h5">Required Fields</div>
						<br></br>
						<div className="dropdown">
							
							<div className="header"><strong>Borough</strong>
							<select value={this.state.selectedBorough} onChange={this.handleBoroughChange} className="dropdown-content" id="boroughDropdown">
								{this.state.borough}
							</select>
							</div>

							<div className="header"><strong>Room Type</strong>
							<select value={this.state.selectedRoomType} onChange={this.handleRoomTypeChange} className="dropdown-content" id="roomTypeDropdown">
								{this.state.roomType}
							</select>
							</div>

							<div className="header"><strong>Num. People</strong>
							<select value={this.state.selectedNumPeople} onChange={this.handleNumPeopleChange} className="dropdown-content" id="numPeopleDropdown">
								{this.state.numPeople}
							</select>
							</div>


							<div className="header">
								<strong>Price </strong> 
							<div className="slidecontainer">
							<input type="range" min="10" max="1000" value={this.state.selectedPrice} 
								onChange={this.handlePriceChange} 
								class="slider" id="myRange"></input>
  							Value: {this.state.selectedPrice}<span id="demo"></span>
							</div>
							</div>

						

							<div className="header">
								<strong>Rating </strong> 
							<div className="slidecontainer">
							<input type="range" min="1" max="100" value={this.state.selectedRating} 
								onChange={this.handleRatingChange} 
								class="slider" id="myRange"></input>
  							Value: {this.state.selectedRating}<span id="demo"></span>
							</div>
							</div>

							<br></br>
							<br></br>

							<div className="h5">Advanced Search</div>
							<div>
								<label className="container">
  									<input type="checkbox" onClick={this.handleCheckChange}></input>
 									<span class="checkmark"></span>
								</label>
							</div>

							<br></br>
							<br></br>
						

							<div className="header"><strong>Hospital</strong>
							<select value={this.state.selectedHospital} onChange={this.handleHospitalChange} className="dropdown-content" id="hospitalDropdown">
								{this.state.hospital}
							</select></div>

							<div className="header"><strong>Restaurant</strong>
							<select value={this.state.selectedRestaurant} onChange={this.handleRestaurantChange} className="dropdown-content" id="restaurantDropdown">
								{this.state.restaurant}
							</select></div>
							
							<div className="header"><strong>Crime</strong>
							<select value={this.state.selectedCrime} onChange={this.handleCrimeChange} className="dropdown-content" id="crimeDropdown">
								{this.state.crime}
							</select></div>

					
							<button className="submit-button" id="submitBtn" onClick={this.submitRequest}>Submit</button>



						</div>

						</div>
				</div>
					
			
				<div className="search-container">
				<div className="jumbotron">
					<div className="recs-container">
					<div className="h5">Air Bnbs Found Based on your Criteria:</div>
					<div className="recResults">
							<div className="header"><strong> Id </strong></div>
					  		<div className="header"><strong>Name </strong></div>
					  		<div className="header"><strong>Neighborhood </strong></div>
					  		<div className="header"><strong>Price </strong></div>
							<div className="header"><strong>Rating </strong></div>

					  	</div>
					<table class="table table-hover row-clickable">
    				<tbody>
						<tr>
						<div className= "recs-container" id="results" > {this.state.recs[0]} 
						</div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[1]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[2]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[3]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[4]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[5]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[6]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[7]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[8]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[9]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[10]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[11]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[12]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[13]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[14]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[15]} </div>
						</tr>
						
    				</tbody>
					</table>


					</div>

				
					</div>

					</div>

			
				
			</div>



			
				
		
		);
	};
};


{/* <table class="table table-hover row-clickable">
    				<tbody>
						<tr>
						<div className= "recs-container" id="results" > {this.state.recs[0]} 
						</div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[1]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[2]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[3]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[4]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[5]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[6]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[7]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[8]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[9]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[10]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[11]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[12]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[13]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[14]} </div>
						</tr>
						<tr>
						<div className= "recs-container" id="results"> {this.state.recs[15]} </div>
						</tr>
						
    				</tbody>
					</table> 
				
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


					</div>

					<div className="recs-container" id="results"> {this.state.recs} </div>
					
				
					</div>

					</div>*/}