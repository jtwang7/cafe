import axios from "axios";

const axiosInstance = axios.create({
  timeout: 5000,
  baseURL: "http://localhost:3000",
});

axiosInstance.interceptors.response.use(
  (value) => {
    const { data } = value;
    if (data.code === 0) {
      return data.data;
    } else {
      throw data;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
