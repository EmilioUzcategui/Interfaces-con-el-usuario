<template>
    <PageWrapper id="foxy-login-page"
                 :no-padding="true"
                 :sections="sections"/>
</template>

<script setup>
import PageWrapper from "/src/vue/components/layout/PageWrapper.vue"
import SectionInfo from "/src/models/SectionInfo.js"
import LoginSection from "/src/vue/content/sections/LoginSection.vue"

const sections = [
    new SectionInfo('login', LoginSection, null, null)
]
</script>

<style lang="scss" scoped>
</style>
