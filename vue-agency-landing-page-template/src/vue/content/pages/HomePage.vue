<template>
    <PageWrapper id="foxy-home-page"
                 :no-padding="true"
                 :sections="sections"/>
</template>

<script setup>
import PageWrapper from "/src/vue/components/layout/PageWrapper.vue"
import SectionInfo from "/src/models/SectionInfo.js"
import FeaturedProjectSection from "/src/vue/content/sections/FeaturedProjectSection.vue"
import HeroSection from "/src/vue/content/sections/HeroSection.vue"
import ServicesSection from "/src/vue/content/sections/ServicesSection.vue"
import ReviewsSection from "/src/vue/content/sections/ReviewsSection.vue"

const sections = [
    new SectionInfo('hero',         HeroSection,            'Inicio',       'fa-solid fa-house'),
    new SectionInfo('featured',     FeaturedProjectSection, 'Banner',       'fa-solid fa-bullhorn'),
    new SectionInfo('services',     ServicesSection,        'Servicios',    'fa-solid fa-wrench'),
    new SectionInfo('reviews',      ReviewsSection,         'Carrusel',     'fa-solid fa-comments')
]
</script>

<style lang="scss" scoped>
</style>