import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CrimeRow extends React.Component {

	render() {
		return (

			<div className="crimeResults">
			    <div className="offense">{this.props.offense}</div>
				<div className="count">{this.props.count}</div>
				{/* <div className="count">{this.props.count}</div> */}
			</div>
		);
	};
};