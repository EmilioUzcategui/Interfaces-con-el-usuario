<template>
    <PageWrapper id="foxy-cv-page"
                 :no-padding="true"
                 :sections="sections"/>
</template>

<script setup>
import PageWrapper from "/src/vue/components/layout/PageWrapper.vue"
import SectionInfo from "/src/models/SectionInfo.js"
import CVSection from "/src/vue/content/sections/CVSection.vue"

const sections = [
    new SectionInfo('cv', CVSection, null, null)
]
</script>

<style lang="scss" scoped>
</style>

