<template>
    <DashboardLayout>
        <div class="curriculums-page">
            <div class="container-xxl">
                <div class="page-header">
                    <h1 class="page-title">Curriculums</h1>
                    <p class="page-subtitle">Gestiona tus currículums guardados</p>
                </div>
                
                <!-- Contenedor vacío para que el usuario agregue su tabla -->
                <div  class="curriculums-content">
                    <!-- Menú contextual -->
                    <div v-if="contextMenu.visible" :style="{ position: 'fixed', top: contextMenu.y + 'px', left: contextMenu.x + 'px', zIndex: 2000 }">
                        <div id="cv-context-menu" class="context-menu card shadow-sm">
                            <ul class="list-unstyled mb-0">
                                <li class="context-item" @click.prevent="contextDownload">
                                    <i class="fa-solid fa-download"></i> Descargar
                                </li>
                                <li class="context-item text-danger" @click.prevent="contextDelete">
                                    <i class="fa-solid fa-trash"></i> Eliminar
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <Datatable 
                    :data="data" 
                    class="display" 
                    :columns="columns"
                    :options="datatableOptions">
                        <thead>
                            <tr>
                                <th>ID Usuario</th>
                                <th>Nombre Usuario</th>
                                <th>Correo Usuario</th>
                                <th>Vista Previa CV</th>
                                <th>Fecha de Subida</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                    </Datatable>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "/src/vue/content/layouts/DashboardLayout.vue"
import Datatable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-dt'
import { ref, onMounted, onUnmounted } from 'vue'
import swal from 'sweetalert2'

Datatable.use(DataTablesCore)

const data = ref([])

// Estado del menú contextual
const contextMenu = ref({ visible: false, x: 0, y: 0, item: null })

// Referencia a la tabla DataTables
let dataTableInstance = null

// Función para manejar el click derecho en una fila (debe estar definida antes de datatableOptions)
function handleRowContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('handleRowContextMenu llamado', { 
        dataTableInstance: !!dataTableInstance,
        target: event.target,
        currentTarget: event.currentTarget
    });
    
    if (!dataTableInstance) {
        console.warn('dataTableInstance no está disponible');
        return;
    }
    
    // Encontrar la fila (tr) más cercana al elemento clickeado
    const row = event.target.closest('tr');
    if (!row) {
        console.warn('No se encontró una fila (tr)');
        return;
    }
    
    // Obtener los datos de la fila
    const rowData = dataTableInstance.row(row).data();
    
    console.log('Datos de la fila:', rowData);
    
    if (!rowData || rowData.file_path === 'No CV') {
        console.warn('No hay datos válidos en la fila');
        return;
    }
    
    // Abrir el menú contextual
    console.log('Abriendo menú contextual en:', event.clientX, event.clientY);
    openContextMenu(event, rowData);
}

// Función para abrir el menú contextual
function openContextMenu(event, item) {
    console.log('openContextMenu llamado', { x: event.clientX, y: event.clientY, item });
    contextMenu.value = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        item: item
    }
    console.log('contextMenu.value después de actualizar:', contextMenu.value);
}

// Configuración de DataTables en español
const datatableOptions = {
    order: [[0, 'asc']], // Orden inicial por ID Usuario ascendente
    orderMulti: true, // Permitir ordenamiento múltiple (Shift + click)
    orderClasses: true, // Habilitar clases de ordenamiento (sorting, sorting_asc, sorting_desc)
    lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Todos"]], // Opciones del limitador de resultados
    pageLength: 10, // Número de entradas por defecto
    initComplete: function() {
        // Este callback se ejecuta después de que DataTables haya inicializado completamente
        // Incluyendo la renderización de los controles de longitud y filtro
        setTimeout(() => {
            // Forzar aplicación de estilos directamente en el DOM
            applyDataTablesStyles();
            debugDataTablesStyles();
        }, 100);
    },
    language: {
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ entradas",
        info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
        infoEmpty: "Mostrando 0 a 0 de 0 entradas",
        infoFiltered: "(filtrado de _MAX_ entradas totales)",
        paginate: {
            first: "Primero",
            previous: "Anterior",
            next: "Siguiente",
            last: "Último"
        },
        emptyTable: "No hay datos disponibles en la tabla",
        zeroRecords: "No se encontraron resultados"
    },
    drawCallback: function() {
        try {
            // Guardar referencia a la instancia de la tabla
            dataTableInstance = this.api();
            console.log('drawCallback ejecutado, dataTableInstance:', !!dataTableInstance);
            
            // Usar event delegation en el tbody en lugar de agregar listeners a cada fila
            // Intentar diferentes formas de obtener el tbody
            let tbody = null;
            
            // Método 1: a través de table().body()
            try {
                const tableBody = dataTableInstance.table().body();
                if (tableBody && tableBody.length > 0) {
                    tbody = tableBody[0];
                }
            } catch (e) {
                console.log('Método 1 falló, intentando método 2');
            }
            
            // Método 2: buscar el tbody directamente en el DOM
            if (!tbody) {
                const tableNode = dataTableInstance.table().node();
                if (tableNode) {
                    tbody = tableNode.querySelector('tbody');
                }
            }
            
            // Método 3: buscar por clase
            if (!tbody) {
                tbody = document.querySelector('.display tbody');
            }
            
            if (tbody) {
                // Remover listener anterior si existe
                tbody.removeEventListener('contextmenu', handleRowContextMenu);
                // Agregar listener usando event delegation
                tbody.addEventListener('contextmenu', handleRowContextMenu, true); // useCapture = true
                console.log('✅ Event listener agregado al tbody usando event delegation', tbody);
            } else {
                console.error('❌ No se pudo encontrar el tbody');
            }
            
            // Aplicar estilos después de cada redibujado
            setTimeout(() => {
                applyDataTablesStyles();
            }, 50);
        } catch (error) {
            console.error('Error en drawCallback:', error);
        }
    }
}

const columns = [
    { 
        title: 'ID Usuario', 
        data: 'id_user', 
        className: 'text-center',
        orderable: true,
        type: 'num' // Para ordenamiento numérico
    },
    { 
        title: 'Nombre Usuario', 
        data: 'name',
        orderable: true
    },
    { 
        title: 'Correo Usuario', 
        data: 'email',
        orderable: true
    },
    { 
        title: 'Vista Previa CV', 
        data: 'file_path',
        className: 'text-center',
        orderable: false,
        render: function(data, type, row) {
            if (data && data !== 'No CV') {
                const imageUrl = `http://localhost:3000/${reemplazarPrimerSlash(data)}`;
                return `<div class="cv-image-container">
                    <img src="${imageUrl}" alt="CV" class="cv-preview-image" onclick="showCVImage('${imageUrl}')" style="cursor: pointer;"/>
                </div>`;
            } else {
                return '<span class="text-muted">No CV</span>';
            }
        }
    },
    { 
        title: 'Fecha de Subida', 
        data: 'updated_at', 
        className: 'text-center',
        orderable: true,
        type: 'date' // Para ordenamiento por fecha
    },
    {
        title: 'Acciones',
        data: 'file_path',
        className: 'text-center',
        orderable: false,
        render: function(data, type, row) {
            if (data && data !== 'No CV') {
                const imageUrl = `http://localhost:3000/${reemplazarPrimerSlash(data)}`;
                const fileName = data.split('/').pop() || 'CV.pdf';
                return `<button class="btn-download-cv" onclick="downloadCV('${imageUrl}', '${fileName}')" title="Descargar CV">
                    <i class="fa-solid fa-download"></i> Descargar
                </button>`;
            } else {
                return '<span class="text-muted">-</span>';
            }
        }
    }
]

function formatTimestamp(ts) {
  if (!ts) return 'N/A';
  try {
    const clean = ts.replace(' ', 'T').split('.')[0] + 'Z';
    return new Date(clean).toLocaleString();
  } catch {
    return 'N/A';
  }
}

function reemplazarPrimerSlash(str) {
    return str.replace(/^\//, '');
}

// Función para descargar CV
function downloadCV(imageUrl, fileName) {
    swal.fire({
        title: 'Desea descargar este CV?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Descargar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            swal.fire({
                title:'Descarga exitosa!!',
                icon: 'success',
                text: 'El CV se ha descargado correctamente.'
                        })
        })
        .catch(error => {
            console.error('Error al descargar CV:', error);
            swal.fire({
                title: 'Error',
                text: 'Hubo un problema al descargar el CV.',
                icon: 'error'
            })
        });
    }
    else {
        swal.fire({
            title: 'Descarga cancelada',
            icon: 'error',
            text: 'La descarga del CV ha sido cancelada.'
        })
    }
    })
}

// Función para mostrar la imagen del CV en SweetAlert
function showCVImage(imageUrl) {
    swal.fire({
        title: 'Vista Previa del CV',
        html: `<img src="${imageUrl}" alt="CV" style="max-width: 100%; max-height: 70vh; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"/>`,
        width: '90%',
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#667eea',
        backdrop: true,
        allowOutsideClick: true
    });
}


// Función para cerrar el menú contextual
function closeContextMenu() {
    contextMenu.value.visible = false
    contextMenu.value.item = null
}

// Función para descargar desde el menú contextual
function contextDownload() {
    const item = contextMenu.value.item
    if (!item || item.file_path === 'No CV') {
        closeContextMenu()
        return
    }
    
    const imageUrl = `http://localhost:3000/${reemplazarPrimerSlash(item.file_path)}`
    const fileName = item.file_path.split('/').pop() || 'CV.pdf'
    
    downloadCV(imageUrl, fileName)
    closeContextMenu()
}

// Función para eliminar desde el menú contextual
async function contextDelete() {
    const item = contextMenu.value.item
    if (!item || !item.id_cv) {
        closeContextMenu()
        return
    }
    
    const result = await swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545'
    })
    
    if (result.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:3000/api/cv/${item.id_cv}`, {
                method: 'DELETE'
            })
            
            if (response.ok) {
                // Eliminar de la tabla local
                if (dataTableInstance) {
                    dataTableInstance.row((idx, data) => data.id_cv === item.id_cv).remove().draw()
                }
                
                // También actualizar el array de datos
                const index = data.value.findIndex(cv => cv.id_cv === item.id_cv)
                if (index !== -1) {
                    data.value.splice(index, 1)
                }
                
                swal.fire({
                    title: 'Eliminado',
                    text: 'El CV ha sido eliminado exitosamente',
                    icon: 'success'
                })
            } else {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al eliminar')
            }
        } catch (error) {
            console.error('Error al eliminar CV:', error)
            swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el CV',
                icon: 'error'
            })
        }
    }
    
    closeContextMenu()
}

// Función para cerrar el menú al hacer click fuera
function handleDocumentClick(event) {
    if (!contextMenu.value.visible) return
    
    // No cerrar si es un click derecho (contextmenu)
    if (event.type === 'contextmenu') {
        return
    }
    
    const menuEl = document.getElementById('cv-context-menu')
    if (menuEl && !menuEl.contains(event.target)) {
        // Verificar que el click no sea en una fila de la tabla
        const clickedRow = event.target.closest('tbody tr')
        if (!clickedRow) {
            closeContextMenu()
        }
    }
}

// Función para cerrar el menú con Escape
function handleEscape(event) {
    if (event.key === 'Escape') {
        closeContextMenu()
    }
}

// Función para aplicar estilos directamente en el DOM
function applyDataTablesStyles() {
    // Buscar dentro del contenedor de la tabla específica
    const tableContainer = document.querySelector('.curriculums-content');
    const wrapper = tableContainer?.querySelector('.dataTables_wrapper') || document.querySelector('.dataTables_wrapper');
    
    // Aplicar estilos al limitador de resultados
    const lengthEl = wrapper?.querySelector('.dt-length') || document.querySelector('.dt-length');
    if (lengthEl) {
        lengthEl.style.setProperty('display', 'flex', 'important');
        lengthEl.style.setProperty('align-items', 'center', 'important');
        lengthEl.style.setProperty('gap', '0.5rem', 'important');
        lengthEl.style.setProperty('box-sizing', 'border-box', 'important');
        
        // Aplicar estilos al select dentro
        const selectEl = lengthEl.querySelector('select, .dt-input');
        if (selectEl) {
            selectEl.style.setProperty('border', '2px solid #e0e0e0', 'important');
            selectEl.style.setProperty('border-radius', '8px', 'important');
            selectEl.style.setProperty('padding', '0.6rem 1rem', 'important');
            selectEl.style.setProperty('background', 'white', 'important');
            selectEl.style.setProperty('color', '#212529', 'important');
            selectEl.style.setProperty('font-size', '0.9rem', 'important');
        }
        
        // Aplicar estilos al label
        const labelEl = lengthEl.querySelector('label');
        if (labelEl) {
            labelEl.style.setProperty('display', 'flex', 'important');
            labelEl.style.setProperty('align-items', 'center', 'important');
            labelEl.style.setProperty('gap', '0.5rem', 'important');
            labelEl.style.setProperty('font-weight', '600', 'important');
            labelEl.style.setProperty('margin', '0', 'important');
        }
    }
    
    // Aplicar estilos a la barra de búsqueda
    const searchEl = wrapper?.querySelector('.dt-search') || document.querySelector('.dt-search');
    if (searchEl) {
        searchEl.style.setProperty('display', 'flex', 'important');
        searchEl.style.setProperty('align-items', 'center', 'important');
        searchEl.style.setProperty('gap', '0.5rem', 'important');
        searchEl.style.setProperty('box-sizing', 'border-box', 'important');
        
        // Aplicar estilos al input dentro
        const inputEl = searchEl.querySelector('input, .dt-input');
        if (inputEl) {
            inputEl.style.setProperty('border', '2px solid #e0e0e0', 'important');
            inputEl.style.setProperty('border-radius', '8px', 'important');
            inputEl.style.setProperty('padding', '0.6rem 1rem', 'important');
            inputEl.style.setProperty('background', 'white', 'important');
            inputEl.style.setProperty('color', '#212529', 'important');
            inputEl.style.setProperty('font-size', '0.9rem', 'important');
            inputEl.style.setProperty('min-width', '200px', 'important');
        }
        
        // Aplicar estilos al label
        const labelEl = searchEl.querySelector('label');
        if (labelEl) {
            labelEl.style.setProperty('font-weight', '600', 'important');
            labelEl.style.setProperty('margin', '0', 'important');
            labelEl.style.setProperty('white-space', 'nowrap', 'important');
        }
    }
    
    // Buscar el contenedor padre que envuelve a .dt-length y .dt-search
    // Puede ser .dt-layout-row o cualquier otro contenedor
    let layoutRow = wrapper?.querySelector('.dt-layout-row');
    
    // Si no se encuentra, buscar el contenedor padre común de length y search
    if (!layoutRow && lengthEl && searchEl) {
        // Encontrar el contenedor padre común
        let parent = lengthEl.parentElement;
        while (parent && parent !== wrapper) {
            if (parent.contains(lengthEl) && parent.contains(searchEl)) {
                layoutRow = parent;
                console.log('Contenedor padre encontrado:', parent, parent.className);
                break;
            }
            parent = parent.parentElement;
        }
    }
    
    // Aplicar estilos al contenedor
    if (layoutRow) {
        console.log('Aplicando estilos al contenedor:', layoutRow, layoutRow.className);
        layoutRow.style.cssText = `
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 2rem !important;
            margin-bottom: 1.5rem !important;
            width: 100% !important;
            box-sizing: border-box !important;
        `;
    } else {
        console.warn('No se encontró contenedor, buscando alternativas...');
        // Buscar cualquier contenedor que tenga ambos elementos
        const allContainers = wrapper?.querySelectorAll('div');
        allContainers?.forEach(div => {
            if (div.contains(lengthEl) && div.contains(searchEl) && div !== lengthEl && div !== searchEl) {
                console.log('Contenedor alternativo encontrado:', div, div.className);
                div.style.cssText = `
                    display: flex !important;
                    flex-direction: row !important;
                    flex-wrap: nowrap !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    gap: 2rem !important;
                    margin-bottom: 1.5rem !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                `;
            }
        });
    }
    
    // Aplicar estilos a las celdas del layout si existen
    const layoutCells = wrapper?.querySelectorAll('.dt-layout-cell') || [];
    console.log('Celdas encontradas:', layoutCells.length);
    layoutCells.forEach((cell, index) => {
        console.log(`Aplicando estilos a celda ${index}:`, cell);
        cell.style.cssText = `
            flex: 0 0 auto !important;
            width: auto !important;
            max-width: none !important;
            display: flex !important;
            align-items: center !important;
            box-sizing: border-box !important;
        `;
    });
    
    // Asegurar que los elementos .dt-length y .dt-search no ocupen todo el ancho
    if (lengthEl) {
        lengthEl.style.setProperty('width', 'auto', 'important');
        lengthEl.style.setProperty('max-width', 'none', 'important');
        lengthEl.style.setProperty('flex', '0 0 auto', 'important');
    }
    
    if (searchEl) {
        searchEl.style.setProperty('width', 'auto', 'important');
        searchEl.style.setProperty('max-width', 'none', 'important');
        searchEl.style.setProperty('flex', '0 0 auto', 'important');
        searchEl.style.setProperty('margin-left', 'auto', 'important');
    }
    
    // Asegurar que la celda de inicio (limitador) esté a la izquierda
    const startCell = wrapper?.querySelector('.dt-layout-cell.dt-layout-start');
    if (startCell) {
        console.log('Aplicando estilos a startCell:', startCell);
        startCell.style.setProperty('margin-right', 'auto', 'important');
    }
    
    // Asegurar que la celda de fin (búsqueda) esté a la derecha
    const endCell = wrapper?.querySelector('.dt-layout-cell.dt-layout-end');
    if (endCell) {
        console.log('Aplicando estilos a endCell:', endCell);
        endCell.style.setProperty('margin-left', 'auto', 'important');
    }
    
    // Verificar que los estilos se aplicaron
    if (layoutRow) {
        const computedStyle = window.getComputedStyle(layoutRow);
        console.log('Estilos aplicados al contenedor:');
        console.log('  - Display:', computedStyle.display);
        console.log('  - Flex-direction:', computedStyle.flexDirection);
        console.log('  - Justify-content:', computedStyle.justifyContent);
        console.log('  - Gap:', computedStyle.gap);
    }
    
    // Aplicar estilos al texto de información y paginación
    // Buscar con las nuevas clases de DataTables (.dt-info, .dt-paging) y las antiguas (.dataTables_info, .dataTables_paginate)
    const infoEl = wrapper?.querySelector('.dt-info') || wrapper?.querySelector('.dataTables_info') || document.querySelector('.dt-info') || document.querySelector('.dataTables_info');
    const paginateEl = wrapper?.querySelector('.dt-paging') || wrapper?.querySelector('.dataTables_paginate') || document.querySelector('.dt-paging') || document.querySelector('.dataTables_paginate');
    
    // Buscar el contenedor .dt-layout-row que contiene info y paginación
    let infoPaginateContainer = wrapper?.querySelector('.dt-layout-row:has(.dt-info), .dt-layout-row:has(.dt-paging)') || 
                                 wrapper?.querySelector('.dt-layout-row:has(.dataTables_info), .dt-layout-row:has(.dataTables_paginate)');
    
    // Si no se encuentra con :has(), buscar manualmente
    if (!infoPaginateContainer && infoEl && paginateEl) {
        // Buscar el contenedor padre común
        let parent = infoEl.parentElement;
        while (parent && parent !== wrapper) {
            if (parent.classList.contains('dt-layout-row') && parent.contains(infoEl) && parent.contains(paginateEl)) {
                infoPaginateContainer = parent;
                console.log('Contenedor de info/paginate encontrado:', parent, parent.className);
                break;
            }
            parent = parent.parentElement;
        }
    }
    
    // Si aún no se encuentra, buscar cualquier contenedor que tenga ambos
    if (!infoPaginateContainer && infoEl && paginateEl) {
        const allContainers = wrapper?.querySelectorAll('.dt-layout-row');
        allContainers?.forEach(div => {
            if (div.contains(infoEl) && div.contains(paginateEl)) {
                infoPaginateContainer = div;
                console.log('Contenedor alternativo info/paginate encontrado:', div, div.className);
            }
        });
    }
    
    // Aplicar estilos al contenedor de info y paginación
    if (infoPaginateContainer) {
        console.log('Aplicando estilos al contenedor info/paginate:', infoPaginateContainer);
        infoPaginateContainer.style.cssText = `
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 2rem !important;
            margin-top: 1.5rem !important;
            width: 100% !important;
            box-sizing: border-box !important;
        `;
    }
    
    // Aplicar estilos a las celdas del layout de info/paginate
    const infoStartCell = wrapper?.querySelector('.dt-layout-cell.dt-layout-start:has(.dt-info), .dt-layout-cell.dt-layout-start:has(.dataTables_info)');
    const infoEndCell = wrapper?.querySelector('.dt-layout-cell.dt-layout-end:has(.dt-paging), .dt-layout-cell.dt-layout-end:has(.dataTables_paginate)');
    
    if (infoStartCell) {
        infoStartCell.style.setProperty('flex', '0 0 auto', 'important');
        infoStartCell.style.setProperty('width', 'auto', 'important');
        infoStartCell.style.setProperty('max-width', 'none', 'important');
    }
    
    if (infoEndCell) {
        infoEndCell.style.setProperty('flex', '0 0 auto', 'important');
        infoEndCell.style.setProperty('width', 'auto', 'important');
        infoEndCell.style.setProperty('max-width', 'none', 'important');
        infoEndCell.style.setProperty('margin-left', 'auto', 'important');
    }
    
    // Aplicar estilos al texto de información
    if (infoEl) {
        infoEl.style.setProperty('width', 'auto', 'important');
        infoEl.style.setProperty('max-width', 'none', 'important');
        infoEl.style.setProperty('flex', '0 0 auto', 'important');
        infoEl.style.setProperty('padding-top', '1rem', 'important');
        infoEl.style.setProperty('margin', '0', 'important');
    }
    
    // Aplicar estilos a la paginación
    if (paginateEl) {
        paginateEl.style.setProperty('width', 'auto', 'important');
        paginateEl.style.setProperty('max-width', 'none', 'important');
        paginateEl.style.setProperty('flex', '0 0 auto', 'important');
        paginateEl.style.setProperty('padding-top', '1rem', 'important');
        paginateEl.style.setProperty('margin', '0', 'important');
        paginateEl.style.setProperty('display', 'flex', 'important');
        paginateEl.style.setProperty('align-items', 'center', 'important');
        paginateEl.style.setProperty('gap', '0.5rem', 'important');
    }
    
    // Aplicar estilos a los botones de paginación
    const pagingButtons = wrapper?.querySelectorAll('.dt-paging-button') || document.querySelectorAll('.dt-paging-button');
    pagingButtons.forEach(button => {
        button.style.setProperty('padding', '0.65rem 1rem', 'important');
        button.style.setProperty('border', '2px solid #e0e0e0', 'important');
        button.style.setProperty('border-radius', '8px', 'important');
        button.style.setProperty('background', 'white', 'important');
        button.style.setProperty('color', '#212529', 'important');
        button.style.setProperty('min-width', '44px', 'important');
        button.style.setProperty('height', '44px', 'important');
        button.style.setProperty('font-weight', '500', 'important');
        button.style.setProperty('transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 'important');
        
        // Estilos para botones de navegación
        if (button.classList.contains('first') || button.classList.contains('previous') || 
            button.classList.contains('next') || button.classList.contains('last')) {
            button.style.setProperty('padding', '0.65rem 1.2rem', 'important');
            button.style.setProperty('font-weight', '600', 'important');
        }
    });
    
    // Aplicar estilos a los botones antiguos también
    const oldPagingButtons = wrapper?.querySelectorAll('.paginate_button') || document.querySelectorAll('.paginate_button');
    oldPagingButtons.forEach(button => {
        button.style.setProperty('padding', '0.65rem 1rem', 'important');
        button.style.setProperty('border', '2px solid #e0e0e0', 'important');
        button.style.setProperty('border-radius', '8px', 'important');
        button.style.setProperty('background', 'white', 'important');
        button.style.setProperty('color', '#212529', 'important');
        button.style.setProperty('min-width', '44px', 'important');
        button.style.setProperty('height', '44px', 'important');
        button.style.setProperty('font-weight', '500', 'important');
        button.style.setProperty('transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 'important');
    });
}

// Función para depurar estilos de DataTables
function debugDataTablesStyles() {
    console.group('🔍 Depuración de estilos DataTables');
    
    // Buscar dentro del contenedor de la tabla específica
    const tableContainer = document.querySelector('.curriculums-content');
    const wrapper = tableContainer?.querySelector('.dataTables_wrapper') || document.querySelector('.dataTables_wrapper');
    
    // 1. Verificar elementos del limitador de resultados (nueva estructura: .dt-length)
    const lengthElement = wrapper?.querySelector('.dt-length') || wrapper?.querySelector('.dataTables_length') || document.querySelector('.dt-length') || document.querySelector('.dataTables_length');
    if (lengthElement) {
        console.log('✅ Limitador de resultados encontrado:', lengthElement);
        const computedStyle = window.getComputedStyle(lengthElement);
        console.log('   - Display:', computedStyle.display);
        console.log('   - Float:', computedStyle.float);
        console.log('   - Width:', computedStyle.width);
        console.log('   - Margin:', computedStyle.margin);
        console.log('   - Clases:', lengthElement.className);
        console.log('   - HTML:', lengthElement.outerHTML.substring(0, 200));
        
        // Verificar el select dentro
        const selectElement = lengthElement.querySelector('select');
        if (selectElement) {
            const selectStyle = window.getComputedStyle(selectElement);
            console.log('   - Select encontrado');
            console.log('     * Display:', selectStyle.display);
            console.log('     * Width:', selectStyle.width);
            console.log('     * Padding:', selectStyle.padding);
            console.log('     * Border:', selectStyle.border);
        } else {
            console.warn('   ⚠️ Select no encontrado dentro del limitador');
        }
    } else {
        console.error('❌ Limitador de resultados NO encontrado');
    }
    
    // 2. Verificar elementos de la barra de búsqueda (nueva estructura: .dt-search)
    const filterElement = wrapper?.querySelector('.dt-search') || wrapper?.querySelector('.dataTables_filter') || document.querySelector('.dt-search') || document.querySelector('.dataTables_filter');
    if (filterElement) {
        console.log('✅ Barra de búsqueda encontrada:', filterElement);
        const computedStyle = window.getComputedStyle(filterElement);
        console.log('   - Display:', computedStyle.display);
        console.log('   - Float:', computedStyle.float);
        console.log('   - Width:', computedStyle.width);
        console.log('   - Margin:', computedStyle.margin);
        console.log('   - Clases:', filterElement.className);
        console.log('   - HTML:', filterElement.outerHTML.substring(0, 200));
        
        // Verificar el input dentro
        const inputElement = filterElement.querySelector('input');
        if (inputElement) {
            const inputStyle = window.getComputedStyle(inputElement);
            console.log('   - Input encontrado');
            console.log('     * Display:', inputStyle.display);
            console.log('     * Width:', inputStyle.width);
            console.log('     * Padding:', inputStyle.padding);
            console.log('     * Border:', inputStyle.border);
        } else {
            console.warn('   ⚠️ Input no encontrado dentro de la barra de búsqueda');
        }
    } else {
        console.error('❌ Barra de búsqueda NO encontrada');
    }
    
    // 3. Verificar el contenedor padre (ya lo tenemos de arriba)
    const wrapperElement = wrapper || document.querySelector('.dataTables_wrapper');
    if (wrapperElement) {
        console.log('✅ Wrapper de DataTables encontrado:', wrapperElement);
        const wrapperStyle = window.getComputedStyle(wrapperElement);
        console.log('   - Display:', wrapperStyle.display);
        console.log('   - Width:', wrapperStyle.width);
        
        // Verificar la primera fila
        const firstRow = wrapperElement.querySelector('.row:first-child');
        if (firstRow) {
            const rowStyle = window.getComputedStyle(firstRow);
            console.log('   - Primera fila encontrada');
            console.log('     * Display:', rowStyle.display);
            console.log('     * Flex-direction:', rowStyle.flexDirection);
            console.log('     * Justify-content:', rowStyle.justifyContent);
            console.log('     * Align-items:', rowStyle.alignItems);
        }
    }
    
    // 4. Verificar estilos aplicados con :deep()
    console.log('📋 Verificando estilos aplicados...');
    const allLengthElements = document.querySelectorAll('.dt-length, .dataTables_length');
    const allFilterElements = document.querySelectorAll('.dt-search, .dataTables_filter');
    console.log(`   - Elementos .dt-length/.dataTables_length encontrados: ${allLengthElements.length}`);
    console.log(`   - Elementos .dt-search/.dataTables_filter encontrados: ${allFilterElements.length}`);
    
    // Verificar el layout row
    const layoutRow = wrapper?.querySelector('.dt-layout-row');
    if (layoutRow) {
        const rowStyle = window.getComputedStyle(layoutRow);
        console.log('   - Layout row encontrado');
        console.log('     * Display:', rowStyle.display);
        console.log('     * Flex-direction:', rowStyle.flexDirection);
        console.log('     * Justify-content:', rowStyle.justifyContent);
    }
    
    // 5. Verificar si hay estilos inline que puedan estar sobrescribiendo
    if (lengthElement && lengthElement.style.cssText) {
        console.warn('   ⚠️ El limitador tiene estilos inline:', lengthElement.style.cssText);
    }
    if (filterElement && filterElement.style.cssText) {
        console.warn('   ⚠️ La búsqueda tiene estilos inline:', filterElement.style.cssText);
    }
    
    console.groupEnd();
}

// Hacer las funciones disponibles globalmente para los botones en la tabla
onMounted(async () => {
    window.downloadCV = downloadCV;
    window.showCVImage = showCVImage;
    
    // Agregar event listeners para el menú contextual
    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)
    
    console.log('CurriculumsPage mounted')
    const userData = localStorage.getItem('currentUser')
    console.log('User data from localStorage:', userData)
    const user = userData ? JSON.parse(userData) : null
    console.log('Parsed user data:', user.id_user)
    try{
        // Obtener todos los CVs con información del usuario (ya incluye JOIN)
        const cvapi = await fetch(`http://localhost:3000/api/cv`)
        const cvJson = await cvapi.json()
        console.log('CVs obtenidos:', cvJson)
        
        // Mapear todos los CVs directamente (cada CV es una fila)
        const combinedData = cvJson.map(cv => ({
            id_cv: cv.id_cv,
            id_user: cv.id_cv,
            name: cv.name || 'N/A',
            email: cv.email || 'N/A',
            file_path: cv.file_path || 'No CV',
            updated_at: formatTimestamp(cv.uploaded_at)
        }))
        
        data.value = combinedData

    } catch (error) {
        console.error('Error fetching user data:', error)
    }

    // try {
    //      const response = await fetch(`http://localhost:3000/api/cv`)
    //      const jsonData = await response.json()
    //      console.log('data de api x:', jsonData)
    //      //agregar el campo file_path y updated_at a data
    //         data.value = jsonData;

         
    //  } catch (error) {
    //      console.error('Error fetching data:', error)
    //  }
});

onUnmounted(() => {
    delete window.downloadCV;
    delete window.showCVImage;
    
    // Remover event listeners
    document.removeEventListener('click', handleDocumentClick)
    document.removeEventListener('keydown', handleEscape)
});



</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.curriculums-page {
    min-height: calc(100vh - 80px);
    padding: 2rem 0;
    
    .container-xxl {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
    }
    
    .page-header {
        margin-bottom: 2rem;
        
        .page-title {
            font-size: 2rem;
            font-weight: 700;
            color: $dark;
            margin: 0 0 0.5rem 0;
        }
        
        .page-subtitle {
            font-size: 1rem;
            color: $text-muted;
            margin: 0;
        }
    }
    
    .curriculums-content {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid #e9ecef;
        min-height: 400px;
        overflow-x: auto;
        
        // Estilos adicionales para asegurar que se apliquen correctamente
        :deep(.dt-length),
        :deep(.dt-search),
        :deep(.dataTables_length),
        :deep(.dataTables_filter) {
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            box-sizing: border-box !important;
        }
    }
}

// Estilos para la tabla DataTables
:deep(.dataTables_wrapper) {
    // Estilos para el layout row (nueva estructura de DataTables)
    .dt-layout-row {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: center !important;
        margin-bottom: 1.5rem;
        flex-wrap: nowrap !important;
        gap: 1rem;
        
        @media (max-width: 768px) {
            flex-direction: column !important;
            align-items: stretch;
            gap: 1rem;
        }
    }
    
    .dt-layout-cell {
        flex: 0 0 auto !important;
        width: auto !important;
        max-width: none !important;
        display: flex !important;
        align-items: center !important;
        
        &.dt-layout-start {
            // Limitador de resultados a la izquierda
            margin-right: auto !important;
        }
        
        &.dt-layout-end {
            // Barra de búsqueda a la derecha
            margin-left: auto !important;
        }
        
        @media (max-width: 768px) {
            width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }
    }
    
    // Estilos para el limitador de resultados (.dt-length)
    .dt-length,
    .dataTables_length {
        margin-bottom: 0 !important;
        margin-top: 0 !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        float: none !important;
        width: auto !important;
        clear: none !important;
        box-sizing: border-box !important;
        
        label {
            font-weight: 600 !important;
            color: $dark !important;
            margin: 0 !important;
            white-space: nowrap !important;
            font-size: 0.9rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
        }
        
        select,
        .dt-input {
            border: 2px solid #e0e0e0 !important;
            border-radius: 8px !important;
            padding: 0.6rem 1rem !important;
            margin: 0 !important;
            background: white !important;
            color: $dark !important;
            font-size: 0.9rem !important;
            transition: all 0.2s ease !important;
            cursor: pointer !important;
            appearance: none !important;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E") !important;
            background-repeat: no-repeat !important;
            background-position: right 0.75rem center !important;
            padding-right: 2.5rem !important;
            box-sizing: border-box !important;
            
            &:focus {
                outline: none !important;
                border-color: #667eea !important;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            }
            
            &:hover {
                border-color: #d0d0d0 !important;
            }
            
            option {
                background: white !important;
                color: $dark !important;
                padding: 0.5rem !important;
            }
        }
    }
    
    // Estilos para la barra de búsqueda (.dt-search)
    .dt-search,
    .dataTables_filter {
        margin-bottom: 0 !important;
        margin-top: 0 !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        float: none !important;
        width: auto !important;
        clear: none !important;
        box-sizing: border-box !important;
        
        label {
            font-weight: 600 !important;
            color: $dark !important;
            margin: 0 !important;
            white-space: nowrap !important;
            font-size: 0.9rem !important;
        }
        
        input,
        .dt-input {
            border: 2px solid #e0e0e0 !important;
            border-radius: 8px !important;
            padding: 0.6rem 1rem !important;
            margin: 0 !important;
            background: white !important;
            color: $dark !important;
            font-size: 0.9rem !important;
            transition: all 0.2s ease !important;
            min-width: 200px !important;
            box-sizing: border-box !important;
            
            &:focus {
                outline: none !important;
                border-color: #667eea !important;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            }
            
            &:hover {
                border-color: #d0d0d0 !important;
            }
        }
    }
    
    .dataTables_info {
        padding-top: 1rem;
        color: $text-muted;
        font-size: 0.9rem;
        margin: 0 !important;
        width: auto !important;
        flex: 0 0 auto !important;
    }
    
    // Estilos para el contenedor de información y paginación (nueva estructura DataTables)
    // Buscar el .dt-layout-row que contiene .dt-info o .dt-paging
    .dt-layout-row:has(.dt-info),
    .dt-layout-row:has(.dt-paging),
    .dt-layout-row:has(.dataTables_info),
    .dt-layout-row:has(.dataTables_paginate) {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        justify-content: space-between !important;
        align-items: center !important;
        gap: 2rem !important;
        margin-top: 1.5rem !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    
    // Estilos para las celdas del layout de info/paginate
    .dt-layout-cell.dt-layout-start:has(.dt-info),
    .dt-layout-cell.dt-layout-start:has(.dataTables_info) {
        flex: 0 0 auto !important;
        width: auto !important;
        max-width: none !important;
    }
    
    .dt-layout-cell.dt-layout-end:has(.dt-paging),
    .dt-layout-cell.dt-layout-end:has(.dataTables_paginate) {
        flex: 0 0 auto !important;
        width: auto !important;
        max-width: none !important;
        margin-left: auto !important;
    }
    
    // Estilos para .dt-info (nueva clase de DataTables)
    .dt-info,
    .dataTables_info {
        padding-top: 1rem;
        color: $text-muted;
        font-size: 0.9rem;
        margin: 0 !important;
        width: auto !important;
        flex: 0 0 auto !important;
    }
    
    // Estilos para .dt-paging (nueva clase de DataTables)
    .dt-paging {
        padding-top: 1rem !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        margin: 0 !important;
        width: auto !important;
        flex: 0 0 auto !important;
        
        nav {
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
        }
    }
    
    // Estilos para los botones de paginación (nueva estructura DataTables)
    .dt-paging-button {
        padding: 0.65rem 1rem !important;
        margin: 0 !important;
        border: 2px solid #e0e0e0 !important;
        border-radius: 8px !important;
        background: white !important;
        color: $dark !important;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        font-size: 0.9rem !important;
        font-weight: 500 !important;
        min-width: 44px !important;
        height: 44px !important;
        text-align: center !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        font-family: inherit !important;
        line-height: 1.5 !important;
        
        &:hover:not(.disabled):not([aria-disabled="true"]) {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
            border-color: #ff5900 !important;
            color: #ff5900 !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(255, 89, 0, 0.15) !important;
        }
        
        &:active:not(.disabled):not([aria-disabled="true"]) {
            transform: translateY(0) !important;
            box-shadow: 0 2px 6px rgba(255, 89, 0, 0.2) !important;
        }
        
        &.current,
        &[aria-current="page"] {
            background: linear-gradient(135deg, #ff5900 0%, #e64d00 100%) !important;
            color: white !important;
            border-color: #ff5900 !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 12px rgba(255, 89, 0, 0.3) !important;
            transform: scale(1.05) !important;
            
            &:hover {
                background: linear-gradient(135deg, #ff6600 0%, #cc4700 100%) !important;
                transform: scale(1.05) translateY(-2px) !important;
                box-shadow: 0 6px 16px rgba(255, 89, 0, 0.4) !important;
            }
        }
        
        &.disabled,
        &[aria-disabled="true"] {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
            background: #f5f5f5 !important;
            border-color: #e0e0e0 !important;
            color: #adb5bd !important;
            
            &:hover {
                transform: none !important;
                box-shadow: none !important;
                background: #f5f5f5 !important;
                border-color: #e0e0e0 !important;
                color: #adb5bd !important;
            }
        }
        
        // Estilos específicos para botones de navegación (Primero, Anterior, Siguiente, Último)
        &.first,
        &.previous,
        &.next,
        &.last {
            font-weight: 600 !important;
            padding: 0.65rem 1.2rem !important;
        }
    }
    
    .dataTables_paginate {
        padding-top: 1rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem;
        margin: 0 !important;
        width: auto !important;
        flex: 0 0 auto !important;
        margin-left: auto !important;
        
        .paginate_button {
            padding: 0.65rem 1rem;
            margin: 0;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            background: white;
            color: $dark;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 0.9rem;
            font-weight: 500;
            min-width: 44px;
            height: 44px;
            text-align: center;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            
            &:hover:not(.disabled) {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-color: #ff5900;
                color: #ff5900;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 89, 0, 0.15);
            }
            
            &:active:not(.disabled) {
                transform: translateY(0);
                box-shadow: 0 2px 6px rgba(255, 89, 0, 0.2);
            }
            
            &.current {
                background: linear-gradient(135deg, #ff5900 0%, #e64d00 100%);
                color: white;
                border-color: #ff5900;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(255, 89, 0, 0.3);
                transform: scale(1.05);
                
                &:hover {
                    background: linear-gradient(135deg, #ff6600 0%, #cc4700 100%);
                    transform: scale(1.05) translateY(-2px);
                    box-shadow: 0 6px 16px rgba(255, 89, 0, 0.4);
                }
            }
            
            &.disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background: #f5f5f5;
                border-color: #e0e0e0;
                color: #adb5bd;
                
                &:hover {
                    transform: none;
                    box-shadow: none;
                    background: #f5f5f5;
                    border-color: #e0e0e0;
                    color: #adb5bd;
                }
            }
        }
    }
}

/* Fuerza que entries y search estén en la misma línea */
:deep(.dataTables_wrapper .row:first-child) {
  display: flex !important;
  flex-wrap: nowrap !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 1rem !important;
}

:deep(.dataTables_length),
:deep(.dataTables_filter) {
  float: none !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  margin: 0 !important;
}

:deep(.dataTables_length) {
  flex: 0 0 auto !important;
}

:deep(.dataTables_filter) {
  flex: 0 0 auto !important;
  margin-left: auto !important; /* mueve "Search" al extremo derecho */
}

/* 🔄 Responsivo: en pantallas pequeñas que se apilen */
@media (max-width: 768px) {
  :deep(.dataTables_wrapper .row:first-child) {
    flex-direction: column !important;
    align-items: stretch !important;
  }

  :deep(.dataTables_filter) {
    margin-left: 0 !important;
    margin-top: 0.5rem !important;
    width: 100% !important;
    justify-content: flex-start !important;
  }
}

// Estilos para los iconos de ordenamiento de DataTables
// DataTables usa elementos <span class="dt-column-order"> dentro del th

// Estilos base para columnas ordenables
:deep(table.dataTable thead th.dt-orderable-asc),
:deep(table.dataTable thead th.dt-orderable-desc) {
    cursor: pointer !important;
    user-select: none !important;
    
    &:hover {
        background: rgba(255, 255, 255, 0.15) !important;
    }
    
    .dt-column-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
    
    .dt-column-order {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        margin-left: 0.5rem;
        position: relative;
    }
}

// Icono base (sin ordenar) - tres líneas horizontales
:deep(table.dataTable thead th.dt-orderable-asc .dt-column-order),
:deep(table.dataTable thead th.dt-orderable-desc .dt-column-order) {
    &::before {
        content: '\f0dc' !important; // Icono de sort de Font Awesome
        font-family: 'Font Awesome 6 Free' !important;
        font-weight: 900 !important;
        color: rgba(255, 255, 255, 0.6) !important;
        font-size: 0.9rem !important;
        display: block !important;
        line-height: 1 !important;
    }
    
    &:hover::before {
        color: rgba(255, 255, 255, 0.9) !important;
    }
}

// Estado: ordenamiento ascendente - flecha hacia arriba
:deep(table.dataTable thead th.dt-orderable-asc.dt-ordering .dt-column-order) {
    &::before {
        content: '\f0de' !important; // Icono de sort-up de Font Awesome
        font-family: 'Font Awesome 6 Free' !important;
        font-weight: 900 !important;
        color: rgba(255, 255, 255, 1) !important;
        font-size: 0.9rem !important;
        display: block !important;
        line-height: 1 !important;
    }
}

// Estado: ordenamiento descendente - flecha hacia abajo
:deep(table.dataTable thead th.dt-orderable-desc.dt-ordering .dt-column-order) {
    &::before {
        content: '\f0dd' !important; // Icono de sort-down de Font Awesome
        font-family: 'Font Awesome 6 Free' !important;
        font-weight: 900 !important;
        color: rgba(255, 255, 255, 1) !important;
        font-size: 0.9rem !important;
        display: block !important;
        line-height: 1 !important;
    }
}

:deep(table.dataTable) {
    width: 100% !important;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: 1rem;
    
    thead {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        
        th {
            padding: 1rem;
            color: white;
            font-weight: 600;
            text-align: left;
            border: none;
            position: relative;
            
            &:first-child {
                border-top-left-radius: 8px;
            }
            
            &:last-child {
                border-top-right-radius: 8px;
            }
        }
    }
    
    tbody {
        tr {
            transition: background-color 0.2s ease;
            
            &:hover {
                background-color: #f8f9fa;
            }
            
            td {
                padding: 1rem;
                border-bottom: 1px solid #e9ecef;
                vertical-align: middle;
                
                .cv-image-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0.5rem;
                    
                    .cv-preview-image {
                        width: 150px;
                        height: 200px;
                        object-fit: cover;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        border: 2px solid #e9ecef;
                        transition: all 0.2s ease;
                        cursor: pointer;
                        
                        &:hover {
                            transform: scale(1.05);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                            border-color: $primary;
                        }
                    }
                }
                
                .btn-download-cv {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    
                    i {
                        font-size: 0.9rem;
                    }
                    
                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
                    }
                    
                    &:active {
                        transform: translateY(0);
                    }
                }
            }
        }
    }
}

/* Estilos para el menú contextual */
.context-menu {
    min-width: 160px;
    background: #ffffff;
    border-radius: 8px;
    padding: 0.35rem 0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border: 1px solid rgba(0,0,0,0.06);
}

.context-menu .context-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.95rem;
    color: #343a40;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s ease;
}

.context-menu .context-item:hover {
    background: #f8f9fa;
}

.context-menu .context-item.text-danger {
    color: #dc3545;
}

.context-menu .context-item i {
    font-size: 0.9rem;
    width: 16px;
    text-align: center;
}
</style>

