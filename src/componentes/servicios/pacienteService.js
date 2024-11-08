import axiosInstance from "@/axios.js";

const URL = "/paciente";

const pacienteService = {

  async getAllPaciente() {
    try {
      const response = await axiosInstance.get(URL, { withCredentials: true });
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Paciente:", error);
      return [];
    }
  },

  async getAllPacienteByStockAreaId(id) {
    try {
      const response = await axiosInstance.get(`${URL}/area/${id}`, { withCredentials: true });
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
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Paciente:", error);
      return [];
    }
  },

  async getPacienteByDniYGenero(dni) {
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

  async createPaciente(paciente) {
    try {   
      const { dni, nombre, apellido, fechaNacimiento, genero } = paciente;  
      const response = await axiosInstance.post(
        `${URL}`,
        { dni, nombre, apellido, fechaNacimiento, genero },
        { withCredentials: true }
      );  
      return response.data;
    } catch (error) {
      console.error("Error al agregar paciente:", error);
      throw error;
    }
  },

  async updatePaciente(paciente) {
    try {
      const {id, dni, nombre, apellido, fechaNacimiento, genero} = paciente;
      const { data: pacienteActualizado } = await axiosInstance.put(
        `${URL}/${id}`,
        { id, dni, nombre, apellido, fechaNacimiento, genero },
        { withCredentials: true }
      );
      return pacienteActualizado;
    } catch (error) {
      console.error("Error al actualizar el paciente:", error);
      throw error;
    }
  },

  async deletePaciente(dni) {
    try {
      const { data: pacienteEliminado } = await axiosInstance.delete(
        `${URL}/${dni}`,
        { withCredentials: true }
      );
      return pacienteEliminado;
    } catch (error) {
      console.error("Error al eliminar el paciente:", error);
      throw error;
    }
  },
};

export default pacienteService;