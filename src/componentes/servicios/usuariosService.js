import axiosInstance from "@/axios.js";
import parsearCuil from "@/utils/parsearCuil";

const URL = "/user";

const usuariosService = {
  async getAllUsuarios() {
    try {
      const response = await axiosInstance.get(URL, { withCredentials: true });
      console.log("usuariosService", response.data.return)
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Users:", error);
      return [];
    }
  },
  async getAllUsuariosByStockAreaId(stockAreaId) {
    try {
      console.log(stockAreaId, "servico front id area")
      const response = await axiosInstance.get(`${URL}/areas/${stockAreaId}`, { withCredentials: true });
      console.log("usuariosService", response.data.return
        
      )
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Users:", error);
      return [];
    }
  },

  async getUsuarioById(id) {
    try {
      console.log(id, "servicio front")
      const response = await axiosInstance.get(`${URL}/id/${id}`, {
        withCredentials: true,
      });
      console.log("aca")
      console.log(response.data)
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
    try {console.log(usuario,"servicio")
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
      console.error("Error al obtener Users:", error);
      return [];
    }
  },

  async updateUsuario(id, cuil, fullName, stockAreaId, rolId) {
    try {
      console.log(id, cuil, fullName, stockAreaId, rolId);
      console.log("AntesUpdateUserPutResponse");
      const { data: usuarioActualizado } = await axiosInstance.put(
        `${URL}/${id}`,
        { cuil, fullName, stockAreaId,rolId },
        { withCredentials: true }
      );
      console.log("DespuesUserPuttResponse");
      return usuarioActualizado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },

  async deleteUsuario(id) {
    try {
      console.log("antesDeleteUser", id);
      const { data: usuerioEliminado } = await axiosInstance.delete(
        `${URL}/${id}`,
        { withCredentials: true }
      );
      console.log(usuerioEliminado, "acaaaa");
      return usuerioEliminado;
    } catch (error) {
      console.error("Error al eliminar Front Delete el usuario:", error);
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
      console.log(usuario,"restore")
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
