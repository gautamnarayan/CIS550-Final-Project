import React from 'react';
import PageNavbar from './PageNavbar';
import BestMoviesRow from './BestMoviesRow';
import '../style/BestMovies.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestMovies extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			selectedGenre: "",
			decades: [],
			genres: [],
			movies: []
		};

		this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
		this.handleDecadeChange = this.handleDecadeChange.bind(this);
		this.handleGenreChange = this.handleGenreChange.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() {

		// Send an HTTP request to the server.
		fetch("http://localhost:8081/decades",
		{
			method: 'GET' // The type of HTTP request.
		}).then(res => {
			// Convert the response data to a JSON.
			return res.json();
		}, err => {
			// Print the error if there is one.
			console.log(err);
		}).then(decadeList => {
			if (!decadeList) return;

			let decadeDivs = decadeList.map((decade, i) =>
			<option className = "decadesOption" value = {decade.FloorValue}>{decade.FloorValue}</option>
			);

			// Set the state of the keywords list to the value returned by the HTTP response from the server.
			this.setState({
			decades: decadeDivs

			});
		}, err => {
			// Print the error if there is one.
			console.log(err);
		});

		// Send an HTTP request to the server.
		fetch("http://localhost:8081/genres",
		{
			method: 'GET' // The type of HTTP request.
		}).then(res => {
			// Convert the response data to a JSON.
			return res.json();
		}, err => {
			// Print the error if there is one.
			console.log(err);
		}).then(genreList => {
			if (!genreList) return;

			const genreDivs = genreList.map((genre, i) =>
			<option className = "genresOption" value = {genre.name}>{genre.name}</option>
			);

			// Set the state of the keywords list to the value returned by the HTTP response from the server.
			this.setState({
			genres: genreDivs,

			});
		}, err => {
			// Print the error if there is one.
			console.log(err);
		});

		
	};


	/* ---- Q3a (Best Movies) ---- */
	handleDecadeChange(e) {
		this.setState({
			selectedDecade: e.target.value
		});
	};

	handleGenreChange(e) {
		this.setState({
			selectedGenre: e.target.value
		});
	};

	/* ---- Q3b (Best Movies) ---- */
	submitDecadeGenre() {
		// Send an HTTP request to the server.

		
		const decade = this.state.selectedDecade;
		const genre = this.state.selectedGenre;
		
		const url = new URL('http://localhost:8081/bestmovies/');
		const queryParams = {decade: decade, genre: genre};

		// If there are more than one query parameters, this is useful.
		Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
		
		fetch(url,
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(bestMovieList => {
		  if (!bestMovieList) return;
	
		  //Map each to a <DashboardMovieRow />
			console.log(bestMovieList)
	   		const bestMovieDivs = bestMovieList.map((movie, i) =>
		  <BestMoviesRow
			// ta said just do thismovie = {movie}
			title={movie.title} 
			id={movie.movie_id}
			rating={movie.rating}
		 /> 
	   );
	   console.log(bestMovieList)
		// Set the state of the keywords list to the value returned by the HTTP response from the server.
		this.setState({
		 movies: bestMovieDivs
		

	   });
	 }, err => {
	   // Print the error if there is one.
	   console.log(err);
	 });
   };
		

	render() {
		return (
			<div className="BestMovies">
				
				<PageNavbar active="bestgenres" />

				<div className="container bestmovies-container">
					<div className="jumbotron">
						<div className="h5">Best Movies</div>
						<div className="dropdown-container">
							<select value={this.state.selectedDecade} onChange={this.handleDecadeChange} className="dropdown" id="decadesDropdown">
								{this.state.decades}
							</select>
							<select value={this.state.selectedGenre} onChange={this.handleGenreChange} className="dropdown" id="genresDropdown">
								{this.state.genres}
							</select>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>
						</div>
					</div>
					<div className="jumbotron">
						<div className="movies-container">
							<div className="movie">
			          <div className="header"><strong>Title</strong></div>
			          <div className="header"><strong>Movie ID</strong></div>
								<div className="header"><strong>Rating</strong></div>
			        </div>
			        <div className="movies-container" id="results">
			          {this.state.movies}
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
		);
	};
};
