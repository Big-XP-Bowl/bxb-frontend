import { useState, useEffect } from 'react';
import { IProductDTO } from '../types/types';
import { handleHttpErrors, HttpException } from '../utils/fetchUtils';
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

    return { products, loading, fetchProductById };
}

export default useProducts;
