import axiosInstance from "@/axios.js";

const URL = "/paciente";

const pacienteService = {

  async getAllPaciente() {
    try {
      console.log("aca")
      const response = await axiosInstance.get(URL, { withCredentials: true });

      console.log(response)
      
      return response.data.message;
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
      console.log(paciente,"crearpacienteservie")
      const {dni, nombre, apellido, fechaNacimiento, genero} = paciente;
      
      const response = await axiosInstance.post(
        `${URL}`,
        { dni, nombre, apellido, fechaNacimiento, genero },
        { withCredentials: true }
      );
      console.log(response, "servicio front post backend")
      console.log(response.data.success, "Creo con exito?")
      return response.data.success;
    } catch (error) {
      console.error("Error al obtener Paciente:", error);
      return [];
    }
  },

  async updatePaciente(paciente) {
    try {console.log(paciente)
      const {id, dni, nombre, apellido, fechaNacimiento, genero} = paciente;
      const { data: pacienteActualizado } = await axiosInstance.put(
        `${URL}/${id}`,
        { id, dni, nombre, apellido, fechaNacimiento, genero },
        { withCredentials: true }
      );

      return pacienteActualizado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },

  async deletePaciente(dni) {
    try {
      console.log(dni,"servicio front delete")
      const { data: pacienteEliminado } = await axiosInstance.delete(
        `${URL}/${dni}`,
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