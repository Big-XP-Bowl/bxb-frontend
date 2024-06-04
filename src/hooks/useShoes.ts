import { useState, useEffect } from 'react';
import { handleHttpErrors, HttpException, makeOptions } from '../utils/fetchUtils';
import { API_URL } from '../settings';
import toast from 'react-hot-toast';

interface Shoe {
    id: number;
    size: number;
}

function useShoes() {
    const SHOE_URL = API_URL + "/shoes";
    const [shoes, setShoes] = useState<Shoe[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchShoes = async () => {
        try {
            const res = await fetch(SHOE_URL);
            const data = await handleHttpErrors(res);
            setShoes(data);
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
        fetchShoes().then(() => setLoading(false));
    }, []);

    const createShoe = async (shoe: Partial<Shoe>) => {
        try {
            const options = makeOptions('POST', shoe);
            const res = await fetch(SHOE_URL, options);
            const data = await handleHttpErrors(res);
            setShoes(prev => [...prev, data]);
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error('En uventet fejl opstod');
            }
        }
    };

    const deleteShoeBySize = async (size: number) => {
        try {
            console.log("Deleting shoe with size:", size);
            const options = makeOptions('DELETE', null);
            const res = await fetch(`${SHOE_URL}/size/${size}`, options);
            await handleHttpErrors(res);
            setShoes(prev => prev.filter(shoe => shoe.size !== size));
            toast.success('Skoen blev slettet');
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                console.log('En uventet fejl opstod');
            }
        }
    };

    return { shoes, loading, createShoe, deleteShoeBySize };
}

export default useShoes;
