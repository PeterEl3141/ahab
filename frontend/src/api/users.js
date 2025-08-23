import api from "./axios";

export const uploadProfilePicture = async (file) => {
    const form = new FormData();
    form.append('image', file);
    const { data }  = await api.post('upload/profile-picture', form, {
        headers: {'Content-Type': 'multipart/form-data'},
    });
    return data; //{imageUrl}
}


export const fetchMe = () => api.get('/users/me');

export const forgotPassword = (email) =>
  api.post('/users/forgot-password', { email });

export const resetPassword = ({ token, email, password }) =>
  api.post('/users/reset-password', { token, email, password });
