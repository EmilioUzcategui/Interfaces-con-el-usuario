<template>
    <div class="login-success text-center">
        <div class="success-icon mb-4">
            <i class="fa-solid fa-check-circle text-success" style="font-size: 4rem;"></i>
        </div>
        
        <h3 class="mb-3 text-success">{{ strings.get('login_success_title') }}</h3>
        
        <p class="mb-4 text-muted">
            {{ strings.get('login_success_message', {name: user?.name || 'Usuario'}) }}
        </p>

        <div class="user-info bg-light p-3 rounded mb-4">
            <div class="row">
                <div class="col-6">
                    <strong>{{ strings.get('email_label') }}:</strong><br>
                    <span class="text-muted">{{ user?.email }}</span>
                </div>
                <div class="col-6">
                    <strong>{{ strings.get('login_time') }}:</strong><br>
                    <span class="text-muted">{{ currentTime }}</span>
                </div>
            </div>
        </div>

        <div class="d-grid gap-2">
            <XLButton :variant="'primary'"
                      :size="'lg'"
                      @click="_goToDashboard">
                <i class="fa-solid fa-tachometer-alt me-2"></i>
                {{ strings.get('go_to_dashboard') }}
            </XLButton>
            
            <XLButton :variant="'outline-secondary'"
                      :size="'md'"
                      @click="_logout">
                <i class="fa-solid fa-sign-out-alt me-2"></i>
                {{ strings.get('logout') }}
            </XLButton>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted} from "vue"
import {useStrings} from "/src/composables/strings.js"
import {useRouter} from "vue-router"

import XLButton from "/src/vue/components/widgets/XLButton.vue"

const strings = useStrings()
const router = useRouter()

const props = defineProps({
    user: {
        type: Object,
        default: null
    }
})

const currentTime = ref("")

onMounted(() => {
    const now = new Date()
    currentTime.value = now.toLocaleString()
})

const _goToDashboard = () => {
    // Redirigir al dashboard
    router.push('/dashboard')
}

const _logout = () => {
    // Simular logout - aquí limpiarías el estado de autenticación
    window.location.reload()
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.login-success {
    .success-icon {
        animation: bounceIn 0.6s ease-out;
    }

    .user-info {
        border: 1px solid $light-3;
        text-align: left;
    }
}

@keyframes bounceIn {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }
    50% {
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
