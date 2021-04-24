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
			borough: [],
			roomType: [],
			numPeople: [],
			price: [],
			rating: []
		};

		this.handleBoroughChange = this.handleBoroughChange.bind(this);
		this.handleRoomTypeChange = this.handleRoomTypeChange.bind(this);
		this.handleNumPeopleChange = this.handleNumPeopleChange.bind(this);
		this.handlePriceChange = this.handlePriceChange.bind(this);
		this.handleRatingChange = this.handleRatingChange.bind(this);



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

	render() {
		return (
			<div className="Search">
				
				<PageNavbar/>

						<div className="dropdown-container">
							<select value={this.state.selectedBorough} onChange={this.handleBoroughChange} className="dropdown" id="boroughDropdown">
								{this.state.decades}
							</select>
							<select value={this.state.selectedRoomType} onChange={this.handleRoomTypeChange} className="dropdown" id="roomTypeDropdown">
								{this.state.genres}
							</select>
							<select value={this.state.selectedNumPeople} onChange={this.handleNumPeopleChange} className="dropdown" id="numPeopleDropdown">
								{this.state.genres}
							</select>
							<select value={this.state.selectedPrice} onChange={this.handlePriceChange} className="dropdown" id="priceDropdown">
								{this.state.genres}
							</select>
							<select value={this.state.selectedRating} onChange={this.handleRatingChange} className="dropdown" id="ratingDropdown">
								{this.state.genres}
							</select>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>
						</div>
				
			</div>
		);
	};
};


