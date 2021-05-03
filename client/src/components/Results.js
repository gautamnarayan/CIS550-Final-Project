import React from 'react';
import PageNavbar from './PageNavbar';
import Map from './Map'
import ResultsRow from './ResultsRow';
import RestaurantElem from './RestaurantElem';
import '../style/ResultsRow.css';
import '../style/RestaurantElem.css';

import '../style/Search.css';

export default class Results extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id : this.props.match.params.id,
			url :  this.props.match.params.url,
			rests: [],
			hosps: [],
			results : []
		}
	};

	componentDidMount() {
		fetch(`http://localhost:8081/Results/${this.state.id}`, {
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
	
				this.setState({
					results: infoDivs
				});
				
			}, err => {
				console.log(err);
			});
		

		fetch(`http://localhost:8081/restaurants/${this.state.id}`, {
			 method: "GET",
		})
		.then(res => {
			return res.json();      // Convert the response data to a JSON.
		}, err => {
			console.log(err);       // Print the error if there is one.
		})
		.then(restList => {
			if (!restList) return;
			let restDivs = restList.map((r, i) =>
				<RestaurantElem 
					name = {r.name}
					phone = {r.PHONE}
				/>
            );

			this.setState({
				rests: restDivs
			});
			
		}, err => {
			console.log(err);
		});

		fetch(`http://localhost:8081/hospitals/${this.state.id}`, {
			 method: "GET",
		})
		.then(res => {
			return res.json();      // Convert the response data to a JSON.
		}, err => {
			console.log(err);       // Print the error if there is one.
		})
		.then(hospList => {
			if (!hospList) return;
			let hospDivs = hospList.map((r, i) =>
              <option className="hospOption" key={i} 
			  	value={r.name}>{r.name}
			</option>
            );

			this.setState({
				hosps: hospDivs
			});
			
		}, err => {
			console.log(err);
		});

	}

	//   <br/>
	// 			<Map/>
	render() {
		return (
			<div className="Results">

				<PageNavbar />

				
				<div className="jumbotron">
						<div className="h1">Air BnB #{this.state.id}</div>

						<div className="info-container">
							<p> {this.state.results}  </p>

							<div className="rest-container" id="restResults">  {this.state.rests} </div>
							<p>  </p>
							<p> {this.state.hosps} </p>
							
						</div>
				
				</div>

			</div>

	
		);
	};
};


