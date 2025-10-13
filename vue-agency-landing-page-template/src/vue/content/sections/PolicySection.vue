<template>
    <!-- License Section -->
    <PageSection variant="default"
                 :id="props.id">
        <Breadcrumbs/>

        <PageSectionHeader title="*Privacy* Policy"
                           subtitle="Understanding our practices"/>

        <PageSectionContent>
            <ArticleParagraph title=""
                              faIcon=""
                              :description="[
                                  `This Privacy Policy has been crafted to explain how the information you provide while on Foxy is collected, stored, used, and managed.`,
                                  `When you access Foxy, you are consenting to the collection and use of your personal information as described in this Privacy Policy. Please note that this Policy may be updated periodically, and it's advised for you to check this page frequently for any modifications.`
                              ]"/>

            <ArticleParagraph title="Collected Information"
                              faIcon="pi pi-address-book"
                              :description="[
                                  `The information that you voluntarily provide may be collected and stored when Foxy is accessed. This may include image files saved on your device storage, usage information such as preferences, purchase history, and/or session duration.`,
                                  `Furthermore, if your information is shared online, for example, by participating in leaderboards, any activity performed with other users will be considered public.`,
                                  `Finally, additional information may be collected each time the service is logged into, such as internet protocol addresses, device type, device language, platform type, number of taps, pages viewed, the order in which they were accessed, the time spent on particular pages, and the date and time of this activity. This information is used to better customize the application to your interests and improve the overall app performance.`,
                                  `Assurance is given that any data accessed and collected will not be disclosed, rented, leased, loaned, sold, or voluntarily distributed to unaffiliated third parties. It will solely be utilized for analytical purposes and to enhance your usage experience.`
                              ]"/>

            <ArticleParagraph title="Cookies"
                              faIcon="pi pi-database"
                              :description="[
                                  `A cookie is a small data file that is stored on your device's hard disk. It allows the application to quickly identify your device and retrieve your user information and preferences, such as your username or the list of items you've purchased.`,
                                  `All the information contained in a cookie may be linked to your personal information, and this data can be used to save your preferences, provide recommendations based on your interests, and improve the application's overall usability. If you wish to do so, you can disable cookies at any time.`
                              ]"/>

            <ArticleParagraph title="Security"
                              faIcon="pi pi-lock"
                              :description="[
                                  `The security of your personal information is taken seriously, and reasonable technical and organizational measures have been implemented to protect it from accidental loss, unauthorized access, alteration, or disclosure.`,
                                  `However, it cannot be guaranteed that unauthorized third parties will never be able to breach these measures or use your personal information for improper purposes. It is important to note that email and messaging systems are not considered secure, so it's advised not to share personal information through these mediums.`,
                                  `Rest assured that the security measures are constantly reviewed and updated to ensure the best possible protection for your personal information.`
                              ]"/>

            <ArticleParagraph title="Links"
                              faIcon="pi pi-link"
                              :description="[
                                  `The application may feature links to other websites. Please note that just because the application links to a website, presents a banner ad, or displays other types of advertisements, it does not imply that it endorses or authorizes that third-party service. Nor is it a representation of any sort of affiliation with that third party.`,
                                  `It should be made clear that the privacy policies of other websites that may be accessed from Foxy are not our responsibility. Therefore, it is highly recommended that the privacy policies of such websites or apps be read carefully before exiting the application.`
                              ]"/>
        </PageSectionContent>
    </PageSection>
</template>

<script setup>
import PageSection from "/src/vue/components/layout/PageSection.vue"
import PageSectionHeader from "/src/vue/components/layout/PageSectionHeader.vue"
import PageSectionContent from "/src/vue/components/layout/PageSectionContent.vue"
import ArticleParagraph from "/src/vue/components/articles/ArticleParagraph.vue"
import Breadcrumbs from "/src/vue/components/widgets/Breadcrumbs.vue"

const props = defineProps({
    id: String
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>