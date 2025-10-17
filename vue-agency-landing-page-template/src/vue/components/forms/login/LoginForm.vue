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
        return apiResponse.value.error || strings.get("error_login_failed")

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
    // Iniciar spinner y que dure un segundo mínimo
    setSpinnerEnabled && setSpinnerEnabled(true, strings.get('logging_in'))
    await new Promise(resolve => setTimeout(resolve, 1000))
    

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })

        const data = await response.json()
        
        _resetScroll()
        setSpinnerEnabled && setSpinnerEnabled(false)
        
        if (response.ok) {
            // Guardar usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(data.user))
            
            // Forzar actualización inmediata de la navbar
            window.dispatchEvent(new CustomEvent('userLogin'))
            
            // Pequeño delay para asegurar que el evento se procese
            await new Promise(resolve => setTimeout(resolve, 100))
            
            // Redirigir según el ID del usuario
            console.log('Login exitoso:', data)
            if (data.user.id_user === 1) {
                // Es admin, va al dashboard
                router.push('/dashboard')
            } else {
                // Es usuario normal, va al home
                // Marcar para saltar preloader en el siguiente cambio de ruta
                localStorage.setItem('skipPreloaderOnce', '1')
                router.push('/')
            }
        } else {
            // Mostrar error
            apiResponse.value = {
                success: false, 
                user: null,
                error: data.error || 'Error en el login'
            }
        }
    } catch (error) {
        console.error('Error en login:', error)
        setSpinnerEnabled && setSpinnerEnabled(false)
        apiResponse.value = {
            success: false, 
            user: null,
            error: 'Error de conexión. Intenta de nuevo.'
        }
    }
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