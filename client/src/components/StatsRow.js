import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class StatsRow extends React.Component {

	render() {
		return (
			<div className="statResults">		
				<div className="section">{this.props.section}</div>
                <div className="percent">{this.props.percent}</div>
			</div>
		);
	};
};
