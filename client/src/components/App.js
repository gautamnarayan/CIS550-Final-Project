import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Home from './Home';
import Search from './Search'
import Results from './Results'
import SearchByAttractions from './SearchByAttractions';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
					<Route
						path="/Home"
						render={() => <Home />}	
					/>
					<Route
						path="/Search"
						render={() => <Search />}
					/>
					<Route path="/Results/:id" component={Results} />
					
					<Route
						path="/SearchByAttractions"
						render={() => <SearchByAttractions />}
					/>

					</Switch>
				</Router>
			</div>
		);
	};
};