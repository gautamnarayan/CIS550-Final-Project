import React from 'react';
import PageNavbar from './PageNavbar';
import Map from './Map'
import ResultsRow from './ResultsRow';
import '../style/ResultsRow.css';
import '../style/Results.css';

export default class Results extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id : this.props.match.params.id,
			results: []
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
		
	}

	//   <br/>
	// 			<Map/>
	render() {
		return (
			<div className="Results">

				<PageNavbar />
				
			<p> {this.state.results} </p>
				
				
			</div>
		);
	};
};
