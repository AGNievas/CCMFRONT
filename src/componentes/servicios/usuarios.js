import axiosInstance from "@/axios.js";

const URL = "https://66773a9e145714a1bd742a35.mockapi.io/Usuarios";

export async function getUsuarios() {
  try {
    const { data: usuarios } = await axiosInstance.get(URL);
    return usuarios;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}

export async function createUsuario(usuario) {
  try {
    const { data } = await axiosInstance.post(URL, usuario);
    return data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
}

