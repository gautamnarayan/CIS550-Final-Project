import React from 'react';
import PageNavbar from './PageNavbar';
import Map from './Map'

export default class Results extends React.Component {
	render() {
		return (
			<div className="Results">
				<PageNavbar />
				<br/>
				<Map/>
			</div>
		);
	};
};
