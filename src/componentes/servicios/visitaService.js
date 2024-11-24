import axiosInstance from "@/axios";

const URL = "/visita";

const visitaService = {
  async getAllVisitas() {
    try {
      const response = await axiosInstance.get(URL, { withCredentials: true });
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Visitas: ", error);
      return [];
    }
  },

  async getVisitasByPacienteId(pacienteId) {
    try {
      const response = await axiosInstance.get(`${URL}/${pacienteId}`, {
        withCredentials: true,
      });
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Visitas: ", error);
      return [];
    }
  },

  async createVisita(visita, pacienteId) {
    try {
      const userId = visita.User.id;
      const { fechaIngreso, diagnostico, seInterno } = visita;
      const fechaAlta = !seInterno ? fechaIngreso : null;
      const stockAreaId = visita.StockArea.id;
      const areaId = visita.StockArea.Area.id;

      const response = await axiosInstance.post(
        `${URL}`,
        {
          userId,
          fechaIngreso,
          diagnostico,
          seInterno,
          fechaAlta,
          stockAreaId,
          areaId,
          pacienteId,
        },
        { withCredentials: true }
      );
      return response.data.message;
    } catch (error) {
      console.error("Error al crear la visita", error);
    }
  },

  async updateVisita(visita) {
    try {
      const userId = visita.User.id;
      const { fechaIngreso, diagnostico, seInterno, id } = visita;
      const fechaAlta = visita.fechaAlta;
      const stockAreaId = visita.StockArea.id;
      const areaId = visita.StockArea.Area.id;
      const pacienteId = visita.Paciente.id;

      const response = await axiosInstance.put(
        `${URL}/${id}`,
        {
          userId,
          fechaIngreso,
          fechaAlta,
          diagnostico,
          seInterno,
          stockAreaId,
          areaId,
          pacienteId,
        },
        { withCredentials: true }
      );
      return response.data.message;
    } catch (error) {
      console.error("Error al actualizar visita", error);
    }
  },

  async delete(id) {
    try {
     
      const { data: visitaEliminada } = await axiosInstance.delete(
        `${URL}/${id}`,
        { withCredentials: true }
      );
      return visitaEliminada;
    } catch (error) {
      console.error("Error al eliminar el Aplique:", error);
      throw error;
    }
  },
};
export default visitaService;
