import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://react-burger-app-123.firebaseio.com/',
});

export default axiosInstance