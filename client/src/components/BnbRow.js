import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BnbRow extends React.Component {
			

	render() {
		return (

			<div className="recResults">
				 <a className="id" key={this.props.id} value="home"  onClick={this.props.onClick}
				 	href={'/Results/'+this.props.id}>{this.props.id}
				</a>
				<div className="name">{this.props.name}</div>
				<div className="neighborhood">{this.props.neighborhood}</div>
				<div className="price">{this.props.price}</div>
				<div className="rating">{this.props.rating}</div>
				
			</div>
		);
	};
};
