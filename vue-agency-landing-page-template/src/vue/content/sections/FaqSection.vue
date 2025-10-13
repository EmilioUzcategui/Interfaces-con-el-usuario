<template>
    <!-- About Section -->
    <PageSection variant="default"
                 :id="props.id">
        <!-- Title -->
        <PageSectionHeader title="Questions and *Answers*"
                           subtitle="Quick answers to your queries!"/>

        <!-- Content -->
        <PageSectionContent>
            <ArticleFaq>
                <ItemFaqQuestion question="Can I expect the template to be responsive?"
                                 answer="Absolutely! The template is designed with responsiveness in mind, ensuring that it adapts to <b>various screen types and sizes</b>, including mobile devices. The use of responsive design techniques like <b>media queries</b> and <b>flexible layout</b> ensures that the template looks and functions well on smartphones, tablets, and other mobile devices. During customization, make sure to preview the template on different screen sizes and devices to ensure it displays correctly. If you encounter any issues, you can adjust the CSS styles or layout accordingly to improve the mobile experience further."/>

                <ItemFaqQuestion question="How do I customize the content of the template?"
                                 answer="To customize the content, edit the <b>Vue</b> files in the content folder. These files hold the template's data, letting you update texts, images, links, and other elements as needed. Just follow the existing structure to avoid formatting issues. If you want to add new sections or make bigger changes, you might need to tweak the Vue components and other related files in the template."/>

                <ItemFaqQuestion question="How can I enable the functionality of the contact form?"
                                 answer="The template now integrates <b>EmailJS</b>, making it easy to send emails directly from your website without needing a backend. It’s designed for seamless integration, allowing you to connect your form to an email service with just a few steps. The setup includes predefined configurations to ensure smooth functionality, but you can customize the settings as needed. During customization, be sure to test the email functionality to confirm everything works correctly. If you run into issues, you can adjust the <b>EmailJS</b> settings or API configuration to improve reliability."/>

                <ItemFaqQuestion question="What steps should I follow to add a new object to the theme?"
                                 answer="To add a new section to the theme, start by creating a <b>Vue component</b> in the <i>sections</i> folder. Use the existing components as a guide to keep the design and functionality consistent. Inside the new component, define the necessary data like <b>texts, links, and other content</b>. Once you've set everything up, your new section should seamlessly integrate into the theme."/>
            </ArticleFaq>
        </PageSectionContent>

        <!-- Footer -->
        <PageSectionFooter title="*Save time* with Foxy!"
                           description="Foxy beautifully and intuitively extends the Vue and Bootstrap frameworks making it easy to build your next project!"
                           :include-divider="true"
                           :description-text-class="`text-3`"
                           button-label="Download Now!"
                           button-fa-icon="fa-solid fa-download"
                           button-url="https://github.com/ryanbalieiro/vue-agency-landing-page-template"/>
    </PageSection>
</template>

<script setup>
import PageSection from "/src/vue/components/layout/PageSection.vue"
import PageSectionHeader from "/src/vue/components/layout/PageSectionHeader.vue"
import PageSectionContent from "/src/vue/components/layout/PageSectionContent.vue"
import PageSectionFooter from "/src/vue/components/layout/PageSectionFooter.vue"
import ArticleFaq from "/src/vue/components/articles/ArticleFaq.vue"
import ItemFaqQuestion from "/src/vue/components/articles/items/ItemFaqQuestion.vue"

const props = defineProps({
    id: String
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>