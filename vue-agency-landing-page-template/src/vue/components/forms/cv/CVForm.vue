<template>
    <div id="foxy-cv-form">
        <CVFormFields v-if="shouldDisplayFormFields"
                     :error-message="errorMessage"
                     :success-message="successMessage"
                     @submit="_onFormSubmit"
                     @update:formData="_onFormDataUpdate"/>
    </div>
</template>

<script setup>
import {computed, inject, ref} from "vue"
import {useRouter} from "vue-router"
import {useStrings} from "/src/composables/strings.js"
import {useLayout} from "/src/composables/layout.js"
import {useUtils} from "/src/composables/utils.js"

import CVFormFields from "/src/vue/components/forms/cv/CVFormFields.vue"

const props = defineProps({
    modelValue: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const layout = useLayout()
const strings = useStrings()
const utils = useUtils()
const setSpinnerEnabled = inject("setSpinnerEnabled")

const apiResponse = ref(null)
const validationError = ref(null)
const successMessage = ref(null)
const formData = ref(null)

const shouldDisplayFormFields = computed(() => {
    return !apiResponse.value || !apiResponse.value.success
})

const errorMessage = computed(() => {
    if(apiResponse.value && !apiResponse.value.success)
        return apiResponse.value.error || strings.get("error_saving_cv") || "Error al guardar el CV"

    if(validationError.value)
        return strings.get(validationError.value) || validationError.value
    return null
})

const _onFormSubmit = async (cvData) => {
    // Iniciar spinner y que dure un segundo mínimo
    setSpinnerEnabled && setSpinnerEnabled(true, strings.get('saving_cv') || 'Guardando CV...')
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
        // Obtener usuario actual del localStorage
        const userData = localStorage.getItem('currentUser')
        if (!userData) {
            throw new Error('Usuario no autenticado')
        }

        const user = JSON.parse(userData)
        
        // Agregar el ID del usuario a los datos del CV
        const cvDataWithUser = {
            ...cvData,
            userId: user.id_user
        }

        const response = await fetch('http://localhost:3000/api/cv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cvDataWithUser)
        })

        const data = await response.json()
        
        _resetScroll()
        setSpinnerEnabled && setSpinnerEnabled(false)
        
        if (response.ok) {
            // Mostrar mensaje de éxito
            apiResponse.value = {
                success: true,
                data: data
            }
            successMessage.value = 'CV guardado exitosamente'
            
            // Limpiar mensaje después de 5 segundos y resetear el formulario
            setTimeout(() => {
                successMessage.value = null
                // Resetear el formulario después de mostrar el éxito
                apiResponse.value = null
            }, 5000)
        } else {
            // Mostrar error
            apiResponse.value = {
                success: false, 
                error: data.error || 'Error al guardar el CV'
            }
        }
    } catch (error) {
        console.error('Error al guardar CV:', error)
        setSpinnerEnabled && setSpinnerEnabled(false)
        apiResponse.value = {
            success: false, 
            error: error.message || 'Error de conexión. Intenta de nuevo.'
        }
    }
}

const _onFormDataUpdate = (data) => {
    formData.value = data
    emit('update:modelValue', data)
}

const _resetScroll = () => {
    const element = document.getElementById('cv') || document.getElementById('foxy-cv-form')
    layout.scrollIntoView(element)
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

#foxy-cv-form {
    width: 100%;
}
</style>

