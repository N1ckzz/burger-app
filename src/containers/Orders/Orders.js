import React, {Component} from 'react';
import axiosInstance from '../../axios-order';

import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Orders extends Component {
    state = {
        orders: null,
        loading: true
    };

    componentDidMount() {
        axiosInstance.get('/orders.json')
            .then(response => {
                this.setState({loading: false, orders: response.data});
            })
            .catch(error => {
                console.log('error while retrieving the orders');
                this.setState({loading: false})
            });
    }

    renderOrders = () => {

    };

    render() {
        let order = '';

        if(this.state.loading) {
            order = <Spinner/>;
        }

        if(this.state.orders) {
            order = [];
            const orders = this.state.orders;
            for (let key in orders ) {
                order.push(<Order key={key} totalPrice={orders[key].totalPrice} ingredients={orders[key].ingredients}/>);
            }
        }
        return (
            <div>
                {order}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axiosInstance);