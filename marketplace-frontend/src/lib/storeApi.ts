import api from './api';
import { StoreSettings } from '@/types';

export const getStoreSettings = async (): Promise<StoreSettings> => {
    const response = await api.get('/api/StoreSettings');
    return response.data;
};

export const updateStoreSettings = async (settings: StoreSettings): Promise<StoreSettings> => {
    const response = await api.put('/api/StoreSettings', settings);
    return response.data;
};