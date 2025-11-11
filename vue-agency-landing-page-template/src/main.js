import "./scss/style.scss"
import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "/src/vue/stack/App.vue"
import HomePage from "/src/vue/content/pages/HomePage.vue"
import LoginPage from "/src/vue/content/pages/LoginPage.vue"
import RegisterPage from "/src/vue/content/pages/RegisterPage.vue"
import DashboardPage from "/src/vue/content/pages/DashboardPage.vue"
import AppearanceConfigPage from "/src/vue/content/pages/AppearanceConfigPage.vue"
import CurriculumsPage from "/src/vue/content/pages/CurriculumsPage.vue"
import LicensePage from "/src/vue/content/pages/LicensePage.vue"
import PolicyPage from "/src/vue/content/pages/PolicyPage.vue"
import CVPage from "/src/vue/content/pages/CVPage.vue"
import { loadTypography } from './utils/loadTypography.js'
import "./assets/styles/dynamic-colors.css"
import { loadPalette, loadPaletteWhenReady, debugPaletteState } from './utils/themeManager.js' // 👈 Importa las funciones

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomePage,
            props: {
                label: "Home",
                faIcon: "fa-solid fa-home",
                inPageNavbar: true,
                shouldAlwaysPreload: true,
                breadcrumbs: []
            }
        },

        {
            path: "/login",
            name: "login",
            component: LoginPage,
            props: {
                label: "Login",
                faIcon: "fa-solid fa-user",
                inPageNavbar: false,
                shouldAlwaysPreload: false,
                breadcrumbs: []
            }
        },

        {
            path: "/register",
            name: "register",
            component: RegisterPage,
            props: {
                label: "Register",
                faIcon: "fa-solid fa-user-plus",
                inPageNavbar: false,
                shouldAlwaysPreload: false,
                breadcrumbs: []
            }
        },

        {
            path: "/dashboard",
            name: "dashboard",
            component: DashboardPage,
            props: {
                label: "Dashboard",
                faIcon: "fa-solid fa-tachometer-alt",
                inPageNavbar: false,
                shouldAlwaysPreload: false,
                breadcrumbs: []
            }
        },

        {
            path: "/dashboard/appearance",
            name: "appearance-config",
            component: AppearanceConfigPage,
            props: {
                label: "Configuración de Apariencia",
                faIcon: "fa-solid fa-palette",
                inPageNavbar: false,
                shouldAlwaysPreload: false,
                breadcrumbs: [
                    "/dashboard"
                ]
            }
        },

        {
            path: "/dashboard/curriculums",
            name: "curriculums",
            component: CurriculumsPage,
            props: {
                label: "Curriculums",
                faIcon: "fa-solid fa-file-alt",
                inPageNavbar: false,
                shouldAlwaysPreload: false,
                breadcrumbs: [
                    "/dashboard"
                ]
            }
        },

        {
            path: "/privacy-policy",
            name: "policy",
            component: PolicyPage,
            props: {
                label: "Privacy Policy",
                faIcon: "fa-solid fa-hammer",
                inPageNavbar: false,
                shouldAlwaysPreload: false,
                breadcrumbs: [
                    "/"
                ]
            }
        },

        {
            path: "/license",
            name: "license",
            component: LicensePage,
            props: {
                label: "License",
                faIcon: "fa-solid fa-copy",
                inPageNavbar: false,
                shouldAlwaysPreload: false,
                breadcrumbs: [
                    "/"
                ]
            }
        },

        {
            path: "/cv",
            name: "cv",
            component: CVPage,
            props: {
                label: "Crear CV",
                faIcon: "fa-solid fa-file-alt",
                inPageNavbar: false,
                shouldAlwaysPreload: false,
                breadcrumbs: [
                    "/"
                ]
            }
        },

        {
            path: "/:pathMatch(.*)*",
            redirect: "/"
        }
    ]
})

router.afterEach(async (to, from) => {
    if (!to.path.includes('/dashboard')) {
        if (!document.getElementById('injected-typography')) {
            try {
                await loadTypography()
            } catch (e) {
                console.warn('Error cargando tipografía tras navegación:', e)
            }
        }
    }
})
await loadTypography() // Carga fuentes antes de renderizar la app

// 🔥 Crea y monta la app
const app = createApp(App).use(router)
app.mount("#app")

// 🔥 Aplica la paleta guardada después de que la app esté montada
// Múltiples estrategias para asegurar que se cargue
loadPaletteWhenReady()

setTimeout(() => {
    console.log("🔄 Intentando cargar paleta (intento 1)...")
    loadPalette()
}, 50)

setTimeout(() => {
    console.log("🔄 Intentando cargar paleta (intento 2)...")
    loadPalette()
}, 200)

setTimeout(() => {
    console.log("🔄 Intentando cargar paleta (intento 3)...")
    loadPalette()
}, 500)

// Debug final después de todos los intentos
setTimeout(() => {
    console.log("🔍 Debug final del estado de la paleta:")
    debugPaletteState()
}, 1000)