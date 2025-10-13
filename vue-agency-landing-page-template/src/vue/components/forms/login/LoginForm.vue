<template>
    <form id="foxy-login-form" @submit="_onFormSubmit">
        <LoginFormFields v-if="shouldDisplayFormFields"
                         :error-message="errorMessage"
                         @input="_onInput"/>

        <LoginFormSuccess v-else
                          :user="user"/>
    </form>
</template>

<script setup>
import {computed, inject, ref} from "vue"
import {useRouter} from "vue-router"
import {useStrings} from "/src/composables/strings.js"
import {useLayout} from "/src/composables/layout.js"
import {useUtils} from "/src/composables/utils.js"

import LoginFormFields from "/src/vue/components/forms/login/LoginFormFields.vue"
import LoginFormSuccess from "/src/vue/components/forms/login/LoginFormSuccess.vue"

const router = useRouter()
const layout = useLayout()
const strings = useStrings()
const utils = useUtils()
const setSpinnerEnabled = inject("setSpinnerEnabled")

const email = ref("")
const password = ref("")
const rememberMe = ref(false)
const apiResponse = ref(null)
const validationError = ref(null)

const shouldDisplayFormFields = computed(() => {
    return !apiResponse.value || !apiResponse.value.success
})

const errorMessage = computed(() => {
    if(apiResponse.value && !apiResponse.value.success)
        return strings.get("error_login_failed")

    if(validationError.value)
        return strings.get(validationError.value)
    return null
})

const user = computed(() => {
    return apiResponse.value?.user || null
})

const _onInput = (field, value) => {
    switch (field) {
        case "email": email.value = value; break
        case "password": password.value = value; break
        case "rememberMe": rememberMe.value = value; break
    }
}

const _onFormSubmit = async (e) => {
    e.preventDefault && e.preventDefault()

    _validate()
    if(validationError.value) {
        _resetScroll()
        return
    }

    _submit().then(r => {})
}

const _validate = () => {
    validationError.value = null
    if(!email.value.length || !password.value.length) {
        validationError.value = "error_fill_all_fields"
    }
    if(!utils.isValidEmail(email.value)) {
        validationError.value = "error_invalid_email"
    }
}

const _submit = async () => {
    setSpinnerEnabled && setSpinnerEnabled(true, strings.get('logging_in'))

    // Simular autenticación - aquí integrarías con tu API real
    const success = await _mockLogin(email.value, password.value, rememberMe.value)
    
    _resetScroll()
    setSpinnerEnabled && setSpinnerEnabled(false)
    
    // Redirección automática después del login exitoso
    if (success) {
        // Redirigir inmediatamente sin mostrar mensaje de éxito
        router.push('/dashboard')
    } else {
        // Solo mostrar error si el login falla
        apiResponse.value = {success: false, user: null}
    }
}

const _mockLogin = async (email, password, rememberMe) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simular validación básica
    return email === "admin@example.com" && password === "password123"
}

const _resetScroll = () => {
    const element = document.getElementById('login') || document.getElementById('foxy-login-form')
    layout.scrollIntoView(element)
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

#foxy-login-form {
    width: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    
    @include media-breakpoint-down(md) {
        padding: 1.5rem;
    }
}
</style>
