import axiosInstance from "@/axios.js";

const URL = "/orden-transferencia";

const ordenTransferenciaService = {
  async getAllOrdenTransferencia() {
    try {
      const response = await axiosInstance.get(URL, { withCredentials: true });
      return response.data.message;
      
    } catch (error) {
      console.error("Error al obtener TransferenciaStock:", error);
      return [];
    }
  },

  async getOrdenTransferenciaById(ordenTransferenciaId) {
    try {
      const response = await axiosInstance.get(
        `${URL}/id/${ordenTransferenciaId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener TransferenciaStock:", error);
      return [];
    }
  },

  async getOrdenTransferenciaByUsuarioId(usuarioId) {
    try {
      const response = await axiosInstance.get(`${URL}/usuario/${usuarioId}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener TransferenciaStock:", error);
      return [];
    }
  },

  async getOrdenTransferenciaByFechaTransferencia(fecha) {
    try {
      const response = await axiosInstance.get(`${URL}/fecha/${fecha}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener TransferenciaStock:", error);
      return [];
    }
  },

  async createOrdenTransferencia(ordenTransferencia, listaItems) {
    try {
      const { stockAreaIdOrigen, stockAreaIdDestino, motivo, areaIdDestino, areaIdOrigen, userId } =
        ordenTransferencia;

      const response = await axiosInstance.post(
        `${URL}`,
        { stockAreaIdOrigen, stockAreaIdDestino, motivo,  areaIdDestino, areaIdOrigen, userId, listaItems },
        { withCredentials: true }
      );
     console.log(response)
      return response;
    } catch (error) {
      console.error("Al crear Orden de Transferencia:", error);
      throw new Error(error.response.data.message);
    }
  },

  async updateOrdenTransferencia(
   ordenTransferencia

  ) {
    const {id, motivo   } = ordenTransferencia
    try {
      const { data: ordenTransferenciaActualizado } = await axiosInstance.put(
        `${URL}/${id}`,
        {
           motivo,
        },
        { withCredentials: true }
      );

      return ordenTransferenciaActualizado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },

  async deleteOrdenTransferencia(id) {
    try {
      const { data: ordenTransferenciaEliminado } = await axiosInstance.delete(
        `${URL}/${id}`,
        { withCredentials: true }
      );
      return ordenTransferenciaEliminado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },
};

export default ordenTransferenciaService;
