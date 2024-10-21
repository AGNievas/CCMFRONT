import { defineStore } from 'pinia';
import axiosInstance from '@/axios';


export const useListadoStore = defineStore('listadoStore', {
  state: () => ({
    areaId: null,
    stockAreaId: null,
    tipoListado: '',
    items: []
  }),
  actions: {
    setAreaId(id) {
      this.areaId = id;
    },
    setStockAreaId(id) {
      this.stockAreaId = id;
    },
    setTipoListado(tipo) {
      this.tipoListado = tipo;
    },
    async fetchListado() {
      try {
        let endpoint = '';
        switch (this.tipoListado) {
          case 'medicamentos':
            endpoint = '/medicamento';
            break;
          case 'pacientes':
            endpoint = '/paciente';
            break;
          case 'usuarios':
            endpoint = '/user';
            break;
          case 'apliques':
            endpoint = '/aplique';
            break;
            case 'area':
                endpoint = '/area';
                break;  
                case 'stock-area':
                    endpoint = '/stock-area';
                    break;        
          default:
            throw new Error('Tipo de listado desconocido');
        }
        const response = await axiosInstance.get(endpoint);
        console.log(response)
        this.items = response.data;
      } catch (error) {
        console.error('Error al traer el listado:', error);
      }
    },
    filterListado(criteria) {
      this.items = this.items.filter(item => {
        return Object.keys(criteria).every(key =>
          String(item[key]).toLowerCase().includes(String(criteria[key]).toLowerCase())
        );
      });
    }
  }
});
