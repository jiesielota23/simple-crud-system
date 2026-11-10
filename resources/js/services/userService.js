import api from './api';

export const getUsers = async (page = 1, per_page = 10, search = '') => {
    const response = await api.get('/api/users', {
        params: {
            page,
            per_page: per_page,
            search
        }
    });

    return response.data;
};

export const createUser = async( data ) => {
    const response = await api.post('/api/users', data);

    return response.data;
}

export const updateUser = async( id, data ) => {
    const response = await api.put(`/api/users/${id}`, data);

    return response.data;
}

export const deleteUser = async( id ) => {
    return await api.delete(`/api/users/${id}`);
}
