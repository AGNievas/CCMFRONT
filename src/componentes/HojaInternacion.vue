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

  // Dimensiones de la página
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  // Alturas fijas
  const headerHeight = pageHeight * 0.15; // 15% del alto total
  const footerHeight = pageHeight * 0.23; // 23% del alto total

  // Encabezado
  const addHeader = (label) => {
    doc.setFontSize(16);
    doc.text('Hospital Penna', pageWidth / 2, 10, { align: 'center' });
    doc.setFontSize(12);
    const currentDate = new Date().toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const fullName = this.globalStore.getFullNameUsuario || 'Usuario Desconocido';
    doc.text(`Usuario: ${fullName}`, 10, 20);
    doc.text(`Fecha: ${currentDate}`, 10, 30);
    doc.text(`Pedido de Medicamentos (${label})`, pageWidth / 2, headerHeight - 10, { align: 'center' });

    // Línea divisoria debajo del header
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(10, headerHeight, pageWidth - 10, headerHeight);
  };

  // Footer
  const addFooter = () => {
    const footerY = pageHeight - footerHeight;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(10, footerY, pageWidth - 10, footerY); // Línea divisoria

    doc.setFontSize(10);
    doc.text(
      'NOTA: El médico que autoriza este pedido se hace responsable por los medicamentos solicitados, y la persona que retira asume la responsabilidad del traslado hasta el área de destino.',
      10,
      footerY + 10,
      { maxWidth: pageWidth - 20 }
    );

    doc.setFontSize(12);
    doc.text('Autoriza:', 10, footerY + 30);
    doc.text('Firma: __________________________', 10, footerY + 40);
    doc.text('Aclaración: ______________________', 10, footerY + 50);
    doc.text('Fecha: _________________', 10, footerY + 60);

    const rightColumnX = pageWidth - 100;
    doc.text('Retira:', rightColumnX, footerY + 30);
    doc.text('Firma: __________________________', rightColumnX, footerY + 40);
    doc.text('Aclaración: ______________________', rightColumnX, footerY + 50);
    doc.text('Fecha: _________________', rightColumnX, footerY + 60);
  };

  // Cuerpo
  const addBody = (label) => {
    doc.autoTable({
      startY: headerHeight + 5, // Inicia después del header
      margin: { left: 10, right: 10, bottom: footerHeight }, // Respeta el espacio del footer
      head: [['SKU', 'Descripción', 'Cantidad']],
      body: this.items.map((item) => [item.sku, item.descripcion, item.cantidad]),
      tableWidth: pageWidth - 20,
      styles: { fontSize: 10 },
      bodyStyles: { valign: 'middle' },
      pageBreak: 'auto', // Permite que la tabla se divida automáticamente en nuevas páginas
      didDrawPage: () => {
        addHeader(label); // Dibuja el header en cada página
        addFooter(); // Dibuja el footer en cada página
      },
    });
  };

  // Generar contenido para Original
  addHeader('Original'); // Dibujar header de la primera página
  addFooter(); // Dibujar footer de la primera página
  addBody('Original');

  // Generar contenido para Duplicado
  doc.addPage(); // Nueva página para Duplicado
  addHeader('Duplicado'); // Dibujar header en la primera página del Duplicado
  addFooter(); // Dibujar footer en la primera página del Duplicado
  addBody('Duplicado');

  // Descargar o guardar PDF
  const pdfBlob = doc.output('blob');

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
    } catch (err) {
      console.error('El usuario canceló la acción o ocurrió un error:', err);
    }
  } else {
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