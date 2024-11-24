<template>
    <v-container v-if="puedeVerOrdenPedido">
        <v-card class="custom-container">
            <v-card-title class="d-flex align-center pe-2">
                <span class="headline">Pedido de Medicamentos</span>
                <v-spacer></v-spacer>

            </v-card-title>
            <v-divider></v-divider>
            <ListadoDeTransferencias :items="items" :isViewMode="false" @add-item="openDialog" @edit-item="editItem"
                @delete-item="deleteItem" />

            <v-btn :disabled="items.length == 0" class="btn-blue" @click="generatePdf">Exportar PDF</v-btn>
        </v-card>

        <TransferenciaDialog v-if="isDialogOpen" v-model="isDialogOpen" :isEditing="isEditing"
            :medicamentosHoja="medicamentosPorArea" :isHojaInternacion="true" @save="saveItem" />
    </v-container>
</template>

<script>
import ListadoDeTransferencias from './ListadoDeTransferencias.vue';
import itemService from './servicios/itemService';
import TransferenciaDialog from './TransferenciaDialog.vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useGlobalStore } from '@/stores/global';
export default {
    components: {
        ListadoDeTransferencias,
        TransferenciaDialog,
    },
    data() {
        return {
            items: [], // Lista local de ítems
            isDialogOpen: false,
            isEditing: false,
            currentItem: null, // Ítem que se está editando
            listadoMedicamentos: [],
            globalStore: useGlobalStore()

        };
    },
    computed: {
        medicamentosPorArea() {
            return this.listadoMedicamentos.filter(med => med.StockArea.areaId == this.globalStore.getAreaId)
        },

        puedeVerOrdenPedido(){
            return this.globalStore.getRolId == this.globalStore.getRolSuperAdmin || this.globalStore.getAreaId != this.globalStore.getFarmaciaId
        }
    },
    mounted() {
        this.loadMedicamentos()
    },
    methods: {

        async loadMedicamentos() {
            this.listadoMedicamentos = await itemService.getAllItem()
            console.log(this.listadoMedicamentos, "LISTADO EN HOJA")
        },

        openDialog() {
            this.isEditing = false;
            this.currentItem = null;
            this.isDialogOpen = true;
        },
        editItem(item) {
            this.isEditing = true;
            this.currentItem = { ...item };
            this.isDialogOpen = true;
        },
        deleteItem(index) {
            this.items.splice(index, 1);
        },
        saveItem(item) {
            if (this.isEditing) {
                const index = this.items.findIndex((i) => i.sku === item.sku);
                if (index !== -1) {
                    this.items[index] = item;
                }
            } else {
                this.items.push(item);
            }
        },
        async generatePdf() {
            const doc = new jsPDF();

            // Título del documento
            doc.setFontSize(14);
            doc.text('Pedido de Medicamentos a Farmacia', 10, 10);

            // Usuario y fecha actual
            const currentDate = new Date().toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            const currentTime = new Date().toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            const fullName = this.globalStore.getFullNameUsuario || 'Usuario Desconocido';
            doc.setFontSize(12);
            doc.text(`Usuario: ${fullName} Fecha: ${currentDate} ${currentTime}`, 10, 20);

            // Tabla con los ítems
            const rows = this.items.map((item) => [
                item.sku,
                item.descripcion,
                item.cantidad,
            ]);

            doc.autoTable({
                head: [['SKU', 'Descripción', 'Cantidad']],
                body: rows,
                startY: 30,
            });

            // Campo de autorización debajo de la tabla
            const finalY = doc.lastAutoTable.finalY + 10; // Obtiene la última posición de la tabla y agrega espacio
            doc.text('Autoriza:', 10, finalY);
            doc.text('Firma: __________________________', 10, finalY + 10);
            doc.text('Aclaración: ______________________', 10, finalY + 20);
            doc.text('Fecha: _________________', 10, finalY + 30);

            // Crear Blob del PDF
            const pdfBlob = doc.output('blob'); // Generar el Blob directamente desde jsPDF

            // Usar File System Access API si está disponible
            if (window.showSaveFilePicker) {
                try {
                    const fileHandle = await window.showSaveFilePicker({
                        suggestedName: 'Pedido_Medicamentos_Farmacia.pdf',
                        types: [
                            {
                                description: 'Archivos PDF',
                                accept: {
                                    'application/pdf': ['.pdf'],
                                },
                            },
                        ],
                    });

                    // Escribir en el archivo seleccionado
                    const writableStream = await fileHandle.createWritable();
                    await writableStream.write(pdfBlob);
                    await writableStream.close();
                    console.log('Archivo guardado exitosamente.');
                } catch (err) {
                    console.error('El usuario canceló la acción o ocurrió un error:', err);
                }
            } else {
                // Fallback para navegadores que no soportan File System Access API
                const blobUrl = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = 'Pedido_Medicamentos_Farmacia.pdf'; // Nombre predeterminado
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        },
    },
};
</script>