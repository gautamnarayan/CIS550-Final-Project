import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default class Home extends React.Component {
  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />
        <br />
        
      </div>
    );
  };
};
