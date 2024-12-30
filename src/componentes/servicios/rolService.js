import axiosInstance from "@/axios.js";

const URL = "/rol";

const rolService = {
  async getAllRol() {
    try {
      const response = await axiosInstance.get(`${URL}/`, {
        withCredentials: true,
      });
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Rol:", error);
      return [];
    }
  },

  async getRolById(id) {
    try {
      const response = await axiosInstance.get(`${URL}/id/${id}`, {
        withCredentials: true,
      });
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Rol:", error);
      return [];
    }
  },

  async getRolByNombre(nombre) {
    try {
      const response = await axiosInstance.get(`${URL}/nombre/${nombre}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Rol:", error);
      return [];
    }
  },

  async createRol(nombre) {
    try {
      const response = await axiosInstance.post(
        `${URL}`,
        { nombre },
        { withCredentials: true }
      );
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Rol:", error);
      return [];
    }
  },

  async deleteRol(id) {
    try {
      const { data: RolEliminado } = await axiosInstance.delete(
        `${URL}/${id}`,
        { withCredentials: true }
      );
      return RolEliminado;
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
      throw error;
    }
  },
};

export default rolService;
