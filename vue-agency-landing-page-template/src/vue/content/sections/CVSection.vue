<template>
    <PageSection id="cv"
                 :darken="false"
                 :no-padding="false">
        <PageSectionHeader :title="strings.get('cv_title') || 'Crear CV Profesional'"
                           :subtitle="strings.get('cv_subtitle') || 'Completa tu información para crear un CV profesional'"
                           :description="strings.get('cv_description') || 'Llena todos los campos requeridos para generar tu currículum'"
                           :fa-icon="'fa-solid fa-file-alt'"
                           :center="true"/>

        <PageSectionContent>
            <div class="cv-full-width-container">
                <div class="row g-4">
                    <div class="col-12 col-lg-5">
                        <div class="cv-form-wrapper">
                            <CVForm v-model="cvFormData" @submit-success="handleSubmitSuccess"/>
                        </div>
                    </div>
                    <div class="col-12 col-lg-7">
                        <CVPreview ref="cvPreviewRef" :cv-data="cvFormData"/>
                    </div>
                </div>
            </div>
        </PageSectionContent>
    </PageSection>
</template>

<script setup>
import PageSection from "/src/vue/components/layout/PageSection.vue"
import PageSectionHeader from "/src/vue/components/layout/PageSectionHeader.vue"
import PageSectionContent from "/src/vue/components/layout/PageSectionContent.vue"
import CVForm from "/src/vue/components/forms/cv/CVForm.vue"
import CVPreview from "/src/vue/components/forms/cv/CVPreview.vue"
import {useStrings} from "/src/composables/strings.js"
import {ref, nextTick, inject, provide, watch} from "vue"
import Swal from "sweetalert2"

const strings = useStrings()
const cvFormData = ref(null)
const cvPreviewRef = ref(null)
const setSpinnerEnabled = inject("setSpinnerEnabled", null)

// Ref para el template seleccionado - se actualizará desde CVPreview
const selectedTemplate = ref('modern')

// Provide selectedTemplate para que CVFormFields pueda acceder
provide('selectedTemplate', selectedTemplate)

// Función para actualizar el template desde CVPreview
const updateSelectedTemplate = (templateValue) => {
    selectedTemplate.value = templateValue
}

// Watch para sincronizar cuando CVPreview esté disponible
watch(cvPreviewRef, (newRef) => {
    if (newRef && newRef.selectedTemplate) {
        // Sincronizar valor inicial
        selectedTemplate.value = newRef.selectedTemplate.value || 'modern'
        
        // Watch el valor del ref de CVPreview para cambios reactivos
        watch(() => newRef.selectedTemplate.value, (newValue) => {
            selectedTemplate.value = newValue
        }, { immediate: true })
    }
}, { immediate: true })

// Manejar el envío exitoso del formulario
const handleSubmitSuccess = async (submitData) => {
    console.log('CVSection.handleSubmitSuccess - submitData recibido:', submitData)
    
    // Esperar a que Vue actualice el DOM
    await nextTick()
    
    // Esperar un momento adicional para asegurar que el CV se renderice completamente
    setTimeout(async () => {
        if (!cvPreviewRef.value || !cvPreviewRef.value.captureCVAsImage) {
            console.error('cvPreviewRef no está disponible o no tiene captureCVAsImage')
            setSpinnerEnabled && setSpinnerEnabled(false)
            return
        }
        
        try {
            console.log('Capturando imagen del CV...')
            // Capturar la imagen del CV
            const imageBlob = await cvPreviewRef.value.captureCVAsImage()
            
            if (!imageBlob) {
                console.error('No se pudo capturar la imagen del CV')
                setSpinnerEnabled && setSpinnerEnabled(false)
                return
            }

            console.log('Imagen capturada, tamaño:', imageBlob.size, 'bytes')

            // Obtener datos del submit (puede ser userId o un objeto con más info)
            let userId, actionType, cvId;
            
            if (typeof submitData === 'object' && submitData !== null) {
                userId = submitData.userId;
                actionType = submitData.actionType || 'create';
                cvId = submitData.cvId || null;
            } else {
                // Compatibilidad con formato anterior
                userId = submitData;
                actionType = 'create';
                cvId = null;
            }

            console.log('Datos extraídos - userId:', userId, 'actionType:', actionType, 'cvId:', cvId)

            // Si no se pasó userId, obtenerlo del localStorage
            if (!userId) {
                const userData = localStorage.getItem('currentUser')
                if (!userData) {
                    console.error('Usuario no autenticado')
                    setSpinnerEnabled && setSpinnerEnabled(false)
                    return
                }
                const user = JSON.parse(userData)
                userId = user.id_user
            }

            // Crear FormData para enviar la imagen
            const formData = new FormData()
            formData.append('cvImage', imageBlob, `CV_${Date.now()}.png`)
            
            // Determinar URL y método según la acción
            let url, method;
            if (actionType === 'update' && cvId) {
                url = `http://localhost:3000/api/cv/${cvId}`
                method = 'PUT'
                console.log('Actualizando CV - URL:', url, 'Método:', method, 'cvId:', cvId)
            } else {
                formData.append('userId', userId)
                url = 'http://localhost:3000/api/cv'
                method = 'POST'
                console.log('Creando CV - URL:', url, 'Método:', method, 'userId:', userId)
            }

            console.log('Enviando petición al backend...')
            // Enviar la imagen al backend
            const response = await fetch(url, {
                method: method,
                body: formData
            })

            console.log('Respuesta recibida - Status:', response.status, 'OK:', response.ok)
            const data = await response.json()
            console.log('Datos de respuesta:', data)

            // Desactivar spinner
            setSpinnerEnabled && setSpinnerEnabled(false)

            if (response.ok) {
                const successMessage = actionType === 'update' ? 'CV actualizado exitosamente' : 'CV guardado exitosamente'
                console.log(successMessage + ':', data)
                await Swal.fire({
                    icon: 'success',
                    title: successMessage,
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'swal2-popup-custom',
                        title: 'swal2-title-custom',
                        confirmButton: 'swal2-confirm-custom'
                    }
                })
                // También descargar la imagen localmente
                const imageUrl = URL.createObjectURL(imageBlob)
                const link = document.createElement('a')
                link.href = imageUrl
                link.download = `CV_${Date.now()}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                setTimeout(() => URL.revokeObjectURL(imageUrl), 100)
            } else {
                const errorMessage = actionType === 'update' ? 'Error al actualizar el CV' : 'Error al guardar el CV'
                console.error(errorMessage + ':', data.error)
                await Swal.fire({
                    icon: 'error',
                    title: errorMessage,
                    text: data.error || 'Error desconocido',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'swal2-popup-custom',
                        title: 'swal2-title-custom',
                        content: 'swal2-content-custom',
                        confirmButton: 'swal2-confirm-custom'
                    }
                })
            }
        } catch (error) {
            console.error('Error al capturar o enviar el CV como imagen:', error)
            // Desactivar spinner en caso de error
            setSpinnerEnabled && setSpinnerEnabled(false)
            await Swal.fire({
                icon: 'error',
                title: 'Error al procesar el CV',
                text: error.message || 'Error desconocido',
                confirmButtonText: 'Aceptar',
                customClass: {
                    popup: 'swal2-popup-custom',
                    title: 'swal2-title-custom',
                    content: 'swal2-content-custom',
                    confirmButton: 'swal2-confirm-custom'
                }
            })
        }
    }, 500) // Esperar 500ms para que todo se renderice
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

#cv {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, $light-1 0%, $light-2 100%);
    padding: 3rem 0;
    padding-top: 8rem; // Separar del navbar fijo
    
    :deep(.container-xxl) {
        max-width: 100%;
        padding-left: 2rem;
        padding-right: 2rem;
    }
    
    // Asegurar que el header no se oculte detrás del navbar
    :deep(.foxy-section-header) {
        margin-top: 2rem;
    }
}

.cv-full-width-container {
    width: 100%;
    max-width: 100%;
}

.cv-form-wrapper {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    padding-right: 0.5rem;
    
    // Estilo personalizado para el scrollbar
    &::-webkit-scrollbar {
        width: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
        
        &:hover {
            background: #555;
        }
    }
}
</style>

