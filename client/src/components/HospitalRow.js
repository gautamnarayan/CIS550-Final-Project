import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class HospitalRow extends React.Component {

	render() {
		return (

			<div className="hospResults">
			    <div className="name">{this.props.name}</div>
				<div className="phone">{this.props.phone}</div>
                <div className="phone">{this.props.type}</div>
			</div>
		);
	};
};