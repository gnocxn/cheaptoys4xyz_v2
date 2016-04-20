import React from 'react';
import Firebase from 'firebase';
import _ from 'lodash';

const firebaseRef = new Firebase('https://aliexpress.firebaseio.com/sites/cheaptoys4yz/products');
const watting = 'https://49.media.tumblr.com/e7efc2afbed488b45c7df9c2dea0d6a3/tumblr_o5xgbsQjnw1vsnhfwo1_250.gif';

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			_products : [],
			filter : {},
			sortBy : 'SoldHighestFirst',
			isLoaded: false
		}
		this.__productClick = this.__productClick.bind(this);
		this.__queryProducts = this.__queryProducts.bind(this);
	}

	componentWillMount() {
		let self = this;
		firebaseRef.on('value', function (dataSnapshot) {
			let data = dataSnapshot.val();
			let products = _.values(data);
			self.setState({
				_products : products
			},function(){
				self.__queryProducts();
			})
		})
		//db('products').remove({});
		//let productsCount = db('products').chain().filter({}).size().value();
		/*if(productsCount > 0) {
			self.__queryProducts();
			setTimeout(function(){
				firebaseRef.once('value', function (dataSnapshot) {
					let data = dataSnapshot.val();
					let products = _.values(data);
					_.each(products, (p)=> {
						let isExists = db('products').chain().some({productId : p.productId}).value();
						if(isExists){
							db('products')
								.chain()
								.find({productId : p.productId})
								.assign(p)
								.value();
						}else{
							db('products').push(p);
						}
					});
					self.__queryProducts();
				});
			},5000)
		}else{
			firebaseRef.once('value', function (dataSnapshot) {
				let data = dataSnapshot.val();
				let products = _.values(data);
				_.each(products, (p)=> {
					let isExists = db('products').chain().some({productId : p.productId}).value();
					if(isExists){
						db('products')
							.chain()
							.find({productId : p.productId})
							.assign(p)
							.value();
					}else{
						db('products').push(p);
					}
				});
				self.__queryProducts();
			});
		}*/
	}

	componentDidMount() {
		let self = this;
		window.emitter.addListener('changeSortBy', (sortBy) =>{
			self.setState({sortBy : sortBy}, ()=>{
				self.__queryProducts();
			});
		});

		window.emitter.addListener('changeFilter', (filter) =>{
			self.setState({filter : filter}, ()=>{
				self.__queryProducts();
			});
		});

		mixpanel.track("App view");
	}

	componentDidUpdate(){
		//this.__queryProducts();
	}

	__queryProducts(){
		this.setState({isLoaded : false});
		let products = this.state._products;
		let filter = this.state.filter;
		let sortBy = this.state.sortBy;
		switch (sortBy) {
			case 'SoldHighestFirst':
				products = _.chain(products).filter(filter).sortBy((p)=> {
					return p.volume
				}).reverse().value();
				break;
			case 'SoldLowestFirst':
				products = _.chain(products).filter(filter).sortBy((p)=> {
					return p.volume
				}).value();
				break;
			case 'PriceHighestFirst':
				products = _.chain(products).filter(filter).sortBy((p)=> {
					return p._salePrice
				}).reverse().value();
				break;
			case 'PriceLowestFirst':
				products = _.chain(products).filter(filter).sortBy((p)=> {
					return p._salePrice
				}).value();
				break;
			default :
				products = _.chain(products).filter(filter).value()
				break;
		}
		this.setState({isLoaded : true, products : products});
	}

	__productClick(e) {
		let p = e.target.parentNode;
		let productUrl = p.getAttribute('data-url') || p.getAttribute('href');
		if(ga){
			ga('send', 'event', 'Products', 'Click', productUrl);
		}
		if (mixpanel) {
			mixpanel.track("Click Product", {
				product: productUrl
			});
		}
	}

	render() {
		let products = this.state.products;

		let isLoaded = this.state.isLoaded;
		if (isLoaded && products) {
			return <div className="row">
				{products.map((product)=> {
					return <div className="col-lg-3 col-md-4 col-xs-6 thumb" key={product.productId}>
						<a href={`${product.promotionUrl}`} target="_blank"
						   className="thumbnail" data-url={product.productUrl} onClick={this.__productClick}>
							<ImageProduct id={product.productId} alt={product.productTitle} src={product.imageUrl}/>
						</a>

						<p className="info">
							<span className="pull-left">Sold : {product.volume}</span>
							<span className="pull-right">{product.salePrice}</span>
						</p>
					</div>
				})}
			</div>
		} else {
			return <div className="row">
				<div className="col-md-12">
					<img src={watting} alt="Loading..." className="center-block" width="100px" height="100px"/>
				</div>
			</div>
		}

	}
}

let ImageProduct = React.createClass({
	componentDidMount(){
		let image = new Image();
		let imageProduct = document.getElementById(`image_${this.props.id}`);
		image.onload = function () {
			imageProduct.src = this.src;
		}
		image.src = this.props.src;
	},
	render(){
		return <img src={watting} alt={this.props.alt} className="image-responsive center-block"
		            id={`image_${this.props.id}`}/>
	}
})