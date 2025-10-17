<template>
    <div class="user-avatar-container" ref="avatarContainer">
        <button class="user-avatar" @click="toggleDropdown">
            <div class="avatar-circle">
                {{ userInitials }}
            </div>
        </button>
        
        <div v-if="showDropdown" class="user-dropdown">
            <div class="dropdown-header">
                <div class="user-info">
                    <div class="user-name">{{ currentUser.name }}</div>
                    <div class="user-email">{{ currentUser.email }}</div>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-actions">
                <button class="dropdown-item logout-btn" @click="handleLogout">
                    <i class="fa-solid fa-sign-out-alt"></i>
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showDropdown = ref(false)
const avatarContainer = ref(null)
const currentUser = ref(null)
const setSpinnerEnabled = inject("setSpinnerEnabled")

const userInitials = computed(() => {
    if (!currentUser.value?.name) return 'U'
    const names = currentUser.value.name.split(' ')
    if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return names[0][0].toUpperCase()
})

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}

const handleLogout = async () => {
    setSpinnerEnabled && setSpinnerEnabled(true, 'Cerrando sesión...')
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSpinnerEnabled && setSpinnerEnabled(false)
    localStorage.removeItem('currentUser')
    currentUser.value = null
    showDropdown.value = false
    // Disparar evento personalizado para actualizar navbar
    window.dispatchEvent(new CustomEvent('userLogout'))
    router.push('/')
}

const closeDropdown = (event) => {
    if (avatarContainer.value && !avatarContainer.value.contains(event.target)) {
        showDropdown.value = false
    }
}

onMounted(() => {
    // Cargar usuario del localStorage
    const userData = localStorage.getItem('currentUser')
    if (userData) {
        currentUser.value = JSON.parse(userData)
    }
    
    // Escuchar clics fuera del dropdown
    document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown)
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.user-avatar-container {
    position: relative;
    display: flex;
    align-items: center;
}

.user-avatar {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: transform 0.2s ease;
    
    &:hover {
        transform: scale(1.05);
    }
}

.avatar-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary 0%, darken($primary, 15%) 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    
    &:hover {
        box-shadow: 0 4px 12px rgba($primary, 0.3);
    }
}

.user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid #e9ecef;
    min-width: 200px;
    z-index: 1000;
    overflow: hidden;
    animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-header {
    padding: 1rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

.user-info {
    .user-name {
        font-weight: 600;
        color: $dark;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
    }
    
    .user-email {
        color: $light-6;
        font-size: 0.8rem;
    }
}

.dropdown-divider {
    height: 1px;
    background: #e9ecef;
}

.dropdown-actions {
    padding: 0.5rem 0;
}

.dropdown-item {
    width: 100%;
    background: none;
    border: none;
    padding: 0.75rem 1rem;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: $dark;
    font-size: 0.9rem;
    
    &:hover {
        background: #f8f9fa;
    }
    
    i {
        color: $light-6;
        width: 16px;
        text-align: center;
    }
}

.logout-btn {
    color: #dc3545;
    
    &:hover {
        background: #fff5f5;
        color: #c82333;
    }
    
    i {
        color: #dc3545;
    }
}

@include media-breakpoint-down(lg) {
    .user-dropdown {
        right: -10px;
        min-width: 180px;
    }
}
</style>
