import React, { useState } from 'react';
import useProducts from '../hooks/useProducts';
import { IProductDTO } from '../types/types';

const Products: React.FC = () => {
    const { products, loading } = useProducts();
    const [cart, setCart] = useState<{ [key: number]: number }>({});

    const handleAddToCart = (productId: number) => {
        setCart((prev) => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1
        }));
    };

    const handleRemoveFromCart = (productId: number) => {
        setCart((prev) => {
            const updatedCart = { ...prev };
            if (updatedCart[productId] > 1) {
                updatedCart[productId]--;
            } else {
                delete updatedCart[productId];
            }
            return updatedCart;
        });
    };

    const calculateTotal = () => {
        return Object.entries(cart).reduce((total, [productId, quantity]) => {
            const product = products.find(p => p.id === parseInt(productId));
            return total + (product ? product.price * quantity : 0);
        }, 0);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Products</h1>
            <div>
                {products.map((product) => (
                    <div key={product.id}>
                        <h3>{product.name}</h3>
                        <p>{product.price} kr</p>
                        <img src={product.imageUrl}></img>
                        <button onClick={() => handleAddToCart(product.id)}>Add to cart</button>
                        <button onClick={() => handleRemoveFromCart(product.id)}>Remove from cart</button>
                    </div>
                ))}
            </div>
            <h2>Cart</h2>
            <div>
                {Object.entries(cart).map(([productId, quantity]) => {
                    const product = products.find(p => p.id === parseInt(productId));
                    return (
                        <div key={productId}>
                            <h3>{product?.name}</h3>
                            <p>{product?.price} kr x {quantity} = {product?.price * quantity} kr</p>
                        </div>
                    );
                })}
            </div>
            <h2>Total: {calculateTotal()} kr</h2>
        </div>
    );
}

export default Products;
