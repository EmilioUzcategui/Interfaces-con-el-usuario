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
                <button class="dropdown-item daltonic-toggle" @click="toggleDaltonicMode" :class="{ active: isDaltonicMode }">
                    <i class="fa-solid fa-eye"></i>
                    <span>{{ isDaltonicMode ? 'Modo Normal' : 'Modo Daltónico' }}</span>
                </button>
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
import * as themeManager from '/src/utils/themeManager.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const showDropdown = ref(false)
const avatarContainer = ref(null)
const currentUser = ref(null)
const isDaltonicMode = ref(false)
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
    
    // Limpiar estilos específicos del usuario
    if (currentUser.value) {
        const userClass = `user-${currentUser.value.id_user}-palette`
        document.body.classList.remove(userClass)
        
        // Remover estilos CSS específicos del usuario
        const userStyle = document.getElementById(`user-${currentUser.value.id_user}-style`)
        if (userStyle) {
            userStyle.remove()
        }
    }
    
    localStorage.removeItem('currentUser')
    currentUser.value = null
    isDaltonicMode.value = false
    showDropdown.value = false
    
    // Disparar evento personalizado para actualizar navbar
    window.dispatchEvent(new CustomEvent('userLogout'))
    router.push('/')
}

const toggleDaltonicMode = async () => {
    try {
        setSpinnerEnabled && setSpinnerEnabled(true, isDaltonicMode.value ? 'Aplicando modo normal...' : 'Aplicando modo daltónico...')
        
        // Alternar el estado
        isDaltonicMode.value = !isDaltonicMode.value
        
        // Guardar el estado específico del usuario en localStorage
        const userKey = `daltonicMode_${currentUser.value.id_user}`
        localStorage.setItem(userKey, isDaltonicMode.value.toString())
        
        // Obtener la paleta correspondiente del backend
        const paletteName = isDaltonicMode.value ? 'daltonicos' : 'original'
        const response = await fetch(`http://localhost:3000/api/colors/by-name/${paletteName}`)
        
        if (response.ok) {
            const palette = await response.json()
            
            // Convertir la paleta del backend al formato esperado por themeManager
            const formattedPalette = {
                colors: [
                    { label: 'Primary', value: palette.color1 },
                    { label: 'Secondary', value: palette.color2 },
                    { label: 'Accent', value: palette.color3 },
                    { label: 'Success', value: palette.color4 },
                    { label: 'Background', value: palette.color5 }
                ]
            }
            
            // Aplicar la paleta globalmente (como lo hace el dashboard)
            try {
                themeManager.applyPalette(formattedPalette)
            } catch (e) {
                console.warn('themeManager.applyPalette falló desde UserAvatar:', e)
            }

            // También aplicar ajustes/overrides específicos por usuario si es necesario
            await applyUserSpecificPalette(formattedPalette, currentUser.value.id_user)
            
            console.log(`Modo daltónico ${isDaltonicMode.value ? 'activado' : 'desactivado'} para usuario ${currentUser.value.id_user}`)
        } else {
            console.error('Error al obtener la paleta:', response.statusText)
        }
        
        await new Promise(resolve => setTimeout(resolve, 500))
        setSpinnerEnabled && setSpinnerEnabled(false)
        
    } catch (error) {
        console.error('Error al cambiar modo daltónico:', error)
        setSpinnerEnabled && setSpinnerEnabled(false)
    }
}

// Función para aplicar paleta específica por usuario
const applyUserSpecificPalette = async (palette, userId) => {
    // Crear un ID único para este usuario
    const userClass = `user-${userId}-palette`
    
    // Remover estilos anteriores del usuario
    const existingStyle = document.getElementById(`user-${userId}-style`)
    if (existingStyle) {
        existingStyle.remove()
    }
    
    // Crear estilos específicos para este usuario
    const style = document.createElement('style')
    style.id = `user-${userId}-style`
    
    // Aplicar la paleta globalmente usando el themeManager para forzar
    // la asignación de variables en :root y disparar las actualizaciones dom.
    try {
        if (palette && (palette.colors || Array.isArray(palette))) {
            // themeManager acepta { colors: [...] } o array
            themeManager.applyPalette(palette)
        }
    } catch (e) {
        console.warn('Error aplicando paleta globalmente desde applyUserSpecificPalette:', e)
    }

    // Construir overrides específicos para el usuario (no sobreescribimos :root aquí)
    const cssVars = ["--primary-color", "--secondary-color", "--accent-color", "--success-color", "--background-color"]
    let cssContent = ''

    // Solo crear reglas puntuales de componentes que necesiten !important
    cssContent += `
        .user-${userId}-palette .foxy-dynamic-button {
            background-color: ${palette.colors[1]?.value || '#ff5900'} !important;
            border-color: ${palette.colors[1]?.value || '#ff5900'} !important;
        }
        .user-${userId}-palette .text-primary {
            color: ${palette.colors[1]?.value || '#ff5900'} !important;
        }
    `

    style.textContent = cssContent
    document.head.appendChild(style)

    // Agregar clase al body para activar los estilos del usuario
    document.body.classList.add(userClass)

    console.log(`Paleta aplicada para usuario ${userId}`)
}

const closeDropdown = (event) => {
    if (avatarContainer.value && !avatarContainer.value.contains(event.target)) {
        showDropdown.value = false
    }
}

// Función para limpiar estilos de otros usuarios
const clearOtherUserStyles = (currentUserId) => {
    // Remover todas las clases de usuario del body
    const bodyClasses = Array.from(document.body.classList)
    bodyClasses.forEach(className => {
        if (className.startsWith('user-') && !className.includes(`user-${currentUserId}-palette`)) {
            document.body.classList.remove(className)
        }
    })
    
    // Remover todos los estilos de usuario excepto el actual
    const userStyles = document.querySelectorAll('style[id^="user-"]')
    userStyles.forEach(style => {
        if (!style.id.includes(`user-${currentUserId}-style`)) {
            style.remove()
        }
    })
}

onMounted(async () => {
    // Cargar usuario del localStorage
    const userData = localStorage.getItem('currentUser')
    if (userData) {
        currentUser.value = JSON.parse(userData)
        
        // Limpiar estilos de otros usuarios
        clearOtherUserStyles(currentUser.value.id_user)
        
        // Cargar estado del modo daltónico específico del usuario
        const userKey = `daltonicMode_${currentUser.value.id_user}`
        const daltonicMode = localStorage.getItem(userKey)
        isDaltonicMode.value = daltonicMode === 'true'
        
        // Si el usuario tiene modo daltónico activado, aplicarlo
        if (isDaltonicMode.value) {
            try {
                const response = await fetch(`http://localhost:3000/api/colors/by-name/daltonicos`)
                if (response.ok) {
                    const palette = await response.json()
                    const formattedPalette = {
                        colors: [
                            { label: 'Primary', value: palette.color1 },
                            { label: 'Secondary', value: palette.color2 },
                            { label: 'Accent', value: palette.color3 },
                            { label: 'Success', value: palette.color4 },
                            { label: 'Background', value: palette.color5 }
                        ]
                    }
                    await applyUserSpecificPalette(formattedPalette, currentUser.value.id_user)
                }
            } catch (error) {
                console.error('Error cargando paleta daltónica:', error)
            }
        }
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
    background: linear-gradient(135deg, var(--secondary-color, $primary) 0%, var(--primary-color, darken($primary, 15%)) 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    
    &:hover {
        box-shadow: 0 4px 12px rgba(var(--secondary-color, $primary), 0.3);
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

.daltonic-toggle {
    color: #6c757d;
    
    &:hover {
        background: #f8f9fa;
        color: #495057;
    }
    
    &.active {
        background: #e3f2fd;
        color: #1976d2;
        
        i {
            color: #1976d2;
        }
    }
    
    i {
        color: #6c757d;
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
