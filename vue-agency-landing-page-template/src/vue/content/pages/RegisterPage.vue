<template>
    <PageWrapper id="foxy-register-page"
                 :no-padding="true"
                 :sections="sections"/>
</template>

<script setup>
import PageWrapper from "/src/vue/components/layout/PageWrapper.vue"
import SectionInfo from "/src/models/SectionInfo.js"
import RegisterSection from "/src/vue/content/sections/RegisterSection.vue"

const sections = [
    new SectionInfo('register', RegisterSection, null, null)
]
</script>

<style lang="scss" scoped>
</style>