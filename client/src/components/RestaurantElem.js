import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RestaurantElem extends React.Component {
	render() {
		return (
			<div className="restResults">
				<div className="name">{this.props.name}</div>
				<div className="phone">{this.props.phone}</div>
			</div>
		);
	};
};
