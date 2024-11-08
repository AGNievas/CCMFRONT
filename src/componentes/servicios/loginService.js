import axiosInstance from "@/axios";

const API_URL = "/user";

const loginService = {

  async login(cuil, password) {
    try {
      const {data: response} = await axiosInstance.post(`${API_URL}/login`,  {
          cuil,
          password,
      }, {withCredentials:true},);
      return response
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  async logout() {
    try {
      const response = await axiosInstance.post(`${API_URL}/logout`, {}, { withCredentials: true });
      if (response.data.success) {
        delete axiosInstance.defaults.headers.common['Authorization'];
        return response.data.message
      }
      else{throw new Error(response.data.message)}
      }
    catch(error){
      throw new Error(error.message)
    }
  }
};

export default loginService