<template>
    <DashboardLayout>
        <PageWrapper id="foxy-appearance-config-page"
                     :no-padding="true"
                     :sections="sections"/>
    </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "/src/vue/content/layouts/DashboardLayout.vue"
import PageWrapper from "/src/vue/components/layout/PageWrapper.vue"
import SectionInfo from "/src/models/SectionInfo.js"
import DashboardColorConfigSection from "/src/vue/content/sections/DashboardColorConfigSection.vue"

const sections = [
    new SectionInfo('dashboard-color-config', DashboardColorConfigSection, 'Configuración de Apariencia', 'fa-solid fa-palette')
]
</script>

<style lang="scss" scoped>
</style>

