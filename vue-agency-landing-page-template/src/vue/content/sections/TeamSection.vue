<template>
    <!-- Services Section -->
    <PageSection variant="primary"
                 :id="props.id">
        <!-- Title -->
        <PageSectionHeader title="Our *Team*"
                           subtitle="Meet the main characters of our amazing crew!"/>

        <!-- Content -->
        <PageSectionContent>
            <ArticleQuotes>
                <ItemQuote title="Jonathan Moore"
                           image="images/avatars/person-1.png"
                           role="CEO"
                           quote="With <b>over 20 years of experience</b> in international development, I've dedicated my career to creating sustainable solutions for communities in need."
                           :links="[
                              { faIcon: 'fa-brands fa-twitter', href: 'https://twitter.com' },
                              { faIcon: 'fa-brands fa-instagram', href: 'https://instagram.com' },
                              { faIcon: 'fa-brands fa-linkedin', href: 'https://linkedin.com' }
                           ]"/>

                <ItemQuote title="Alicia Cole"
                           image="images/avatars/person-2.png"
                           role="Marketing Analyst"
                           quote="With my expertise in market research and consumer behavior, I help businesses make strategic decisions that <b>drive growth</b> and <b>enhance overall customer satisfaction</b> to the best."
                           :links="[
                              { faIcon: 'fa-brands fa-twitter', href: 'https://twitter.com' },
                              { faIcon: 'fa-brands fa-linkedin', href: 'https://linkedin.com' }
                           ]"/>

                <ItemQuote title="Jiang Xi"
                           image="images/avatars/person-4.png"
                           role="Product Manager"
                           quote="Leading diverse teams with strategic vision, <b>I drive customer-centric solutions</b>, fostering innovation and delivering real value to the market."
                           :links="[
                              { faIcon: 'fa-brands fa-instagram', href: 'https://instagram.com' },
                              { faIcon: 'fa-brands fa-facebook', href: 'https://facebook.com' },
                              { faIcon: 'fa-brands fa-linkedin', href: 'https://linkedin.com' }
                           ]"/>

                <ItemQuote title="Sofia Kondakova"
                           image="images/avatars/person-3.png"
                           role="Lead Developer"
                           quote="With a proven track record of creating complex distributed software systems, I bring a wealth of <b>technical expertise</b> to the table."
                           :links="[
                              { faIcon: 'fa-brands fa-twitter', href: 'https://twitter.com' },
                              { faIcon: 'fa-brands fa-linkedin', href: 'https://linkedin.com' },
                              { faIcon: 'fa-brands fa-github', href: 'https://github.com' }
                           ]"/>

                <ItemQuote title="Travis Jones"
                           image="images/avatars/person-5.png"
                           role="CFO"
                           quote="Guiding financial growth, I ensure stability through <b>meticulous planning and risk management</b>. Empowering the team to seize opportunities, we achieve lasting success."
                           :links="[
                              { faIcon: 'fa-brands fa-instagram', href: 'https://instagram.com' },
                              { faIcon: 'fa-brands fa-linkedin', href: 'https://linkedin.com' }
                           ]"/>

                <ItemQuote title="Aaron Friedrich"
                           image="images/avatars/person-6.png"
                           role="Information Security Officer"
                           quote="<b>Safeguarding valuable data</b> is my mission. As a vigilant CISO, I proactively secure the digital landscape, assuring the trust of customers and partners with cutting-edge measures."
                           :links="[
                              { faIcon: 'fa-brands fa-instagram', href: 'https://instagram.com' },
                              { faIcon: 'fa-brands fa-linkedin', href: 'https://linkedin.com' }
                           ]"/>
            </ArticleQuotes>
        </PageSectionContent>
    </PageSection>
</template>

<script setup>
import PageSection from "/src/vue/components/layout/PageSection.vue"
import PageSectionHeader from "/src/vue/components/layout/PageSectionHeader.vue"
import PageSectionContent from "/src/vue/components/layout/PageSectionContent.vue"
import ArticleQuotes from "/src/vue/components/articles/ArticleQuotes.vue"
import ItemQuote from "/src/vue/components/articles/items/ItemQuote.vue"

const props = defineProps({
    id: String
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>