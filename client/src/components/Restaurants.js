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
		fetch("http://localhost:8081/decades",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(decadesList => {
		  if (!decadesList) return;
		  // Map each keyword in this.state.keywords to an HTML element:
		  // A button which triggers the showMovies function for each keyword.
		

		  const decadeDivs = decadesList.map((obj, i) =>
		    <option key={i} className="decadesOption" value={obj.decade}>{obj.decade}</option>
		  );

		  // Set the state of the keywords list to the value returned by the HTTP response from the server.
		  this.setState({
		    decades: decadeDivs
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});

		fetch("http://localhost:8081/genres",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(genresList => {
		  if (!genresList) return;
		  console.log(genresList)
		  // Map each keyword in this.state.keywords to an HTML element:
		  // A button which triggers the showMovies function for each keyword.
		  const genreDivs = genresList.map((genreObj, i) =>
		    <option className="genresOption" value={genreObj.name}>{genreObj.name}</option>
		  );

		  // Set the state of the keywords list to the value returned by the HTTP response from the server.
		  this.setState({
		    // decades: decadeDivs,
		    genres: genreDivs
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});

		

	};

	/* ---- Q3a (Best Movies) ---- */
	handleDecadeChange(e) {
		console.log(e.target.value);
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
		const url = new URL('http://localhost:8081/bestmovies');
		url.searchParams.append("decade", this.state.selectedDecade);
		url.searchParams.append("genre", this.state.selectedGenre);
		// console.log('http://localhost:8081/bestmovies/'+this.state.selectedGenre+'arldkskdfcaf,djonkog'+this.state.selectedDecade);
		// fetch('http://localhost:8081/bestmovies/'+this.state.selectedGenre+'arldkskdfcaf,djonkog'+this.state.selectedDecade,
		fetch(url,

		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(keywordsList => {
		  if (!keywordsList) return;

		  // Map each keyword in this.state.keywords to an HTML element:
		  // A button which triggers the showMovies function for each keyword.
		  const keywordsDivs = keywordsList.map((movieObj, i) =>
		    <BestMoviesRow 
		      title = {movieObj.title}
		      movie_id = {movieObj.movie_id}
	          rating = {movieObj.rating}
		    /> 
		  );

		  // Set the state of the keywords list to the value returned by the HTTP response from the server.
		  this.setState({
		    movies: keywordsDivs
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
