import { useState, useEffect } from 'react';
import { handleHttpErrors, HttpException, makeOptions } from '../utils/fetchUtils';
import { API_URL } from '../settings';
import toast from 'react-hot-toast';

interface Pin {
    id: number;
}

function usePins() {
    const PIN_URL = API_URL + "/pins";
    const [pins, setPins] = useState<Pin[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchPins = async () => {
        try {
            const res = await fetch(PIN_URL);
            const data = await handleHttpErrors(res);
            setPins(data);
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
        fetchPins().then(() => setLoading(false));
    }, []);

    const createPin = async (pin: Partial<Pin>) => {
        try {
            const options = makeOptions('POST', pin);
            const res = await fetch(PIN_URL, options);
            const data = await handleHttpErrors(res);
            setPins(prev => [...prev, data]);
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error('En uventet fejl opstod');
            }
        }
    };

    const deletePin = async (id: number) => {
        try {
            const options = makeOptions('DELETE', null);
            const res = await fetch(PIN_URL + '/' + id, options);
            await handleHttpErrors(res);
            setPins(prev => prev.filter(pin => pin.id !== id));
            toast.success('Pin blev slettet');
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            }
        }
    };

    return { pins, loading, createPin, deletePin };
}

export default usePins;
