<template>
    <div class="cv-preview">
        <div class="cv-preview-shell">
            <div class="cv-preview-container" :class="`template-${selectedTemplate}`">
                <!-- Template Moderno -->
                <div v-if="selectedTemplate === 'modern'" class="cv-content">
                    <div class="cv-header-modern">
                        <div class="cv-photo-section-modern" v-if="cvData?.personalInfo?.photoBase64">
                            <img :src="cvData.personalInfo.photoBase64" alt="Foto" class="cv-photo-modern">
                        </div>
                        <div class="cv-header-info-modern">
                            <h1 class="cv-name-modern">{{ fullName }}</h1>
                            <h2 class="cv-job-title-modern" v-if="cvData?.personalInfo?.jobTitle">
                                {{ cvData.personalInfo.jobTitle }}
                            </h2>
                            <div class="cv-contact-info-modern">
                                <div v-if="cvData?.personalInfo?.email" class="contact-item-modern">
                                    <i class="fa-solid fa-envelope"></i>
                                    <span>{{ cvData.personalInfo.email }}</span>
                                </div>
                                <div v-if="cvData?.personalInfo?.phone" class="contact-item-modern">
                                    <i class="fa-solid fa-phone"></i>
                                    <span>{{ cvData.personalInfo.phone }}</span>
                                </div>
                                <div v-if="fullAddress" class="contact-item-modern">
                                    <i class="fa-solid fa-location-dot"></i>
                                    <span>{{ fullAddress }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="cvData?.profile" class="cv-section-modern">
                        <h3 class="cv-section-title-modern">
                            <i class="fa-solid fa-user me-2"></i>Perfil
                        </h3>
                        <div class="cv-section-content-modern" v-html="cvData.profile"></div>
                    </div>

                    <div v-if="hasExperience" class="cv-section-modern">
                        <h3 class="cv-section-title-modern">
                            <i class="fa-solid fa-briefcase me-2"></i>Experiencia Profesional
                        </h3>
                        <div v-for="(exp, index) in filteredExperience" :key="index" class="cv-item-modern">
                            <div class="cv-item-header-modern">
                                <h4 class="cv-item-title-modern">{{ exp.position }}</h4>
                                <span class="cv-item-company-modern">{{ exp.employer }}</span>
                            </div>
                            <div class="cv-item-meta-modern">
                                <span class="cv-item-location-modern" v-if="exp.location">
                                    <i class="fa-solid fa-map-marker-alt"></i>{{ exp.location }}
                                </span>
                                <span class="cv-item-date-modern">
                                    {{ formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.current) }}
                                </span>
                            </div>
                            <div v-if="exp.description" class="cv-item-description-modern" v-html="exp.description"></div>
                        </div>
                    </div>

                    <div v-if="hasEducation" class="cv-section-modern">
                        <h3 class="cv-section-title-modern">
                            <i class="fa-solid fa-graduation-cap me-2"></i>Formación
                        </h3>
                        <div v-for="(edu, index) in filteredEducation" :key="index" class="cv-item-modern">
                            <div class="cv-item-header-modern">
                                <h4 class="cv-item-title-modern">{{ edu.formation }}</h4>
                                <span class="cv-item-company-modern">{{ edu.institution }}</span>
                            </div>
                            <div class="cv-item-meta-modern">
                                <span class="cv-item-location-modern" v-if="edu.location">
                                    <i class="fa-solid fa-map-marker-alt"></i>{{ edu.location }}
                                </span>
                                <span class="cv-item-date-modern">
                                    {{ formatDateRange(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear, edu.current) }}
                                </span>
                            </div>
                            <div v-if="edu.description" class="cv-item-description-modern" v-html="edu.description"></div>
                        </div>
                    </div>

                    <div v-if="cvData?.competences?.length > 0" class="cv-section-modern">
                        <h3 class="cv-section-title-modern">
                            <i class="fa-solid fa-star me-2"></i>Competencias
                        </h3>
                        <div class="cv-competences-modern">
                            <div v-for="(comp, index) in cvData.competences" :key="index" class="cv-competence-item-modern">
                                <span class="competence-name-modern">{{ comp.name }}</span>
                                <span class="competence-level-modern">{{ comp.level }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="cvData?.languages?.length > 0" class="cv-section-modern">
                        <h3 class="cv-section-title-modern">
                            <i class="fa-solid fa-language me-2"></i>Idiomas
                        </h3>
                        <div class="cv-languages-modern">
                            <div v-for="(lang, index) in cvData.languages" :key="index" class="cv-language-item-modern">
                                <span class="language-name-modern">{{ lang.name }}</span>
                                <span class="language-level-modern">{{ lang.level }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="cvData?.hobbies?.length > 0" class="cv-section-modern">
                        <h3 class="cv-section-title-modern">
                            <i class="fa-solid fa-heart me-2"></i>Pasatiempos e Intereses
                        </h3>
                        <div class="cv-hobbies-modern">
                            <span v-for="(hobby, index) in cvData.hobbies" :key="index" class="cv-hobby-badge-modern">
                                {{ hobby }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Template Elegante -->
                <div v-else-if="selectedTemplate === 'elegant'" class="cv-content-elegant">
                    <div class="cv-elegant-container">
                        <div class="cv-elegant-sidebar"></div>
                        <div class="cv-elegant-main">
                            <div class="cv-elegant-header">
                                <div class="cv-elegant-profile-photo" v-if="cvData?.personalInfo?.photoBase64">
                                    <img :src="cvData.personalInfo.photoBase64" alt="Foto de perfil">
                                </div>
                                <div class="cv-elegant-info">
                                    <h1>{{ fullNameUppercase }}</h1>
                                    <ul>
                                        <li v-if="cvData?.personalInfo?.email">
                                            <span>📧</span> {{ cvData.personalInfo.email }}
                                        </li>
                                        <li v-if="cvData?.personalInfo?.phone">
                                            <span>📞</span> {{ cvData.personalInfo.phone }}
                                        </li>
                                        <li v-if="fullAddress">
                                            <span>📍</span> {{ fullAddress }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="cv-elegant-content">
                                <div v-if="cvData?.profile" class="cv-elegant-section">
                                    <h3 class="cv-elegant-section-title">PERFIL</h3>
                                    <div class="cv-elegant-section-text" v-html="cvData.profile"></div>
                                </div>

                                <div v-if="hasExperience" class="cv-elegant-section">
                                    <h3 class="cv-elegant-section-title">EXPERIENCIA PROFESIONAL</h3>
                                    <div v-for="(exp, index) in filteredExperience" :key="`exp-${index}`" class="cv-elegant-item">
                                        <div class="cv-elegant-item-header">
                                            <div>
                                                <h4 class="cv-elegant-item-title">{{ exp.position }}</h4>
                                                <span class="cv-elegant-item-company">{{ exp.employer }}</span>
                                            </div>
                                            <span class="cv-elegant-item-date">
                                                {{ formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.current) }}
                                            </span>
                                        </div>
                                        <div v-if="exp.location" class="cv-elegant-item-location">
                                            <span>📍</span> {{ exp.location }}
                                        </div>
                                        <div v-if="exp.description" class="cv-elegant-item-description" v-html="exp.description"></div>
                                    </div>
                                </div>

                                <div v-if="hasEducation" class="cv-elegant-section">
                                    <h3 class="cv-elegant-section-title">FORMACIÓN ACADÉMICA</h3>
                                    <div v-for="(edu, index) in filteredEducation" :key="`edu-${index}`" class="cv-elegant-item">
                                        <div class="cv-elegant-item-header">
                                            <div>
                                                <h4 class="cv-elegant-item-title">{{ edu.formation }}</h4>
                                                <span class="cv-elegant-item-company">{{ edu.institution }}</span>
                                            </div>
                                            <span class="cv-elegant-item-date">
                                                {{ formatDateRange(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear, edu.current) }}
                                            </span>
                                        </div>
                                        <div v-if="edu.location" class="cv-elegant-item-location">
                                            <span>📍</span> {{ edu.location }}
                                        </div>
                                        <div v-if="edu.description" class="cv-elegant-item-description" v-html="edu.description"></div>
                                    </div>
                                </div>

                                <div v-if="cvData?.competences?.length > 0" class="cv-elegant-section">
                                    <h3 class="cv-elegant-section-title">COMPETENCIAS</h3>
                                    <div class="cv-elegant-competences">
                                        <div v-for="(comp, index) in cvData.competences" :key="`comp-${index}`" class="cv-elegant-competence-item">
                                            <span class="cv-elegant-competence-name">{{ comp.name }}</span>
                                            <span class="cv-elegant-competence-level">{{ comp.level }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="cvData?.languages?.length > 0" class="cv-elegant-section">
                                    <h3 class="cv-elegant-section-title">IDIOMAS</h3>
                                    <div class="cv-elegant-languages">
                                        <div v-for="(lang, index) in cvData.languages" :key="`lang-${index}`" class="cv-elegant-language-item">
                                            <span>{{ lang.name }}</span>
                                            <span class="cv-elegant-language-level">{{ lang.level }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="cvData?.hobbies?.length > 0" class="cv-elegant-section">
                                    <h3 class="cv-elegant-section-title">INTERESES</h3>
                                    <div class="cv-elegant-hobbies">
                                        <span v-for="(hobby, index) in cvData.hobbies" :key="`hobby-${index}`" class="cv-elegant-hobby-tag">
                                            {{ hobby }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <transition name="fade-slide">
                <div v-if="showTemplateGallery" class="template-gallery">
                    <div class="gallery-header">
                        <h3>Elige una plantilla</h3>
                        <p>Selecciona entre nuestras opciones destacadas</p>
                    </div>
                    <div class="gallery-scroll">
                        <button
                            v-for="template in templates"
                            :key="template.id"
                            class="template-card"
                            :class="{ active: template.id === selectedTemplate }"
                            @click="selectTemplate(template.id)">
                            <div class="template-thumbnail" :class="template.thumbnailClass">
                                <span class="template-badge">{{ template.badge }}</span>
                            </div>
                            <span class="template-name">{{ template.name }}</span>
                        </button>
                    </div>
                </div>
            </transition>

            <div class="cv-toolbar">
                <button
                    type="button"
                    class="toolbar-btn"
                    :class="{ active: showTemplateGallery }"
                    @click="toggleTemplateGallery">
                    <i class="fa-solid fa-table-cells-large"></i>
                </button>
                <button type="button" class="toolbar-btn disabled" disabled>Aa</button>
                <button type="button" class="toolbar-btn disabled" disabled>tT</button>
                <button type="button" class="toolbar-btn disabled" disabled>
                    <i class="fa-solid fa-list"></i>
                </button>
                <button type="button" class="toolbar-btn disabled" disabled>
                    <i class="fa-solid fa-droplet"></i>
                </button>
                <button type="button" class="toolbar-btn disabled" disabled>
                    <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    cvData: {
        type: Object,
        default: () => null
    }
});

const selectedTemplate = ref('modern');
const showTemplateGallery = ref(false);

const templates = [
    { id: 'modern', name: 'Moderna', badge: 'Actual', thumbnailClass: 'thumb-modern' },
    { id: 'elegant', name: 'Elegante', badge: 'Nuevo', thumbnailClass: 'thumb-elegant' }
];

const toggleTemplateGallery = () => {
    showTemplateGallery.value = !showTemplateGallery.value;
};

const selectTemplate = (templateId) => {
    selectedTemplate.value = templateId;
    showTemplateGallery.value = false;
};

const fullName = computed(() => {
    if (!props.cvData?.personalInfo) return '';
    const { firstName, lastName } = props.cvData.personalInfo;
    return [firstName, lastName].filter(Boolean).join(' ').trim() || 'Nombre Completo';
});

const fullNameUppercase = computed(() => {
    return fullName.value.toUpperCase();
});

const fullAddress = computed(() => {
    if (!props.cvData?.personalInfo) return '';
    const { address, postalCode, city } = props.cvData.personalInfo;
    const parts = [address, postalCode, city].filter(Boolean);
    return parts.join(', ') || '';
});

const hasExperience = computed(() => {
    return props.cvData?.experience?.some(exp =>
        exp.position?.trim() || exp.employer?.trim()
    );
});

const filteredExperience = computed(() => {
    if (!props.cvData?.experience) return [];
    return props.cvData.experience.filter(exp =>
        exp.position?.trim() || exp.employer?.trim()
    );
});

const hasEducation = computed(() => {
    return props.cvData?.education?.some(edu =>
        edu.formation?.trim() || edu.institution?.trim()
    );
});

const filteredEducation = computed(() => {
    if (!props.cvData?.education) return [];
    return props.cvData.education.filter(edu =>
        edu.formation?.trim() || edu.institution?.trim()
    );
});

const formatDateRange = (startMonth, startYear, endMonth, endYear, current) => {
    if (!startYear) return '';

    const months = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const startMonthName = startMonth ? months[parseInt(startMonth)] : '';
    const start = [startMonthName, startYear].filter(Boolean).join(' ') || startYear;

    if (current) {
        return `${start} - Presente`;
    }

    if (!endYear) return start;

    const endMonthName = endMonth ? months[parseInt(endMonth)] : '';
    const end = [endMonthName, endYear].filter(Boolean).join(' ') || endYear;

    return `${start} - ${end}`;
};
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.cv-preview {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;

    .cv-preview-shell {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-12px);
}

.template-gallery {
    background: white;
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 1.25rem;

    .gallery-header {
        h3 {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0;
            color: $dark;
        }

        p {
            margin: 0.25rem 0 0 0;
            color: $text-muted;
            font-size: 0.95rem;
        }
    }

    .gallery-scroll {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
        scrollbar-width: thin;

        &::-webkit-scrollbar {
            height: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.15);
            border-radius: 4px;
        }
    }
}

.template-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    border: 2px solid transparent;
    border-radius: 14px;
    background: #f8f9fa;
    padding: 0.75rem;
    min-width: 180px;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
    }

    &.active {
        border-color: var(--secondary-color, #2ddc72);
        box-shadow: 0 10px 24px rgba(45, 220, 114, 0.25);
        background: white;
    }

    .template-thumbnail {
        width: 180px;
        aspect-ratio: 3 / 4;
        border-radius: 12px;
        position: relative;
        overflow: hidden;
        border: 3px solid rgba(255, 255, 255, 0.9);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: flex-start;
        justify-content: center;

        &.thumb-modern {
            background: linear-gradient(140deg, #15161d 0%, #1b1c25 42%, #39ff14 42%, #39ff14 60%, #ffffff 60%, #f8f9fb 100%);
        }

        &.thumb-elegant {
            background: linear-gradient(165deg, #1f2a48 0%, #222f53 40%, #68d4ff 40%, #68d4ff 58%, #ffffff 58%, #f4f7fc 100%);
        }

        .template-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            padding: 0.3rem 0.6rem;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.92);
            color: #1e1f2c;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.6px;
        }
    }

    .template-name {
        font-size: 1rem;
        font-weight: 600;
        color: $dark;
        text-transform: capitalize;
    }
}

.cv-preview-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
    padding: 2.5rem;
    min-height: 820px;

    &.template-elegant {
        padding: 0;
        background: #f6f9fa;
        box-shadow: none;
        border-radius: 0;
        overflow: visible;
    }
}

.cv-toolbar {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    justify-content: center;
    padding: 0.9rem;
    background: #1f2028;
    border-radius: 14px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);

    .toolbar-btn {
        width: 42px;
        height: 42px;
        border: none;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.08);
        color: white;
        font-weight: 600;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;

        i {
            font-size: 1.1rem;
        }

        &.active {
            background: linear-gradient(135deg, #2ddc72 0%, #1dbf60 100%);
            box-shadow: 0 8px 18px rgba(45, 220, 114, 0.45);
        }

        &.disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }

        &:not(.disabled):hover {
            transform: translateY(-2px);
        }
    }
}

// ========== TEMPLATE MODERNO ==========
.cv-header-modern {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid var(--secondary-color, #ff5900);

    .cv-photo-section-modern {
        flex-shrink: 0;

        .cv-photo-modern {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid var(--secondary-color, #ff5900);
        }
    }

    .cv-header-info-modern {
        flex: 1;

        .cv-name-modern {
            font-size: 2rem;
            font-weight: 700;
            color: $dark;
            margin: 0 0 0.5rem 0;
        }

        .cv-job-title-modern {
            font-size: 1.25rem;
            font-weight: 500;
            color: var(--secondary-color, #ff5900);
            margin: 0 0 1rem 0;
        }

        .cv-contact-info-modern {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            .contact-item-modern {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: $text-muted;
                font-size: 0.9rem;

                i {
                    color: var(--secondary-color, #ff5900);
                    width: 16px;
                }
            }
        }
    }
}

.cv-section-modern {
    margin-bottom: 2rem;

    .cv-section-title-modern {
        font-size: 1.5rem;
        font-weight: 600;
        color: $dark;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid $light-3;
        display: flex;
        align-items: center;

        i {
            color: var(--secondary-color, #ff5900);
        }
    }

    .cv-section-content-modern {
        color: $dark;
        line-height: 1.6;

        :deep(p) {
            margin: 0 0 0.5rem 0;
        }
    }
}

.cv-item-modern {
    margin-bottom: 1.5rem;

    .cv-item-header-modern {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.5rem;

        .cv-item-title-modern {
            font-size: 1.1rem;
            font-weight: 600;
            color: $dark;
            margin: 0;
        }

        .cv-item-company-modern {
            font-size: 1rem;
            font-weight: 500;
            color: var(--secondary-color, #ff5900);
        }
    }

    .cv-item-meta-modern {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: $text-muted;

        .cv-item-location-modern i {
            color: var(--secondary-color, #ff5900);
        }
    }

    .cv-item-description-modern {
        color: $dark;
        line-height: 1.6;
        margin-top: 0.5rem;
    }
}

.cv-competences-modern,
.cv-languages-modern {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .cv-competence-item-modern,
    .cv-language-item-modern {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid $light-2;
    }
}

.cv-hobbies-modern {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .cv-hobby-badge-modern {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: $light-1;
        border: 1px solid $light-3;
        border-radius: 20px;
        color: $dark;
        font-size: 0.9rem;
    }
}

// ========== TEMPLATE ELEGANTE (CV WIZARD) ==========
.cv-content-elegant {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', 'Arial', sans-serif;
    background: #f6f9fa;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100%;
    width: 100%;
}

// CONTENEDOR PRINCIPAL - tarjeta similar a la imagen
.cv-elegant-container {
    width: 100%;
    max-width: 820px;
    display: grid;
    // columna izquierda para la barra lateral, columna derecha para contenido
    grid-template-columns: 220px 1fr;
    grid-template-rows: 1fr;
    background: transparent;
    border-radius: 16px;
    overflow: visible;
    min-height: 740px;
    position: relative;
}

// Barra lateral oscura — ocupa la columna 1 desde arriba hasta abajo (fija)
.cv-elegant-sidebar {
    background: #25252e;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    min-height: 100%;
    border-radius: 16px 0 0 16px;
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.2);
}

// Contenedor principal de la tarjeta blanca
.cv-elegant-main {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    background: white;
    border-radius: 0 14px 14px 0;
    margin: 48px 48px 48px -110px;
    padding: 28px 34px 36px 34px;
    box-shadow: 0 28px 48px rgba(15, 23, 42, 0.18);
    display: flex;
    flex-direction: column;
    position: relative;
}

// HEADER: la franja verde dentro de la tarjeta blanca
.cv-elegant-header {
    display: flex;
    align-items: center;
    background: #29ff37; // verde brillante como en la imagen
    padding: 22px 30px;
    gap: 24px;
    position: relative;
    border-radius: 10px;
    box-shadow: 0 18px 32px rgba(15, 23, 42, 0.12);
}

// FOTO: avatar circular con borde negro marcado
.cv-elegant-profile-photo {
    border: 5px solid #000; // Borde negro como en la imagen
    border-radius: 50%;
    overflow: hidden;
    width: 110px;
    height: 110px;
    flex-shrink: 0;
    margin-left: -42px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    background: #fff;
}

// Ajuste para que la imagen llene el contenedor
.cv-elegant-profile-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

// INFO (nombre y datos de contacto)
.cv-elegant-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
}

.cv-elegant-info h1 {
    font-size: 34px;
    color: #000;
    margin: 0;
    padding: 0;
    font-weight: 700;
    letter-spacing: 1px;
    line-height: 1;
}

.cv-elegant-info ul {
    list-style: none;
    font-size: 13px;
    color: #000;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
}

// Hacemos los li más pequeños y con icono-espacio
.cv-elegant-info li {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #000;
    font-size: 14px;
    font-weight: 500;
}

// CONTENIDO PRINCIPAL (derecha debajo del header)
.cv-elegant-content {
    margin-top: 24px;
}

// Secciones: títulos y estilos parecidos a la captura
.cv-elegant-section {
    margin-bottom: 1.6rem;
}

.cv-elegant-section-title {
    font-size: 14px;
    font-weight: 700;
    color: #29ff37;
    margin: 0 0 10px 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 2px solid #29ff37;
    padding-bottom: 4px;
}

.cv-elegant-section-text {
    color: #111;
    line-height: 1.6;
    font-size: 13px;

    :deep(p) {
        margin: 0 0 0.75rem 0;

        &:last-child {
            margin-bottom: 0;
        }
    }
}

// Items (experiencia / educación)
.cv-elegant-item {
    margin-bottom: 1.2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e9e9e9;

    &:last-child {
        border-bottom: none;
    }
}

.cv-elegant-item-header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 0.5rem;
}

.cv-elegant-item-title {
    font-size: 15px;
    font-weight: 700;
    color: #0c0c0c;
    margin: 0;
}

.cv-elegant-item-company {
    font-size: 13px;
    font-weight: 500;
    color: #111;
    display: block;
}

.cv-elegant-item-date {
    font-size: 13px;
    color: #111;
    font-weight: 500;
    white-space: nowrap;
}

// Ubicación y descripción
.cv-elegant-item-location {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #111;
    margin-bottom: 8px;
}

.cv-elegant-item-description {
    color: #111;
    line-height: 1.6;
    font-size: 13px;

    :deep(p) {
        margin: 0 0 0.5rem 0;

        &:last-child {
            margin-bottom: 0;
        }
    }
}

// Competencias / idiomas / hobbies: estilo compacto
.cv-elegant-competences,
.cv-elegant-languages {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.cv-elegant-competence-item,
.cv-elegant-language-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid #eaeaea;

    &:last-child {
        border-bottom: none;
    }
}

.cv-elegant-competence-name {
    font-weight: 600;
    color: #0c0c0c;
    font-size: 13px;
}

.cv-elegant-competence-level {
    font-size: 13px;
    color: #111;
}

.cv-elegant-language-level {
    font-size: 13px;
    color: #111;
}

.cv-elegant-hobbies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.cv-elegant-hobby-tag {
    padding: 6px 10px;
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 18px;
    font-size: 13px;
    color: #111;
}

// pequeños ajustes responsive
@media (max-width: 900px) {
    .cv-elegant-container {
        grid-template-columns: 160px 1fr;
    }

    .cv-elegant-main {
        margin: 28px 28px 28px -24px;
        padding: 28px 32px 32px 32px;
    }

    .cv-elegant-profile-photo {
        width: 96px;
        height: 96px;
        border-width: 4px;
    }

    .cv-elegant-info h1 {
        font-size: 24px;
    }
}

@media (max-width: 600px) {
    .cv-elegant-container {
        display: block;
        border-radius: 8px;
    }

    .cv-elegant-main {
        margin: 24px;
        padding: 24px;
        border-radius: 12px;
    }

    .cv-elegant-header {
        border-radius: 10px;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 16px;
        padding: 24px;
    }

    .cv-elegant-profile-photo {
        margin-top: 0;
    }

    .cv-elegant-info ul {
        align-items: center;
        gap: 8px;
    }
}

@media (max-width: 1200px) {
    .cv-preview-container {
        padding: 2rem;
    }

    .template-card {
        min-width: 160px;

        .template-thumbnail {
            width: 160px;
        }
    }
}

@media (max-width: 768px) {
    .cv-preview {
        top: 1rem;
        max-height: none;
        position: static;
    }

    .cv-preview-container {
        padding: 1.5rem;
    }

    .cv-toolbar {
        flex-wrap: wrap;
    }

    .cv-elegant-header {
        padding: 1.5rem;
    }
}
</style>
