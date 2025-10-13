<template>
    <div class="login-form-fields">
        <!-- Error Message -->
        <Alert v-if="errorMessage"
               :type="'danger'"
               :message="errorMessage"
               :dismissible="true"/>

        <!-- Email Field -->
        <div class="mb-3">
            <label for="login-email" class="form-label">
                <i class="fa-solid fa-envelope me-2"></i>
                {{ strings.get('email_label') }}
            </label>
            <input type="email"
                   id="login-email"
                   class="form-control"
                   :class="{'is-invalid': errorMessage}"
                   :placeholder="strings.get('email_placeholder')"
                   v-model="email"
                   @input="_onEmailInput"
                   required>
        </div>

        <!-- Password Field -->
        <div class="mb-3">
            <label for="login-password" class="form-label">
                <i class="fa-solid fa-lock me-2"></i>
                {{ strings.get('password_label') }}
            </label>
            <div class="input-group">
                <input :type="showPassword ? 'text' : 'password'"
                       id="login-password"
                       class="form-control"
                       :class="{'is-invalid': errorMessage}"
                       :placeholder="strings.get('password_placeholder')"
                       v-model="password"
                       @input="_onPasswordInput"
                       required>
                <button class="btn btn-outline-secondary"
                        type="button"
                        @click="togglePasswordVisibility">
                    <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
            </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="form-check">
                <input type="checkbox"
                       class="form-check-input"
                       id="remember-me"
                       v-model="rememberMe"
                       @change="_onRememberMeInput">
                <label class="form-check-label" for="remember-me">
                    {{ strings.get('remember_me') }}
                </label>
            </div>
            <Link :href="'/forgot-password'"
                  :label="strings.get('forgot_password')"
                  :class="'text-decoration-none'"/>
        </div>

        <!-- Submit Button -->
        <div class="d-grid">
            <XLButton :type="'submit'"
                      :label="strings.get('login_button')"
                      :icon="isLoading ? '' : 'fa-solid fa-sign-in-alt'"
                      :class="'w-100'"
                      :disabled="isLoading">
                <Spinner v-if="isLoading" :size="'sm'" class="me-2"/>
            </XLButton>
        </div>

        <!-- Demo Credentials -->
        <div class="mt-4 p-3 bg-light rounded">
            <small class="text-muted">
                <strong>{{ strings.get('demo_credentials') }}:</strong><br>
                Email: admin@example.com<br>
                Password: password123
            </small>
        </div>

        <!-- Register Link -->
        <div class="text-center mt-4">
            <span class="text-muted">{{ strings.get('no_account') }}</span>
            <Link :href="'/register'"
                  :label="strings.get('register_link')"
                  :class="'ms-2 text-decoration-none fw-bold'"/>
        </div>
    </div>
</template>

<script setup>
import {ref, inject} from "vue"
import {useStrings} from "/src/composables/strings.js"

import Alert from "/src/vue/components/widgets/Alert.vue"
import Link from "/src/vue/components/generic/Link.vue"
import XLButton from "/src/vue/components/widgets/XLButton.vue"
import Spinner from "/src/vue/components/widgets/Spinner.vue"

const strings = useStrings()
const setSpinnerEnabled = inject("setSpinnerEnabled")

const props = defineProps({
    errorMessage: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['input'])

const email = ref("")
const password = ref("")
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)

// Watch for spinner state changes
if(setSpinnerEnabled) {
    const spinnerEnabled = inject("spinnerEnabled")
    isLoading.value = spinnerEnabled?.value || false
}

const _onEmailInput = (e) => {
    email.value = e.target.value
    emit('input', 'email', email.value)
}

const _onPasswordInput = (e) => {
    password.value = e.target.value
    emit('input', 'password', password.value)
}

const _onRememberMeInput = (e) => {
    rememberMe.value = e.target.checked
    emit('input', 'rememberMe', rememberMe.value)
}

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.login-form-fields {
    .form-label {
        font-weight: 600;
        color: $dark;
        margin-bottom: 0.5rem;
    }
    
    .form-control {
        border: 2px solid $light-3;
        border-radius: 8px;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        transition: all 0.3s ease;

        &:focus {
            border-color: $primary;
            box-shadow: 0 0 0 0.2rem rgba($primary, 0.25);
        }

        &.is-invalid {
            border-color: $danger;
        }
    }

    .input-group .btn {
        border: 2px solid $light-3;
        border-left: none;
        border-radius: 0 8px 8px 0;
        
        &:hover {
            background-color: $light-2;
        }
    }

    .form-check-input {
        &:checked {
            background-color: $primary;
            border-color: $primary;
        }
    }

    .form-check-label {
        color: $text-muted;
        font-size: 0.9rem;
    }
}
</style>
