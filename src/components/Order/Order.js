import React from 'react';

import classes from './Order.css';

const order = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(key => {
            return (
                <span
                    style={{
                        textTransform: 'capitalize',
                        display: 'inline-block',
                        margin: '0 8px',
                        border: '1px solid #ccc',
                        padding: '5px',
                        // boxShadow: '0 2px 3px #cccccc'
                    }}
                    key={key}>
                    {key} : {props.ingredients[key]}
                </span>
            );
        });

    return (
        <div className={classes.Order}>
            <span>Ingredients:</span>
            {ingredientSummary}
            <p>Price: <strong>{Number.parseFloat(props.totalPrice.toFixed(2))} €</strong></p>
        </div>
    );
};

export default order;