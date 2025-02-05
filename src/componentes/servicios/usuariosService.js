import axiosInstance from "@/axios.js";
import parsearCuil from "@/utils/parsearCuil";

const URL = "/user";

const usuariosService = {
  async getAllUsuarios() {
    try {
      const response = await axiosInstance.get(URL, { withCredentials: true });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Users:", error);
      return [];
    }
  },
  async getAllUsuariosByStockAreaId(stockAreaId) {
    try {
      const response = await axiosInstance.get(`${URL}/areas/${stockAreaId}`, { withCredentials: true });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Users:", error);
      return [];
    }
  },

  async getUsuarioById(id) {
    try {

      const response = await axiosInstance.get(`${URL}/id/${id}`, {
        withCredentials: true,
      });
      return response.data.message;
    } catch (error) {
      console.error(`Error al obtener el User id: ${id} `, error);
      throw error;
    }
  },

  async getUsuarioByCuil(cuil) {
    try {
      const response = await axiosInstance.get(`${URL}/cuil/${cuil}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error(`Error al obtener el User con cuil: ${cuil} `, error);
      throw error;
    }
  },

  async createUsuario(usuario) {
    try {
      const cuil = usuario.cuil;
      const fullName = usuario.fullName;
      const rolId = usuario.rolId;
      const stockAreaId = usuario.stockAreaId;
      const password = parsearCuil.extraerNumeroDelCuil(usuario.cuil);
      const response = await axiosInstance.post(
        `${URL}`,
        { cuil, password, fullName,  stockAreaId,rolId },
        { withCredentials: true }
      );
      return response.data.return;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return [];
    }
  },

  async updateUsuario(id, cuil, fullName, stockAreaId, rolId) {
    try {
      const { data: usuarioActualizado } = await axiosInstance.put(
        `${URL}/${id}`,
        { cuil, fullName, stockAreaId,rolId },
        { withCredentials: true }
      );
      return usuarioActualizado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },

  async deleteUsuario(id) {
    try {
      const { data: usuerioEliminado } = await axiosInstance.delete(
        `${URL}/${id}`,
        { withCredentials: true }
      );
      return usuerioEliminado;
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  },

  async updatePassword(id, currentPassword, newPassword) {
    try {
      const response = await axiosInstance.put(
        `${URL}/update-password/${id}`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      throw error.response.data.message;
    }
  },

  async restorePassword(usuario) {
    try {
      const dni =  parsearCuil.extraerNumeroDelCuil(usuario.cuil);
      const response = await axiosInstance.put(
        `${URL}/blank-password/${usuario.id}`,
        { dni },
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      throw error.response.data.message;
    }
  },
};

export default usuariosService;
