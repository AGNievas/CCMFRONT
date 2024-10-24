import axiosInstance from "@/axios.js";

const URL = '/rol'; // URL base

const rolService = {

  async getAllRol() {
    try {
      console.log("llega aca? roles")
      const response = await axiosInstance.get(`${URL}/`, { withCredentials: true });
      console.log(response.data, "AAAAAAAAAAAAAAAAAAA")
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Rol:", error);
      return [];
    }
  },

  async getRolById(id) {
    try {
            const response = await axiosInstance.get(`${URL}/id/${id}`, { withCredentials: true });
    console.log(response)
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Rol:", error);
      return [];
    }
  },

  async getRolByNombre(nombre) {
    try {
      console.log("crearRolPostResponse")
      const response = await axiosInstance.get(`${URL}/nombre/${nombre}`, { withCredentials: true });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Rol:", error);
      return [];
    }
  },

  async createRol(nombre) {
    try {
      console.log("crearRolPostResponse")
      const response = await axiosInstance.post(`${URL}`, { nombre }, { withCredentials: true });
      console.log("crearRolPostResponse", response.data.return)
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Rol:", error);
      return [];
    }
  },

  async deleteRol(id) {
    try {
      console.log("antesDeleteRol", id)
      const { data: RolEliminado } = await axiosInstance.delete(`${URL}/${id}`, { withCredentials: true });
      return RolEliminado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  }

}

export default rolService;