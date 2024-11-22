<template>
    <div v-if="globalStore.getRolId == globalStore.getRolSuperAdmin">
        <v-card class="custom-container">
            <v-card-title class="d-flex align-center pe-2">
                <h3>Reporte Apliques</h3>
            </v-card-title>

            <v-text-field v-model="startDate" label="Fecha Desde" type="date" required />
            <v-text-field v-model="endDate" label="Fecha Hasta" type="date" required />
            <v-card-actions>
                <v-btn class="btn-blue" text @click="searchApliques">Buscar</v-btn>
            </v-card-actions>

            <Tabla v-if="mostrarReporte" :data="apliquesFiltrados" :headers="apliqueHeaders" :isReporte="true" />
            <v-card-actions>
                <v-btn v-show="mostrarReporte" class="btn-blue" text @click="descargar">Imprimir Reporte</v-btn>
            </v-card-actions>
        </v-card>

        <ConfirmDialog v-model="imprimeReporte" title="Imprimir Reporte" text="¿Desea descargar el archivo?"
            @confirm="descargarArchivo" />
    </div>
</template>

<script>
import Tabla from './Tabla.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import { useGlobalStore } from '@/stores/global';
import apliqueService from './servicios/apliqueService';
import { unparse } from 'papaparse'; // Librería para convertir datos a CSV

export default {
    components: {
        Tabla,
        ConfirmDialog,
    },

    data() {
        return {
            apliqueHeaders: [
                { text: 'Area', value: 'Area' },
                { text: 'SubArea', value: 'SubArea' },
                { text: 'DNI Paciente', value: 'DNI_Paciente' },
                { text: 'Nombre Paciente', value: 'NombreCompletoPaciente' },
                { text: 'Diagnostico', value: 'Diagnostico' },
                { text: 'Medicamento Aplicado', value: 'Descripcion_Medicamento' },
                { text: 'SKU', value: 'Sku_Medicamento' },
                { text: 'Fecha Aplique', value: 'Fecha_Aplicacion' },
                { text: 'Cantidad Aplicada', value: 'Cantidad' },
                { text: 'Medico Autorizante', value: 'Medico_Autorizante' },
            ],
            apliques: [],
            startDate: '',
            endDate: '',
            imprimeReporte: false,
            isReporte: false,
            globalStore: useGlobalStore(),
            mostrarReporte: false,
        };
    },

    computed: {
        apliquesFiltrados() {
            return this.apliques.map((apl) => ({
                id: apl.id,
                Area: apl.StockArea.Area.nombre,
                Sub_Area: apl.StockArea.nombre,
                DNI_Paciente: apl.Visita.Paciente.dni,
                Nombre_Completo_Paciente: `${apl.Visita.Paciente.nombre} ${apl.Visita.Paciente.apellido}`,
                Diagnostico: apl.Visita.diagnostico,
                Descripcion_Medicamento: apl.Medicamento.descripcion,
                Sku_Medicamento: apl.Medicamento.sku,
                Fecha_Aplicacion: apl.fechaAplicacion,
                Cantidad: apl.cantidad,
                Medico_Autorizante: apl.User.fullName,
            }));
        },
    },

    methods: {
        async loadApliques() {
            try {
                if (!this.startDate || !this.endDate) {
                    return alert('Por favor, seleccione ambas fechas para realizar la búsqueda.');
                }
                this.apliques = await apliqueService.getApliquesByDateRange(
                    this.startDate,
                    this.endDate
                );
                console.log(this.apliques, 'APLIQUES');
            } catch (error) {
                console.error('Error al cargar apliques:', error);
            }
        },

        searchApliques() {
            this.loadApliques();
            this.mostrarReporte = true
        },

        descargar() {
            this.imprimeReporte = true;
        },

        descargarArchivo() {
            try {
                // Convertir `apliquesFiltrados` a CSV
                const csvData = unparse(this.apliquesFiltrados);

                // Crear un Blob para descargar el archivo
                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);

                // Crear un enlace para forzar la descarga
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'reporte_apliques.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                console.log('Archivo descargado exitosamente.');
            } catch (error) {
                console.error('Error al descargar el archivo:', error);
            }
        },
    },
};
</script>
