<template>
    <nav class="dashboard-navbar">
        <div class="navbar-container">
            <!-- Brand/Logo Section -->
            <div class="navbar-brand">
                <Link :url="brandUrl">
                    <div class="brand-content">
                        <div class="brand-icon">
                            <i class="fa-solid fa-tachometer-alt"></i>
                        </div>
                        <span class="brand-text">{{ brandLabel || 'Dashboard Pro' }}</span>
                    </div>
                </Link>
            </div>

            <!-- Navigation Links -->
            <div class="navbar-links" :class="{ 'collapsed': isCollapsed }">
                <ul class="nav-list">
                    <li v-for="link in dashboardLinks" :key="link.id" class="nav-item">
                        <Link 
                            :url="link.url" 
                            :label="link.label"
                            :class="{ 'active': isActiveLink(link.url) }"
                            class="nav-link"
                        >
                            <i :class="link.icon" class="nav-icon"></i>
                            <span class="nav-text">{{ link.label }}</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <!-- User Actions -->
            <div class="navbar-actions">
                <div class="user-menu">
                    <button class="user-button" @click="toggleUserMenu">
                        <div class="user-avatar">
                            <i class="fa-solid fa-user"></i>
                        </div>
                        <span class="user-name">Usuario</span>
                        <i class="fa-solid fa-chevron-down dropdown-icon"></i>
                    </button>
                    
                    <!-- User Dropdown -->
                    <div class="user-dropdown" :class="{ 'show': showUserMenu }">
                        <div class="dropdown-item">
                            <i class="fa-solid fa-user-cog"></i>
                            <span>Perfil</span>
                        </div>
                        <div class="dropdown-item">
                            <i class="fa-solid fa-cog"></i>
                            <span>Configuración</span>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-item logout" @click="handleLogout">
                            <i class="fa-solid fa-sign-out-alt"></i>
                            <span>Cerrar Sesión</span>
                        </div>
                    </div>
                </div>

                <!-- Mobile Toggle Button -->
                <button class="mobile-toggle" @click="toggleMobileMenu">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Link from "/src/vue/components/generic/Link.vue"

const route = useRoute()
const router = useRouter()

const props = defineProps({
    brandLabel: {
        type: String,
        default: 'Dashboard Pro'
    },
    brandUrl: {
        type: String,
        default: '/dashboard'
    }
})

const isCollapsed = ref(true)
const showUserMenu = ref(false)

// Dashboard navigation links
const dashboardLinks = ref([
    {
        id: 'dashboard',
        label: 'Inicio',
        url: '/dashboard',
        icon: 'fa-solid fa-home'
    },
    {
        id: 'stats',
        label: 'Estadísticas',
        url: '#dashboard-stats',
        icon: 'fa-solid fa-chart-line'
    },
    {
        id: 'features',
        label: 'Características',
        url: '#dashboard-features',
        icon: 'fa-solid fa-star'
    },
    {
        id: 'config',
        label: 'Configuración',
        url: '#dashboard-color-config',
        icon: 'fa-solid fa-palette'
    }
])

const isActiveLink = (url) => {
    if (url.startsWith('#')) {
        return false // For anchor links, we don't show active state
    }
    return route.path === url
}

const toggleMobileMenu = () => {
    isCollapsed.value = !isCollapsed.value
}

const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
}

const handleLogout = () => {
    // Handle logout logic here
    router.push('/')
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
    if (!event.target.closest('.user-menu')) {
        showUserMenu.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.dashboard-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transition: all 0.3s ease;
}

.navbar-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    @include media-breakpoint-down(md) {
        padding: 0 1rem;
    }
}

.navbar-brand {
    .brand-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: white;
        font-weight: 700;
        font-size: 1.25rem;
        transition: transform 0.3s ease;
        
        &:hover {
            transform: scale(1.05);
        }
    }
    
    .brand-icon {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }
    
    .brand-text {
        @include media-breakpoint-down(sm) {
            display: none;
        }
    }
}

.navbar-links {
    display: flex;
    align-items: center;
    
    @include media-breakpoint-down(md) {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        
        &.collapsed {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
    }
    
    .nav-list {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 0.5rem;
        
        @include media-breakpoint-down(md) {
            flex-direction: column;
            width: 100%;
            padding: 1rem;
            gap: 0;
        }
    }
    
    .nav-item {
        @include media-breakpoint-down(md) {
            width: 100%;
        }
    }
    
    .nav-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        font-weight: 500;
        
        @include media-breakpoint-down(md) {
            width: 100%;
            padding: 1rem;
            border-radius: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        &:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            transform: translateY(-2px);
        }
        
        &.active {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
    }
    
    .nav-icon {
        font-size: 1rem;
        width: 20px;
        text-align: center;
    }
    
    .nav-text {
        @include media-breakpoint-down(sm) {
            display: none;
        }
    }
}

.navbar-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-menu {
    position: relative;
    
    .user-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 25px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        
        &:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
    }
    
    .user-avatar {
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
    }
    
    .user-name {
        @include media-breakpoint-down(sm) {
            display: none;
        }
    }
    
    .dropdown-icon {
        font-size: 0.8rem;
        transition: transform 0.3s ease;
    }
    
    .user-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        min-width: 200px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 1001;
        
        &.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            color: #333;
            text-decoration: none;
            cursor: pointer;
            transition: background 0.3s ease;
            font-size: 0.9rem;
            
            &:hover {
                background: #f8f9fa;
            }
            
            &.logout {
                color: #dc3545;
                
                &:hover {
                    background: #f8d7da;
                }
            }
            
            i {
                width: 16px;
                text-align: center;
            }
        }
        
        .dropdown-divider {
            height: 1px;
            background: #e9ecef;
            margin: 0.5rem 0;
        }
    }
}

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 5px;
    transition: background 0.3s ease;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    @include media-breakpoint-down(md) {
        display: block;
    }
}
</style>
