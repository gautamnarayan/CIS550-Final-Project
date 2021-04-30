import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/Search.css';
import BnbRow from './BnbRow';
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
			rating: [], 
			crime: [], 
			restaurants: [], 
			hospitals: [],
			recs: [],
		};

		this.handleBoroughChange = this.handleBoroughChange.bind(this);
		this.handleRoomTypeChange = this.handleRoomTypeChange.bind(this);
		this.handleNumPeopleChange = this.handleNumPeopleChange.bind(this);
		this.handlePriceChange = this.handlePriceChange.bind(this);
		this.handleRatingChange = this.handleRatingChange.bind(this);
		this.handleCrimeChange = this.handleCrimeChange.bind(this);
		this.handleRestaurantChange = this.handleRestaurantChange.bind(this);
		this.handleHospitalChange = this.handleHospitalChange.bind(this);
		this.submitSimpleRequest = this.submitSimpleRequest.bind(this);
			
	};



	componentDidMount() {
        // request for room types
        fetch("http://localhost:8081/roomtypes", {
            method: 'GET'
        })
        .then(res => {
            return res.json();      // Convert the response data to a JSON.
        }, err => {
            console.log(err);       // Print the error if there is one.
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
		
		

		//set rating
		const ratingList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
		let ratingDivs = ratingList.map((v, i) =>
			<option className="ratingOption" key={v} value={v}>{v}</option>
		);
		
		this.setState({
			rating: ratingDivs
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
					index = {i + 1}
					id = {i + 1}
					abnbID = {recObj.id}
					name = {recObj.name}
					neighborhood = {recObj.neighborhood}
					price = {recObj.price}
					rating = {recObj.rs_rating}
				/>
			);

			this.setState({
				recs: recDivs
			});
		}, err => {
			console.log(err);
		});
	};

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
							</select></div>
							<div className="header"><strong>Num. People</strong>
							<select value={this.state.selectedNumPeople} onChange={this.handleNumPeopleChange} className="dropdown-content" id="numPeopleDropdown">
								{this.state.numPeople}
							</select></div>
							<div className="header"><strong>Price</strong>
							<select value={this.state.selectedPrice} onChange={this.handlePriceChange} className="dropdown-content" id="priceDropdown">
								{this.state.price}
							</select></div>

							<div className="header"><strong>Rating</strong>
							<select value={this.state.selectedRating} onChange={this.handleRatingChange} className="dropdown-content" id="ratingDropdown">
								{this.state.rating}
							</select></div>


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

					
							<button className="submit-button" id="submitBtn" onClick={this.submitSimpleRequest}>Submit</button>

						</div>
						
						<div className="slidecontainer">
  							<input type="range" min="1" max="100" value="50" class="slider" id="myRange"></input>
  							<p>Value: <span id="demo"></span></p>
						</div>
					
					</div>
				</div>


				<div className="search-container">
				<div className="jumbotron">
					<div className="recs-container">
						<div className="rec">
							<div className="header"><strong>Index </strong></div>
					  		<div className="header"><strong>Name </strong></div>
					  		<div className="header"><strong>Neighborhood </strong></div>
					  		<div className="header"><strong>Price </strong></div>
							<div className="header"><strong>Rating </strong></div>

					  	</div>
					</div>

			        <div className="recs-container" id="results"> {this.state.recs} </div>
				</div>
				</div>
				
			</div>



						
				
		
		);
	};
};


