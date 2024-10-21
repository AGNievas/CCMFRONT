<template>
    <table>
      <thead>
        <tr>
          <th v-for="(col, index) in columns" :key="index">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td v-for="(value, key) in item" :key="key">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script>
  export default {
    name: 'Tabla',
    props: {
      data: {
        type: Array,
        required: true
      },
      columns: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  thead {
    background-color: #f4f4f4;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  </style>