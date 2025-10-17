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




