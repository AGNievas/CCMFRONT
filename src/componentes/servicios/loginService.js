import axiosInstance from "@/axios";

const API_URL = "/user";

const loginService = {

    async login(cuil, password) {
        try {
            console.log("servicio login front", cuil, password)
          const response = await axiosInstance.post(`${API_URL}/login`,  {
              cuil,
              password,
            
          }, {withCredentials:true},);
         

          console.log(response)
        } catch (error) {
          throw new Error("Email o contraseña incorrectos.");
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