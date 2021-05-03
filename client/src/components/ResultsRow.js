import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ResultsRow extends React.Component {
	//					<div className="id">{this.props.id}</div>
			

	render() {
		return (

			<div className="infoResults">
				<div className="header"><strong>Id:</strong></div>		
				<div className="id">{this.props.id}</div>
				<div className="header"><strong>URL:</strong></div>
                 <div className="url">{this.props.url}</div>
				 <div className="header"><strong>Name:</strong></div>
				<div className="name">{this.props.name}</div>
				<div className="header"><strong>Neighborhood:</strong></div>
				<div className="neighborhood">{this.props.neighborhood}</div>
				<div className="header"><strong>Borough:</strong></div>
                <div className="borough">{this.props.borough}</div>
				<div className="header"><strong>Latitude:</strong></div>
                <div className="latitude">{this.props.latitude}</div>
				<div className="header"><strong>Longitude:</strong></div>
                <div className="longitude">{this.props.longitude}</div>
				<div className="header"><strong>Room Type:</strong></div>
                <div className="room_type">{this.props.room_type}</div>
				<div className="header"><strong>Accomodates:</strong></div>
                <div className="accommodates">{this.props.accommodates}</div>
				<div className="header"><strong>Price</strong></div>
				<div className="price">{this.props.price}</div>
				<div className="header"><strong>Minimum Num. Nights:</strong></div>
                <div className="min_nights">{this.props.min_nights}</div>
				<div className="header"><strong>Maximum Num. Nights:</strong></div>
                <div className="max_nights">{this.props.max_nights}</div>
				<div className="header"><strong>Rating:</strong></div>
				<div className="rating">{this.props.rating}</div>
			</div>
		);
	};
};
