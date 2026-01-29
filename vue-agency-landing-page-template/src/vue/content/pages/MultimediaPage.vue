<template>
  <DashboardLayout>
    <PageWrapper id="dashboard-multimedia-page" :no-padding="true" :sections="sections" />
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '/src/vue/content/layouts/DashboardLayout.vue'
import PageWrapper from '/src/vue/components/layout/PageWrapper.vue'
import SectionInfo from '/src/models/SectionInfo.js'
import DashboardMultimediaSection from '/src/vue/content/sections/DashboardMultimediaSection.vue'

const sections = [
  new SectionInfo('dashboard-multimedia', DashboardMultimediaSection, 'Multimedia', 'fa-solid fa-photo-film')
]
</script>

<style scoped>
</style>
