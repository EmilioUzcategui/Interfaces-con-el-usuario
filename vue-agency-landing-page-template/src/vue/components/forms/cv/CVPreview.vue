<template>
    <div class="cv-preview">
        <!-- Selector de Plantillas -->
        <div class="template-selector mb-3">
            <label class="form-label fw-bold">Seleccionar Plantilla:</label>
            <select v-model="selectedTemplate" class="form-select" @change="applyTemplate">
                <option v-for="template in templates" :key="template.id" :value="template.id">
                    {{ template.name }}
                </option>
            </select>
        </div>

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

            <!-- Template Clásico -->
            <div v-else-if="selectedTemplate === 'classic'" class="cv-content">
                <div class="cv-header-classic">
                    <h1 class="cv-name-classic">{{ fullName }}</h1>
                    <h2 class="cv-job-title-classic" v-if="cvData?.personalInfo?.jobTitle">
                        {{ cvData.personalInfo.jobTitle }}
                    </h2>
                    <div class="cv-contact-info-classic">
                        <span v-if="cvData?.personalInfo?.email">{{ cvData.personalInfo.email }}</span>
                        <span v-if="cvData?.personalInfo?.phone"> | {{ cvData.personalInfo.phone }}</span>
                        <span v-if="fullAddress"> | {{ fullAddress }}</span>
                    </div>
                    <div class="cv-photo-section-classic" v-if="cvData?.personalInfo?.photoBase64">
                        <img :src="cvData.personalInfo.photoBase64" alt="Foto" class="cv-photo-classic">
                    </div>
                </div>

                <div v-if="cvData?.profile" class="cv-section-classic">
                    <h3 class="cv-section-title-classic">PERFIL PROFESIONAL</h3>
                    <div class="cv-section-content-classic" v-html="cvData.profile"></div>
                </div>

                <div v-if="hasExperience" class="cv-section-classic">
                    <h3 class="cv-section-title-classic">EXPERIENCIA PROFESIONAL</h3>
                    <div v-for="(exp, index) in filteredExperience" :key="index" class="cv-item-classic">
                        <h4 class="cv-item-title-classic">{{ exp.position }}</h4>
                        <div class="cv-item-meta-classic">
                            <strong>{{ exp.employer }}</strong>
                            <span v-if="exp.location"> - {{ exp.location }}</span>
                            <span class="cv-item-date-classic">
                                | {{ formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.current) }}
                            </span>
                        </div>
                        <div v-if="exp.description" class="cv-item-description-classic" v-html="exp.description"></div>
                    </div>
                </div>

                <div v-if="hasEducation" class="cv-section-classic">
                    <h3 class="cv-section-title-classic">FORMACIÓN ACADÉMICA</h3>
                    <div v-for="(edu, index) in filteredEducation" :key="index" class="cv-item-classic">
                        <h4 class="cv-item-title-classic">{{ edu.formation }}</h4>
                        <div class="cv-item-meta-classic">
                            <strong>{{ edu.institution }}</strong>
                            <span v-if="edu.location"> - {{ edu.location }}</span>
                            <span class="cv-item-date-classic">
                                | {{ formatDateRange(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear, edu.current) }}
                            </span>
                        </div>
                        <div v-if="edu.description" class="cv-item-description-classic" v-html="edu.description"></div>
                    </div>
                </div>

                <div v-if="cvData?.competences?.length > 0" class="cv-section-classic">
                    <h3 class="cv-section-title-classic">COMPETENCIAS</h3>
                    <div class="cv-competences-classic">
                        <span v-for="(comp, index) in cvData.competences" :key="index" class="cv-competence-badge-classic">
                            {{ comp.name }} ({{ comp.level }})
                        </span>
                    </div>
                </div>

                <div v-if="cvData?.languages?.length > 0" class="cv-section-classic">
                    <h3 class="cv-section-title-classic">IDIOMAS</h3>
                    <div class="cv-languages-classic">
                        <div v-for="(lang, index) in cvData.languages" :key="index" class="cv-language-item-classic">
                            <strong>{{ lang.name }}:</strong> {{ lang.level }}
                        </div>
                    </div>
                </div>

                <div v-if="cvData?.hobbies?.length > 0" class="cv-section-classic">
                    <h3 class="cv-section-title-classic">PASATIEMPOS E INTERESES</h3>
                    <div class="cv-hobbies-classic">
                        {{ cvData.hobbies.join(', ') }}
                    </div>
                </div>
            </div>

            <!-- Template Minimalista -->
            <div v-else-if="selectedTemplate === 'minimal'" class="cv-content">
                <div class="cv-header-minimal">
                    <h1 class="cv-name-minimal">{{ fullName }}</h1>
                    <h2 class="cv-job-title-minimal" v-if="cvData?.personalInfo?.jobTitle">
                        {{ cvData.personalInfo.jobTitle }}
                    </h2>
                    <div class="cv-contact-info-minimal">
                        <span v-if="cvData?.personalInfo?.email">{{ cvData.personalInfo.email }}</span>
                        <span v-if="cvData?.personalInfo?.phone"> · {{ cvData.personalInfo.phone }}</span>
                        <span v-if="fullAddress"> · {{ fullAddress }}</span>
                    </div>
                </div>

                <div v-if="cvData?.profile" class="cv-section-minimal">
                    <h3 class="cv-section-title-minimal">Perfil</h3>
                    <div class="cv-section-content-minimal" v-html="cvData.profile"></div>
                </div>

                <div v-if="hasExperience" class="cv-section-minimal">
                    <h3 class="cv-section-title-minimal">Experiencia</h3>
                    <div v-for="(exp, index) in filteredExperience" :key="index" class="cv-item-minimal">
                        <div class="cv-item-header-minimal">
                            <h4 class="cv-item-title-minimal">{{ exp.position }}</h4>
                            <span class="cv-item-date-minimal">
                                {{ formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.current) }}
                            </span>
                        </div>
                        <div class="cv-item-company-minimal">{{ exp.employer }}<span v-if="exp.location">, {{ exp.location }}</span></div>
                        <div v-if="exp.description" class="cv-item-description-minimal" v-html="exp.description"></div>
                    </div>
                </div>

                <div v-if="hasEducation" class="cv-section-minimal">
                    <h3 class="cv-section-title-minimal">Formación</h3>
                    <div v-for="(edu, index) in filteredEducation" :key="index" class="cv-item-minimal">
                        <div class="cv-item-header-minimal">
                            <h4 class="cv-item-title-minimal">{{ edu.formation }}</h4>
                            <span class="cv-item-date-minimal">
                                {{ formatDateRange(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear, edu.current) }}
                            </span>
                        </div>
                        <div class="cv-item-company-minimal">{{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span></div>
                        <div v-if="edu.description" class="cv-item-description-minimal" v-html="edu.description"></div>
                    </div>
                </div>

                <div v-if="cvData?.competences?.length > 0" class="cv-section-minimal">
                    <h3 class="cv-section-title-minimal">Competencias</h3>
                    <div class="cv-competences-minimal">
                        <span v-for="(comp, index) in cvData.competences" :key="index" class="cv-competence-tag-minimal">
                            {{ comp.name }}
                        </span>
                    </div>
                </div>

                <div v-if="cvData?.languages?.length > 0" class="cv-section-minimal">
                    <h3 class="cv-section-title-minimal">Idiomas</h3>
                    <div class="cv-languages-minimal">
                        <div v-for="(lang, index) in cvData.languages" :key="index" class="cv-language-item-minimal">
                            {{ lang.name }} <span class="language-level-minimal">({{ lang.level }})</span>
                        </div>
                    </div>
                </div>

                <div v-if="cvData?.hobbies?.length > 0" class="cv-section-minimal">
                    <h3 class="cv-section-title-minimal">Intereses</h3>
                    <div class="cv-hobbies-minimal">
                        {{ cvData.hobbies.join(' · ') }}
                    </div>
                </div>
            </div>

            <!-- Template Creativo -->
            <div v-else-if="selectedTemplate === 'creative'" class="cv-content">
                <div class="cv-header-creative">
                    <div class="cv-photo-section-creative" v-if="cvData?.personalInfo?.photoBase64">
                        <img :src="cvData.personalInfo.photoBase64" alt="Foto" class="cv-photo-creative">
                    </div>
                    <div class="cv-header-info-creative">
                        <h1 class="cv-name-creative">{{ fullName }}</h1>
                        <h2 class="cv-job-title-creative" v-if="cvData?.personalInfo?.jobTitle">
                            {{ cvData.personalInfo.jobTitle }}
                        </h2>
                        <div class="cv-contact-info-creative">
                            <div v-if="cvData?.personalInfo?.email" class="contact-item-creative">
                                <i class="fa-solid fa-envelope"></i>
                                <span>{{ cvData.personalInfo.email }}</span>
                            </div>
                            <div v-if="cvData?.personalInfo?.phone" class="contact-item-creative">
                                <i class="fa-solid fa-phone"></i>
                                <span>{{ cvData.personalInfo.phone }}</span>
                            </div>
                            <div v-if="fullAddress" class="contact-item-creative">
                                <i class="fa-solid fa-location-dot"></i>
                                <span>{{ fullAddress }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="cvData?.profile" class="cv-section-creative">
                    <h3 class="cv-section-title-creative">
                        <span class="section-icon-creative">👤</span> Perfil
                    </h3>
                    <div class="cv-section-content-creative" v-html="cvData.profile"></div>
                </div>

                <div v-if="hasExperience" class="cv-section-creative">
                    <h3 class="cv-section-title-creative">
                        <span class="section-icon-creative">💼</span> Experiencia
                    </h3>
                    <div v-for="(exp, index) in filteredExperience" :key="index" class="cv-item-creative">
                        <div class="cv-item-header-creative">
                            <h4 class="cv-item-title-creative">{{ exp.position }}</h4>
                            <span class="cv-item-company-creative">{{ exp.employer }}</span>
                        </div>
                        <div class="cv-item-meta-creative">
                            <span v-if="exp.location">{{ exp.location }}</span>
                            <span class="cv-item-date-creative">
                                {{ formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.current) }}
                            </span>
                        </div>
                        <div v-if="exp.description" class="cv-item-description-creative" v-html="exp.description"></div>
                    </div>
                </div>

                <div v-if="hasEducation" class="cv-section-creative">
                    <h3 class="cv-section-title-creative">
                        <span class="section-icon-creative">🎓</span> Formación
                    </h3>
                    <div v-for="(edu, index) in filteredEducation" :key="index" class="cv-item-creative">
                        <div class="cv-item-header-creative">
                            <h4 class="cv-item-title-creative">{{ edu.formation }}</h4>
                            <span class="cv-item-company-creative">{{ edu.institution }}</span>
                        </div>
                        <div class="cv-item-meta-creative">
                            <span v-if="edu.location">{{ edu.location }}</span>
                            <span class="cv-item-date-creative">
                                {{ formatDateRange(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear, edu.current) }}
                            </span>
                        </div>
                        <div v-if="edu.description" class="cv-item-description-creative" v-html="edu.description"></div>
                    </div>
                </div>

                <div v-if="cvData?.competences?.length > 0" class="cv-section-creative">
                    <h3 class="cv-section-title-creative">
                        <span class="section-icon-creative">⭐</span> Competencias
                    </h3>
                    <div class="cv-competences-creative">
                        <div v-for="(comp, index) in cvData.competences" :key="index" class="cv-competence-item-creative">
                            <span class="competence-name-creative">{{ comp.name }}</span>
                            <span class="competence-level-creative">{{ comp.level }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="cvData?.languages?.length > 0" class="cv-section-creative">
                    <h3 class="cv-section-title-creative">
                        <span class="section-icon-creative">🌐</span> Idiomas
                    </h3>
                    <div class="cv-languages-creative">
                        <div v-for="(lang, index) in cvData.languages" :key="index" class="cv-language-item-creative">
                            <span class="language-name-creative">{{ lang.name }}</span>
                            <span class="language-level-creative">{{ lang.level }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="cvData?.hobbies?.length > 0" class="cv-section-creative">
                    <h3 class="cv-section-title-creative">
                        <span class="section-icon-creative">❤️</span> Pasatiempos
                    </h3>
                    <div class="cv-hobbies-creative">
                        <span v-for="(hobby, index) in cvData.hobbies" :key="index" class="cv-hobby-badge-creative">
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

                        <div v-if="cvData?.competences?.length > 0" class="cv-section-dark">
                            <h3 class="cv-section-title-dark">Habilidades</h3>
                            <div class="cv-section-content-dark">
                                <div v-for="(comp, index) in cvData.competences" :key="index" class="cv-skill-item-dark">
                                    <span class="skill-name-dark">{{ comp.name }}</span>
                                    <div class="skill-rating-dark">
                                        <span v-for="i in 5" :key="i" 
                                              class="skill-dot-dark" 
                                              :class="{ 'skill-dot-filled-dark': i <= getSkillRating(comp.level) }">
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Barra de herramientas con selector de colores -->
        <div class="cv-toolbar" v-if="selectedTemplate === 'dark'">
            <div class="cv-toolbar-content">
                <button 
                    class="btn btn-outline-secondary cv-color-btn" 
                    @click="toggleColorDropdown"
                    type="button">
                    <i class="fa-solid fa-palette me-2"></i>
                    Colores
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
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { loadPalette } from '/src/utils/themeManager.js';

const props = defineProps({
    cvData: {
        type: Object,
        default: () => null
    }
});

const selectedTemplate = ref('modern');

const templates = [
    { id: 'modern', name: 'Moderno' },
    { id: 'classic', name: 'Clásico' },
    { id: 'minimal', name: 'Minimalista' },
    { id: 'creative', name: 'Creativo' },
    { id: 'dark', name: 'Gris Oscuro' }
];

const applyTemplate = () => {
    // El cambio de template se maneja automáticamente con v-if
};

// Variables para el selector de colores
const showColorDropdown = ref(false);
const activePalette = ref(null);
const selectedColor = ref(null);

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
    if (selectedColor.value && selectedColor.value.value) {
        return selectedColor.value.value;
    }
    // Si no hay color seleccionado, usar el color3 de la paleta activa
    if (activePalette.value && activePalette.value[2]) {
        return activePalette.value[2].value;
    }
    return '#333333'; // Color por defecto
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
        'Experto': 100
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
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.cv-preview {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    
    .template-selector {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        
        .form-select {
            border: 2px solid $light-3;
            border-radius: 8px;
            padding: 0.5rem 1rem;
            
            &:focus {
                border-color: var(--secondary-color, #ff5900);
                box-shadow: 0 0 0 0.2rem rgba(255, 89, 0, 0.25);
            }
        }
    }
    
    .cv-preview-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        min-height: 800px;
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

// ========== TEMPLATE CLÁSICO ==========
.cv-header-classic {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 3px solid $dark;
    
    .cv-name-classic {
        font-size: 2.5rem;
        font-weight: 700;
        color: $dark;
        margin: 0 0 0.5rem 0;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    
    .cv-job-title-classic {
        font-size: 1.5rem;
        font-weight: 400;
        color: $text-muted;
        margin: 0 0 1rem 0;
        font-style: italic;
    }
    
    .cv-contact-info-classic {
        font-size: 0.9rem;
        color: $text-muted;
        margin-bottom: 1rem;
    }
    
    .cv-photo-section-classic {
        margin-top: 1rem;
        
        .cv-photo-classic {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid $dark;
        }
    }
}

.cv-section-classic {
    margin-bottom: 2rem;
    
    .cv-section-title-classic {
        font-size: 1.2rem;
        font-weight: 700;
        color: $dark;
        margin-bottom: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 2px solid $dark;
        padding-bottom: 0.5rem;
    }
    
    .cv-section-content-classic {
        color: $dark;
        line-height: 1.8;
        text-align: justify;
    }
}

.cv-item-classic {
    margin-bottom: 1.5rem;
    
    .cv-item-title-classic {
        font-size: 1.1rem;
        font-weight: 600;
        color: $dark;
        margin: 0 0 0.25rem 0;
    }
    
    .cv-item-meta-classic {
        font-size: 0.95rem;
        color: $text-muted;
        margin-bottom: 0.5rem;
        
        .cv-item-date-classic {
            font-style: italic;
        }
    }
    
    .cv-item-description-classic {
        color: $dark;
        line-height: 1.7;
        margin-top: 0.5rem;
        text-align: justify;
    }
}

.cv-competences-classic {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    
    .cv-competence-badge-classic {
        display: inline-block;
        padding: 0.4rem 0.8rem;
        background-color: $light-2;
        border: 1px solid $dark;
        color: $dark;
        font-size: 0.9rem;
    }
}

.cv-languages-classic {
    .cv-language-item-classic {
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
    }
}

.cv-hobbies-classic {
    color: $dark;
    line-height: 1.8;
}

// ========== TEMPLATE MINIMALISTA ==========
.cv-header-minimal {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid $light-3;
    
    .cv-name-minimal {
        font-size: 2rem;
        font-weight: 300;
        color: $dark;
        margin: 0 0 0.25rem 0;
        letter-spacing: 3px;
    }
    
    .cv-job-title-minimal {
        font-size: 1rem;
        font-weight: 300;
        color: $text-muted;
        margin: 0 0 1rem 0;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    
    .cv-contact-info-minimal {
        font-size: 0.85rem;
        color: $text-muted;
        font-weight: 300;
    }
}

.cv-section-minimal {
    margin-bottom: 2.5rem;
    
    .cv-section-title-minimal {
        font-size: 0.9rem;
        font-weight: 400;
        color: $text-muted;
        margin-bottom: 1rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        border-bottom: 1px solid $light-2;
        padding-bottom: 0.5rem;
    }
    
    .cv-section-content-minimal {
        color: $dark;
        line-height: 1.8;
        font-weight: 300;
    }
}

.cv-item-minimal {
    margin-bottom: 2rem;
    
    .cv-item-header-minimal {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 0.25rem;
        
        .cv-item-title-minimal {
            font-size: 1rem;
            font-weight: 400;
            color: $dark;
            margin: 0;
        }
        
        .cv-item-date-minimal {
            font-size: 0.85rem;
            color: $text-muted;
            font-weight: 300;
        }
    }
    
    .cv-item-company-minimal {
        font-size: 0.9rem;
        color: $text-muted;
        font-weight: 300;
        margin-bottom: 0.5rem;
    }
    
    .cv-item-description-minimal {
        color: $dark;
        line-height: 1.8;
        font-weight: 300;
        margin-top: 0.5rem;
    }
}

.cv-competences-minimal {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    
    .cv-competence-tag-minimal {
        display: inline-block;
        padding: 0.3rem 0.6rem;
        background-color: transparent;
        border: 1px solid $light-3;
        color: $dark;
        font-size: 0.85rem;
        font-weight: 300;
    }
}

.cv-languages-minimal {
    .cv-language-item-minimal {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        font-weight: 300;
        
        .language-level-minimal {
            color: $text-muted;
        }
    }
}

.cv-hobbies-minimal {
    color: $dark;
    line-height: 1.8;
    font-weight: 300;
    font-size: 0.9rem;
}

// ========== TEMPLATE CREATIVO ==========
.cv-header-creative {
    background: linear-gradient(135deg, var(--secondary-color, #ff5900) 0%, #ff8c42 100%);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    
    .cv-photo-section-creative {
        flex-shrink: 0;
        
        .cv-photo-creative {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
    }
    
    .cv-header-info-creative {
        flex: 1;
        
        .cv-name-creative {
            font-size: 2.2rem;
            font-weight: 700;
            margin: 0 0 0.5rem 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .cv-job-title-creative {
            font-size: 1.3rem;
            font-weight: 400;
            margin: 0 0 1rem 0;
            opacity: 0.95;
        }
        
        .cv-contact-info-creative {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            
            .contact-item-creative {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9rem;
                opacity: 0.9;
                
                i {
                    width: 16px;
                }
            }
        }
    }
}

.cv-section-creative {
    margin-bottom: 2rem;
    
    .cv-section-title-creative {
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--secondary-color, #ff5900);
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--secondary-color, #ff5900);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        .section-icon-creative {
            font-size: 1.2rem;
        }
    }
    
    .cv-section-content-creative {
        color: $dark;
        line-height: 1.6;
    }
}

.cv-item-creative {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: $light-1;
    border-radius: 8px;
    border-left: 4px solid var(--secondary-color, #ff5900);
    
    .cv-item-header-creative {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.5rem;
        
        .cv-item-title-creative {
            font-size: 1.1rem;
            font-weight: 600;
            color: $dark;
            margin: 0;
        }
        
        .cv-item-company-creative {
            font-size: 1rem;
            font-weight: 500;
            color: var(--secondary-color, #ff5900);
        }
    }
    
    .cv-item-meta-creative {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: $text-muted;
        
        .cv-item-date-creative {
            font-weight: 500;
        }
    }
    
    .cv-item-description-creative {
        color: $dark;
        line-height: 1.6;
        margin-top: 0.5rem;
    }
}

.cv-competences-creative,
.cv-languages-creative {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    
    .cv-competence-item-creative,
    .cv-language-item-creative {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: $light-1;
        border-radius: 8px;
        border-left: 3px solid var(--secondary-color, #ff5900);
    }
}

.cv-hobbies-creative {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    
    .cv-hobby-badge-creative {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, var(--secondary-color, #ff5900) 0%, #ff8c42 100%);
        color: white;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
                color: white;
                margin: 0;
                line-height: 1.2;
            }
            
            .cv-lastname-dark {
                font-size: 2.8rem;
                font-weight: 700;
                color: white;
                margin: 0;
                line-height: 1.2;
            }
            
            .cv-job-title-dark {
                font-size: 1.4rem;
                font-weight: 400;
                color: #E74C3C;
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
                color: white;
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
        color: white;
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
            color: #333333;
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

// ========== BARRA DE HERRAMIENTAS ==========
.cv-toolbar {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    position: relative;
    
    .cv-toolbar-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        position: relative;
    }
    
    .cv-color-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .cv-color-dropdown {
        position: absolute;
        bottom: 100%;
        left: 0;
        margin-bottom: 0.5rem;
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

// Responsive
@media (max-width: 768px) {
    .cv-header-modern,
    .cv-header-creative {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    
    .cv-header-dark {
        flex-direction: column;
        
        .cv-header-info-dark {
            flex-direction: column;
            gap: 1rem;
            
            .cv-contact-info-dark {
                align-items: flex-start;
            }
        }
    }
    
    .cv-body-dark {
        flex-direction: column;
    }
    
    .cv-toolbar {
        .cv-color-dropdown {
            min-width: 250px;
            max-width: 100%;
        }
    }
}
</style>
