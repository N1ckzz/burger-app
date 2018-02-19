import React, {Component} from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axiosInstance from '../../axios-order';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
};

class BurgerBuilder extends Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {...}
	// }
	
	state = {
		ingredients: null,
		totalPrice: 0,
		purchasable: false,
		purchasing: false,
		loading: false
	};
	
	
	componentDidMount() {
		axiosInstance.get('/ingredients.json')
			.then(response => {
				let totalPrice = 0;
				this.setState({ingredients: response.data});
				Object.keys(response.data).forEach( key => {
					// console.log('item -> ' + response.data[key]);
					// console.log('key -> ' + key);
					totalPrice += INGREDIENT_PRICES[key] * response.data[key];
				});
				this.setState({totalPrice : totalPrice});
			})
			.catch(error => {
				console.log('error while retrieving the ingredients');
				console.log(error);
			})
	}
	
	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		this.setState({purchasable: sum > 0});
	};
	
	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + priceAddition;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
	};
	
	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0) {
			return;
		}
		const updatedCount = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceDeduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice - priceDeduction;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
	};
	
	purchaseHandler = () => {
		this.setState({purchasing: true});
	};
	
	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	};
	
	purchaseContinueHandler = () => {
		this.setState({loading: true});
		const order = {
			ingredients: this.state.ingredients,
			totalPrice: this.state.totalPrice,
			customer: {
				name: 'Nicola Bellotti',
				addres: {
					street: 'via del niente',
					zipCode: '12345',
					country: 'nullopoli',
				},
				email: 'test@test.com'
			},
			deliveryMethod: 'fastest'
		};
		
		axiosInstance.post('/orders.json', order)
			.then(response => {
				this.setState({loading: false, purchasing: false});
				console.log(response)
			})
			.catch(error => {
				this.setState({loading: false, purchasing: false});
				console.log(error)
			});
	};
	
	render() {
		const disabledInfo = {
			...this.state.ingredients
		};
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}
		let orderSummary = null;
		let burger = <Spinner/>;
		if(this.state.ingredients) {
			burger = (
				<Aux>
					<Burger ingredients={this.state.ingredients}/>
					<BuildControls
						addButton={this.addIngredientHandler}
						removeButton={this.removeIngredientHandler}
						disabled={disabledInfo}
						purchasable={this.state.purchasable}
						price={this.state.totalPrice}
						ordered={this.purchaseHandler}/>
				</Aux>
			);
			
			orderSummary = <OrderSummary
				ingredients={this.state.ingredients}
				totalPrice={this.state.totalPrice}
				purchaseContinued={this.purchaseContinueHandler}
				purhcaseCancelled={this.purchaseCancelHandler}/>
		}
		if (this.state.loading) {
			orderSummary = <Spinner/>
		}
		
		return (
			<Aux>
				<Modal show={this.state.purchasing} click={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

export default withErrorHandler(BurgerBuilder, axiosInstance);