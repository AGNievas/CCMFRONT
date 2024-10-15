// src/services/medicamentos.js

import axiosInstance from "@/axios.js";

const URL = 'https://66773a9e145714a1bd742a35.mockapi.io/medicamentos'; // URL base

// Función para obtener todos los medicamentos
export async function getMedicamentos() {
  try {
    const response = await axiosInstance.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener medicamentos:", error);
    return [];
  }
}

// Función para crear un nuevo medicamento
export async function createMedicamento(medicamento) {
  try {
    const response = await axiosInstance.post(URL, medicamento);
    return response.data;
  } catch (error) {
    console.error("Error al crear medicamento:", error);
    throw error;
  }
}

// Función para actualizar un medicamento existente usando el id de MockAPI
export async function updateMedicamento(id, medicamentoActualizado) {
  try {
    const {data} = await axiosInstance.put(`${URL}/${id}`, medicamentoActualizado);
    return data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
}

// Función para eliminar un medicamento usando el id de MockAPI
export async function deleteMedicamento(id) {
  try {
    const url = `${URL}/${id}`;
    console.log(`Eliminando medicamento en: ${url}`); // Verificar URL
    await axiosInstance.delete(url);
  } catch (error) {
    console.error("Error al eliminar medicamento:", error.response ? error.response.data : error.message);
    throw error;
  }
}
