<template>
    <PageSection id="cv"
                 :darken="false"
                 :no-padding="false">
        <PageSectionHeader :title="strings.get('cv_title') || 'Crear CV Profesional'"
                           :subtitle="strings.get('cv_subtitle') || 'Completa tu información para crear un CV profesional'"
                           :description="strings.get('cv_description') || 'Llena todos los campos requeridos para generar tu currículum'"
                           :fa-icon="'fa-solid fa-file-alt'"
                           :center="true"/>

        <PageSectionContent>
            <div class="cv-full-width-container">
                <div class="row g-4">
                    <div class="col-12 col-lg-5">
                        <CVForm v-model="cvFormData"/>
                    </div>
                    <div class="col-12 col-lg-7">
                        <CVPreview :cv-data="cvFormData"/>
                    </div>
                </div>
            </div>
        </PageSectionContent>
    </PageSection>
</template>

<script setup>
import PageSection from "/src/vue/components/layout/PageSection.vue"
import PageSectionHeader from "/src/vue/components/layout/PageSectionHeader.vue"
import PageSectionContent from "/src/vue/components/layout/PageSectionContent.vue"
import CVForm from "/src/vue/components/forms/cv/CVForm.vue"
import CVPreview from "/src/vue/components/forms/cv/CVPreview.vue"
import {useStrings} from "/src/composables/strings.js"
import {ref} from "vue"

const strings = useStrings()
const cvFormData = ref(null)
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

#cv {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, $light-1 0%, $light-2 100%);
    padding: 3rem 0;
    
    :deep(.container-xxl) {
        max-width: 100%;
        padding-left: 2rem;
        padding-right: 2rem;
    }
}

.cv-full-width-container {
    width: 100%;
    max-width: 100%;
}
</style>

