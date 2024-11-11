import axiosInstance from "@/axios.js";

const URL = "/aplique";

const apliqueService = {
  async getAllAplique() {
    try {
      const response = await axiosInstance.get(URL, { withCredentials: true });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Aplique:", error);
      return [];
    }
  },

  async getApliqueById(id) {
    try {
      const response = await axiosInstance.get(`${URL}/${id}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Aplique:", error);
      return [];
    }
  },

  async getApliquesByPacienteId(pacienteId) {
    try {
           const response = await axiosInstance.get(
        `${URL}/paciente/${pacienteId}`,
        {
          withCredentials: true,
        }
      );

      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Aplique:", error);
      return [];
    }
  },

  async getApliqueByDni(dni) {
    try {
      const response = await axiosInstance.get(`${URL}/dni/${dni}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Aplique:", error);
      return [];
    }
  },

  async createAplique(pacienteId, nuevoAplique) {
    try {
      console.log(pacienteId, "SERVICIO CREATE APLIQUE")
      const { sku, cantidad, User, stockAreaId, fechaAplicacion } =
        nuevoAplique;

      const response = await axiosInstance.post(
        `${URL}`,
        { pacienteId, sku, cantidad, User, stockAreaId, fechaAplicacion },
        { withCredentials: true }
      );

      return response.data.message;
    } catch (error) {
      console.error("Error al crear Aplique:", error);
      return [];
    }
  },

  async updateAplique(pacienteId, aplique) {
    try {
      console.log(pacienteId, "PACIENTE EN UpdaTE")
      console.log(aplique, "APLIQUE EN SERVICE")
      const { User, fechaAplicacion, id } = aplique;
      const userId = User.id
      const response = await axiosInstance.put(
        `${URL}/${id}`,
        {
          userId,
          fechaAplicacion,
        },
        { withCredentials: true }
      );

      return response.data.message;
    } catch (error) {
      console.error("Error al actualizar el aplique:", error);
      throw error;
    }
  },

  async deleteAplique(id) {
    try {
      const { data: ApliqueEliminado } = await axiosInstance.delete(
        `${URL}/${id}`,
        { withCredentials: true }
      );
      return ApliqueEliminado;
    } catch (error) {
      console.error("Error al eliminar el Aplique:", error);
      throw error;
    }
  },
};

export default apliqueService;
