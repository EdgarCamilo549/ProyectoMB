// Cargar y procesar el archivo CSV
document.addEventListener("DOMContentLoaded", () => {
    Papa.parse("datos.csv", {
      download: true,
      header: true,
      complete: function(results) {
        datosCSV = results.data;  // Guardamos los datos sin mostrarlos
      }
    });
  });
  
  const tablaCuerpo = document.getElementById("tabla-cuerpo");
  const tablaContenedor = document.getElementById("tabla-contenedor");
  const exportarBtn = document.getElementById("exportar-btn");
  
  // Elementos de las listas desplegables y botones de búsqueda
  const busquedaMarcaSelect = document.getElementById("busqueda-marca");
  const busquedaBranchSelect = document.getElementById("busqueda-branch");
  const busquedaCustomerInput = document.getElementById("busqueda-customer");
  const busquedaPartnersInput = document.getElementById("busqueda-partners");
  const busquedaEjecutivoInput = document.getElementById("busqueda-ejecutivo");
  
  const buscarMarcaBtn = document.getElementById("buscar-marca-btn");
  const buscarBranchBtn = document.getElementById("buscar-branch-btn");
  const buscarCustomerBtn = document.getElementById("buscar-customer-btn");
  const buscarPartnersBtn = document.getElementById("buscar-partners-btn");
  const buscarEjecutivoBtn = document.getElementById("buscar-ejecutivo-btn");
  const limpiarBtn = document.getElementById("limpiar-btn");
  
  let datosCSV = [];
  
  // Mostrar datos en la tabla después de una búsqueda
  function mostrarDatos(datos) {
    tablaCuerpo.innerHTML = "";  // Limpiar tabla
  
    datos.forEach(dato => {
      const fila = document.createElement("tr");
  
      // Solo mostrar las columnas requeridas
      const camposMostrar = ["Nombre completo", "Teléfono", "Correo electrónico", "Estado"];
      camposMostrar.forEach(campo => {
        const celda = document.createElement("td");
        celda.textContent = dato[campo] || "";  // Manejar valores vacíos
        fila.appendChild(celda);
      });
  
      tablaCuerpo.appendChild(fila);
    });
  
    // Mostrar el contenedor de la tabla si hay resultados
    tablaContenedor.style.display = datos.length > 0 ? "block" : "none";
  }
  
  // Funciones de búsqueda específicas
  function buscarPorMarca() {
    const query = busquedaMarcaSelect.value.toLowerCase();
    const resultados = datosCSV.filter(dato => 
      dato["Marca - Proyecto"] && dato["Marca - Proyecto"].toLowerCase() === query
    );
    mostrarDatos(resultados);
  }
  
  function buscarPorBranch() {
    const query = busquedaBranchSelect.value.toLowerCase();
    const resultados = datosCSV.filter(dato => 
      dato["Branch Customer Number"] && dato["Branch Customer Number"].toLowerCase() === query
    );
    mostrarDatos(resultados);
  }
  
  function buscarPorCustomerName() {
    const query = busquedaCustomerInput.value.toLowerCase();
    const resultados = datosCSV.filter(dato => 
      dato["Customer Name"] && dato["Customer Name"].toLowerCase().includes(query)
    );
    mostrarDatos(resultados);
  }
  
  function buscarPorPartners() {
    const query = busquedaPartnersInput.value.toLowerCase();
    const resultados = datosCSV.filter(dato => 
      dato["Desarrollo de Partners - UF"] && dato["Desarrollo de Partners - UF"].toLowerCase().includes(query)
    );
    mostrarDatos(resultados);
  }
  
  function buscarPorEjecutivo() {
    const query = busquedaEjecutivoInput.value.toLowerCase();
    const resultados = datosCSV.filter(dato => 
      dato["Nombre Ejecutivo DC"] && dato["Nombre Ejecutivo DC"].toLowerCase().includes(query)
    );
    mostrarDatos(resultados);
  }
  
  // Función para limpiar los datos y restablecer la tabla
  function limpiarDatos() {
    // Restablecer las listas desplegables y campos de texto
    busquedaMarcaSelect.value = "";
    busquedaBranchSelect.value = "";
    busquedaCustomerInput.value = "";
    busquedaPartnersInput.value = "";
    busquedaEjecutivoInput.value = "";
  
    // Limpiar la tabla
    tablaCuerpo.innerHTML = "";
    tablaContenedor.style.display = "none";
  }
  
  // Enlazar cada botón con su respectiva función de búsqueda
  buscarMarcaBtn.addEventListener("click", buscarPorMarca);
  buscarBranchBtn.addEventListener("click", buscarPorBranch);
  buscarCustomerBtn.addEventListener("click", buscarPorCustomerName);
  buscarPartnersBtn.addEventListener("click", buscarPorPartners);
  buscarEjecutivoBtn.addEventListener("click", buscarPorEjecutivo);
  limpiarBtn.addEventListener("click", limpiarDatos);
  // Enlazar el botón de exportación a la función de exportación
exportarBtn.addEventListener("click", exportarExcel);

  
  // Función para exportar resultados filtrados a Excel
    function exportarExcel() {
      const queryMarca = busquedaMarcaSelect.value.toLowerCase();
      const queryBranch = busquedaBranchSelect.value.toLowerCase();
      const queryCustomer = busquedaCustomerSelect.value.toLowerCase();
    
      // Filtrar solo los datos de la búsqueda actual para la exportación
      const datosExportar = datosCSV
        .filter(dato => (
          (dato["Marca - Proyecto"] && dato["Marca - Proyecto"].toLowerCase() === queryMarca) ||
          (dato["Branch Customer Number"] && dato["Branch Customer Number"].toLowerCase() === queryBranch) ||
          (dato["Customer Name"] && dato["Customer Name"].toLowerCase() === queryCustomer)
        ))
        .map(dato => ({
          "Nombre completo": dato["Nombre completo"],
          "Teléfono": dato["Teléfono"],
          "Correo electrónico": dato["Correo electrónico"],
          "Estado": dato["Estado"]
        }));
    
      // Comprobar si hay datos para exportar
      if (datosExportar.length === 0) {
        alert("No hay datos para exportar.");
        return;
      }
    
      // Crear el archivo Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosExportar);
      
      XLSX.utils.book_append_sheet(wb, ws, "Resultados");
      XLSX.writeFile(wb, "Resultados.xlsx");
    }
    