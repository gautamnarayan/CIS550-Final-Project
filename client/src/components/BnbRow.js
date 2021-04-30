import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BnbRow extends React.Component {
	
	render() {
		return (
			<div className="recResults">
				<div className="id">{this.props.id}</div>
				<div className="name">{this.props.name}</div>
				<div className="neighborhood">{this.props.neighborhood}</div>
				<div className="price">{this.props.price}</div>
				<div className="rating">{this.props.rating}</div>
			</div>
		);
	};
};
