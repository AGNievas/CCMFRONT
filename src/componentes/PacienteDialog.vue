<template>
    <v-dialog v-model="localVisible" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isEditing ? 'Editar Paciente' : 'Agregar Paciente' }}</span>
        </v-card-title>
  
        <v-card-text>
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
          <v-btn
            text
            @click="save"
            :disabled="!isFormValid"
          >Guardar</v-btn>
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
        validando: false,
      };
    },
    computed: {
      isFormValid() {
        return (
          this.pacienteLocal.nombre &&
          this.pacienteLocal.apellido &&
          this.pacienteLocal.dni &&
          this.pacienteLocal.fechaNacimiento &&
          !this.nombreError &&
          !this.apellidoError &&
          !this.dniError &&
          !this.fechaNacimientoError
        );
      },
    },
    watch: {
      paciente: {
        immediate: true,
        handler(newPaciente) {
          if (this.isEditing && newPaciente) {
            this.pacienteLocal = { ...newPaciente };
          } else {
            this.pacienteLocal = {
              nombre: '',
              apellido: '',
              dni: '',
              fechaNacimiento: '',
              genero: '',
            };
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
        this.dniError = !validarDni(this.pacienteLocal.dni);
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
      closeDialog() {
        this.localVisible = false;
        this.resetValidation();
      },
      resetValidation() {
        this.nombreError = false;
        this.apellidoError = false;
        this.dniError = false;
        this.fechaNacimientoError = false;
        this.validando = false;
      },
      save() {
        this.validando = true;
        this.validateDni();
        this.validateNombre();
        this.validateApellido();
        this.validateFechaNacimiento();
  
        if (this.dniError || this.nombreError || this.apellidoError || this.fechaNacimientoError) {
          return; // No procedemos si hay errores
        }
  
        this.$emit('save', this.pacienteLocal);
        this.closeDialog();
      },
    },
  };
  </script>
