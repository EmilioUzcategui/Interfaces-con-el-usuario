<template>
    <!-- License Section -->
    <PageSection variant="default"
                 :id="props.id">
        <Breadcrumbs/>

        <PageSectionHeader title="Usage *License*"
                           subtitle="Terms and Attributions"/>

        <PageSectionContent>
            <ArticleParagraph title=""
                              fa-icon=""
                              :description="[
                                  `Foxy is an open source Vue template that is licensed under the<a href='https://opensource.org/licenses/MIT'> MIT license</a>. This allows you to do pretty much anything you want as long as you include the copyright in “all copies or substantial portions of the Software.” Attribution is not required (though very much appreciated).`
                              ]"/>

            <ArticleParagraph title="Usage"
                              fa-icon="pi pi-briefcase"
                              :description="[
                                  `You are granted a range of opportunities to leverage Foxy to its fullest potential. Firstly, the framework extends its utility to both commercial and personal/private projects, offering flexibility for various contexts. Whether you're developing a business application or working on a personal project, Foxy can be integrated seamlessly.`,
                                  `Moreover, the freedom to modify and adapt the work allows you to tailor it to your specific requirements, ensuring a harmonious fit with your project's objectives. This adaptability extends to distribution as well, empowering you to share your customized version with others. The provision for sub-licensing further augments the framework's versatility, enabling you to incorporate it into projects governed by more restrictive licenses, expanding its potential applications.`
                              ]"/>

            <ArticleParagraph title="MIT License"
                              fa-icon="pi pi-hammer"
                              :description="[
                                  `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:`,
                                  `The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.`,
                                  `THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`
                              ]"/>

            <ArticleParagraph title="Disclaimer Note"
                              fa-icon="pi pi-exclamation-triangle"
                              :description="[
                                  `The work is made available to you in its current state, without any warranties, guarantees, or assurances of its performance or suitability for any specific purpose. This means that the work is provided 'as is', and you are advised to use it with a comprehensive understanding of its inherent characteristics and limitations. The absence of warranties implies that the author does not take on the responsibility of ensuring the work's error-free functioning, stability, or fitness for particular applications.`,
                                  `It is important to emphasize that the principle of providing the work 'as is' is not an attempt to undermine its value or quality. Rather, it underscores the reality that software and creative works can vary in terms of performance, compatibility, and outcomes due to the diverse environments and contexts in which they are used. While the author has undoubtedly put effort into crafting a functional and reliable tool, the inherent complexities of technology and the diversity of user scenarios can influence the work's behavior in unpredictable ways.`
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