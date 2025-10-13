<template>
    <PageWrapper id="foxy-home-page"
                 :no-padding="true"
                 :sections="sections"/>
</template>

<script setup>
import PageWrapper from "/src/vue/components/layout/PageWrapper.vue"
import SectionInfo from "/src/models/SectionInfo.js"
import AboutSection from "/src/vue/content/sections/AboutSection.vue"
import ContactSection from "/src/vue/content/sections/ContactSection.vue"
import FaqSection from "/src/vue/content/sections/FaqSection.vue"
import FeaturedProjectSection from "/src/vue/content/sections/FeaturedProjectSection.vue"
import HeroSection from "/src/vue/content/sections/HeroSection.vue"
import HistorySection from "/src/vue/content/sections/HistorySection.vue"
import PortfolioSection from "/src/vue/content/sections/PortfolioSection.vue"
import ReviewsSection from "/src/vue/content/sections/ReviewsSection.vue"
import ServicesSection from "/src/vue/content/sections/ServicesSection.vue"
import TeamSection from "/src/vue/content/sections/TeamSection.vue"

const sections = [
    new SectionInfo('hero',         HeroSection,            null,           null),
    new SectionInfo('about',        AboutSection,           'About',        'fa-solid fa-file'),
    new SectionInfo('services',     ServicesSection,        'Services',     'fa-solid fa-wrench'),
    new SectionInfo('history',      HistorySection,         'History',      'fa-solid fa-clock'),
    new SectionInfo('featured',     FeaturedProjectSection, 'Zork',         'fa-solid fa-bolt'),
    new SectionInfo('portfolio',    PortfolioSection,       'Portfolio',    'fa-solid fa-camera'),
    new SectionInfo('team',         TeamSection,            'Team',         'fa-solid fa-users'),
    new SectionInfo('faq',          FaqSection,             'Q&A',          'fa-solid fa-question-circle'),
    new SectionInfo('reviews',      ReviewsSection,         'Reviews',      'fa-solid fa-comment'),
    new SectionInfo('contact',      ContactSection,         'Contact',      'fa-solid fa-envelope')
]
</script>

<style lang="scss" scoped>
</style>