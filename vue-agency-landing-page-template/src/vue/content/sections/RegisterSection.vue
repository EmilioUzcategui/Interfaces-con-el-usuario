<template>
    <PageSection id="register"
                 :darken="false"
                 :no-padding="false">
        <PageSectionHeader :title="strings.get('register_title')"
                           :subtitle="strings.get('register_subtitle')"
                           :description="strings.get('register_description')"
                           :fa-icon="'fa-solid fa-user-plus'"
                           :center="true"/>

        <PageSectionContent>
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <RegisterForm/>
                </div>
            </div>
        </PageSectionContent>
    </PageSection>
</template>

<script setup>
import PageSection from "/src/vue/components/layout/PageSection.vue"
import PageSectionHeader from "/src/vue/components/layout/PageSectionHeader.vue"
import PageSectionContent from "/src/vue/components/layout/PageSectionContent.vue"
import RegisterForm from "/src/vue/components/forms/register/RegisterForm.vue"
import {useStrings} from "/src/composables/strings.js"

const strings = useStrings()
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

#register {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, $light-1 0%, $light-2 100%);
}
</style>