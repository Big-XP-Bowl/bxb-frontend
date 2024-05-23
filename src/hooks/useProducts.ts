import { useState, useEffect } from 'react';
import { IProductDTO } from '../types/types';
import { handleHttpErrors, HttpException, makeOptions } from '../utils/fetchUtils';
import { API_URL } from '../settings';
import toast from 'react-hot-toast';

function useProducts() {
    const PRODUCT_URL = API_URL + "/products";
    const [products, setProducts] = useState<IProductDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchProducts = async () => {
        try {
            const res = await fetch(PRODUCT_URL);
            const data = await handleHttpErrors(res);
            setProducts(data);
            console.log(data);
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error('En uventet fejl opstod');
            }
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchProducts().then(() => setLoading(false));
    }, []);


    const fetchProductById = async (id: number) => {
        try {
            const res = await fetch(PRODUCT_URL + "/" + id);
            const data = await handleHttpErrors(res);
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error('En uventet fejl opstod');
            }
        }
    };

    const createProduct = async (product: Partial<IProductDTO>) => {
        try {
            const options = makeOptions('POST', product);
            const res = await fetch(PRODUCT_URL, options);
            const data = await handleHttpErrors(res);
            setProducts(prev => [...prev, data]);
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error('En uventet fejl opstod');
            }
        }
    };

    const updateProduct = async (product: Partial<IProductDTO>) => {
        try {
            const options = makeOptions('PUT', product);
            const res = await fetch(PRODUCT_URL + '/' + product.id, options);
            const data = await handleHttpErrors(res);
            setProducts(prev => prev.map(product => product.id === data.id ? data : product));
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error('En uventet fejl opstod');
            }
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            const options = makeOptions('DELETE', null);
            const res = await fetch(PRODUCT_URL + '/' + id, options);
            await handleHttpErrors(res);
            setProducts(prev => prev.filter(product => product.id !== id));
            toast.success('Produktet blev slettet');
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            }
        }
    };



    return { products, loading, fetchProductById, createProduct, updateProduct, deleteProduct };
}

export default useProducts;
