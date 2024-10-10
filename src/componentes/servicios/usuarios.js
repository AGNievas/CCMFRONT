import axiosInstance from "@/axios.js";

const URL = "https://66773a9e145714a1bd742a35.mockapi.io/Usuarios";

// Función para obtener los usuarios
export async function getUsuarios() {
  try {
    const { data: usuarios } = await axiosInstance.get(URL);
    return usuarios;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}

// Función para crear un nuevo usuario
export async function createUsuario(usuario) {
  try {
    const { data } = await axiosInstance.post(URL, usuario);
    return data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
}

// Nueva función para actualizar la información del usuario, incluida la contraseña
export async function updateUsuario(id, usuarioActualizado) {
  try {
    const { data } = await axiosInstance.put(`${URL}/${id}`, usuarioActualizado);
    return data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
}
