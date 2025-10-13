<template>
    <!-- About Section -->
    <PageSection variant="promo"
                 :id="props.id">

        <!-- Content -->
        <PageSectionContent>
            <ArticleCustomContent>
                <!-- Banner -->
                <ProjectInfo image="images/portfolio/project-logo-8.png">
                    <ProjectInfoFeaturedContent title="*Zork* App"
                                                description="<b>Zork</b> is your ultimate battery life management app, empowering you to seize control of your device's energy consumption effortlessly. With its intuitive interface, Zork provides real-time monitoring of battery status, enabling you to identify power-draining apps and processes."
                                                :links="[
                                                   {label: `App Store`, href: `https://apple.com`, faIcon:`fa-brands fa-apple`},
                                                   {label: `Google Play`, href: `https://play.google.com`, faIcon:`fa-brands fa-google-play`},
                                                   {label: `Windows Store`, href: `https://windows.com`, faIcon:`fa-brands fa-windows`},
                                                ]"/>
                </ProjectInfo>
            </ArticleCustomContent>
        </PageSectionContent>
    </PageSection>
</template>

<script setup>
import PageSection from "/src/vue/components/layout/PageSection.vue"
import PageSectionContent from "/src/vue/components/layout/PageSectionContent.vue"
import ArticleCustomContent from "/src/vue/components/articles/ArticleCustomContent.vue"
import ProjectInfo from "/src/vue/components/projects/ProjectInfo.vue"
import ProjectInfoFeaturedContent from "/src/vue/components/projects/ProjectInfoFeaturedContent.vue"

const props = defineProps({
    id: String
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>