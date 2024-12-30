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

  async getApliquesByVisitaId(visitaId) {
    try {
      const response = await axiosInstance.get(`${URL}/visita/${visitaId}`, {
        withCredentials: true,
      });

      return response.data.message;
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

  async getApliquesByDateRange(startDate, endDate) {
    try {
      const response = await axiosInstance.get(`${URL}/reporte`, {
        params: { startDate, endDate },
        withCredentials: true,
      });

      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Apliques:", error);
      return [];
    }
  },

  async createAplique(nuevoAplique, visitaId) {
    try {
      const { sku, cantidad, User, stockAreaId, fechaAplicacion } =
        nuevoAplique;

      const response = await axiosInstance.post(
        `${URL}`,
        {
          sku,
          cantidad,
          User,
          stockAreaId,
          fechaAplicacion,
          visitaId,
        },
        { withCredentials: true }
      );

      return response.data.message;
    } catch (error) {
      console.error("Error al crear Aplique:", error);
      return [];
    }
  },

  async updateAplique(aplique) {
    try {
      const { visitaId, fechaAplicacion, id } = aplique;
      const userId = aplique.User;

      const response = await axiosInstance.put(
        `${URL}/${id}`,
        {
          userId,
          fechaAplicacion,
          visitaId,
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
