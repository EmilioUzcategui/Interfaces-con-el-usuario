<template>
    <DashboardLayout>
        <PageWrapper id="foxy-dashboard-page"
                     :no-padding="true"
                     :sections="sections"/>
    </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "/src/vue/content/layouts/DashboardLayout.vue"
import PageWrapper from "/src/vue/components/layout/PageWrapper.vue"
import SectionInfo from "/src/models/SectionInfo.js"
import DashboardHeroSection from "/src/vue/content/sections/DashboardHeroSection.vue"
import DashboardStatsSection from "/src/vue/content/sections/DashboardStatsSection.vue"
import DashboardFeaturesSection from "/src/vue/content/sections/DashboardFeaturesSection.vue"
import DashboardColorConfigSection from "/src/vue/content/sections/DashboardColorConfigSection.vue"

const sections = [
    new SectionInfo('dashboard-hero', DashboardHeroSection, null, null),
    new SectionInfo('dashboard-stats', DashboardStatsSection, 'Estadísticas', 'fa-solid fa-chart-bar'),
    new SectionInfo('dashboard-features', DashboardFeaturesSection, 'Características', 'fa-solid fa-star'),
    new SectionInfo('dashboard-color-config', DashboardColorConfigSection, 'Configuración', 'fa-solid fa-palette')
]
</script>

<style lang="scss" scoped>
</style>
