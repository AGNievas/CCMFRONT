import axiosInstance from "@/axios.js";

const URL = "/paciente";

const pacienteService = {
  async getAllPaciente() {
    try {
      const response = await axiosInstance.get(URL, { withCredentials: true });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Paciente:", error);
      return [];
    }
  },
  async getAllPacienteByStockAreaId(id) {
    try {
      const response = await axiosInstance.get(`${URL}/area/${id}`, { withCredentials: true });
      
      console.log(response)
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Paciente:", error);
      return [];
    }
  },

  async getPacienteById(id) {
    try {
      const response = await axiosInstance.get(`${URL}/id/${id}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Paciente:", error);
      return [];
    }
  },

  async getPacienteByDni(dni) {
    try {
      const response = await axiosInstance.get(`${URL}/dni/${dni}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Paciente:", error);
      return [];
    }
  },

  async createPaciente(nombre) {
    try {
      const response = await axiosInstance.post(
        `${URL}`,
        { nombre },
        { withCredentials: true }
      );

      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Paciente:", error);
      return [];
    }
  },

  async updatePaciente(id, nombre) {
    try {
      const { data: pacienteActualizado } = await axiosInstance.put(
        `${URL}/${id}`,
        { nombre },
        { withCredentials: true }
      );

      return pacienteActualizado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },

  async deletePaciente(id) {
    try {
      const { data: pacienteEliminado } = await axiosInstance.delete(
        `${URL}/${id}`,
        { withCredentials: true }
      );
      return pacienteEliminado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },
};

export default pacienteService;
