import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class StarbucksRow extends React.Component {

	render() {
		return (

			<div className="">
			    <div className="num_starbucks">{this.props.num_starbucks}</div>
				
			</div>
		);
	};
};