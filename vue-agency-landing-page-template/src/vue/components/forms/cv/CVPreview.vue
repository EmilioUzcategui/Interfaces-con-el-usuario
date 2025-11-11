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

                <!-- Template Gris Oscuro -->
                <div v-else-if="selectedTemplate === 'dark'" class="cv-content-dark">
                    <div class="cv-header-dark">
                        <div class="cv-header-top-dark">
                            <div class="cv-photo-section-dark" v-if="cvData?.personalInfo?.photoBase64">
                                <img :src="cvData.personalInfo.photoBase64" alt="Foto" class="cv-photo-dark">
                            </div>
                            <div class="cv-name-section-dark">
                                <h1 class="cv-name-dark">{{ firstName }}</h1>
                                <h1 class="cv-lastname-dark">{{ lastName }}</h1>
                                <h2 class="cv-job-title-dark" v-if="cvData?.personalInfo?.jobTitle">
                                    {{ cvData.personalInfo.jobTitle }}
                                </h2>
                            </div>
                        </div>
                        <div class="cv-header-bottom-dark">
                            <div v-if="cvData?.profile" class="cv-profile-section-dark">
                                <h3 class="cv-profile-title-dark">Mi Perfil</h3>
                                <div class="cv-profile-content-dark" v-html="cvData.profile"></div>
                            </div>
                            <div class="cv-contact-info-dark">
                                <div v-if="cvData?.personalInfo?.phone" class="contact-item-dark">
                                    <i class="fa-solid fa-phone"></i>
                                    <span>{{ cvData.personalInfo.phone }}</span>
                                </div>
                                <div v-if="cvData?.personalInfo?.email" class="contact-item-dark">
                                    <i class="fa-solid fa-envelope"></i>
                                    <span>{{ cvData.personalInfo.email }}</span>
                                </div>
                                <div v-if="cvData?.personalInfo?.email" class="contact-item-dark">
                                    <i class="fa-solid fa-globe"></i>
                                    <span>{{ cvData.personalInfo.email }}</span>
                                </div>
                                <div v-if="fullAddress" class="contact-item-dark">
                                    <i class="fa-solid fa-location-dot"></i>
                                    <span>{{ fullAddress }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="cv-body-dark">
                        <div class="cv-left-column-dark">

                            <div v-if="hasExperience" class="cv-section-dark">
                                <h3 class="cv-section-title-dark">Experiencia Laboral</h3>
                                <div class="cv-section-content-dark">
                                    <div v-for="(exp, index) in filteredExperience" :key="index" class="cv-item-dark">
                                        <i class="fa-solid fa-check cv-check-icon-dark"></i>
                                        <div class="cv-item-content-dark">
                                            <div class="cv-item-header-dark">
                                                <h4 class="cv-item-title-dark">{{ exp.employer }}</h4>
                                                <span class="cv-item-date-dark">
                                                    {{ formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.current) }}
                                                </span>
                                            </div>
                                            <div v-if="exp.description" class="cv-item-description-dark" v-html="exp.description"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="hasEducation" class="cv-section-dark">
                                <h3 class="cv-section-title-dark">Formación Académica</h3>
                                <div class="cv-section-content-dark">
                                    <div v-for="(edu, index) in filteredEducation" :key="index" class="cv-item-dark">
                                        <i class="fa-solid fa-check cv-check-icon-dark"></i>
                                        <div class="cv-item-content-dark">
                                            <div class="cv-item-header-dark">
                                                <h4 class="cv-item-title-dark">{{ edu.institution }}</h4>
                                                <span class="cv-item-date-dark">
                                                    {{ formatDateRange(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear, edu.current) }}
                                                </span>
                                            </div>
                                            <div class="cv-item-degree-dark">{{ edu.formation }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="cv-right-column-dark">
                            <div v-if="cvData?.languages?.length > 0" class="cv-section-dark">
                                <h3 class="cv-section-title-dark">Idiomas</h3>
                                <div class="cv-languages-list-dark">
                                    <div v-for="(lang, index) in cvData.languages" :key="index" class="cv-language-item-dark">
                                        <i class="fa-solid fa-check cv-check-icon-dark"></i>
                                        <span class="cv-language-name-dark">{{ lang.name }}</span>
                                    </div>
                                </div>
                            </div>

                            <div v-if="cvData?.competences?.length > 0" class="cv-section-dark">
                                <h3 class="cv-section-title-dark">Competencias</h3>
                                <div class="cv-section-content-dark">
                                    <div v-for="(comp, index) in cvData.competences" :key="index" class="cv-competence-item-dark">
                                        <span class="competence-name-dark">{{ comp.name }}</span>
                                        <div class="competence-progress-dark">
                                            <div class="progress-bar-dark" :style="{ width: getCompetenceLevel(comp.level) + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="cvData?.skills?.length > 0" class="cv-section-dark">
                                <h3 class="cv-section-title-dark">Habilidades</h3>
                                <div class="cv-section-content-dark">
                                    <div v-for="(skill, index) in cvData.skills" :key="index" class="cv-skill-item-dark">
                                        <span class="skill-name-dark">{{ skill.name }}</span>
                                        <div class="skill-rating-dark">
                                            <span v-for="i in 5" :key="i" 
                                                  class="skill-dot-dark" 
                                                  :class="{ 'skill-dot-filled-dark': i <= getSkillRating(skill.level) }">
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Template Elegante -->
                <div v-else-if="selectedTemplate === 'elegant'" class="cv-content-elegant">
                    <div class="cv-elegant-container">
                        <div class="cv-elegant-sidebar">
                            <div class="cv-elegant-sidebar-content">
                                <div v-if="cvData?.competences?.length > 0" class="cv-elegant-sidebar-section">
                                    <h3 class="cv-elegant-sidebar-title">COMPETENCIAS</h3>
                                    <div class="cv-elegant-sidebar-competences">
                                        <div v-for="(comp, index) in cvData.competences" :key="`comp-${index}`" class="cv-elegant-sidebar-competence-item">
                                            <span class="cv-elegant-sidebar-competence-name">{{ comp.name }}</span>
                                            <div class="cv-elegant-sidebar-progress-bar">
                                                <div class="cv-elegant-sidebar-progress-fill" :style="{ width: getCompetenceLevel(comp.level) + '%' }"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="cvData?.languages?.length > 0" class="cv-elegant-sidebar-section">
                                    <h3 class="cv-elegant-sidebar-title">IDIOMAS</h3>
                                    <div class="cv-elegant-sidebar-languages">
                                        <div v-for="(lang, index) in cvData.languages" :key="`lang-${index}`" class="cv-elegant-sidebar-language-item">
                                            <span class="cv-elegant-sidebar-language-name">{{ lang.name }}</span>
                                            <div class="cv-elegant-sidebar-progress-bar">
                                                <div class="cv-elegant-sidebar-progress-fill" :style="{ width: getCompetenceLevel(lang.level) + '%' }"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="cvData?.hobbies?.length > 0" class="cv-elegant-sidebar-section">
                                    <h3 class="cv-elegant-sidebar-title">PASATIEMPOS E INTERESES</h3>
                                    <div class="cv-elegant-sidebar-hobbies">
                                        <div v-for="(hobby, index) in cvData.hobbies" :key="`hobby-${index}`" class="cv-elegant-sidebar-hobby-item">
                                            <span class="cv-elegant-sidebar-hobby-bullet"></span>
                                            <span>{{ hobby }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cv-elegant-main">
                            <div class="cv-elegant-card">
                                <div class="cv-elegant-header">
                                    <div v-if="cvData?.personalInfo?.photoBase64" class="cv-elegant-photo-wrapper">
                                        <div class="cv-elegant-profile-photo">
                                        <img :src="cvData.personalInfo.photoBase64" alt="Foto de perfil">
                                        </div>
                                    </div>
                                    <div class="cv-elegant-info">
                                        <h1>{{ fullNameUppercase }}</h1>
                                        <div class="cv-elegant-contact">
                                            <div v-if="cvData?.personalInfo?.email" class="cv-elegant-contact-item">
                                                    <i class="fa-solid fa-envelope"></i>
                                                <span>{{ cvData.personalInfo.email }}</span>
                                            </div>
                                            <div v-if="cvData?.personalInfo?.phone" class="cv-elegant-contact-item">
                                                    <i class="fa-solid fa-phone"></i>
                                                <span>{{ cvData.personalInfo.phone }}</span>
                                            </div>
                                            <div v-if="fullAddress" class="cv-elegant-contact-item">
                                                    <i class="fa-solid fa-location-dot"></i>
                                                <span>{{ fullAddress }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="cv-elegant-content-box">
                                    <div v-if="cvData?.profile" class="cv-elegant-section">
                                        <h3 class="cv-elegant-section-title">PERFIL</h3>
                                        <div class="cv-elegant-section-text" v-html="cvData.profile"></div>
                                    </div>

                                    <div v-if="hasEducation" class="cv-elegant-section">
                                        <h3 class="cv-elegant-section-title">FORMACIÓN</h3>
                                        <div v-for="(edu, index) in filteredEducation" :key="`edu-${index}`" class="cv-elegant-item">
                                            <div class="cv-elegant-item-header">
                                                    <h4 class="cv-elegant-item-title">{{ edu.formation }}</h4>
                                                <span class="cv-elegant-item-date">
                                                    {{ formatDateRange(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear, edu.current) }}
                                                </span>
                                            </div>
                                            <div v-if="edu.institution || edu.location" class="cv-elegant-item-meta">
                                                <span v-if="edu.institution">{{ edu.institution }}</span>
                                                <span v-if="edu.institution && edu.location">, </span>
                                                <span v-if="edu.location">{{ edu.location }}</span>
                                            </div>
                                            <div v-if="edu.description" class="cv-elegant-item-description" v-html="edu.description"></div>
                                        </div>
                                    </div>

                                    <div v-if="hasExperience" class="cv-elegant-section">
                                        <h3 class="cv-elegant-section-title">EXPERIENCIA</h3>
                                        <div v-for="(exp, index) in filteredExperience" :key="`exp-${index}`" class="cv-elegant-item">
                                            <div class="cv-elegant-item-header">
                                                <h4 class="cv-elegant-item-title">{{ exp.position }}</h4>
                                                <span class="cv-elegant-item-date">
                                                    {{ formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.current) }}
                                                </span>
                                        </div>
                                            <div v-if="exp.employer || exp.location" class="cv-elegant-item-meta">
                                                <span v-if="exp.employer">{{ exp.employer }}</span>
                                                <span v-if="exp.employer && exp.location">, </span>
                                                <span v-if="exp.location">{{ exp.location }}</span>
                                            </div>
                                            <div v-if="exp.description" class="cv-elegant-item-description" v-html="exp.description"></div>
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
                <div class="cv-toolbar-content">
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
                    
                    <!-- Botón de colores para templates dark y elegant -->
                    <div  class="cv-color-btn-wrapper">
                        <button 
                            class="toolbar-btn cv-color-btn" 
                            @click="toggleColorDropdown"
                            type="button"
                            :class="{ active: showColorDropdown }">
                            <i class="fa-solid fa-palette"></i>
                        </button>
                        
                        <!-- Dropdown de colores -->
                        <div v-if="showColorDropdown" class="cv-color-dropdown">
                            <div v-if="!activePalette || activePalette.length === 0" class="cv-color-empty">
                                <p class="mb-0">No hay paleta activa disponible</p>
                            </div>
                            <div v-else class="cv-color-list">
                                <div 
                                    v-for="color in activePalette" 
                                    :key="color.id"
                                    class="cv-color-item"
                                    @click="applyColor(color)">
                                    <div class="cv-color-preview">
                                        <div 
                                            class="cv-color-dot"
                                            :style="{ backgroundColor: color.value }"
                                            :title="color.label">
                                        </div>
                                    </div>
                                    <span class="cv-color-name">{{ color.label }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, provide } from 'vue';
import { loadPalette } from '/src/utils/themeManager.js';
import html2canvas from 'html2canvas';

const props = defineProps({
    cvData: {
        type: Object,
        default: () => null
    }
});

const selectedTemplate = ref('modern');
const showTemplateGallery = ref(false);

// Provide selectedTemplate para que CVFormFields pueda acceder
provide('selectedTemplate', selectedTemplate);

const templates = [
    { id: 'modern', name: 'Moderna', badge: 'Actual', thumbnailClass: 'thumb-modern' },
    { id: 'elegant', name: 'Elegante', badge: 'Nuevo', thumbnailClass: 'thumb-elegant' },
    { id: 'dark', name: 'Gris Oscuro', badge: 'Nuevo', thumbnailClass: 'thumb-dark' }
];

// Variables para el selector de colores
const showColorDropdown = ref(false);
const activePalette = ref(null);
const selectedColor = ref(null);

const toggleTemplateGallery = () => {
    showTemplateGallery.value = !showTemplateGallery.value;
};

const selectTemplate = (templateId) => {
    selectedTemplate.value = templateId;
    showTemplateGallery.value = false;
    // Cerrar el dropdown de colores si se cambia de template
    if (showColorDropdown.value) {
        showColorDropdown.value = false;
    }
    // Resetear el color seleccionado cuando se cambia de template
    // para que el template dark siempre empiece con gris oscuro
    selectedColor.value = null;
};

// Cargar la paleta activa desde localStorage
const loadActivePalette = () => {
    try {
        const palette = loadPalette();
        if (palette && palette.colors && Array.isArray(palette.colors)) {
            activePalette.value = palette.colors;
        } else {
            // Si no hay paleta activa, usar valores por defecto
            activePalette.value = [
                { id: 'c1', label: 'Color 1', value: '#212529' },
                { id: 'c2', label: 'Color 2', value: '#ff5900' },
                { id: 'c3', label: 'Color 3', value: '#333333' },
                { id: 'c4', label: 'Color 4', value: '#343a40' },
                { id: 'c5', label: 'Color 5', value: '#ffffff' }
            ];
        }
    } catch (error) {
        console.error('Error loading active palette:', error);
        // Valores por defecto en caso de error
        activePalette.value = [
            { id: 'c1', label: 'Color 1', value: '#212529' },
            { id: 'c2', label: 'Color 2', value: '#ff5900' },
            { id: 'c3', label: 'Color 3', value: '#333333' },
            { id: 'c4', label: 'Color 4', value: '#343a40' },
            { id: 'c5', label: 'Color 5', value: '#ffffff' }
        ];
    }
};

// Toggle del dropdown de colores
const toggleColorDropdown = () => {
    showColorDropdown.value = !showColorDropdown.value;
};

// Aplicar color seleccionado
const applyColor = (color) => {
    selectedColor.value = color;
    showColorDropdown.value = false;
};

// Cerrar dropdown al hacer click fuera
const handleClickOutside = (event) => {
    const toolbar = event.target.closest('.cv-toolbar');
    if (!toolbar && showColorDropdown.value) {
        showColorDropdown.value = false;
    }
};

// Computed para obtener el color del recuadro gris
const darkGrayColor = computed(() => {
    // Si hay un color seleccionado explícitamente, usarlo
    if (selectedColor.value && selectedColor.value.value) {
        return selectedColor.value.value;
    }
    // Por defecto, usar gris oscuro hasta que se cambie el color
    return '#333333';
});

// Computed para obtener el color de la plantilla elegante
const elegantColor = computed(() => {
    // Si hay un color seleccionado explícitamente, usarlo
    if (selectedColor.value && selectedColor.value.value) {
        return selectedColor.value.value;
    }
    // Por defecto, usar el color teal original
    return '#94c4c4';
});

// Computed para obtener el color del box-shadow de la plantilla elegante
const elegantColorRgba = computed(() => {
    const color = elegantColor.value;
    // Convertir hex a rgb para el rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.25)`;
});

onMounted(() => {
    loadActivePalette();
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

const fullName = computed(() => {
    if (!props.cvData?.personalInfo) return '';
    const { firstName, lastName } = props.cvData.personalInfo;
    return [firstName, lastName].filter(Boolean).join(' ').trim() || 'Nombre Completo';
});

const fullNameUppercase = computed(() => {
    return fullName.value.toUpperCase();
});

const firstName = computed(() => {
    if (!props.cvData?.personalInfo) return '';
    return props.cvData.personalInfo.firstName || '';
});

const lastName = computed(() => {
    if (!props.cvData?.personalInfo) return '';
    return props.cvData.personalInfo.lastName || '';
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
    
    // Para el template gris oscuro, solo mostrar años
    if (selectedTemplate.value === 'dark') {
        if (current) {
            return `${startYear} - Presente`;
        }
        if (!endYear) return startYear;
        return `${startYear} - ${endYear}`;
    }
    
    // Para otros templates, mostrar mes y año
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

const getCompetenceLevel = (level) => {
    const levelMap = {
        'Básico': 30,
        'Intermedio': 60,
        'Avanzado': 80,
        'Experto': 100,
        'Nativo': 100
    };
    return levelMap[level] || 50;
};

const getSkillRating = (level) => {
    const ratingMap = {
        'Básico': 2,
        'Intermedio': 3,
        'Avanzado': 4,
        'Experto': 5
    };
    return ratingMap[level] || 3;
};

// Referencia al elemento del preview
const previewContainerRef = ref(null);

// Función para recortar espacios en blanco del canvas
const trimCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let top = 0;
    let bottom = canvas.height;
    let left = 0;
    let right = canvas.width;
    
    // Función auxiliar para verificar si un pixel tiene contenido real
    const hasContent = (r, g, b, a) => {
        // Considerar que un pixel tiene contenido si:
        // 1. No es completamente transparente (alpha > 0)
        // 2. No es completamente blanco (255, 255, 255)
        // 3. No es un fondo gris claro (para todas las plantillas)
        // 4. Tiene algún color significativo
        if (a === 0) return false;
        // Permitir un pequeño margen para píxeles casi blancos (por anti-aliasing)
        const isWhite = r > 250 && g > 250 && b > 250;
        // Detectar fondos grises claros comunes en las plantillas:
        // - #f3f6f8 (elegant) = rgb(243, 246, 248)
        // - #f6f9fa (elegant container) = rgb(246, 249, 250)
        // - Fondos blancos y grises muy claros
        const isLightGray = r >= 240 && r <= 255 && g >= 240 && g <= 255 && b >= 240 && b <= 255;
        return !isWhite && !isLightGray;
    };
    
    // Encontrar el borde superior
    for (let y = 0; y < canvas.height; y++) {
        let foundContent = false;
        for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            
            if (hasContent(r, g, b, a)) {
                top = y;
                foundContent = true;
                break;
            }
        }
        if (foundContent) break;
    }
    
    // Encontrar el borde inferior
    for (let y = canvas.height - 1; y >= top; y--) {
        let foundContent = false;
        for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            
            if (hasContent(r, g, b, a)) {
                bottom = y + 1;
                foundContent = true;
                break;
            }
        }
        if (foundContent) break;
    }
    
    // Encontrar el borde izquierdo
    for (let x = 0; x < canvas.width; x++) {
        let foundContent = false;
        for (let y = top; y < bottom; y++) {
            const idx = (y * canvas.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            
            if (hasContent(r, g, b, a)) {
                left = x;
                foundContent = true;
                break;
            }
        }
        if (foundContent) break;
    }
    
    // Encontrar el borde derecho
    for (let x = canvas.width - 1; x >= left; x--) {
        let foundContent = false;
        for (let y = top; y < bottom; y++) {
            const idx = (y * canvas.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            
            if (hasContent(r, g, b, a)) {
                right = x + 1;
                foundContent = true;
                break;
            }
        }
        if (foundContent) break;
    }
    
    // Asegurar que las dimensiones sean válidas
    const width = Math.max(1, right - left);
    const height = Math.max(1, bottom - top);
    
    // Crear un nuevo canvas con las dimensiones recortadas
    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = width;
    trimmedCanvas.height = height;
    const trimmedCtx = trimmedCanvas.getContext('2d');
    
    // Copiar la región recortada
    trimmedCtx.drawImage(
        canvas,
        left, top, width, height,
        0, 0, width, height
    );
    
    return trimmedCanvas;
};

// Función para capturar el CV como imagen
const captureCVAsImage = async () => {
    try {
        // Obtener el contenedor del CV (sin el toolbar y la galería)
        const cvContainer = document.querySelector('.cv-preview-container');
        if (!cvContainer) {
            console.error('No se encontró el contenedor del CV');
            return null;
        }

        // Ocultar temporalmente el toolbar y la galería si están visibles
        const toolbar = document.querySelector('.cv-toolbar');
        const gallery = document.querySelector('.template-gallery');
        const originalToolbarDisplay = toolbar ? toolbar.style.display : '';
        const originalGalleryDisplay = gallery ? gallery.style.display : '';
        
        if (toolbar) toolbar.style.display = 'none';
        if (gallery) gallery.style.display = 'none';

        // Esperar un momento para que los cambios se apliquen
        await new Promise(resolve => setTimeout(resolve, 100));

        // Para la plantilla elegante, obtener el contenedor específico
        let targetElement = cvContainer;
        let captureHeight = cvContainer.scrollHeight;
        
        if (selectedTemplate.value === 'elegant') {
            const elegantContainer = cvContainer.querySelector('.cv-elegant-container');
            if (elegantContainer) {
                targetElement = elegantContainer;
                // Calcular la altura real del contenido sin espacios en blanco
                const sidebar = elegantContainer.querySelector('.cv-elegant-sidebar');
                const card = elegantContainer.querySelector('.cv-elegant-card');
                
                if (sidebar && card) {
                    // Obtener el último elemento visible en cada columna
                    const sidebarChildren = Array.from(sidebar.children);
                    const cardChildren = Array.from(card.children);
                    
                    let maxBottom = 0;
                    
                    // Encontrar el último elemento visible en la sidebar
                    sidebarChildren.forEach(child => {
                        const rect = child.getBoundingClientRect();
                        const containerRect = elegantContainer.getBoundingClientRect();
                        const relativeBottom = rect.bottom - containerRect.top;
                        if (relativeBottom > maxBottom) {
                            maxBottom = relativeBottom;
                        }
                    });
                    
                    // Encontrar el último elemento visible en el card
                    cardChildren.forEach(child => {
                        const rect = child.getBoundingClientRect();
                        const containerRect = elegantContainer.getBoundingClientRect();
                        const relativeBottom = rect.bottom - containerRect.top;
                        if (relativeBottom > maxBottom) {
                            maxBottom = relativeBottom;
                        }
                    });
                    
                    // Usar la altura del último elemento más un pequeño padding
                    captureHeight = maxBottom > 0 ? maxBottom + 20 : Math.max(sidebar.offsetHeight, card.offsetHeight) + 20;
                }
            }
        }

        // Capturar el CV como canvas usando el ancho visible real
        // Para la plantilla elegante, calcular el ancho real del contenido (sidebar + card)
        let captureWidth = targetElement.offsetWidth || targetElement.clientWidth;
        if (selectedTemplate.value === 'elegant') {
            const elegantContainer = cvContainer.querySelector('.cv-elegant-container');
            if (elegantContainer) {
                const sidebar = elegantContainer.querySelector('.cv-elegant-sidebar');
                const card = elegantContainer.querySelector('.cv-elegant-card');
                if (sidebar && card) {
                    // Usar getBoundingClientRect para obtener el ancho real del contenido visible
                    const sidebarRect = sidebar.getBoundingClientRect();
                    const cardRect = card.getBoundingClientRect();
                    // El ancho total es desde el inicio del sidebar hasta el final del card
                    const containerRect = elegantContainer.getBoundingClientRect();
                    // Calcular el ancho real: desde el left del sidebar hasta el right del card
                    const realWidth = (cardRect.right - sidebarRect.left);
                    captureWidth = realWidth;
                }
            }
        }
        
        // Para dark y modern, usar scrollHeight para capturar todo el contenido
        const captureHeightFinal = selectedTemplate.value === 'elegant' 
            ? captureHeight 
            : (targetElement.scrollHeight || targetElement.offsetHeight || targetElement.clientHeight);
        
        const canvas = await html2canvas(targetElement, {
            backgroundColor: null, // Sin fondo para que trimCanvas pueda detectar espacios vacíos en todas las plantillas
            scale: 2, // Mayor calidad
            logging: false,
            useCORS: true,
            allowTaint: false,
            width: captureWidth,
            height: captureHeightFinal,
            windowWidth: captureWidth,
            windowHeight: captureHeightFinal
        });

        // Restaurar la visibilidad del toolbar y la galería
        if (toolbar) toolbar.style.display = originalToolbarDisplay;
        if (gallery) gallery.style.display = originalGalleryDisplay;

        // Recortar espacios en blanco solo para la plantilla elegante
        // Para dark y modern, usar el canvas completo sin recortar
        let finalCanvas = canvas;
        if (selectedTemplate.value === 'elegant') {
            finalCanvas = trimCanvas(canvas);
        }

        // Convertir canvas a blob
        return new Promise((resolve) => {
            finalCanvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    resolve(null);
                }
            }, 'image/png', 1.0);
        });
    } catch (error) {
        console.error('Error al capturar el CV como imagen:', error);
        return null;
    }
};

// Exponer la función para uso externo
defineExpose({
    captureCVAsImage,
    selectedTemplate
});
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.cv-preview {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 0.5rem;
    
    // Estilo personalizado para el scrollbar
    &::-webkit-scrollbar {
        width: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
        
        &:hover {
            background: #555;
        }
    }
    
    // Para Firefox
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;

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
            background: linear-gradient(165deg, #25252e 0%, #25252e 35%, #94c4c4 35%, #94c4c4 58%, #ffffff 58%, #f4f7fc 100%);
        }

        &.thumb-dark {
            background: linear-gradient(180deg, #333333 0%, #333333 30%, #ffffff 30%, #ffffff 100%);
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
        min-height: auto;
        height: auto;
        display: flex;
        flex-direction: column;
    }

    &.template-dark {
        padding: 0;
        background: white;
        box-shadow: none;
        border-radius: 0;
        overflow: visible;
    }
}

.cv-toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.9rem;
    background: #1f2028;
    border-radius: 14px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
    position: relative;

    .cv-toolbar-content {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        position: relative;
    }

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

        &.cv-color-btn {
            width: 42px;
            height: 42px;
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
            color: white;
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
                    color: white;
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
            color: white;
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
            color: white;
        }
    }

    .cv-item-meta-modern {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: $text-muted;

        .cv-item-location-modern i {
            color: white;
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
    font-family: var(--font-primary, var(--font-base, 'Saira', 'Arial', sans-serif));
    background: #f3f6f8;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: auto;
    min-height: 100%;
    flex: 1;
}

// CONTENEDOR PRINCIPAL - estructura base
.cv-elegant-container {
    width: 100%;
    max-width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;
    position: relative;
    padding: 0;
    height: auto;
    min-height: 0;
}

// Barra lateral oscura
.cv-elegant-sidebar {
    width: 260px;
    background: #25252e;
    border-radius: 0;
    box-shadow: 0 32px 60px rgba(15, 23, 42, 0.25);
    position: relative;
    z-index: 1;
    padding: 24px;
    height: auto;
    align-self: stretch;
}

.cv-elegant-sidebar-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-top: 20px;
    margin-top: 240px; // Más espacio para que el header no cubra las secciones del sidebar
}

// FOTO: contenedor blanco con foto que se superpone al sidebar
.cv-elegant-photo-wrapper {
    position: relative;
    width: 140px;
    height: 140px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
}

.cv-elegant-profile-photo {
    border: 4px solid white;
    border-radius: 50%;
    overflow: hidden;
    width: 120px;
    height: 120px;
    flex-shrink: 0;
    background: #fff;
}

.cv-elegant-profile-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

// Secciones del sidebar
.cv-elegant-sidebar-section {
    margin-bottom: 20px;
}

.cv-elegant-sidebar-title {
    color: gray !important;
    font-size: var(--size-subtitle, 14px);
    font-family: var(--font-secondary, var(--font-headings, 'Patua One', 'Arial', sans-serif));
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 16px 0;
}

// Competencias e idiomas en sidebar
.cv-elegant-sidebar-competences,
.cv-elegant-sidebar-languages {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.cv-elegant-sidebar-competence-item,
.cv-elegant-sidebar-language-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.cv-elegant-sidebar-competence-name,
.cv-elegant-sidebar-language-name {
    color: white;
    font-size: var(--size-paragraph, 14px);
    font-family: var(--font-primary, var(--font-base, 'Saira', 'Arial', sans-serif));
    font-weight: 400;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
}

.cv-elegant-sidebar-progress-bar {
    width: 100%;
    height: 6px;
    background: white ;
    overflow: hidden;
}

.cv-elegant-sidebar-progress-fill {
    height: 100%;
    background: v-bind(elegantColor);
    border-radius: 3px;
    transition: width 0.3s ease;
}

// Hobbies en sidebar
.cv-elegant-sidebar-hobbies {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.cv-elegant-sidebar-hobby-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    font-size: var(--size-paragraph, 14px);
    font-family: var(--font-primary, var(--font-base, 'Saira', 'Arial', sans-serif));
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;

    span {
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
    }
}

.cv-elegant-sidebar-hobby-bullet {
    width: 8px;
    height: 8px;
    background: v-bind(elegantColor);
    flex-shrink: 0;
    display: block;
}

// Contenedor principal de la tarjeta
.cv-elegant-main {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    position: relative;
    margin-left: -110px; // solapamiento con la barra oscura
    padding-left: 110px;
    z-index: 2;
}

.cv-elegant-card {
    background: #ffffff;
    border-radius: 0;
    box-shadow: 0 32px 60px rgba(15, 23, 42, 0.18);
    padding: 44px 52px 54px;
    width: 100%;
    max-width: 100%;
    overflow: visible;
    height: auto;
    flex: 1;
    min-width: 0;
}

// HEADER: franja teal superior que se superpone al sidebar
.cv-elegant-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    background: v-bind(elegantColor);
    border-radius: 0;
    padding: 30px 38px 40px 38px; // Padding simétrico para centrar el contenido
    box-shadow: 0 24px 48px v-bind(elegantColorRgba);
    margin-bottom: 48px;
    margin-left: -287px; // Se extiende hasta donde empieza el texto de competencias (24px desde el borde del sidebar)
    width: calc(100% + 287px); // Compensa el margin negativo
    z-index: 10;
    min-height: 180px; // Altura mínima para dar más espacio a la imagen
    
}

// INFO (nombre y datos de contacto)
.cv-elegant-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    flex: 1;
    text-align: center;
}

.cv-elegant-info h1 {
    font-size: var(--size-title, 36px);
    font-family: var(--font-secondary, var(--font-headings, 'Patua One', 'Arial', sans-serif));
    color: white !important;
    margin: 0;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    line-height: 1.05;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
}

// Contacto con iconos en header teal
.cv-elegant-contact {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
}

.cv-elegant-contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
    font-size: var(--size-paragraph, 15px);
    font-family: var(--font-primary, var(--font-base, 'Saira', 'Arial', sans-serif));
    font-weight: 400;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;

    i {
        font-size: 16px;
        width: 20px;
    flex-shrink: 0;
    }

    span {
        min-width: 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
    }
}

// Secciones
.cv-elegant-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
}

.cv-elegant-section-title {
    display: inline-block;
    width: fit-content;
    background: v-bind(elegantColor);
    color: white !important;
    font-size: var(--size-subtitle, 14px);
    font-family: var(--font-secondary, var(--font-headings, 'Patua One', 'Arial', sans-serif));
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 16px 0;
    padding: 10px 20px;
    white-space: nowrap;
}

.cv-elegant-section-text {
    color: #1f2937;
    line-height: 1.7;
    font-size: var(--size-paragraph, 14px);
    font-family: var(--font-primary, var(--font-base, 'Saira', 'Arial', sans-serif));
    font-weight: 400;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;

    :deep(p) {
        margin: 0 0 0.85rem 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;

        &:last-child {
            margin-bottom: 0;
        }
    }
}

// Items (experiencia / educación)
.cv-elegant-item {
    padding-bottom: 1.3rem;
    margin-bottom: 1.3rem;
    border-bottom: 1px solid #e6e8eb;

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 0;
    }
}

.cv-elegant-item-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 8px;

    > div {
        min-width: 0;
        flex: 1;
    }
}

.cv-elegant-item-title {
    font-size: var(--size-subtitle, 16px);
    font-family: var(--font-secondary, var(--font-headings, 'Patua One', 'Arial', sans-serif));
    font-weight: 700;
    color: #1f2937 !important;
    margin: 0;
    line-height: 1.3;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
}

.cv-elegant-item-date {
    font-size: var(--size-paragraph, 13px);
    font-family: var(--font-primary, var(--font-base, 'Saira', 'Arial', sans-serif));
    color: #6b7280;
    font-weight: 400;
    white-space: nowrap;
    flex-shrink: 0;
}

.cv-elegant-item-meta {
    font-size: var(--size-paragraph, 14px);
    font-family: var(--font-primary, var(--font-base, 'Saira', 'Arial', sans-serif));
    color: #4b5563;
    font-weight: 400;
    margin-bottom: 8px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
}

.cv-elegant-item-description {
    color: #1f2937;
    line-height: 1.7;
    font-size: var(--size-paragraph, 14px);
    font-family: var(--font-primary, var(--font-base, 'Saira', 'Arial', sans-serif));
    margin-top: 8px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;

    :deep(p) {
        margin: 0 0 0.55rem 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;

        &:last-child {
            margin-bottom: 0;
        }
    }
}

// Ajustes responsive
@media (max-width: 1080px) {
    .cv-elegant-container {
        padding: 56px 0 64px;
    }

    .cv-elegant-main {
        margin-left: -100px;
        padding-left: 100px;
    }

    .cv-elegant-card {
        max-width: 600px;
        padding: 44px 48px 52px;
    }

    .cv-elegant-header {
        gap: 28px;
        padding: 28px 34px;
    }
}

@media (max-width: 860px) {
    .cv-elegant-container {
        flex-direction: column;
        align-items: center;
        padding: 48px 24px 56px;
        gap: 32px;
    }

    .cv-elegant-sidebar {
        width: 100%;
        border-radius: 0;
        padding: 24px;
    }

    .cv-elegant-sidebar-content {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 24px;
        justify-content: center;
        margin-top: 0; // Sin espacio para la foto en responsive
    }

    .cv-elegant-sidebar-section {
        flex: 1;
        min-width: 200px;
    }

    .cv-elegant-main {
        margin-left: 0;
        padding-left: 0;
        width: 100%;
    }

    .cv-elegant-card {
        max-width: 100%;
    }

    .cv-elegant-header {
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        padding: 30px 38px;
        margin-left: 0; // Sin superposición en responsive
        width: 100%; // Ancho normal en responsive
    }

    .cv-elegant-photo-wrapper {
        position: static;
        left: auto;
        top: auto;
        transform: none;
        margin: 0 auto 20px;
    }

    .cv-elegant-info h1 {
        font-size: 30px;
    }
}

@media (max-width: 540px) {
    .cv-elegant-card {
        padding: 32px 28px 40px;
    }

    .cv-elegant-header {
        gap: 20px;
        padding: 24px;
        margin-left: 0;
        width: 100%;
    }

    .cv-elegant-sidebar-content {
        flex-direction: column;
        margin-top: 0;
    }
    
    .cv-elegant-photo-wrapper {
        width: 120px;
        height: 120px;
        position: static;
        left: auto;
        top: auto;
        transform: none;
        margin: 0 auto 20px;
    }

    .cv-elegant-profile-photo {
        width: 100px;
        height: 100px;
    }

    .cv-elegant-info h1 {
        font-size: 26px;
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

// ========== TEMPLATE GRIS OSCURO ==========
.cv-content-dark {
    background: white;
}

.cv-header-dark {
    background: v-bind(darkGrayColor);
    padding: 2rem;
    
    .cv-header-top-dark {
        display: flex;
        gap: 2rem;
        align-items: center;
        margin-bottom: 2rem;
        
        .cv-photo-section-dark {
            flex-shrink: 0;
            
            .cv-photo-dark {
                width: 190px;
                height: 190px;
                object-fit: cover;
                background: white;
                border: none;
                border-radius: 0;
                padding: 4px;
            }
        }
        
        .cv-name-section-dark {
            flex: 1;
            
            .cv-name-dark {
                font-size: 2.2rem;
                font-weight: 700;
                color: white !important;
                margin: 0;
                line-height: 1.2;
            }
            
            .cv-lastname-dark {
                font-size: 2.8rem;
                font-weight: 700;
                color: white !important;
                margin: 0;
                line-height: 1.2;
            }
            
            .cv-job-title-dark {
                font-size: 1.4rem;
                font-weight: 400;
                color: red !important;
                margin: 0.5rem 0 0 0;
            }
        }
    }
    
    .cv-header-bottom-dark {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        
        .cv-profile-section-dark {
            flex: 1;
            min-width: 0;
            
            .cv-profile-title-dark {
                font-size: 1.1rem;
                font-weight: 700;
                color: white !important;
                margin: 0 0 0.75rem 0;
                text-transform: uppercase;
            }
            
            .cv-profile-content-dark {
                color: white;
                line-height: 1.7;
                text-align: justify;
                word-wrap: break-word;
                word-break: break-word;
                overflow-wrap: break-word;
                
                :deep(p) {
                    margin: 0 0 0.75rem 0;
                    color: white;
                    word-wrap: break-word;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
        
        .cv-contact-info-dark {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            
            .contact-item-dark {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                color: white;
                font-size: 0.9rem;
                word-wrap: break-word;
                word-break: break-word;
                
                i {
                    color: #E74C3C;
                    width: 16px;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                    margin-top: 0.1rem;
                }
                
                span {
                    flex: 1;
                    min-width: 0;
                    line-height: 1.4;
                    color: white;
                }
            }
        }
    }
}

.cv-body-dark {
    display: flex;
    gap: 2rem;
    padding: 2rem;
    
    .cv-left-column-dark {
        flex: 2;
    }
    
    .cv-right-column-dark {
        flex: 1;
    }
}

.cv-section-dark {
    margin-bottom: 2rem;
    
    .cv-section-title-dark {
        background: v-bind(darkGrayColor);
        color: white !important;
        font-size: 1.1rem;
        font-weight: 700;
        text-align: center;
        padding: 0.75rem 1rem;
        margin: 0 0 1rem 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .cv-section-content-dark {
        background: white;
        padding: 1rem;
        color: #333333;
        line-height: 1.7;
        text-align: justify;
        
        :deep(p) {
            margin: 0 0 0.75rem 0;
            
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}

.cv-item-dark {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;
    
    &:last-child {
        margin-bottom: 0;
    }
    
    .cv-check-icon-dark {
        color: #E74C3C;
        font-size: 0.9rem;
        margin-top: 0.25rem;
        flex-shrink: 0;
    }
    
    .cv-item-content-dark {
        flex: 1;
        min-width: 0;
    }
    
    .cv-item-header-dark {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.5rem;
        gap: 1rem;
        
        .cv-item-title-dark {
            font-size: 1rem;
            font-weight: 700;
            color: #333333 !important;
            margin: 0;
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            flex: 1;
            min-width: 0;
        }
        
        .cv-item-date-dark {
            font-size: 0.9rem;
            color: #333333;
            font-weight: 400;
            white-space: nowrap;
            flex-shrink: 0;
        }
    }
    
    .cv-item-degree-dark {
        font-size: 0.95rem;
        color: #333333;
        font-weight: 400;
        margin: 0.25rem 0 0.5rem 0;
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
    }
    
    .cv-item-description-dark {
        color: #333333;
        line-height: 1.7;
        margin-top: 0.5rem;
        text-align: justify;
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
        
        :deep(p) {
            margin: 0 0 0.5rem 0;
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}

.cv-competence-item-dark {
    padding: 0.75rem 0;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    
    &:last-child {
        margin-bottom: 0;
    }
    
    .competence-name-dark {
        font-size: 0.9rem;
        color: #333333;
        font-weight: 400;
        min-width: 80px;
        flex-shrink: 0;
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
    }
    
    .competence-progress-dark {
        flex: 1;
        height: 12px;
        background: #BBBBBB;
        border-radius: 6px;
        overflow: hidden;
        position: relative;
        min-width: 150px;
        
        .progress-bar-dark {
            height: 100%;
            background: #E74C3C;
            border-radius: 6px;
            transition: width 0.3s ease;
        }
    }
}

.cv-skill-item-dark {
    padding: 0.75rem 0;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    
    &:last-child {
        margin-bottom: 0;
    }
    
    .skill-name-dark {
        font-size: 0.9rem;
        color: #333333;
        font-weight: 400;
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
        flex: 1;
        min-width: 0;
    }
    
    .skill-rating-dark {
        display: flex;
        gap: 0.4rem;
        flex-shrink: 0;
        
        .skill-dot-dark {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #BBBBBB;
            display: inline-block;
            
            &.skill-dot-filled-dark {
                background: #E74C3C;
            }
        }
    }
}

.cv-languages-list-dark {
    background: white;
    padding: 1rem;
}

.cv-language-item-dark {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    
    &:last-child {
        margin-bottom: 0;
    }
    
    .cv-check-icon-dark {
        color: #E74C3C;
        font-size: 0.9rem;
        flex-shrink: 0;
    }
    
    .cv-language-name-dark {
        font-size: 0.9rem;
        color: #333333;
        font-weight: 400;
    }
}

// Estilos para el dropdown de colores en el toolbar
.cv-color-btn-wrapper {
    position: relative;
    
    .cv-color-dropdown {
        position: absolute;
        bottom: calc(100% + 0.5rem);
        right: 0;
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        min-width: 300px;
        max-height: 400px;
        overflow-y: auto;
        
        .cv-color-empty {
            padding: 1.5rem;
            text-align: center;
            color: #6c757d;
        }
        
        .cv-color-list {
            padding: 0.5rem;
        }
        
        .cv-color-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s;
            
            &:hover {
                background-color: #f8f9fa;
            }
            
            .cv-color-preview {
                display: flex;
                align-items: center;
                
                .cv-color-dot {
                    width: 30px;
                    height: 30px;
                    border-radius: 4px;
                    border: 1px solid #dee2e6;
                }
            }
            
            .cv-color-name {
                font-size: 0.95rem;
                font-weight: 500;
                color: #333;
            }
        }
    }
}

// Responsive para template dark
@media (max-width: 768px) {
    .cv-header-dark {
        .cv-header-top-dark {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        
        .cv-header-bottom-dark {
            flex-direction: column;
            gap: 1rem;
        }
    }
    
    .cv-body-dark {
        flex-direction: column;
    }
    
    .cv-color-btn-wrapper {
        .cv-color-dropdown {
            min-width: 250px;
            max-width: calc(100vw - 2rem);
            right: 0;
        }
    }
}
</style>
