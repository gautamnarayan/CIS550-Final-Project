import React from 'react';
import PageNavbar from './PageNavbar';

import 'bootstrap/dist/css/bootstrap.min.css';

export default class Search extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedBorough: "",
			selectedRoomType: "",
			selectedNumPeople: "",
			selectedPrice: "",
			selectedRating: "",
			selectedCrime: "",
			selectedRestaurants: "",
			selectedHospitals: "",
			borough: [],
			roomType: [],
			numPeople: [],
			price: [],
			rating: [], 
			crime: [], 
			restaurants: [], 
			hospitals: []
		};

		this.handleBoroughChange = this.handleBoroughChange.bind(this);
		this.handleRoomTypeChange = this.handleRoomTypeChange.bind(this);
		this.handleNumPeopleChange = this.handleNumPeopleChange.bind(this);
		this.handlePriceChange = this.handlePriceChange.bind(this);
		this.handleRatingChange = this.handleRatingChange.bind(this);
		this.handleCrimeChange = this.handleCrimeChange.bind(this);
		this.handleRestaurantsChange = this.handleRestaurantsChange.bind(this);
		this.handleHospitalsChange = this.handleHospitalsChange.bind(this);


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

	handleRestaurantsChange(e) {
		this.setState({
			selectedRestaurants: e.target.value
		});
	};

	handleHospitalsChange(e) {
		this.setState({
			selectedHospitals: e.target.value
		});
	};

	render() {
		return (
			<div className="Search">
				
				<PageNavbar/>

				<div className="container search-container">
					<div className="jumbotron">
						<div className="h2">Find your Air BnB</div>
						<br></br>
					</div>
				</div>
				
				<div className="container search-container">
					<div className="jumbotron">
						<div className="h5">Required Fields</div>
						<br></br>
						<div className="dropdown-container">
							<div className="header"><strong>Borough</strong>
							<select value={this.state.selectedBorough} onChange={this.handleBoroughChange} className="dropdown" id="boroughDropdown">
								{this.state.borough}
							</select>
							</div>
							<div className="header"><strong>Room Type</strong>
							<select value={this.state.selectedRoomType} onChange={this.handleRoomTypeChange} className="dropdown" id="roomTypeDropdown">
								{this.state.roomType}
							</select></div>
							<div className="header"><strong>Number of People</strong>
							<select value={this.state.selectedNumPeople} onChange={this.handleNumPeopleChange} className="dropdown" id="numPeopleDropdown">
								{this.state.numPeople}
							</select></div>
							<div className="header"><strong>Price</strong>
							<select value={this.state.selectedPrice} onChange={this.handlePriceChange} className="dropdown" id="priceDropdown">
								{this.state.price}
							</select></div>
							<div className="header"><strong>Rating</strong>
							<select value={this.state.selectedRating} onChange={this.handleRatingChange} className="dropdown" id="ratingDropdown">
								{this.state.rating}
							</select></div>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>

						</div>
					
					</div>
				</div>

				<div className="container search-container">
					<div className="jumbotron">
						<div className="h5">Optional Add Ons</div>
						<br></br>
						<div className="dropdown-container"></div>
							<div className="header"><strong>Crime</strong>
							<select value={this.state.selectedBorough} onChange={this.handleBoroughChange} className="dropdown" id="boroughDropdown">
								{this.state.borough}
							</select>
							</div>
							<div className="header"><strong>Restaurants</strong>
							<select value={this.state.selectedBorough} onChange={this.handleBoroughChange} className="dropdown" id="boroughDropdown">
								{this.state.borough}
							</select>
							</div>
							<div className="header"><strong>Hospitals</strong>
							<select value={this.state.selectedBorough} onChange={this.handleBoroughChange} className="dropdown" id="boroughDropdown">
								{this.state.borough}
							</select>
							</div>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>

					</div>
				</div>


						
				
			</div>
		);
	};
};


