import "./scss/style.scss"
import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "/src/vue/stack/App.vue"
import HomePage from "/src/vue/content/pages/HomePage.vue"
import LoginPage from "/src/vue/content/pages/LoginPage.vue"
import RegisterPage from "/src/vue/content/pages/RegisterPage.vue"
import DashboardPage from "/src/vue/content/pages/DashboardPage.vue"
import LicensePage from "/src/vue/content/pages/LicensePage.vue"
import PolicyPage from "/src/vue/content/pages/PolicyPage.vue"
import { loadTypography } from './utils/loadTypography.js'

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
            path: "/:pathMatch(.*)*",
            redirect: "/"
        }
    ]
})
await loadTypography() // Carga fuentes antes de renderizar la app
createApp(App).use(router).mount("#app")