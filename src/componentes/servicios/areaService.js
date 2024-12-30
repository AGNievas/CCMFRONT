import axiosInstance from "@/axios.js";

const URL = "/area";

const areaService = {
  async getAllArea() {
    try {
      const response = await axiosInstance.get(`${URL}/`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener area:", error);
      return [];
    }
  },

  async getareaById(id) {
    try {
      const response = await axiosInstance.get(`${URL}/id/${id}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener area:", error);
      return [];
    }
  },

  async getareaByNombre(nombre) {
    try {
      const response = await axiosInstance.get(`${URL}/nombre/${nombre}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener area:", error);
      return [];
    }
  },

  async createarea(nombre) {
    try {
      const response = await axiosInstance.post(
        `${URL}`,
        { nombre },
        { withCredentials: true }
      );
      return response.data.return;
    } catch (error) {
      console.error("Error al crear area:", error);
      return [];
    }
  },

  async deletearea(id) {
    try {
      const { data: areaEliminado } = await axiosInstance.delete(
        `${URL}/${id}`,
        { withCredentials: true }
      );
      return areaEliminado;
    } catch (error) {
      console.error("Error al eliminar el area:", error);
      throw error;
    }
  },
};

export default areaService;
