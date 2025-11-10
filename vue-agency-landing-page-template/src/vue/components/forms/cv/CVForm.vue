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

const emit = defineEmits(['update:modelValue', 'submit-success'])

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
    // Iniciar spinner
    setSpinnerEnabled && setSpinnerEnabled(true, strings.get('saving_cv') || 'Guardando CV...')
    
    try {
        // Obtener usuario actual del localStorage
        const userData = localStorage.getItem('currentUser')
        if (!userData) {
            throw new Error('Usuario no autenticado')
        }

        const user = JSON.parse(userData)
        
        // Emitir evento de éxito para que se pueda capturar y enviar la imagen
        // El envío real al backend se hace desde CVSection después de capturar la imagen
        emit('submit-success', user.id_user)
        
        _resetScroll()
        
        // El spinner se desactivará cuando se complete el envío de la imagen en CVSection
    } catch (error) {
        console.error('Error al procesar formulario:', error)
        setSpinnerEnabled && setSpinnerEnabled(false)
        apiResponse.value = {
            success: false, 
            error: error.message || 'Error al procesar el formulario.'
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

