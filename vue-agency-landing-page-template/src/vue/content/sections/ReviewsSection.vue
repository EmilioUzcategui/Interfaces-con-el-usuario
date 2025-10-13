<template>
    <!-- Services Section -->
    <PageSection variant="primary"
                 :id="props.id">
        <!-- Title -->
        <PageSectionHeader title="Client *Reviews*"
                           subtitle="What people say about us!"/>

        <!-- Content -->
        <PageSectionContent>
            <ArticleTestimonials>
                <ItemTestimonial title="Spotify"
                                 image="images/clients/client-spotify.svg"
                                 quote="I am absolutely <b>blown away</b> by the Vue3 website template! The minimalist design is simply stunning, and it's <b>incredibly easy</b> to customize to fit my needs. Plus, it loads super fast, which is crucial for my business. I highly recommend this template to you!"
                                 author="John Lee"
                                 role="Engineer"/>

                <ItemTestimonial title="Voloco"
                                 image="images/clients/client-voloco.svg"
                                 quote="I can't say enough good things about this website template. As someone <b>with no coding experience</b>, I was able to create a professional-looking website in no time."
                                 author="Any Heather"
                                 role="HR Lead"/>

                <ItemTestimonial title="Facebook"
                                 image="images/clients/client-facebook.svg"
                                 quote="<b>The Vue3 theme surpassed expectations</b> with its stunning design, seamless integration, and excellent performance. Highly recommended for a transformative website experience."
                                 author="Mark Zuckie"
                                 role="CEO"/>

                <ItemTestimonial title="Microsoft"
                                 image="images/clients/client-microsoft.svg"
                                 quote="This is hands down <b>the best website template</b> I've ever used. The lightweight codebase makes for a lightning-fast site, and the fully flexible nature allowed me to create a unique and engaging experience for my users."
                                 author="Bill Gates"
                                 role="CEO"/>

                <ItemTestimonial title="Nasa"
                                 image="images/clients/client-nasa.svg"
                                 quote="I am absolutely thrilled to express my admiration for this top-notch template with its <b>simple and intuitive design</b>! Words alone cannot do justice to the delight it has brought into my life."
                                 author="John Suarez"
                                 role="Tech Analyst"/>
            </ArticleTestimonials>
        </PageSectionContent>
    </PageSection>
</template>

<script setup>
import PageSection from "/src/vue/components/layout/PageSection.vue"
import PageSectionHeader from "/src/vue/components/layout/PageSectionHeader.vue"
import PageSectionContent from "/src/vue/components/layout/PageSectionContent.vue"
import ArticleTestimonials from "/src/vue/components/articles/ArticleTestimonials.vue"
import ItemTestimonial from "/src/vue/components/articles/items/ItemTestimonial.vue"

const props = defineProps({
    id: String
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>