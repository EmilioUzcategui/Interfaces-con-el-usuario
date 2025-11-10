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
                        <CVForm v-model="cvFormData" @submit-success="handleSubmitSuccess"/>
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
import {ref, nextTick, inject} from "vue"

const strings = useStrings()
const cvFormData = ref(null)
const cvPreviewRef = ref(null)
const setSpinnerEnabled = inject("setSpinnerEnabled", null)

// Manejar el envío exitoso del formulario
const handleSubmitSuccess = async (userId) => {
    // Esperar a que Vue actualice el DOM
    await nextTick()
    
    // Esperar un momento adicional para asegurar que el CV se renderice completamente
    setTimeout(async () => {
        if (cvPreviewRef.value && cvPreviewRef.value.captureCVAsImage) {
            try {
                // Capturar la imagen del CV
                const imageBlob = await cvPreviewRef.value.captureCVAsImage()
                
                if (!imageBlob) {
                    console.error('No se pudo capturar la imagen del CV')
                    return
                }

                // Obtener el userId del localStorage si no se pasó como parámetro
                const userData = localStorage.getItem('currentUser')
                if (!userData) {
                    console.error('Usuario no autenticado')
                    return
                }

                const user = JSON.parse(userData)
                const finalUserId = userId || user.id_user

                // Crear FormData para enviar la imagen
                const formData = new FormData()
                formData.append('cvImage', imageBlob, `CV_${Date.now()}.png`)
                formData.append('userId', finalUserId)

                // Enviar la imagen al backend
                const response = await fetch('http://localhost:3000/api/cv', {
                    method: 'POST',
                    body: formData
                })

                const data = await response.json()

                // Desactivar spinner
                setSpinnerEnabled && setSpinnerEnabled(false)

                if (response.ok) {
                    console.log('CV guardado exitosamente:', data)
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
                    console.error('Error al guardar CV:', data.error)
                    alert('Error al guardar el CV: ' + (data.error || 'Error desconocido'))
                }
            } catch (error) {
                console.error('Error al capturar o enviar el CV como imagen:', error)
                // Desactivar spinner en caso de error
                setSpinnerEnabled && setSpinnerEnabled(false)
                alert('Error al guardar el CV: ' + (error.message || 'Error desconocido'))
            }
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
</style>

