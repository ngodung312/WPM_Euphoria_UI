import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: `${process.env.WPM_API_HOST}`
});