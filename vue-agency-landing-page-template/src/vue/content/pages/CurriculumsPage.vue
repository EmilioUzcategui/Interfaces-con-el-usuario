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

// Configuración de DataTables en español
const datatableOptions = {
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
    }
}

const columns = [
    { title: 'ID Usuario', data: 'id_user', className: 'text-center' },
    { title: 'Nombre Usuario', data: 'name' },
    { title: 'Correo Usuario', data: 'email' },
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
    { title: 'Fecha de Subida', data: 'updated_at', className: 'text-center' },
    {
        title: 'Acciones',
        data: 'file_path',
        className: 'text-center',
        orderable: false,
        render: function(data, type, row) {
            if (data && data !== 'No CV') {
                const imageUrl = `http://localhost:3000/${reemplazarPrimerSlash(data)}`;
                const fileName = data.split('/').pop() || 'CV.png';
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

// Hacer las funciones disponibles globalmente para los botones en la tabla
onMounted(async () => {
    window.downloadCV = downloadCV;
    window.showCVImage = showCVImage;
    
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
        
        // Estilo global para forzar que length y filter estén en la misma fila
        :deep(.dataTables_length),
        :deep(.dataTables_filter) {
            display: inline-flex !important;
            vertical-align: middle !important;
        }
        
        // Forzar que el contenedor row use flexbox horizontal
        :deep(.dataTables_wrapper > .row:first-child) {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            justify-content: space-between !important;
            align-items: center !important;
            
            > div {
                flex: 0 0 auto !important;
                width: auto !important;
                max-width: none !important;
            }
        }
    }
}

// Estilos para la tabla DataTables
:deep(.dataTables_wrapper) {
    // Forzar que length y filter estén en la misma fila
    > .row:first-child {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: center !important;
        margin-bottom: 1.5rem;
        flex-wrap: nowrap !important;
        gap: 1rem;
        
        // Anular todos los estilos de Bootstrap grid en los divs hijos
        > div[class*="col-"],
        > div {
            flex: 0 0 auto !important;
            width: auto !important;
            max-width: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin: 0 !important;
            float: none !important;
            position: static !important;
            display: inline-block !important;
        }
        
        // Específicamente para las columnas de Bootstrap
        > .col-sm-12,
        > .col-md-6,
        > .col-lg-6,
        > [class*="col-"] {
            flex: 0 0 auto !important;
            width: auto !important;
            max-width: none !important;
            display: inline-block !important;
        }
        
        @media (max-width: 768px) {
            flex-direction: column !important;
            align-items: stretch;
            
            > div {
                width: 100% !important;
                display: block !important;
            }
        }
    }
    
    .dataTables_length,
    .dataTables_filter {
        margin-bottom: 0 !important;
        margin-top: 0 !important;
        display: flex !important;
        align-items: center;
        gap: 0.5rem;
        float: none !important;
        width: auto !important;
        clear: none !important;
        
        label {
            font-weight: 600;
            color: $dark;
            margin: 0;
            white-space: nowrap;
            font-size: 0.9rem;
        }
        
        input,
        select {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 0.6rem 1rem;
            margin: 0;
            background: white;
            color: $dark;
            font-size: 0.9rem;
            transition: all 0.2s ease;
            
            &:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            &:hover {
                border-color: #d0d0d0;
            }
        }
        
        select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            padding-right: 2.5rem;
            
            option {
                background: white;
                color: $dark;
                padding: 0.5rem;
            }
        }
    }
    
    .dataTables_length {
        float: none !important;
        text-align: left !important;
    }
    
    .dataTables_filter {
        float: none !important;
        text-align: right !important;
        
        input {
            min-width: 200px;
        }
    }
    
    .dataTables_info {
        padding-top: 1rem;
        color: $text-muted;
        font-size: 0.9rem;
    }
    
    .dataTables_paginate {
        padding-top: 1rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.25rem;
        
        .paginate_button {
            padding: 0.6rem 0.9rem;
            margin: 0;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            background: white;
            color: $dark;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
            font-weight: 500;
            min-width: 40px;
            text-align: center;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            
            &:hover:not(.disabled) {
                background: #f5f5f5;
                border-color: #667eea;
                color: #667eea;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            &.current {
                background: #667eea;
                color: white;
                border-color: #667eea;
                font-weight: 600;
                box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
            }
            
            &.disabled {
                opacity: 0.4;
                cursor: not-allowed;
                background: #f5f5f5;
                border-color: #e0e0e0;
                
                &:hover {
                    transform: none;
                    box-shadow: none;
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
            
            &.sorting {
                cursor: pointer;
                user-select: none;
                
                &:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                &::after {
                    content: '\f0dc';
                    font-family: 'Font Awesome 6 Free';
                    font-weight: 900;
                    float: right;
                    opacity: 0.5;
                }
                
                &.sorting_asc::after {
                    content: '\f0de';
                    opacity: 1;
                }
                
                &.sorting_desc::after {
                    content: '\f0dd';
                    opacity: 1;
                }
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
</style>

