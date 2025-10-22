<template>
    <Navbar :brand-logo="logo"
            :brand-label="label"
            brand-url="/"
            :link-list="linkList"
            :expandable="false"/>
</template>

<script setup>
import Navbar from "/src/vue/components/nav/navbar/Navbar.vue"
import {computed, ref, onMounted, onUnmounted, watch, nextTick} from "vue"
import {useRoute, useRouter} from "vue-router"

const route = useRoute()
const router = useRouter()

const props = defineProps({
    logo: String,
    label: String
})

const isLoggedIn = ref(false)

const checkLoginStatus = () => {
    const userData = localStorage.getItem('currentUser')
    isLoggedIn.value = userData !== null
    console.log('Login status updated:', isLoggedIn.value, userData)
}

onMounted(() => {
    checkLoginStatus()
    // Listen for storage changes and custom login events
    window.addEventListener('storage', checkLoginStatus)
    window.addEventListener('userLogin', checkLoginStatus)
    window.addEventListener('userLogout', checkLoginStatus)
})

// Watch para forzar reactividad
watch(isLoggedIn, (newVal) => {
    console.log('isLoggedIn changed to:', newVal)
    nextTick(() => {
        console.log('NextTick executed, forcing update')
    })
})

onUnmounted(() => {
    window.removeEventListener('storage', checkLoginStatus)
    window.removeEventListener('userLogin', checkLoginStatus)
    window.removeEventListener('userLogout', checkLoginStatus)
})

const linkList = computed(() => {
    // Enlaces fijos consistentes con la página principal
    const staticLinks = [
        {
            path: '/',
            label: 'Home',
            faIcon: 'fa-solid fa-home',
            isActive: route.path === '/'
        },
        {
            path: '/#about',
            label: 'About',
            faIcon: 'fa-solid fa-info-circle',
            isActive: false
        },
        {
            path: '/#services',
            label: 'Services',
            faIcon: 'fa-solid fa-cogs',
            isActive: false
        },
        {
            path: '/#portfolio',
            label: 'Portfolio',
            faIcon: 'fa-solid fa-briefcase',
            isActive: false
        },
        {
            path: '/#team',
            label: 'Team',
            faIcon: 'fa-solid fa-users',
            isActive: false
        },
        {
            path: '/#reviews',
            label: 'Reviews',
            faIcon: 'fa-solid fa-star',
            isActive: false
        },
        {
            path: '/#contact',
            label: 'Contact',
            faIcon: 'fa-solid fa-envelope',
            isActive: false
        }
    ]

    // Si está logueado, verificar si es administrador
    if (isLoggedIn.value) {
        const userData = localStorage.getItem('currentUser')
        if (userData) {
            try {
                const user = JSON.parse(userData)
                // Si es administrador (id_user === 1), agregar enlace al dashboard
                if (user.id_user === 1) {
                    return [
                        ...staticLinks,
                        {
                            path: '/dashboard',
                            label: 'Dashboard',
                            faIcon: 'fa-solid fa-tachometer-alt',
                            isActive: route.path === '/dashboard'
                        }
                    ]
                }
            } catch (error) {
                console.error('Error parsing user data:', error)
            }
        }
        return staticLinks
    }
    
    const authLinks = [
        {
            path: '/register',
            label: 'Register',
            faIcon: 'fa-solid fa-user-plus',
            isActive: route.path === '/register'
        },
        {
            path: '/login',
            label: 'Login',
            faIcon: 'fa-solid fa-user',
            isActive: route.path === '/login'
        }
    ]

    return [...staticLinks, ...authLinks]
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>