<template>
  <v-dialog v-model="localVisible" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditing ? 'Editar Paciente' : 'Agregar Paciente' }}</span>
      </v-card-title>

      <v-card-text>
        <!-- Popup de error -->
        <v-alert
          v-if="errorMensaje"
          type="error"
          dense
          dismissible
          @click:close="clearError"
        >
          {{ errorMensaje }}
        </v-alert>
      
        <v-form ref="form">
          <v-text-field
            v-model="pacienteLocal.nombre"
            label="Nombre"
            required
            @input="validateNombre"
            @keypress="soloLetras"
            :error-messages="nombreError ? 'El nombre debe contener solo letras' : ''"
          ></v-text-field>
          <v-text-field
            v-model="pacienteLocal.apellido"
            label="Apellido"
            required
            @input="validateApellido"
            @keypress="soloLetras"
            :error-messages="apellidoError ? 'El apellido debe contener solo letras' : ''"
          ></v-text-field>
          <v-text-field
            v-model="pacienteLocal.dni"
            label="DNI"
            required
            @input="validateDni"
            @keypress="soloNumeros"
            :error-messages="dniError ? 'El DNI debe tener 8 dígitos' : ''"
          ></v-text-field>
          <v-text-field
            v-model="pacienteLocal.fechaNacimiento"
            label="Fecha de Nacimiento (YYYY-MM-DD)"
            type="date"
            required
            @input="formatearFechaNacimiento"
            @keypress="soloNumeros"
            :error-messages="fechaNacimientoError ? 'La fecha debe tener el formato YYYY-MM-DD' : ''"
          ></v-text-field>
          <v-select
            v-model="pacienteLocal.genero"
            :items="['Masculino', 'Femenino', 'No binario']"
            label="Género"
            required
          ></v-select>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Cancelar</v-btn>
        <v-btn text @click="save" :disabled="!isFormValid">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validarDni, validarNombre, validarFechaNacimiento } from '@/utils/validarPaciente';

export default {
  props: {
    modelValue: Boolean,
    isEditing: Boolean,
    paciente: Object,
    errorMensaje: String, // Nueva prop para recibir el mensaje de error
  },
  data() {
    return {
      localVisible: this.modelValue,
      pacienteLocal: {
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: '',
        genero: '',
      },
      nombreError: false,
      apellidoError: false,
      dniError: false,
      fechaNacimientoError: false,
      generoError: false,
      validando: false,
    };
  },

  computed: {
    isFormValid() {
      // Solo verificar si los campos requeridos están completos
      return (
        this.pacienteLocal.nombre &&
        this.pacienteLocal.apellido &&
        
        this.pacienteLocal.fechaNacimiento &&
        this.pacienteLocal.genero
      );
    },
  },
  watch: {
    paciente: {
      immediate: true,
      handler(newPaciente) {
        if (this.isEditing && newPaciente) {
          // Al editar, cargar los datos del paciente
          this.pacienteLocal = { ...newPaciente };
        } else {
          // Al agregar, asegurarse de que el formulario esté vacío
          this.resetPacienteLocal();
        }
      },
    },
    modelValue(val) {
      this.localVisible = val;
    },
    localVisible(val) {
      this.$emit('update:modelValue', val);
    },
  },
  methods: {
    resetPacienteLocal() {
      this.pacienteLocal = {
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: '',
        genero: '',
      };
    },
    soloNumeros(event) {
      const key = event.key;
      if (!/[0-9]/.test(key)) {
        event.preventDefault();
      }
    },
    soloLetras(event) {
      const key = event.key;
      if (!/[a-zA-Z\s]/.test(key)) {
        event.preventDefault();
      }
    },
    formatearFechaNacimiento() {
      let fecha = this.pacienteLocal.fechaNacimiento.replace(/\D/g, ''); // Elimina cualquier carácter que no sea número
      if (fecha.length > 4 && fecha.length <= 6) {
        fecha = `${fecha.slice(0, 4)}-${fecha.slice(4)}`; // YYYY-MM
      } else if (fecha.length > 6) {
        fecha = `${fecha.slice(0, 4)}-${fecha.slice(4, 6)}-${fecha.slice(6)}`; // YYYY-MM-DD
      }
      this.pacienteLocal.fechaNacimiento = fecha;
    },
    validateDni() {
      if(this.pacienteLocal.dni!=0 && !this.isEditing){
        this.dniError = !validarDni(this.pacienteLocal.dni);
      }
      
    },
    validateNombre() {
      this.nombreError = !validarNombre(this.pacienteLocal.nombre);
    },
    validateApellido() {
      this.apellidoError = !validarNombre(this.pacienteLocal.apellido);
    },
    validateFechaNacimiento() {
      this.fechaNacimientoError = !validarFechaNacimiento(this.pacienteLocal.fechaNacimiento);
    },
    validateGenero() {
      this.generoError = !this.pacienteLocal.genero;
    },
    closeDialog() {
      this.localVisible = false;
      this.resetValidation();
      // Solo reseteamos el formulario al cerrar si no hay mensaje de error
      if (!this.errorMensaje) {
        this.resetPacienteLocal();
      }
    },
    clearError() {
      this.$emit('update:errorMensaje', ''); // Emitir evento para limpiar el mensaje de error
    },
    resetValidation() {
      this.nombreError = false;
      this.apellidoError = false;
      this.dniError = false;
      this.fechaNacimientoError = false;
      this.generoError = false;
      this.validando = false;
    },
    save() {
      this.validando = true;
      this.validateDni();
      this.validateNombre();
      this.validateApellido();
      this.validateFechaNacimiento();
      this.validateGenero();

      if (this.dniError || this.nombreError || this.apellidoError || this.fechaNacimientoError || this.generoError) {
        return; // No procedemos si hay errores
      }

      // Emitir el evento para guardar
      this.$emit('save', this.pacienteLocal);
    },
  },
};
</script>
