<template>
  <v-card v-if="puedeVerOrdenPedido" class="custom-container">
      <v-card-title class="d-flex align-center pe-2">
          <span class="headline">Pedido de Medicamentos</span>
          <v-divider></v-divider>
      </v-card-title>
      <ListadoDeTransferencias
        :items="items"
        :isViewMode="false"
        @add-item="openDialog"
        @edit-item="editItem"
        @delete-item="deleteItem"
      />

      <v-card-actions>
        <v-btn :disabled="items.length == 0" class="btn-blue" @click="generatePdf">Exportar PDF</v-btn>
      </v-card-actions>
  </v-card>

  <TransferenciaDialog
    v-if="isDialogOpen"
    v-model="isDialogOpen"
    :isEditing="isEditing"
    :medicamentosHoja="medicamentosPorArea"
    :isHojaInternacion="true"
    @save="saveItem"
  />
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

        puedeVerOrdenPedido() {
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
            console.log(item, "ITEM AL ABRIR EDIT")
            this.isEditing = true;
            this.currentItem = { ...item };
            this.isDialogOpen = true;
        },
        deleteItem(index) {
            this.items.splice(index, 1);
        },
        saveItem(item) {
            if (this.isEditing) {
                const index = this.items.findIndex((i) => i.id == item.id);
                if (index !== -1) {
                    this.items[index] = item;
                }
            } else {
                this.items.push(item);
            }
        },



        async generatePdf() {
  const doc = new jsPDF();

  // Función para agregar una página con una etiqueta específica
  const addPage = (label) => {
    doc.setFontSize(14);
    doc.text(`Pedido de Medicamentos a Farmacia (${label})`, 10, 10);

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
    doc.autoTable({
      head: [['SKU', 'Descripción', 'Cantidad']],
      body: this.items.map((item) => [item.sku, item.descripcion, item.cantidad]),
      startY: 30,
    });

    // Campo de autorización y retiro
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text('Autoriza:', 10, finalY);
    doc.text('Firma: __________________________', 10, finalY + 10);
    doc.text('Aclaración: ______________________', 10, finalY + 20);
    doc.text('Fecha: _________________', 10, finalY + 30);

    const rightColumnX = 110;
    doc.text('Retira:', rightColumnX, finalY);
    doc.text('Firma: __________________________', rightColumnX, finalY + 10);
    doc.text('Aclaración: ______________________', rightColumnX, finalY + 20);
    doc.text('Fecha: _________________', rightColumnX, finalY + 30);
  };

  // Agregar la primera página (Original)
  addPage('Original');

  // Agregar una nueva página para el duplicado
  doc.addPage();
  addPage('Duplicado');

  // Crear Blob del PDF
  const pdfBlob = doc.output('blob');

  // Guardar archivo usando File System Access API
  if (window.showSaveFilePicker) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'Pedido_Medicamentos_Farmacia.pdf',
        types: [
          {
            description: 'Archivos PDF',
            accept: { 'application/pdf': ['.pdf'] },
          },
        ],
      });
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(pdfBlob);
      await writableStream.close();
      console.log('Archivo guardado exitosamente.');
    } catch (err) {
      console.error('El usuario canceló la acción o ocurrió un error:', err);
    }
  } else {
    // Fallback
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'Pedido_Medicamentos_Farmacia.pdf';
    link.click();
  }
},
    },
};
</script>