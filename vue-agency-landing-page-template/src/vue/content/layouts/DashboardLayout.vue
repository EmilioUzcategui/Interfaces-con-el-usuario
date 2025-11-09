<template>
    <div class="dashboard-layout">
        <!-- Dashboard Navigation -->
        <DashboardNavbar/>

        <!-- Main Content -->
        <main class="dashboard-main">
            <slot/>
        </main>

        <!-- Dashboard Footer -->
        <DashboardFooter/>
    </div>
</template>

<script setup>
import DashboardNavbar from "/src/vue/components/nav/dashboard/DashboardNavbar.vue"
import DashboardFooter from "/src/vue/components/footer/dashboard/DashboardFooter.vue"
import { onMounted } from 'vue'
import { unloadTypography } from '/src/utils/loadTypography.js'

// Al montar el layout del dashboard limpiamos cualquier tipografía inyectada
// para que el dashboard no muestre la tipografía activa del sitio sin refrescar.
onMounted(() => {
    try {
        // Si hay estilos/variables inyectadas por la vista de tipografías, removerlos
        unloadTypography()
    } catch (e) {
        console.warn('Error llamando a unloadTypography en DashboardLayout:', e)
    }
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.dashboard-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.dashboard-main {
    flex: 1;
    padding-top: 80px; // Espacio para la navbar fija
    min-height: calc(100vh - 80px);
}
</style>





