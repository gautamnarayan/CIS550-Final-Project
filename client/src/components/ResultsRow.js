import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ResultsRow extends React.Component {
	//					<div className="id">{this.props.id}</div>
			

	render() {
		return (

			<div className="infoResults">
				 <div className="id">{this.props.id}</div>
                 <div className="url">{this.props.url}</div>
				<div className="name">{this.props.name}</div>
				<div className="neighborhood">{this.props.neighborhood}</div>
                <div className="borough">{this.props.borough}</div>
                <div className="latitude">{this.props.latitude}</div>
                <div className="longitude">{this.props.longitude}</div>
                <div className="room_type">{this.props.room_type}</div>
                <div className="accommodates">{this.props.accommodates}</div>
				<div className="price">{this.props.price}</div>
                <div className="min_nights">{this.props.min_nights}</div>
                <div className="max_nights">{this.props.max_nights}</div>
				<div className="rating">{this.props.rating}</div>
			</div>
		);
	};
};
