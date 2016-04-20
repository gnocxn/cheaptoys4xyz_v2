require('expose?$!expose?jQuery!jquery');
require("bootstrap-webpack");
require('./index.css');

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory,IndexRedirect } from 'react-router';


import Home from './pages/Home.jsx';

class App extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return <div>
			<Header/>
			<div className="container">{this.props.children}</div>
		</div>
	}
}

let {EventEmitter} = require('fbemitter');
window.emitter = new EventEmitter();


let Header = React.createClass({
	__sltSortByChange(e){
		window.emitter.emit('changeSortBy', e.target.value);
	},
	render(){
		return (
			<nav className="navbar navbar-default navbar-fixed-top">
				<div className="container">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className="navbar-brand" href="#">CheapToys4XYZ</a>
					</div>
					<div id="navbar" className="navbar-collapse collapse">
						<ul className="nav navbar-nav">
							<li className="active"><a href="/">Home</a></li>
						</ul>
						<form className="navbar-form navbar-right">
							<div className="form-group">
								<label htmlFor="sltSortBy">Sort:&nbsp;</label>
								<select name="sltSortBy" id="sltSortBy" className="form-control" onChange={this.__sltSortByChange}>
									<option value="SoldHighestFirst">Sold : highest first</option>
									<option value="SoldLowestFirst">Sold : lowest first</option>
									<option value="PriceHighestFirst">Price : highest first</option>
									<option value="PriceLowestFirst">Price : lowest first</option>
								</select>
							</div>
						</form>
					</div>
				</div>
			</nav>
		)
	}
})

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home}/>
		</Route>
	</Router>
	, document.getElementById('app'));