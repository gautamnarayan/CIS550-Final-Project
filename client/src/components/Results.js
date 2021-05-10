import React from 'react';
import PageNavbar from './PageNavbar';
import ResultsRow from './ResultsRow';
import RestaurantElem from './RestaurantElem';
import HospitalRow from './HospitalRow';
import CrimeRow from './CrimeRow';
import StatsRow from './StatsRow';
import '../style/ResultsRow.css';
import '../style/RestaurantElem.css';
import '../style/HospitalRow.css';
import '../style/Search.css'
import '../style/CrimeRow.css'
import '../style/StatsRow.css'




export default class Results extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id : this.props.match.params.id,
			url :  this.props.match.params.url,
			rests: [],
			hosps: [],
			results : [],
			coordinates : [],
			realUrl: [],
			crimes: [],
			stats: []
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
				
				//get stats by borough
				fetch(`http://localhost:8081/x/${infoList[0].borough}`, {
					method: "GET",
				})
				
				.then(res => {
					return res.json();      // Convert the response data to a JSON.
				}, err => {
					console.log(err);       // Print the error if there is one.
				})
				.then(statList => {
					if (!statList) return;
					let statDivs = statList.map((s, i) =>
						<StatsRow
							section = {s.section}
							percent = {s.percent}
						/>
					);
					this.setState({
						stats: statDivs
					});
				}, err => {
					console.log(err);
				});

				
				let coords = infoList.map((recObj, i) =>
					"https://www.google.com/maps/embed/v1/place?q=" + 
					recObj.latitude + "%2C%20" + recObj.longitude + 
					"&key=AIzaSyB6YKb-drsVI0X6HEBDmYRNJIthveN8EEw"						
					
				);
				let u = infoList.map((recObj, i) =>
					recObj.listing_url				
				);
	
				this.setState({
					results: infoDivs,
					coordinates: coords,
					realUrl: u
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
				if (!hospList)  return;
				
				if (hospList.length === 0 ) {
					let hospDivs = [0].map((r, i) =>
						<HospitalRow
						name = {"There are no hospitals within a quarter mile radius."}
						/>
					);
					this.setState({
						hosps: hospDivs
					});
				} else {

					let hospDivs = hospList.map((r, i) =>
						<HospitalRow
						name = {r.name}
						phone = {r.phone}
						type = {r.type}
						/>
					);
					this.setState({
						hosps: hospDivs
					});
				}
				
			}, err => {
				console.log(err);
			});

		fetch(`http://localhost:8081/crimes/${this.state.id}`, {
			 method: "GET",
		})
		.then(res => {
			return res.json();      // Convert the response data to a JSON.
		}, err => {
			console.log(err);       // Print the error if there is one.
		})
		.then(crimeList => {
			if (!crimeList) return;
			let crimeDivs = crimeList.map((r, i) =>

			<CrimeRow
				offense = {r.offense}
				count = {r.count}
			/>
            );

			this.setState({
				crimes: crimeDivs
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
				<a href={"" + this.state.realUrl}><div className="h1">Air BnB #{this.state.id}</div></a>
						<iframe width="600" height="450" loading="lazy" allowfullscreen
									src={this.state.coordinates[0]}></iframe>

						<div className="info-container">
						<p> {this.state.results}  </p>

						</div>
						<div className="info-container">
							<div className="header"><strong>Statistics of Borough Compared to all of NYC</strong>
							<div className="stat-container">
							<div className="jumbotron">
								<div className="stat-container">
									<div className="stat">
										<div className="header"><strong>Section </strong></div>
					  					<div className="header"><strong>Percent </strong></div>
									</div>
							<div className="stat-container" id="statResults">  {this.state.stats} </div>
							
							</div>
							</div>
							</div>
							</div>
						</div>
						
						<div className="info-container">

							<br></br>

							<div className="header"><strong>Restaurants Nearby</strong>
							<div className="rest-container">
							<div className="jumbotron">
								<div className="rest-container">
									<div className="rec">
										<div className="header"><strong>Name </strong></div>
					  					<div className="header"><strong>Phone Number </strong></div>
									</div>
							<div className="rest-container" id="restResults">  {this.state.rests} </div>
							
							</div>
							</div>
							</div>
							</div>
						</div>

						<div className="info-container">

							<br></br>

							<div className="header"><strong>Hospitals Nearby</strong>
							<div className="hosp-container">
							<div className="jumbotron">
								<div className="hosp-container">
									<div className="rec">
										<div className="header"><strong>Name </strong></div>
					  					<div className="header"><strong>Phone Number </strong></div>
					  					<div className="header"><strong>Facility Type(s) </strong></div>

									</div>
								<div className="hosp-container" id="hospResults">  {this.state.hosps} </div>
								
							</div>
							</div>
							</div>
							</div>
						</div>

						<div className="info-container">

							<br></br>

							<div className="header"><strong>Crime Nearby</strong>
							<div className="recs-container">
							<div className="jumbotron">
								<div className="recs-container">
									<div className="rec">
										<div className="header"><strong>Offense Name </strong></div>
					  					<div className="header"><strong>Crime Count </strong></div>

									</div>
									<div className="crime-container" id="crimeResults">  {this.state.crimes} </div>

							
							</div>
							</div>
							</div>
							</div>
						</div>

				
						</div>
						  
			</div>

	
		);
	};
};


