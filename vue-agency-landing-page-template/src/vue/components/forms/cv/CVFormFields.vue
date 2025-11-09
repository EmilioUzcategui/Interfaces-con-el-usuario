<template>
    <div class="cv-form-fields">
        <!-- Error Message -->
        <Alert v-if="errorMessage"
               variant="danger"
               :message="errorMessage"/>

        <!-- Success Message -->
        <Alert v-if="successMessage"
               variant="success"
               :message="successMessage"/>

        <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
            <!-- Datos Personales -->
            <div class="form-section">
                <h3 class="section-title">
                    <i class="fa-solid fa-user me-2"></i>
                    Datos Personales
                </h3>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="firstName" class="form-label">Nombre *</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="firstName" 
                            v-model="form.personalInfo.firstName"
                            :class="{ 'is-invalid': errors.personalInfo?.firstName }"
                            @input="validateField('personalInfo', 'firstName')"
                            @blur="validateField('personalInfo', 'firstName')"
                            required
                        >
                        <div v-if="errors.personalInfo?.firstName" class="invalid-feedback">
                            {{ errors.personalInfo.firstName }}
                        </div>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="lastName" class="form-label">Apellidos *</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="lastName" 
                            v-model="form.personalInfo.lastName"
                            :class="{ 'is-invalid': errors.personalInfo?.lastName }"
                            @input="validateField('personalInfo', 'lastName')"
                            @blur="validateField('personalInfo', 'lastName')"
                            required
                        >
                        <div v-if="errors.personalInfo?.lastName" class="invalid-feedback">
                            {{ errors.personalInfo.lastName }}
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="jobTitle" class="form-label">Puesto de Trabajo Deseado *</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="jobTitle" 
                            v-model="form.personalInfo.jobTitle"
                            :class="{ 'is-invalid': errors.personalInfo?.jobTitle }"
                            @input="validateField('personalInfo', 'jobTitle')"
                            @blur="validateField('personalInfo', 'jobTitle')"
                            required
                        >
                        <div v-if="errors.personalInfo?.jobTitle" class="invalid-feedback">
                            {{ errors.personalInfo.jobTitle }}
                        </div>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Correo Electrónico *</label>
                        <input 
                            type="email" 
                            class="form-control" 
                            id="email" 
                            v-model="form.personalInfo.email"
                            :class="{ 'is-invalid': errors.personalInfo?.email }"
                            @input="validateField('personalInfo', 'email')"
                            @blur="validateField('personalInfo', 'email')"
                            required
                        >
                        <div v-if="errors.personalInfo?.email" class="invalid-feedback">
                            {{ errors.personalInfo.email }}
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="phone" class="form-label">Teléfono *</label>
                        <input 
                            type="tel" 
                            class="form-control" 
                            id="phone" 
                            v-model="form.personalInfo.phone"
                            :class="{ 'is-invalid': errors.personalInfo?.phone }"
                            @input="validateField('personalInfo', 'phone')"
                            @blur="validateField('personalInfo', 'phone')"
                            required
                        >
                        <div v-if="errors.personalInfo?.phone" class="invalid-feedback">
                            {{ errors.personalInfo.phone }}
                        </div>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="address" class="form-label">Dirección *</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="address" 
                            v-model="form.personalInfo.address"
                            :class="{ 'is-invalid': errors.personalInfo?.address }"
                            @input="validateField('personalInfo', 'address')"
                            @blur="validateField('personalInfo', 'address')"
                            required
                        >
                        <div v-if="errors.personalInfo?.address" class="invalid-feedback">
                            {{ errors.personalInfo.address }}
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="postalCode" class="form-label">Código Postal *</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="postalCode" 
                            v-model="form.personalInfo.postalCode"
                            :class="{ 'is-invalid': errors.personalInfo?.postalCode }"
                            @input="validateField('personalInfo', 'postalCode')"
                            @blur="validateField('personalInfo', 'postalCode')"
                            required
                        >
                        <div v-if="errors.personalInfo?.postalCode" class="invalid-feedback">
                            {{ errors.personalInfo.postalCode }}
                        </div>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="city" class="form-label">Localidad *</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="city" 
                            v-model="form.personalInfo.city"
                            :class="{ 'is-invalid': errors.personalInfo?.city }"
                            @input="validateField('personalInfo', 'city')"
                            @blur="validateField('personalInfo', 'city')"
                            required
                        >
                        <div v-if="errors.personalInfo?.city" class="invalid-feedback">
                            {{ errors.personalInfo.city }}
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="photo" class="form-label">Foto de la Persona</label>
                    <input 
                        type="file" 
                        class="form-control" 
                        id="photo" 
                        accept="image/*"
                        @change="handlePhotoChange"
                    >
                    <div v-if="photoPreview" class="mt-2">
                        <img :src="photoPreview" alt="Preview" class="photo-preview">
                    </div>
                </div>
            </div>

            <!-- Perfil -->
            <div class="form-section">
                <h3 class="section-title">
                    <i class="fa-solid fa-id-card me-2"></i>
                    Perfil
                </h3>
                
                <div class="mb-3">
                    <label for="profile" class="form-label">Descripción de la Persona *</label>
                    <WYSIWYGEditor
                        v-model="form.profile"
                        :min-height="200"
                        placeholder="Describe tu perfil profesional..."
                    />
                    <div v-if="errors.profile" class="invalid-feedback d-block">
                        {{ errors.profile }}
                    </div>
                </div>
            </div>

            <!-- Formación -->
            <div class="form-section">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="section-title mb-0">
                        <i class="fa-solid fa-graduation-cap me-2"></i>
                        Formación
                    </h3>
                    <button type="button" class="btn btn-sm btn-outline-primary" @click="addEducation">
                        <i class="fa-solid fa-plus me-1"></i>
                        Agregar Formación
                    </button>
                </div>

                <div v-for="(edu, index) in form.education" :key="index" class="education-entry mb-4 p-3 border rounded">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="mb-0">Formación {{ index + 1 }}</h5>
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removeEducation(index)" v-if="form.education.length > 1">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label :for="`edu-formation-${index}`" class="form-label">Formación *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :id="`edu-formation-${index}`"
                                v-model="edu.formation"
                                :class="{ 'is-invalid': errors.education?.[index]?.formation }"
                                @input="validateEducation(index)"
                                @blur="validateEducation(index)"
                                required
                            >
                            <div v-if="errors.education?.[index]?.formation" class="invalid-feedback">
                                {{ errors.education[index].formation }}
                            </div>
                        </div>

                        <div class="col-md-4 mb-3">
                            <label :for="`edu-institution-${index}`" class="form-label">Institución *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :id="`edu-institution-${index}`"
                                v-model="edu.institution"
                                :class="{ 'is-invalid': errors.education?.[index]?.institution }"
                                @input="validateEducation(index)"
                                @blur="validateEducation(index)"
                                required
                            >
                            <div v-if="errors.education?.[index]?.institution" class="invalid-feedback">
                                {{ errors.education[index].institution }}
                            </div>
                        </div>

                        <div class="col-md-4 mb-3">
                            <label :for="`edu-location-${index}`" class="form-label">Localidad *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :id="`edu-location-${index}`"
                                v-model="edu.location"
                                :class="{ 'is-invalid': errors.education?.[index]?.location }"
                                @input="validateEducation(index)"
                                @blur="validateEducation(index)"
                                required
                            >
                            <div v-if="errors.education?.[index]?.location" class="invalid-feedback">
                                {{ errors.education[index].location }}
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-3 mb-3">
                            <label :for="`edu-start-month-${index}`" class="form-label">Mes Inicio</label>
                            <select 
                                class="form-select" 
                                :id="`edu-start-month-${index}`"
                                v-model="edu.startMonth"
                            >
                                <option value="">Selecciona</option>
                                <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
                            </select>
                        </div>

                        <div class="col-md-3 mb-3">
                            <label :for="`edu-start-year-${index}`" class="form-label">Año Inicio *</label>
                            <select 
                                class="form-select" 
                                :id="`edu-start-year-${index}`"
                                v-model="edu.startYear"
                                :class="{ 'is-invalid': errors.education?.[index]?.startYear }"
                                @change="validateEducation(index)"
                                required
                            >
                                <option value="">Selecciona</option>
                                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                            </select>
                            <div v-if="errors.education?.[index]?.startYear" class="invalid-feedback">
                                {{ errors.education[index].startYear }}
                            </div>
                        </div>

                        <div class="col-md-3 mb-3">
                            <label :for="`edu-end-month-${index}`" class="form-label">Mes Fin</label>
                            <select 
                                class="form-select" 
                                :id="`edu-end-month-${index}`"
                                v-model="edu.endMonth"
                            >
                                <option value="">Selecciona</option>
                                <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
                            </select>
                        </div>

                        <div class="col-md-3 mb-3">
                            <label :for="`edu-end-year-${index}`" class="form-label">Año Fin</label>
                            <select 
                                class="form-select" 
                                :id="`edu-end-year-${index}`"
                                v-model="edu.endYear"
                            >
                                <option value="">Selecciona</option>
                                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                            </select>
                            <div class="form-check mt-2">
                                <input 
                                    class="form-check-input" 
                                    type="checkbox" 
                                    :id="`edu-current-${index}`"
                                    v-model="edu.current"
                                    @change="edu.current ? (edu.endMonth = '', edu.endYear = '') : null"
                                >
                                <label class="form-check-label" :for="`edu-current-${index}`">
                                    En curso
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label :for="`edu-description-${index}`" class="form-label">Descripción de la Formación</label>
                        <WYSIWYGEditor
                            v-model="edu.description"
                            :min-height="150"
                            placeholder="Describe tu formación..."
                        />
                    </div>
                </div>
            </div>

            <!-- Experiencia -->
            <div class="form-section">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="section-title mb-0">
                        <i class="fa-solid fa-briefcase me-2"></i>
                        Experiencia
                    </h3>
                    <button type="button" class="btn btn-sm btn-outline-primary" @click="addExperience">
                        <i class="fa-solid fa-plus me-1"></i>
                        Agregar Experiencia
                    </button>
                </div>

                <div v-for="(exp, index) in form.experience" :key="index" class="experience-entry mb-4 p-3 border rounded">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="mb-0">Experiencia {{ index + 1 }}</h5>
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removeExperience(index)" v-if="form.experience.length > 1">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label :for="`exp-position-${index}`" class="form-label">Puesto *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :id="`exp-position-${index}`"
                                v-model="exp.position"
                                :class="{ 'is-invalid': errors.experience?.[index]?.position }"
                                @input="validateExperience(index)"
                                @blur="validateExperience(index)"
                                required
                            >
                            <div v-if="errors.experience?.[index]?.position" class="invalid-feedback">
                                {{ errors.experience[index].position }}
                            </div>
                        </div>

                        <div class="col-md-4 mb-3">
                            <label :for="`exp-employer-${index}`" class="form-label">Empleador *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :id="`exp-employer-${index}`"
                                v-model="exp.employer"
                                :class="{ 'is-invalid': errors.experience?.[index]?.employer }"
                                @input="validateExperience(index)"
                                @blur="validateExperience(index)"
                                required
                            >
                            <div v-if="errors.experience?.[index]?.employer" class="invalid-feedback">
                                {{ errors.experience[index].employer }}
                            </div>
                        </div>

                        <div class="col-md-4 mb-3">
                            <label :for="`exp-location-${index}`" class="form-label">Localidad *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :id="`exp-location-${index}`"
                                v-model="exp.location"
                                :class="{ 'is-invalid': errors.experience?.[index]?.location }"
                                @input="validateExperience(index)"
                                @blur="validateExperience(index)"
                                required
                            >
                            <div v-if="errors.experience?.[index]?.location" class="invalid-feedback">
                                {{ errors.experience[index].location }}
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-3 mb-3">
                            <label :for="`exp-start-month-${index}`" class="form-label">Mes Inicio</label>
                            <select 
                                class="form-select" 
                                :id="`exp-start-month-${index}`"
                                v-model="exp.startMonth"
                            >
                                <option value="">Selecciona</option>
                                <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
                            </select>
                        </div>

                        <div class="col-md-3 mb-3">
                            <label :for="`exp-start-year-${index}`" class="form-label">Año Inicio *</label>
                            <select 
                                class="form-select" 
                                :id="`exp-start-year-${index}`"
                                v-model="exp.startYear"
                                :class="{ 'is-invalid': errors.experience?.[index]?.startYear }"
                                @change="validateExperience(index)"
                                required
                            >
                                <option value="">Selecciona</option>
                                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                            </select>
                            <div v-if="errors.experience?.[index]?.startYear" class="invalid-feedback">
                                {{ errors.experience[index].startYear }}
                            </div>
                        </div>

                        <div class="col-md-3 mb-3">
                            <label :for="`exp-end-month-${index}`" class="form-label">Mes Fin</label>
                            <select 
                                class="form-select" 
                                :id="`exp-end-month-${index}`"
                                v-model="exp.endMonth"
                            >
                                <option value="">Selecciona</option>
                                <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
                            </select>
                        </div>

                        <div class="col-md-3 mb-3">
                            <label :for="`exp-end-year-${index}`" class="form-label">Año Fin</label>
                            <select 
                                class="form-select" 
                                :id="`exp-end-year-${index}`"
                                v-model="exp.endYear"
                            >
                                <option value="">Selecciona</option>
                                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                            </select>
                            <div class="form-check mt-2">
                                <input 
                                    class="form-check-input" 
                                    type="checkbox" 
                                    :id="`exp-current-${index}`"
                                    v-model="exp.current"
                                    @change="exp.current ? (exp.endMonth = '', exp.endYear = '') : null"
                                >
                                <label class="form-check-label" :for="`exp-current-${index}`">
                                    Trabajo actual
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label :for="`exp-description-${index}`" class="form-label">Descripción de la Experiencia</label>
                        <WYSIWYGEditor
                            v-model="exp.description"
                            :min-height="150"
                            placeholder="Describe tus responsabilidades y logros..."
                        />
                    </div>
                </div>
            </div>

            <!-- Competencias -->
            <div class="form-section">
                <h3 class="section-title">
                    <i class="fa-solid fa-star me-2"></i>
                    Competencias
                </h3>
                
                <div class="competence-input mb-3 p-3 border rounded">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="competence-name" class="form-label">Habilidad</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="competence-name"
                                v-model="competenceInput.name"
                                placeholder="Ej: JavaScript, Vue.js..."
                            >
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="competence-level" class="form-label">Nivel</label>
                            <select 
                                class="form-select" 
                                id="competence-level"
                                v-model="competenceInput.level"
                            >
                                <option value="">Selecciona un nivel</option>
                                <option value="Básico">Básico</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                                <option value="Experto">Experto</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-primary" @click="addCompetence">
                            <i class="fa-solid fa-plus me-1"></i>
                            Agregar Competencia
                        </button>
                        <button type="button" class="btn btn-outline-secondary" @click="clearCompetenceInput">
                            <i class="fa-solid fa-eraser me-1"></i>
                            Limpiar Campos
                        </button>
                    </div>
                </div>

                <div v-if="form.competences.length > 0" class="competences-list">
                    <div v-for="(comp, index) in form.competences" :key="index" class="competence-item mb-2 p-2 border rounded d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{{ comp.name }}</strong> - <span class="text-muted">{{ comp.level }}</span>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removeCompetence(index)">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Idiomas -->
            <div class="form-section">
                <h3 class="section-title">
                    <i class="fa-solid fa-language me-2"></i>
                    Idiomas
                </h3>
                
                <div class="language-input mb-3 p-3 border rounded">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="language-name" class="form-label">Idioma</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="language-name"
                                v-model="languageInput.name"
                                placeholder="Ej: Inglés, Francés..."
                            >
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="language-level" class="form-label">Nivel</label>
                            <select 
                                class="form-select" 
                                id="language-level"
                                v-model="languageInput.level"
                            >
                                <option value="">Selecciona un nivel</option>
                                <option value="Básico">Básico</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                                <option value="Nativo">Nativo</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-primary" @click="addLanguage">
                            <i class="fa-solid fa-plus me-1"></i>
                            Agregar Idioma
                        </button>
                        <button type="button" class="btn btn-outline-secondary" @click="clearLanguageInput">
                            <i class="fa-solid fa-eraser me-1"></i>
                            Limpiar Campos
                        </button>
                    </div>
                </div>

                <div v-if="form.languages.length > 0" class="languages-list">
                    <div v-for="(lang, index) in form.languages" :key="index" class="language-item mb-2 p-2 border rounded d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{{ lang.name }}</strong> - <span class="text-muted">{{ lang.level }}</span>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removeLanguage(index)">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Pasatiempos e Intereses -->
            <div class="form-section">
                <h3 class="section-title">
                    <i class="fa-solid fa-heart me-2"></i>
                    Pasatiempos e Intereses
                </h3>
                
                <div class="hobby-input mb-3 p-3 border rounded">
                    <div class="row">
                        <div class="col-md-8 mb-3">
                            <label for="hobby-name" class="form-label">Pasatiempo</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="hobby-name"
                                v-model="hobbyInput"
                                placeholder="Ej: Lectura, Deportes, Música..."
                            >
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-primary" @click="addHobby">
                            <i class="fa-solid fa-plus me-1"></i>
                            Agregar Pasatiempo
                        </button>
                    </div>
                </div>

                <div v-if="form.hobbies.length > 0" class="hobbies-list">
                    <div v-for="(hobby, index) in form.hobbies" :key="index" class="hobby-item mb-2 p-2 border rounded d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{{ hobby }}</strong>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removeHobby(index)">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="d-grid mt-4">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-if="!loading" class="fa-solid fa-save me-2"></i>
                    {{ loading ? 'Guardando...' : 'Guardar CV' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, computed, inject, watch } from 'vue';
import Alert from "/src/vue/components/widgets/Alert.vue";
import WYSIWYGEditor from "/src/vue/components/forms/cv/WYSIWYGEditor.vue";

const props = defineProps({
    errorMessage: {
        type: String,
        default: null
    },
    successMessage: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['submit', 'update:formData']);

const setSpinnerEnabled = inject("setSpinnerEnabled", null);
const spinnerEnabled = inject("spinnerEnabled", ref(false));

const loading = ref(false);

// Sincronizar loading con spinnerEnabled
if (spinnerEnabled) {
    watch(() => spinnerEnabled.value, (newVal) => {
        loading.value = newVal || false;
    }, { immediate: true });
}

// Generar años (desde 1950 hasta el año actual + 5)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1950 + 6 }, (_, i) => 1950 + i).reverse();

const months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
];

const form = reactive({
    personalInfo: {
        firstName: '',
        lastName: '',
        jobTitle: '',
        email: '',
        phone: '',
        address: '',
        postalCode: '',
        city: '',
        photo: null
    },
    profile: '',
    education: [{
        formation: '',
        institution: '',
        location: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        current: false,
        description: ''
    }],
    experience: [{
        position: '',
        employer: '',
        location: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        current: false,
        description: ''
    }],
    competences: [],
    languages: [],
    hobbies: []
});

const errors = reactive({
    personalInfo: {},
    profile: null,
    education: [],
    experience: [],
    competences: null
});

const photoPreview = ref(null);
const competenceInput = reactive({
    name: '',
    level: ''
});

const languageInput = reactive({
    name: '',
    level: ''
});

const hobbyInput = ref('');

const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.personalInfo.photo = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const validateField = (section, field = null) => {
    if (section === 'personalInfo' && field) {
        delete errors.personalInfo[field];
        
        switch (field) {
            case 'firstName':
                if (!form.personalInfo.firstName.trim()) {
                    errors.personalInfo.firstName = 'El nombre es requerido';
                } else if (/\d/.test(form.personalInfo.firstName)) {
                    errors.personalInfo.firstName = 'El nombre no puede contener números';
                }
                break;
            case 'lastName':
                if (!form.personalInfo.lastName.trim()) {
                    errors.personalInfo.lastName = 'Los apellidos son requeridos';
                } else if (/\d/.test(form.personalInfo.lastName)) {
                    errors.personalInfo.lastName = 'Los apellidos no pueden contener números';
                }
                break;
            case 'jobTitle':
                if (!form.personalInfo.jobTitle.trim()) {
                    errors.personalInfo.jobTitle = 'El puesto de trabajo es requerido';
                }
                break;
            case 'email':
                if (!form.personalInfo.email.trim()) {
                    errors.personalInfo.email = 'El email es requerido';
                } else if (!/\S+@\S+\.\S+/.test(form.personalInfo.email)) {
                    errors.personalInfo.email = 'El email no es válido';
                }
                break;
            case 'phone':
                if (!form.personalInfo.phone.trim()) {
                    errors.personalInfo.phone = 'El teléfono es requerido';
                }
                break;
            case 'address':
                if (!form.personalInfo.address.trim()) {
                    errors.personalInfo.address = 'La dirección es requerida';
                }
                break;
            case 'postalCode':
                if (!form.personalInfo.postalCode.trim()) {
                    errors.personalInfo.postalCode = 'El código postal es requerido';
                }
                break;
            case 'city':
                if (!form.personalInfo.city.trim()) {
                    errors.personalInfo.city = 'La localidad es requerida';
                }
                break;
        }
    } else if (section === 'profile') {
        errors.profile = null;
        if (!form.profile || !form.profile.trim() || form.profile === '<p></p>' || form.profile === '<br>') {
            errors.profile = 'El perfil es requerido';
        }
    }
};

const validateExperience = (index) => {
    if (!errors.experience[index]) {
        errors.experience[index] = {};
    }
    
    const exp = form.experience[index];
    delete errors.experience[index].position;
    delete errors.experience[index].employer;
    delete errors.experience[index].location;
    delete errors.experience[index].startYear;
    
    if (!exp.position.trim()) {
        errors.experience[index].position = 'El puesto es requerido';
    }
    if (!exp.employer.trim()) {
        errors.experience[index].employer = 'El empleador es requerido';
    }
    if (!exp.location.trim()) {
        errors.experience[index].location = 'La localidad es requerida';
    }
    if (!exp.startYear) {
        errors.experience[index].startYear = 'El año de inicio es requerido';
    }
};

const validateEducation = (index) => {
    if (!errors.education[index]) {
        errors.education[index] = {};
    }
    
    const edu = form.education[index];
    delete errors.education[index].formation;
    delete errors.education[index].institution;
    delete errors.education[index].location;
    delete errors.education[index].startYear;
    
    if (!edu.formation.trim()) {
        errors.education[index].formation = 'La formación es requerida';
    }
    if (!edu.institution.trim()) {
        errors.education[index].institution = 'La institución es requerida';
    }
    if (!edu.location.trim()) {
        errors.education[index].location = 'La localidad es requerida';
    }
    if (!edu.startYear) {
        errors.education[index].startYear = 'El año de inicio es requerido';
    }
};

const addExperience = () => {
    form.experience.push({
        position: '',
        employer: '',
        location: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        current: false,
        description: ''
    });
    errors.experience.push({});
};

const removeExperience = (index) => {
    form.experience.splice(index, 1);
    errors.experience.splice(index, 1);
};

const addEducation = () => {
    form.education.push({
        formation: '',
        institution: '',
        location: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        current: false,
        description: ''
    });
    errors.education.push({});
};

const removeEducation = (index) => {
    form.education.splice(index, 1);
    errors.education.splice(index, 1);
};

const addCompetence = () => {
    if (competenceInput.name.trim() && competenceInput.level) {
        form.competences.push({
            name: competenceInput.name.trim(),
            level: competenceInput.level
        });
        clearCompetenceInput();
    }
};

const removeCompetence = (index) => {
    form.competences.splice(index, 1);
};

const clearCompetenceInput = () => {
    competenceInput.name = '';
    competenceInput.level = '';
};

const addLanguage = () => {
    if (languageInput.name.trim() && languageInput.level) {
        form.languages.push({
            name: languageInput.name.trim(),
            level: languageInput.level
        });
        clearLanguageInput();
    }
};

const removeLanguage = (index) => {
    form.languages.splice(index, 1);
};

const clearLanguageInput = () => {
    languageInput.name = '';
    languageInput.level = '';
};

const addHobby = () => {
    if (hobbyInput.value.trim()) {
        form.hobbies.push(hobbyInput.value.trim());
        hobbyInput.value = '';
    }
};

const removeHobby = (index) => {
    form.hobbies.splice(index, 1);
};

const validateForm = () => {
    // Limpiar errores
    errors.personalInfo = {};
    errors.profile = null;
    errors.education = [];
    errors.experience = [];
    errors.competences = null;
    
    let isValid = true;
    
    // Validar información personal
    ['firstName', 'lastName', 'jobTitle', 'email', 'phone', 'address', 'postalCode', 'city'].forEach(field => {
        validateField('personalInfo', field);
        if (errors.personalInfo[field]) {
            isValid = false;
        }
    });
    
    // Validar perfil
    validateField('profile');
    if (errors.profile) {
        isValid = false;
    }
    
    // Validar experiencia
    form.experience.forEach((exp, index) => {
        validateExperience(index);
        if (Object.keys(errors.experience[index] || {}).length > 0) {
            isValid = false;
        }
    });
    
    // Validar educación
    form.education.forEach((edu, index) => {
        validateEducation(index);
        if (Object.keys(errors.education[index] || {}).length > 0) {
            isValid = false;
        }
    });
    
    return isValid;
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Preparar datos para enviar
    const cvData = {
        personalInfo: {
            ...form.personalInfo,
            // Convertir foto a base64 si existe
            photoBase64: photoPreview.value || null
        },
        profile: form.profile,
        education: form.education.filter(edu => edu.formation.trim() || edu.institution.trim()),
        experience: form.experience.filter(exp => exp.position.trim() || exp.employer.trim()),
        competences: form.competences,
        languages: form.languages,
        hobbies: form.hobbies
    };
    
    emit('submit', cvData);
};

// Emitir datos del formulario en tiempo real para la vista previa
const getFormData = () => {
    return {
        personalInfo: {
            ...form.personalInfo,
            photoBase64: photoPreview.value || null
        },
        profile: form.profile,
        education: form.education.filter(edu => edu.formation.trim() || edu.institution.trim()),
        experience: form.experience.filter(exp => exp.position.trim() || exp.employer.trim()),
        competences: form.competences,
        languages: form.languages,
        hobbies: form.hobbies
    };
};

// Watch para emitir cambios en tiempo real
watch(() => [
    form.personalInfo,
    form.profile,
    form.education,
    form.experience,
    form.competences,
    form.languages,
    form.hobbies,
    photoPreview.value
], () => {
    emit('update:formData', getFormData());
}, { deep: true, immediate: true });

// Exponer el formulario para acceso externo si es necesario
defineExpose({
    form,
    validateForm,
    handleSubmit,
    getFormData
});
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.cv-form-fields {
    width: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    
    @include media-breakpoint-down(md) {
        padding: 1.5rem;
    }
    
    .form-section {
        margin-bottom: 2.5rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid $light-3;
        
        &:last-child {
            border-bottom: none;
        }
    }
    
    .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: $dark;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
    }
    
    .form-label {
        font-weight: 600;
        color: $dark;
        margin-bottom: 0.5rem;
    }
    
    .form-control,
    .form-select {
        border: 2px solid $light-3;
        border-radius: 8px;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        transition: all 0.3s ease;
        
        &:focus {
            border-color: var(--secondary-color, #ff5900);
            box-shadow: 0 0 0 0.2rem rgba(255, 89, 0, 0.25);
        }
        
        &.is-invalid {
            border-color: $danger;
        }
    }
    
    .photo-preview {
        max-width: 200px;
        max-height: 200px;
        border-radius: 8px;
        border: 2px solid $light-3;
    }
    
    .experience-entry,
    .education-entry,
    .competence-input,
    .language-input,
    .hobby-input {
        background-color: $light-1;
        border-color: $light-3 !important;
    }
    
    .competence-item,
    .language-item,
    .hobby-item {
        background-color: white;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, var(--secondary-color) 0%, var(--secondary-color) 100%);
        border: none;
        padding: 12px 24px;
        font-weight: 600;
        border-radius: 30px;
        transition: all 0.3s ease;
        
        &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        &:disabled {
            opacity: 0.6;
        }
    }
    
    .btn-outline-primary {
        border-color: var(--secondary-color);
        color: var(--secondary-color);
        
        &:hover {
            background-color: var(--secondary-color);
            color: white;
        }
    }
    
    .btn-outline-secondary {
        border-color: $light-3;
        color: $dark;
        
        &:hover {
            background-color: $light-2;
        }
    }
    
    .btn-outline-danger {
        border-color: $danger;
        color: $danger;
        
        &:hover {
            background-color: $danger;
            color: white;
        }
    }
    
    .invalid-feedback {
        display: block;
        color: $danger;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .gap-2 {
        gap: 0.5rem;
    }
}
</style>
