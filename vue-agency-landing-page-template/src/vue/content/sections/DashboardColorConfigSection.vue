<template>
    <PageSection id="dashboard-color-config"
                 :darken="false"
                 :no-padding="false">
        <PageSectionHeader :title="'Configuración de Apariencia'"
                           :subtitle="'Personaliza colores y tipografía de tu dashboard'"
                           :center="true"/>

        <PageSectionContent>
                <!-- Menú contextual global -->
                <div v-if="contextMenu.visible" :style="{ position: 'fixed', top: contextMenu.y + 'px', left: contextMenu.x + 'px', zIndex: 2000 }">
                    <div id="fcontextmenu" class="context-menu card shadow-sm">
                        <ul class="list-unstyled mb-0">
                            <li class="context-item" @click.prevent="contextLoad">Cargar</li>
                            <li class="context-item" @click.prevent="contextEdit">Editar</li>
                            <li class="context-item text-danger" @click.prevent="contextDelete">Eliminar</li>
                        </ul>
                    </div>
                </div>
            <div class="color-config-container">
                <div class="row">
                    <!-- Sidebar de Configuración -->
                    <div class="col-12 col-lg-4">
                        <div class="config-sidebar">
                            <!-- Pestañas de Configuración -->
                            <div class="config-tabs">
                                <button
                                    class="tab-button"
                                    :class="{ active: activeTab === 'colors' }"
                                    @click="activeTab = 'colors'"
                                >
                                    <i class="fa-solid fa-palette me-2"></i>
                                    Colores
                                </button>
                                <button
                                    class="tab-button"
                                    :class="{ active: activeTab === 'typography' }"
                                    @click="activeTab = 'typography'"
                                >
                                    <i class="fa-solid fa-font me-2"></i>
                                    Tipografía
                                </button>
                            </div>

                            <!-- Contenido de Pestaña de Colores -->
                            <div v-if="activeTab === 'colors'" class="tab-content">
                                <h4 class="section-title">
                                    <i class="fa-solid fa-palette me-2"></i>
                                    Paleta de Colores
                                </h4>

                                <div class="color-inputs">
                                    <div class="color-input-group" v-for="color in colorConfig" :key="color.id">
                                        <label :for="color.id" class="color-label">
                                            {{ color.label }}
                                        </label>
                                        <div class="color-input-wrapper">
                                            <input
                                                type="color"
                                                :id="color.id"
                                                v-model="color.value"
                                                class="color-picker"
                                                @input="onColorInput(color.id, $event.target.value)"
                                            />
                                            <input
                                                type="text"
                                                v-model="color.value"
                                                class="color-text"
                                                :class="{ 'error': hasColorError(color.id) }"
                                                placeholder="#000000"
                                                @input="onColorInput(color.id, $event.target.value)"
                                            />
                                        </div>
                                        <div v-if="hasColorError(color.id)" class="color-error-message">
                                            <i class="fa-solid fa-exclamation-triangle me-1"></i>
                                            {{ getColorError(color.id) }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Campo para nombre de paleta -->
                                <div class="palette-name-section">
                                    <h5 class="palette-name-title">
                                        <i class="fa-solid fa-save me-2"></i>
                                        Guardar Paleta
                                    </h5>
                                    <div class="palette-name-input">
                                        <input
                                            type="text"
                                            v-model="newPaletteName"
                                            class="form-control"
                                            placeholder="Nombre de la paleta (ej: Mi Paleta Corporativa)"
                                            maxlength="50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Contenido de Pestaña de Tipografía -->
                            <div v-if="activeTab === 'typography'" class="tab-content">
                                <h4 class="section-title">
                                    <i class="fa-solid fa-font me-2"></i>
                                    Personalización de Tipografía
                                </h4>

                                <div class="font-inputs">
                                    <div class="font-input-group">
                                        <label class="font-label">Tamaño de Títulos (px)</label>
                                        <input
                                            type="number"
                                            :value="fontConfig.titleSize"
                                            @input="(e) => onFontSizeInput('titleSize', e.target.value)"
                                            :class="['font-input', { 'error': hasFontError('titleSize') }]"
                                            placeholder="20 - 80"
                                            min="20"
                                            max="100"
                                        />
                                        <div v-if="hasFontError('titleSize')" class="input-error-message">{{ getFontError('titleSize') }}</div>
                                    </div>

                                    <div class="font-input-group">
                                        <label class="font-label">Tamaño de Subtítulos (px)</label>
                                        <input
                                            type="number"
                                            :value="fontConfig.subtitleSize"
                                            @input="(e) => onFontSizeInput('subtitleSize', e.target.value)"
                                            :class="['font-input', { 'error': hasFontError('subtitleSize') }]"
                                            placeholder="16 - 60"
                                            min="16"
                                            max="80"
                                        />
                                        <div v-if="hasFontError('subtitleSize')" class="input-error-message">{{ getFontError('subtitleSize') }}</div>
                                    </div>

                                    <div class="font-input-group">
                                        <label class="font-label">Tamaño de Párrafos (px)</label>
                                        <input
                                            type="number"
                                            :value="fontConfig.paragraphSize"
                                            @input="(e) => onFontSizeInput('paragraphSize', e.target.value)"
                                            :class="['font-input', { 'error': hasFontError('paragraphSize') }]"
                                            placeholder="12 - 24"
                                            min="12"
                                            max="36"
                                        />
                                        <div v-if="hasFontError('paragraphSize')" class="input-error-message">{{ getFontError('paragraphSize') }}</div>
                                    </div>
                                </div>

                                <div class="font-uploads">
                                    <div class="font-upload-group">
                                        <label class="font-label">Fuente Principal (.ttf)</label>
                                        <div class="file-upload-wrapper">
                                            <input
                                                type="file"
                                                ref="primaryFontInput"
                                                @change="handlePrimaryFontUpload"
                                                accept=".ttf"
                                                class="file-input"
                                                :class="{ 'error': hasFontError('primaryFont') }"
                                            />
                                            <button class="file-upload-btn" @click.prevent="openPrimaryFileChooser">
                                                <i class="fa-solid fa-upload me-2"></i>
                                                Seleccionar archivo .ttf
                                            </button>
                                        </div>
                                        <div v-if="fontConfig.primaryFont && !hasFontError('primaryFont')" class="font-file-info">
                                            <i class="fa-solid fa-check-circle text-success me-1"></i>
                                            {{ fontConfig.primaryFont }}
                                        </div>
                                        <div v-if="hasFontError('primaryFont')" class="input-error-message">{{ getFontError('primaryFont') }}</div>
                                    </div>

                                    <div class="font-upload-group">
                                        <label class="font-label">Fuente Secundaria (.ttf)</label>
                                        <div class="file-upload-wrapper">
                                            <input
                                                type="file"
                                                ref="secondaryFontInput"
                                                @change="handleSecondaryFontUpload"
                                                accept=".ttf"
                                                class="file-input"
                                                :class="{ 'error': hasFontError('secondaryFont') }"
                                            />
                                            <button class="file-upload-btn" @click.prevent="openSecondaryFileChooser">
                                                <i class="fa-solid fa-upload me-2"></i>
                                                Seleccionar archivo .ttf
                                            </button>
                                        </div>
                                        <div v-if="fontConfig.secondaryFont && !hasFontError('secondaryFont')" class="font-file-info">
                                            <i class="fa-solid fa-check-circle text-success me-1"></i>
                                            {{ fontConfig.secondaryFont }}
                                        </div>
                                        <div v-if="hasFontError('secondaryFont')" class="input-error-message">{{ getFontError('secondaryFont') }}</div>
                                    </div>
                                </div>

                                <!-- Restructured typography save section to match palette section styling -->
                                <div class="typography-name-section">
                                    <h5 class="typography-name-title">
                                        <i class="fa-solid fa-save me-2"></i>
                                        Guardar Tipografía
                                    </h5>
                                    <div class="typography-name-input">
                                        <input
                                            type="text"
                                            v-model="newTypographyName"
                                            class="form-control"
                                            placeholder="Nombre de la tipografía (ej: Corporativa)"
                                            maxlength="50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Updated sidebar-actions buttons with proper styling to match the image -->
                            <div class="sidebar-actions">
                                <!-- Save button that changes based on active tab -->
                                <button
                                    v-if="activeTab === 'colors'"
                                    class="btn btn-save"
                                    @click="saveCurrentPalette"
                                >
                                    <i class="fa-solid fa-save me-1"></i>
                                    GUARDAR PALETA
                                </button>

                                <button
                                    v-if="activeTab === 'typography'"
                                    class="btn btn-save"
                                    @click="saveCurrentTypography"
                                >
                                    <i class="fa-solid fa-save me-1"></i>
                                    GUARDAR TIPOGRAFÍA
                                </button>

                                <!-- Reset button is context-aware -->
                                <button class="btn btn-reset" @click="resetChanges">
                                    <i class="fa-solid fa-undo me-1"></i>
                                    RESETEAR
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Preview del Dashboard -->
                    <div class="col-12 col-lg-8">
                        <div class="dashboard-preview">
                            <h5 class="preview-title">
                                <i class="fa-solid fa-eye me-2"></i>
                                Vista Previa
                            </h5>

                            <!-- Preview de Tipografía -->


                            <!-- Vista Previa Combinada (Colores + Tipografía) -->
                            <div class="combined-preview"
                                 :style="{
                                     '--preview-primary': colorConfig[0].value,
                                     '--preview-secondary': colorConfig[1].value,
                                     '--preview-accent': colorConfig[2].value,
                                     '--preview-success': colorConfig[3].value,
                                     '--preview-background': colorConfig[4].value,
                                     '--preview-font-family-secondary': fontConfig.secondaryFamily || fontConfig.secondaryFont || 'Saira, Arial, sans-serif',
                                     '--preview-font-family-primary': fontConfig.primaryFamily || fontConfig.primaryFont || 'Patua One, serif',
                                     '--preview-title-size': (fontConfig.titleSize || 40) + 'px',
                                     '--preview-subtitle-size': (fontConfig.subtitleSize || 28) + 'px',
                                     '--preview-paragraph-size': (fontConfig.paragraphSize || 16) + 'px'
                                 }">
                                <div class="combined-header">
                                    <div class="combined-logo">
                                        <span class="logo-mark"></span>
                                        <span class="logo-text">Agency</span>
                                    </div>
                                    <div class="combined-menu">
                                        <span class="combined-menu-item">Inicio</span>
                                        <span class="combined-menu-item">Servicios</span>
                                        <span class="combined-menu-item">Portafolio</span>
                                        <button class="cta-btn">Contáctanos</button>
                                    </div>
                                </div>
                                <!-- Added gradient background between color 1 and color 2 for hero section -->
                                <div class="combined-hero">
                                    <h2 class="hero-title" style="">
                                        Creamos experiencias digitales
                                    </h2>
                                    <!-- Changed subtitle color from color 2 to color 1 (secondary color) -->
                                    <p class="hero-subtitle">
                                        Diseño, desarrollo y estrategia para tu marca
                                    </p>
                                    <div class="hero-actions">
                                        <button class="xl-btn primary">Empieza ahora</button>
                                        <button class="xl-btn ghost">Ver trabajos</button>
                                    </div>
                                </div>
                                <!-- Changed cards section background to color 5 -->
                                <div class="combined-cards">
                                    <div class="c-card">
                                        <i class="fa-solid fa-bolt icon-accent"></i>
                                        <h6 class="card-title">Rápido</h6>
                                        <!-- Card description text now uses color 3 (accent color) -->
                                        <p class="card-desc">Implementaciones veloces y de calidad.</p>
                                    </div>
                                    <div class="c-card">
                                        <i class="fa-solid fa-shield icon-accent"></i>
                                        <h6 class="card-title">Seguro</h6>
                                        <p class="card-desc">Buenas prácticas y seguridad.</p>
                                    </div>
                                    <div class="c-card">
                                        <i class="fa-solid fa-star icon-accent"></i>
                                        <h6 class="card-title">Calidad</h6>
                                        <p class="card-desc">Diseños pulidos y modernos.</p>
                                    </div>
                                </div>

                                <!-- Sección adicional para mostrar Color 4 (success-color) -->
                                <div class="combined-footer">
                                    <div class="footer-content">
                                        <!-- Changed "¿Listo para comenzar?" to use color 2 (secondary color) -->
                                        <h5 class="footer-title">¿Listo para comenzar?</h5>
                                        <!-- Changed "Contáctanos y transformemos..." to use color 3 (accent color) -->
                                        <p class="footer-desc">Contáctanos y transformemos tu idea en realidad.</p>
                                        <button class="footer-btn">
                                            <i class="fa-solid fa-envelope me-2"></i>
                                            Contactar
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Sección de Paletas / Tipografías Guardadas -->
                <div class="row mt-5">
                    <div class="col-12">
                        <div class="saved-palettes-section">
                            <h4 class="section-title">
                                <i class="fa-solid fa-save me-2"></i>
                                <span v-if="activeTab === 'colors'">Paletas Guardadas</span>
                                <span v-else>Tipografías Guardadas</span>
                                <span class="palette-count">({{ activeTab === 'colors' ? savedPalettes.length : savedTypography.length }})</span>
                            </h4>

                            <div v-if="activeTab === 'colors'">
                                <div v-if="savedPalettes.length === 0" class="no-palettes">
                                    <i class="fa-solid fa-palette"></i>
                                    <p>No tienes paletas guardadas aún</p>
                                    <small>Configura los colores arriba y guárdalos para crear tu primera paleta</small>
                                </div>

                                <div v-else class="palettes-grid">
                                    <div
                                        v-for="palette in savedPalettes"
                                        :key="palette.id"
                                        class="palette-card"
                                        @contextmenu="(e) => openContextMenu(e, palette, 'palette')"
                                    >
                                        <div class="palette-header">
                                            <h6 class="palette-name">{{ palette.name }}</h6>
                                            <small class="palette-date">{{ formatDate(palette.createdAt) }}</small>
                                        </div>

                                        <div class="palette-colors">
                                            <div
                                                v-for="color in palette.colors"
                                                :key="color.id"
                                                class="color-preview"
                                                :style="{ backgroundColor: color.value }"
                                                :title="color.label"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else>
                                <!-- La UI para guardar tipografías se muestra en el formulario (arriba) -->

                                <div v-if="savedTypography.length === 0" class="no-palettes">
                                    <i class="fa-solid fa-font"></i>
                                    <p>No tienes tipografías guardadas aún</p>
                                    <small>Configura los tamaños y fuentes arriba y guárdalos para crear tu primera tipografía</small>
                                </div>

                                <div v-else class="typographies-grid">
                                    <div v-for="item in savedTypography" :key="item.id" class="palette-card" @contextmenu="(e) => openContextMenu(e, item, 'typography')">
                                        <div class="palette-header">
                                            <h6 class="palette-name">{{ item.name }}</h6>
                                            <small class="palette-date">{{ formatDate(item.createdAt) }}</small>
                                        </div>
                                        <div class="palette-colors">
                                            <div class="color-preview" style="background:#fff; border:1px solid #dee2e6;">
                                                <div class="typography-sample" style="padding:10px; color:#333;">
                                                    <div class="sample-line" :style="{ fontSize: item.fonts.titleSize + 'px', fontFamily: getFontFamilyName(item.fonts.secondaryFont, 'secondary') }">
                                                        A
                                                        <div class="sample-label"><strong>Título</strong> — {{ item.fonts.titleSize }}px</div>
                                                </div>
                                                    <div class="sample-line" :style="{ fontSize: item.fonts.subtitleSize + 'px', fontFamily: getFontFamilyName(item.fonts.secondaryFont, 'secondary') }">
                                                        A
                                                        <div class="sample-label"><strong>Subtítulo</strong> — {{ item.fonts.subtitleSize }}px</div>
                                            </div>
                                                    <div class="sample-line" :style="{ fontSize: item.fonts.paragraphSize + 'px', fontFamily: getFontFamilyName(item.fonts.primaryFont, 'primary') }">
                                                        A
                                                        <div class="sample-label"><strong>Párrafo</strong> — {{ item.fonts.paragraphSize }}px</div>
                                        </div>
                                        </div>
                                    </div>
                                            <!-- Mostrar nombres de las fuentes guardadas -->
                                            <div class="font-info-section">
                                                <div class="font-item">
                                                    <div class="font-label">Fuente Principal</div>
                                                    <div class="font-name">{{ getCleanFontName(item.fonts.primaryFont) }}</div>
                                </div>
                                                <div class="font-item">
                                                    <div class="font-label">Fuente Secundaria</div>
                                                    <div class="font-name">{{ getCleanFontName(item.fonts.secondaryFont) }}</div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
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
import {ref, onMounted, onUnmounted} from "vue"
import Swal from 'sweetalert2'
import * as themeManager from '/src/utils/themeManager.js'



const colorConfig = ref([
    {
        id: 'primary-color',
        label: 'Color 1',
        value: '#212529' // dark header/nav
    },
    {
        id: 'secondary-color',
        label: 'Color 2',
        value: '#ff5900' // primary orange
    },
    {
        id: 'accent-color',
        label: 'Color 3',
        value: '#000000' // black accent
    },
    {
        id: 'success-color',
        label: 'Color 4',
        value: '#343a40' // dark gray
    },
    {
        id: 'background-color',
        label: 'Color 5',
        value: '#fcfcfc' // light background
    }
])

const fontConfig = ref({
    titleSize: 40,
    subtitleSize: 28,
    paragraphSize: 16,
    // primaryFont / secondaryFont kept as display/url
    primaryFont: '',
    secondaryFont: '',
    // primaryFamily / secondaryFamily used for preview via FontFace
    primaryFamily: '',
    secondaryFamily: ''
})

const activeTab = ref('colors')

// Variables para gestión de paletas
const newPaletteName = ref('')
const savedPalettes = ref([])
const newTypographyName = ref('')
const savedTypography = ref([])

// Variables para validación de colores
const colorErrors = ref({})

// Refs para los inputs de archivo (para limpiar en caso de error)
const primaryFontInput = ref(null)
const secondaryFontInput = ref(null)
// Guardar File objects seleccionados para poder subirlos al backend
const primaryFontFile = ref(null)
const secondaryFontFile = ref(null)

// Errores relacionados con tipografía (validación en tiempo real)
const fontErrors = ref({
    titleSize: null,
    subtitleSize: null,
    paragraphSize: null,
    primaryFont: null,
    secondaryFont: null
})

const hasFontError = (field) => {
    return !!fontErrors.value[field]
}

const getFontError = (field) => {
    return fontErrors.value[field] || ''
}

const onFontSizeInput = (field, rawValue) => {
    // Eliminar todo lo que no sea dígito
    const digits = String(rawValue).replace(/[^0-9]/g, '')
    if (digits === '') {
        fontErrors.value[field] = 'Introduce un número válido'
        // No sobrescribimos con NaN: dejamos el texto temporalmente
        fontConfig.value[field] = rawValue
        return
    }

    const num = parseInt(digits, 10)
    fontConfig.value[field] = num

    // Rango por campo
    if (field === 'titleSize') {
        if (num < 20 || num > 80) {
            fontErrors.value[field] = 'El valor debe estar entre 20 y 80'
            return
        }
    }
    if (field === 'subtitleSize') {
        if (num < 16 || num > 60) {
            fontErrors.value[field] = 'El valor debe estar entre 16 y 60'
            return
        }
    }
    if (field === 'paragraphSize') {
        if (num < 12 || num > 24) {
            fontErrors.value[field] = 'El valor debe estar entre 12 y 24'
            return
        }
    }

    // Si todo está bien, limpiar error
    fontErrors.value[field] = null
}

const handlePrimaryFontUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validar extensión .ttf
    if (!/\.ttf$/i.test(file.name)) {
        fontConfig.value.primaryFont = ''
        fontErrors.value.primaryFont = 'Archivo inválido: sube un .ttf'
        // Limpiar input
        try {
            if (primaryFontInput && primaryFontInput.value) primaryFontInput.value.value = ''
        } catch (e) {}
        return
    }

    // Si es válido, limpiar error y procesar
    fontErrors.value.primaryFont = null
    // generar un family único para preview
    const family = 'UploadedPrimary_' + Date.now().toString()
    fontConfig.value.primaryFont = file.name
    fontConfig.value.primaryFamily = family
    primaryFontFile.value = file
    loadFontFromFile(file, family)
}

const openPrimaryFileChooser = () => {
    // limpiar cualquier valor previo para detectar cancel
    try { if (primaryFontInput && primaryFontInput.value) primaryFontInput.value.value = '' } catch (e) {}
    // abrir el diálogo
    primaryFontInput && primaryFontInput.value && primaryFontInput.value.click()

    // Si el usuario cierra sin seleccionar, mostrar mensaje (no hay evento 'cancel', usamos un timeout corto)
    setTimeout(() => {
        const hasFile = primaryFontInput && primaryFontInput.value && primaryFontInput.value.files && primaryFontInput.value.files.length > 0
        if (!hasFile) {
            fontErrors.value.primaryFont = 'No se ha seleccionado ningún archivo. Selecciona un .ttf para la fuente primaria.'
        } else {
            fontErrors.value.primaryFont = null
        }
    }, 500)
}

const handleSecondaryFontUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!/\.ttf$/i.test(file.name)) {
        fontConfig.value.secondaryFont = ''
        fontErrors.value.secondaryFont = 'Archivo inválido: sube un .ttf'
        try {
            if (secondaryFontInput && secondaryFontInput.value) secondaryFontInput.value.value = ''
        } catch (e) {}
        return
    }

    fontErrors.value.secondaryFont = null
    const family = 'UploadedSecondary_' + Date.now().toString()
    fontConfig.value.secondaryFont = file.name
    fontConfig.value.secondaryFamily = family
    secondaryFontFile.value = file
    loadFontFromFile(file, family)
}

const openSecondaryFileChooser = () => {
    try { if (secondaryFontInput && secondaryFontInput.value) secondaryFontInput.value.value = '' } catch (e) {}
    secondaryFontInput && secondaryFontInput.value && secondaryFontInput.value.click()

    setTimeout(() => {
        const hasFile = secondaryFontInput && secondaryFontInput.value && secondaryFontInput.value.files && secondaryFontInput.value.files.length > 0
        if (!hasFile) {
            fontErrors.value.secondaryFont = 'No se ha seleccionado ningún archivo. Selecciona un .ttf para la fuente secundaria.'
        } else {
            fontErrors.value.secondaryFont = null
        }
    }, 500)
}

// Cargar una fuente a partir de un File usando Blob URL y registrarla con FontFace
const loadFontFromFile = (file, familyName) => {
    try {
        const blobUrl = URL.createObjectURL(file)
        const fontFace = new FontFace(familyName, `url(${blobUrl}) format('truetype')`)
        fontFace.load().then((loaded) => {
            document.fonts.add(loaded)
            // liberar el object URL después de cargar
            try { URL.revokeObjectURL(blobUrl) } catch (e) {}
        }).catch(err => console.error('Error cargando fuente desde File:', err))
    } catch (err) {
        console.error('loadFontFromFile error:', err)
    }
}

// Cargar una fuente a partir de una URL (por ejemplo /uploads/fonts/xxx.ttf)
const loadFontFromUrl = async (url, familyName) => {
    try {
        // Intentamos crear directamente FontFace con la URL (permite cargar desde el servidor)
        const fontFace = new FontFace(familyName, `url(${url}) format('truetype')`)
        await fontFace.load()
        document.fonts.add(fontFace)
    } catch (err) {
        // Como fallback intentamos fetch -> blob -> objectURL
        try {
            const resp = await fetch(url)
            if (!resp.ok) throw new Error('fetch error ' + resp.status)
            const blob = await resp.blob()
            const blobUrl = URL.createObjectURL(blob)
            const fontFace = new FontFace(familyName, `url(${blobUrl}) format('truetype')`)
            await fontFace.load()
            document.fonts.add(fontFace)
            try { URL.revokeObjectURL(blobUrl) } catch (e) {}
        } catch (e) {
            console.error('No se pudo cargar fuente desde URL:', url, e)
        }
    }
}

const saveChanges = () => {
    // Aquí implementarías la lógica para guardar los cambios
    console.log('Guardando configuración:', { colorConfig: colorConfig.value, fontConfig: fontConfig.value })
    Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'La configuración ha sido guardada exitosamente.'
    })
}

const resetChanges = async () => {
    if (activeTab.value === 'typography') {
        // Resetear solo tipografía

        //preguntar si desea resetear

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esto reseteará la configuración de tipografía a los valores por defecto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, resetear',
            cancelButtonText: 'Cancelar'
        })

        if (!result.isConfirmed) return

        const response = await fetch('http://localhost:3000/api/tipografias/deactivate-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })

        console.log('Reset typography response status:', response.status)

        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo resetear la tipografía en el servidor.'
            })
            return
        }


        fontConfig.value = {
            titleSize: 40,
            subtitleSize: 28,
            paragraphSize: 16,
            primaryFont: '',
            secondaryFont: ''
        }
        // Clear font errors on reset
        fontErrors.value.primaryFont = null
        fontErrors.value.secondaryFont = null
        //preguntar si desea ir al home despues de resetear
        const goHome = await Swal.fire({
            title: 'Tipografía reseteada',
            text: '¿Deseas ir a la página principal?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Sí, ir al home',
            cancelButtonText: 'No, quedarme aquí'
        })
        if (goHome.isConfirmed) {
            window.location.href = '/'
        }

    } else {
        const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esto reseteará la configuración de colores a los valores por defecto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, resetear',
        cancelButtonText: 'Cancelar'
    })
    if (!result.isConfirmed) return
        // Resetear solo colores
    colorConfig.value = [
        { id: 'primary-color', label: 'Color Primario', value: '#212529' },
        { id: 'secondary-color', label: 'Color Secundario', value: '#ff5900' },
        { id: 'accent-color', label: 'Color de Acento', value: '#000000' },
        { id: 'success-color', label: 'Color de Éxito', value: '#343a40' },
        { id: 'background-color', label: 'Color de Fondo', value: '#fcfcfc' }
    ]

    // Aplicar inmediatamente la paleta por defecto al template y persistirla
    try {
        applyColorsToTemplate(colorConfig.value)
        try { themeManager.savePalette({ name: 'default', colors: colorConfig.value }) } catch (e) { /* no crítico */ }
    } catch (e) {
        console.warn('No se pudo aplicar la paleta por defecto automáticamente:', e)
    }

    // preguntar si desea ir al home despues de resetear
    const goHome = await Swal.fire({
        title: 'Colores reseteados',
        text: '¿Deseas ir a la página principal?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sí, ir al home',
        cancelButtonText: 'No, quedarme aquí'
    })
    if (goHome.isConfirmed) {
        window.location.href = '/'
    }
    }


}
// Función para aplicar colores al template real
const applyColorsToTemplate = (colors) => {
    const root = document.documentElement;

    root.style.setProperty('--primary-color', colors[0].value);
    root.style.setProperty('--secondary-color', colors[1].value);
    root.style.setProperty('--accent-color', colors[2].value);
    root.style.setProperty('--success-color', colors[3].value);
    root.style.setProperty('--background-color', colors[4].value);

    // Guardar en localStorage para persistencia
    localStorage.setItem('activeColorPalette', JSON.stringify(colors));
}
// Funciones para gestión de paletas
const saveCurrentPalette = async () => {
    if (!newPaletteName.value.trim()) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingresa un nombre para la paleta'
        })
        // Al final de saveCurrentPalette, después de guardar en localStorage
        applyColorsToTemplate(colorConfig.value);
        return
    }


    // Validar todos los colores antes de guardar
    let hasErrors = false
    colorConfig.value.forEach(color => {
        if (!validateColor(color.id, color.value)) {
            hasErrors = true
        }
    })

    if (hasErrors) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hay errores en los colores. Por favor corrígelos antes de guardar.'
        })
        return;
    }


    const localPaletteBase = {
        name: newPaletteName.value.trim(),
        colors: [...colorConfig.value],
        createdAt: new Date().toISOString()
    }

    // Buscar si ya existe una paleta con ese nombre (case-insensitive)
    const existingPalette = savedPalettes.value.find(p => String(p.name || '').toLowerCase() === String(localPaletteBase.name || '').toLowerCase())

    // Si existe, preguntar y actualizar (PUT) si viene de la BD
    if (existingPalette) {
        const result = await Swal.fire({
            title: "Paleta existente",
            text: `Ya existe una paleta llamada "${existingPalette.name}". ¿Deseas sobrescribirla?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, sobrescribir",
            cancelButtonText: "Cancelar"
        })

        if (!result.isConfirmed) return

        try {
            const idStr = String(existingPalette.id || '')
            const isNumeric = /^\d+$/.test(idStr)
            if (isNumeric) {
                // Hacer PUT en /api/colors/:id
                const payload = { name: localPaletteBase.name, ...mapColorsPayload(localPaletteBase.colors) }
                const resp = await fetch(`http://localhost:3000/api/colors/${idStr}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                if (!resp.ok) {
                    const t = await resp.text().catch(() => '')
                    throw new Error(`Server responded ${resp.status} ${t}`)
                }
                const updated = await resp.json().catch(() => null)

                // Actualizar localmente la paleta existente
                existingPalette.name = localPaletteBase.name
                existingPalette.colors = [...localPaletteBase.colors]
                existingPalette.createdAt = (updated && (updated.created_at || updated.createdAt)) || new Date().toISOString()
                try { savePalettesToStorage() } catch (e) {}

                await Swal.fire({ icon: 'success', title: 'Actualizada', text: 'La paleta ha sido actualizada en el servidor.' })
            } else {
                // No tiene id numérico -> actualizar solo localmente
                existingPalette.name = localPaletteBase.name
                existingPalette.colors = [...localPaletteBase.colors]
                existingPalette.createdAt = new Date().toISOString()
                try { savePalettesToStorage() } catch (e) {}
                await Swal.fire({ icon: 'success', title: 'Guardada', text: 'La paleta ha sido guardada localmente.' })
            }
        } catch (error) {
            console.error('Error actualizando paleta en servidor:', error)
            // Aún así actualizar localmente para no perder trabajo
            existingPalette.name = localPaletteBase.name
            existingPalette.colors = [...localPaletteBase.colors]
            try { savePalettesToStorage() } catch (e) {}
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar en el servidor. Se guardó localmente.' })
        }

        // Limpiar input
        newPaletteName.value = ''
            return
        }

    // Si no existe, intentar crear (POST)
    try {
        const payload = { name: localPaletteBase.name, ...mapColorsPayload(localPaletteBase.colors) }
        const resp = await fetch('http://localhost:3000/api/colors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!resp.ok) {
            const t = await resp.text().catch(() => '')
            throw new Error(`Server responded ${resp.status} ${t}`)
        }

        const created = await resp.json().catch(() => null)
    const newId = created && (created.id_color || created.id) ? String(created.id_color || created.id) : ('local-' + Date.now().toString())
        const createdAt = created && (created.created_at || created.createdAt) ? (created.created_at || created.createdAt) : localPaletteBase.createdAt

    const newPalette = {
            id: newId,
            name: localPaletteBase.name,
            colors: [...localPaletteBase.colors],
            createdAt
        }

        savedPalettes.value.unshift(newPalette)
        try { savePalettesToStorage() } catch (e) {}

        await Swal.fire({ icon: 'success', title: 'Paleta guardada', text: 'Tu paleta ha sido guardada en el servidor y localmente!' })
        newPaletteName.value = ''
        colorConfig.value = [
            {
                id: 'primary-color',
                label: 'Color 1',
                value: '#212529' // dark header/nav
            },
            {
                id: 'secondary-color',
                label: 'Color 2',
                value: '#ff5900' // primary orange
            },
            {
                id: 'accent-color',
                label: 'Color 3',
                value: '#000000' // black accent
            },
            {
                id: 'success-color',
                label: 'Color 4',
                value: '#343a40' // dark gray
            },
            {
                id: 'background-color',
                label: 'Color 5',
                value: '#fcfcfc' // light background
            }
        ]
    } catch (error) {
        console.error('Error creando paleta en servidor:', error)
        // Guardar localmente como fallback
        const fallback = {
            id: 'local-' + Date.now().toString(),
            name: localPaletteBase.name,
            colors: [...localPaletteBase.colors],
            createdAt: localPaletteBase.createdAt
        }
        savedPalettes.value.unshift(fallback)
        try { savePalettesToStorage() } catch (e) {}
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar en el servidor. La paleta se guardó localmente.' })
        newPaletteName.value = ''
    }
}

const createAndSavePalette = () => {
    const newPalette = {
    id: 'local-' + Date.now().toString(),
        name: newPaletteName.value.trim(),
        colors: [...colorConfig.value], // Copia de los colores actuales
        createdAt: new Date().toISOString()
    }

    // Agregar a la lista
    savedPalettes.value.unshift(newPalette)

    // Guardar en localStorage
    savePalettesToStorage()

    // Limpiar el input
    newPaletteName.value = ''

    Swal.fire({
        icon: 'success',
        title: 'Paleta guardada',
        text: 'Tu paleta ha sido guardada exitosamente!'
    })
}


const saveCurrentTypography = () => {
    if (!newTypographyName.value.trim()) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingresa un nombre para la tipografía'
        })
        return
    }

    // Validar tamaños antes de guardar
    if (!validateFontSizes()) return

    if (fontErrors.value.primaryFont || fontErrors.value.secondaryFont) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor corrige los errores en los archivos de fuente antes de guardar'
        })
        return
    }

    // Asegurarnos de que ambas fuentes estén presentes: o se seleccionó un archivo o ya existe un valor en fontConfig
    if (!primaryFontFile.value && !fontConfig.value.primaryFont) {
        Swal.fire({ icon: 'error', title: 'Falta fuente', text: 'Debes seleccionar la fuente primaria (.ttf) antes de guardar.' })
        return
    }
    if (!secondaryFontFile.value && !fontConfig.value.secondaryFont) {
        Swal.fire({ icon: 'error', title: 'Falta fuente', text: 'Debes seleccionar la fuente secundaria (.ttf) antes de guardar.' })
        return
    }

    const newItem = {
    id: 'local-' + Date.now().toString(),
        name: newTypographyName.value.trim(),
        fonts: {
            titleSize: fontConfig.value.titleSize,
            subtitleSize: fontConfig.value.subtitleSize,
            paragraphSize: fontConfig.value.paragraphSize,
            primaryFont: fontConfig.value.primaryFont,
            secondaryFont: fontConfig.value.secondaryFont
        },
        createdAt: new Date().toISOString()
    }
;
    // Intentar persistir en backend si el backend está disponible
    (async () => {
        try {
            // Si hay archivos seleccionados, subirlos primero a /api/uploads/fonts
            const uploadedUrls = { font1: '', font2: '' }

            const uploadFile = async (file) => {
                if (!file) return ''
                const fd = new FormData()
                fd.append('font', file)
                const resp = await fetch('http://localhost:3000/api/uploads/fonts', { method: 'POST', body: fd })
                if (!resp.ok) {
                    const t = await resp.text().catch(()=>'')
                    throw new Error(`Upload failed ${resp.status} ${t}`)
                }
                const body = await resp.json().catch(()=>null)
                return body && body.url ? body.url : ''
            }

            if (primaryFontFile.value) {
                uploadedUrls.font1 = await uploadFile(primaryFontFile.value)
            } else {
                // si no se seleccionó archivo, usar valor existente en fontConfig (podría ser url o nombre)
                uploadedUrls.font1 = fontConfig.value.primaryFont || ''
            }

            if (secondaryFontFile.value) {
                uploadedUrls.font2 = await uploadFile(secondaryFontFile.value)
            } else {
                uploadedUrls.font2 = fontConfig.value.secondaryFont || ''
            }

            const payload = {
                nombre: newItem.name,
                tamanio_titulo: newItem.fonts.titleSize,
                tamanio_subtitulo: newItem.fonts.subtitleSize,
                tamanio_parrafo: newItem.fonts.paragraphSize,
                font1: uploadedUrls.font1 || '',
                font2: uploadedUrls.font2 || ''
            }

            const resp = await fetch('http://localhost:3000/api/tipografias', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            })

            if (!resp.ok) throw new Error('Error creando tipografía en servidor')
            const created = await resp.json().catch(() => null)
            const newId = created && (created.id_tipografia || created.id) ? String(created.id_tipografia || created.id) : ('local-' + Date.now().toString())

            newItem.id = newId
            // almacenar las urls devueltas como nombres en la UI para persistencia
            newItem.fonts.primaryFont = payload.font1
            newItem.fonts.secondaryFont = payload.font2

            // intentar cargar las fuentes devueltas desde URL y asignar familias para preview inmediato
            if (payload.font1) {
                const fam = 'SavedPrimary_' + Date.now().toString()
                loadFontFromUrl(payload.font1, fam).then(() => { newItem.fonts.primaryFamily = fam; fontConfig.value.primaryFamily = fam })
            }
            if (payload.font2) {
                const fam2 = 'SavedSecondary_' + Date.now().toString()
                loadFontFromUrl(payload.font2, fam2).then(() => { newItem.fonts.secondaryFamily = fam2; fontConfig.value.secondaryFamily = fam2 })
    }

    savedTypography.value.unshift(newItem)
    saveTypographiesToStorage()
    newTypographyName.value = ''
            // limpiar files
            primaryFontFile.value = null
            secondaryFontFile.value = null

            Swal.fire({ icon: 'success', title: 'Tipografía guardada', text: 'Tu tipografía ha sido guardada exitosamente en el servidor!' })
            // reset numeric/display fields but preserve any loaded families so preview remains
            const preservedPrimaryFamily = fontConfig.value.primaryFamily || ''
            const preservedSecondaryFamily = fontConfig.value.secondaryFamily || ''
            fontConfig.value = {
            titleSize: 40,
            subtitleSize: 28,
            paragraphSize: 16,
            primaryFont: '',
            secondaryFont: '',
            primaryFamily: preservedPrimaryFamily,
            secondaryFamily: preservedSecondaryFamily
            }
        } catch (err) {
            console.error('Error guardando tipografía en servidor:', err)
            // Fallback local: guardar nombres/valores locales
            savedTypography.value.unshift(newItem)
            saveTypographiesToStorage()
            newTypographyName.value = ''
            // limpiar files locales
            primaryFontFile.value = null
            secondaryFontFile.value = null
            Swal.fire({ icon: 'error', title: 'Guardado local', text: 'No se pudo guardar en el servidor. Tipografía guardada localmente.' })
        }
    })()
}

// Traer tipografías desde la API y mapear al formato interno
const fetchTypographiesFromAPI = async () => {
    try {
        const resp = await fetch('http://localhost:3000/api/tipografias')
        if (!resp.ok) throw new Error('Error fetching typographies')
        const data = await resp.json()
        console.log('Tipografías desde API:', data)

        for (const row of data) {
            try {
                const id = row.id_tipografia != null ? String(row.id_tipografia) : (row.id || ('local-' + Date.now().toString()))
                const name = row.nombre || row.name || `Tipografía ${id}`
                const item = {
                    id,
                    name,
                    fonts: {
                        titleSize: row.tamanio_titulo || 40,
                        subtitleSize: row.tamanio_subtitulo || 28,
                        paragraphSize: row.tamanio_parrafo || 16,
                        primaryFont: row.font1 || '',
                        secondaryFont: row.font2 || '',
                        // families serán cargadas cuando el usuario cargue la tipografía al preview
                        primaryFamily: '',
                        secondaryFamily: ''
                    },
                    createdAt: row.created_at || row.createdAt || new Date().toISOString()
                }

                const exists = savedTypography.value.find(p => String(p.id) === String(id) || p.name === name)
                if (!exists) savedTypography.value.push(item)
            } catch (e) {
                console.warn('Error mapeando tipografía desde API:', e, row)
            }
        }

        try { saveTypographiesToStorage() } catch (e) {}
    } catch (error) {
        console.error('Error fetching typographies from API:', error)
    }
}

const editTypography = async (item) => {
    if (!item) return;

    const id = String(item.id || '');
    const html = `
        <div class="swal-edit-typography">
            <style>
                .swal-field-label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 6px;
                    color: #34495e;
                }
                .swal-input-error {
                    border-color: #dc3545 !important;
                    box-shadow: 0 0 0 3px rgba(220,53,69,0.08);
                }
                .swal-error-msg {
                    color: #dc3545;
                    font-size: 0.85rem;
                    margin-top: 4px;
                    margin-bottom: 6px;
                }
                .swal-typ-row {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .swal-typ-input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 8px 10px;
                    border-radius: 6px;
                    border: 1px solid #ced4da;
                    font-size: 0.95rem;
                    transition: border-color 0.2s;
                }
                .swal-typ-input:focus {
                    border-color: #86b7fe;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(13,110,253,0.1);
                }
                .swal-edit-typography {
                    max-width: 450px;
                    margin: 0 auto;
                }
            </style>

            <label class="swal-field-label" for="swal-typ-name">Nombre</label>
            <input id="swal-typ-name" class="swal-typ-input" value="${escapeHtml(item.name || '')}" />
            <div id="swal-typ-name-error" class="swal-error-msg"></div>

            <div class="swal-typ-row">
                <div style="flex:1">
                    <label class="swal-field-label" for="swal-typ-title">Tamaño Título</label>
                    <input id="swal-typ-title" type="number" min="20" max="80" class="swal-typ-input"
                        value="${item.fonts ? (item.fonts.titleSize || 40) : 40}" />
                    <div id="swal-typ-title-error" class="swal-error-msg"></div>
                </div>
                <div style="flex:1">
                    <label class="swal-field-label" for="swal-typ-sub">Tamaño Subtítulo</label>
                    <input id="swal-typ-sub" type="number" min="16" max="60" class="swal-typ-input"
                        value="${item.fonts ? (item.fonts.subtitleSize || 28) : 28}" />
                    <div id="swal-typ-sub-error" class="swal-error-msg"></div>
                </div>
            </div>

            <div style="margin-bottom:8px;">
                <label class="swal-field-label" for="swal-typ-para">Tamaño Párrafo</label>
                <input id="swal-typ-para" type="number" min="12" max="24" class="swal-typ-input"
                    value="${item.fonts ? (item.fonts.paragraphSize || 16) : 16}" />
                <div id="swal-typ-para-error" class="swal-error-msg"></div>
            </div>

            <div style="margin-bottom:8px;">
                <label class="swal-field-label" for="swal-typ-font1">Fuente 1 (primary)</label>
                <input id="swal-typ-font1" type="file" accept=".ttf,.otf" class="swal-typ-input" />
                <div id="swal-typ-font1-error" class="swal-error-msg"></div>
            </div>

            <div style="margin-bottom:8px;">
                <label class="swal-field-label" for="swal-typ-font2">Fuente 2 (secondary)</label>
                <input id="swal-typ-font2" type="file" accept=".ttf,.otf" class="swal-typ-input" />
                <div id="swal-typ-font2-error" class="swal-error-msg"></div>
            </div>
        </div>
    `;

    const { value: confirm } = await Swal.fire({
        title: 'Editar Tipografía',
        html,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        didOpen: () => {
            const nameEl = document.getElementById('swal-typ-name');
            const nameErr = document.getElementById('swal-typ-name-error');
            const titleEl = document.getElementById('swal-typ-title');
            const subEl = document.getElementById('swal-typ-sub');
            const paraEl = document.getElementById('swal-typ-para');
            const font1El = document.getElementById('swal-typ-font1');
            const font2El = document.getElementById('swal-typ-font2');

            const setErr = (el, errEl, msg) => {
                if (!el) return;
                if (msg) el.classList.add('swal-input-error');
                else el.classList.remove('swal-input-error');
                if (errEl) errEl.textContent = msg || '';
            };

            const validateName = () => {
                const v = (nameEl && nameEl.value || '').trim();
                if (!v) { setErr(nameEl, nameErr, 'El nombre no puede estar vacío'); return false; }
                setErr(nameEl, nameErr, '');
                return true;
            };

            const validateNumber = (el, errEl, min, max, label) => {
                const n = parseInt(el.value, 10);
                if (isNaN(n)) { setErr(el, errEl, `${label} debe ser un número`); return false; }
                if (n < min || n > max) { setErr(el, errEl, `${label} debe estar entre ${min} y ${max}`); return false; }
                setErr(el, errEl, '');
                return true;
            };

            const validateFile = (el, errEl, label) => {
                const file = el.files[0];
                if (!file) { setErr(el, errEl, `${label} es obligatorio`); return false; }
                if (!file.name.endsWith('.ttf') && !file.name.endsWith('.otf')) {
                    setErr(el, errEl, `${label} debe ser un archivo .ttf o .otf`);
                    return false;
                }
                setErr(el, errEl, '');
                return true;
            };

            nameEl && nameEl.addEventListener('input', validateName);
            titleEl && titleEl.addEventListener('input', () => validateNumber(titleEl, document.getElementById('swal-typ-title-error'), 20, 80, 'Tamaño Título'));
            subEl && subEl.addEventListener('input', () => validateNumber(subEl, document.getElementById('swal-typ-sub-error'), 16, 60, 'Tamaño Subtítulo'));
            paraEl && paraEl.addEventListener('input', () => validateNumber(paraEl, document.getElementById('swal-typ-para-error'), 12, 24, 'Tamaño Párrafo'));
            font1El && font1El.addEventListener('change', () => validateFile(font1El, document.getElementById('swal-typ-font1-error'), 'Fuente primaria'));
            font2El && font2El.addEventListener('change', () => validateFile(font2El, document.getElementById('swal-typ-font2-error'), 'Fuente secundaria'));

            // Inicialización
            validateName();
            validateNumber(titleEl, document.getElementById('swal-typ-title-error'), 20, 80, 'Tamaño Título');
            validateNumber(subEl, document.getElementById('swal-typ-sub-error'), 16, 60, 'Tamaño Subtítulo');
            validateNumber(paraEl, document.getElementById('swal-typ-para-error'), 12, 24, 'Tamaño Párrafo');

            // Precargar fuentes existentes (si item.fonts.primaryFont / secondaryFont apuntan a URL o nombre)
            (async () => {
                try {
                    const font1Url = item && item.fonts && item.fonts.primaryFont;
                    const font2Url = item && item.fonts && item.fonts.secondaryFont;
                    const font1Input = document.getElementById('swal-typ-font1');
                    const font2Input = document.getElementById('swal-typ-font2');

                    const ensureStatusEl = (inputEl, id) => {
                        if (!inputEl) return null
                        let s = document.getElementById(id)
                        if (!s) {
                            s = document.createElement('div')
                            s.id = id
                            s.style.fontSize = '0.85rem'
                            s.style.marginTop = '6px'
                            s.style.color = '#6c757d'
                            inputEl.parentNode && inputEl.parentNode.appendChild(s)
                        }
                        return s
                    }

                    const status1 = ensureStatusEl(font1Input, 'swal-typ-font1-status')
                    const status2 = ensureStatusEl(font2Input, 'swal-typ-font2-status')

                    const buildCandidates = (raw) => {
                        if (!raw) return []
                        const candidates = []
                        const r = String(raw)
                        if (/^https?:\/\//i.test(r)) candidates.push(r)
                        if (r.startsWith('/')) {
                            candidates.push(window.location.origin + r)
                            candidates.push(r)
                            candidates.push('http://localhost:3000' + r)
                        } else {
                            candidates.push(r)
                            candidates.push('/uploads/fonts/' + r)
                            candidates.push(window.location.origin + '/uploads/fonts/' + r)
                            candidates.push('http://localhost:3000/uploads/fonts/' + r)
                        }
                        return [...new Set(candidates)]
                    }

                    const tryPreload = async (rawUrl, inputEl, statusEl) => {
                        if (!rawUrl || !inputEl) {
                            if (statusEl) statusEl.textContent = 'No hay fuente configurada'
                            return
                        }

                        const candidates = buildCandidates(rawUrl)
                        if (statusEl) statusEl.textContent = 'Buscando fuente...'

                        for (const fetchUrl of candidates) {
                            try {
                                if (statusEl) statusEl.textContent = `Intentando: ${fetchUrl}`
                                const resp = await fetch(fetchUrl)
                                if (!resp.ok) {
                                    if (statusEl) statusEl.textContent = `No disponible: ${fetchUrl} (${resp.status})`
                                    continue
                                }
                                const blob = await resp.blob()
                                const name = fileBasename(fetchUrl) || (String(rawUrl).split('/').pop() || 'font.ttf')
                                const file = new File([blob], name, { type: blob.type || 'font/ttf' })
                                const dt = new DataTransfer()
                                dt.items.add(file)
                                try {
                                    inputEl.files = dt.files
                                    inputEl.dataset.preloaded = '1'
                                    inputEl.dataset.preloadedUrl = fetchUrl
                                    if (statusEl) statusEl.textContent = `Fuente precargada: ${name}`
                                    inputEl.dispatchEvent(new Event('change', { bubbles: true }))
                                    console.log('Precargada fuente desde', fetchUrl)
                                    return
                                } catch (assignErr) {
                                    inputEl.dataset.preloaded = '0'
                                    inputEl.dataset.preloadedUrl = fetchUrl
                                    if (statusEl) statusEl.textContent = `Fuente encontrada (usar al guardar): ${name}`
                                    console.warn('No se pudo asignar input.files programáticamente, usar URL fallback', assignErr)
                                    return
                                }
                            } catch (err) {
                                console.warn('Intento de precarga falló para', fetchUrl, err)
                                if (statusEl) statusEl.textContent = `Error intentando: ${fetchUrl}`
                            }
                        }

                        if (statusEl) statusEl.textContent = 'No se encontró la fuente en el servidor'
                    }

                    await tryPreload(font1Url, font1Input, status1)
                    await tryPreload(font2Url, font2Input, status2)
                } catch (err) {
                    console.warn('Precarga de fuentes falló:', err)
                }
            })();
        },
        preConfirm: () => {
            const nameEl = document.getElementById('swal-typ-name');
            const titleEl = document.getElementById('swal-typ-title');
            const subEl = document.getElementById('swal-typ-sub');
            const paraEl = document.getElementById('swal-typ-para');
            const font1El = document.getElementById('swal-typ-font1');
            const font2El = document.getElementById('swal-typ-font2');

            const name = nameEl.value.trim();
            const title = parseInt(titleEl.value, 10);
            const sub = parseInt(subEl.value, 10);
            const para = parseInt(paraEl.value, 10);

            // archivos seleccionados directamente
            const rawFile1 = font1El.files && font1El.files[0] ? font1El.files[0] : null
            const rawFile2 = font2El.files && font2El.files[0] ? font2El.files[0] : null
            // fallback: URL precargada (dataset.preloadedUrl)
            const preloaded1 = font1El && font1El.dataset && font1El.dataset.preloadedUrl ? font1El.dataset.preloadedUrl : null
            const preloaded2 = font2El && font2El.dataset && font2El.dataset.preloadedUrl ? font2El.dataset.preloadedUrl : null

            // Preferir File; si no hay File pero existe preloadedUrl, lo aceptamos
            const font1 = rawFile1 || (preloaded1 ? { preloadedUrl: preloaded1 } : null)
            const font2 = rawFile2 || (preloaded2 ? { preloadedUrl: preloaded2 } : null)

            // Validar extensiones de archivos si se seleccionaron directamente
            const isValidFontFile = (f) => {
                if (!f) return false
                const name = String(f.name || '').toLowerCase()
                return name.endsWith('.ttf') || name.endsWith('.otf')
            }
            if (rawFile1 && !isValidFontFile(rawFile1)) { Swal.showValidationMessage('Fuente primaria inválida: el archivo debe ser .ttf o .otf'); return false }
            if (rawFile2 && !isValidFontFile(rawFile2)) { Swal.showValidationMessage('Fuente secundaria inválida: el archivo debe ser .ttf o .otf'); return false }

            if (!name) { Swal.showValidationMessage('El nombre no puede estar vacío'); return false; }
            if (isNaN(title) || title < 20 || title > 80) { Swal.showValidationMessage('Tamaño Título inválido'); return false; }
            if (isNaN(sub) || sub < 16 || sub > 60) { Swal.showValidationMessage('Tamaño Subtítulo inválido'); return false; }
            if (isNaN(para) || para < 12 || para > 24) { Swal.showValidationMessage('Tamaño Párrafo inválido'); return false; }
            if (!font1) { Swal.showValidationMessage('Debe seleccionar o tener precargada la fuente primaria (.ttf o .otf)'); return false; }
            if (!font2) { Swal.showValidationMessage('Debe seleccionar o tener precargada la fuente secundaria (.ttf o .otf)'); return false; }

            return { name, title, sub, para, font1, font2 };
        }
    });

    if (!confirm) return;

    const { name, title, sub, para, font1, font2 } = confirm;

    const target = savedTypography.value.find(p => String(p.id) === id);
    if (target) {
        target.name = name;
        target.fonts.titleSize = title;
        target.fonts.subtitleSize = sub;
        target.fonts.paragraphSize = para;
        // Determinar qué se recibió: File o {preloadedUrl}
        const font1Value = (font1 && font1.preloadedUrl) ? font1.preloadedUrl : (font1 && font1.name ? font1.name : '');
        const font2Value = (font2 && font2.preloadedUrl) ? font2.preloadedUrl : (font2 && font2.name ? font2.name : '');
        target.fonts.primaryFont = font1Value;
        target.fonts.secondaryFont = font2Value;
        try { saveTypographiesToStorage(); } catch (e) {}

        // Si se subió un archivo directamente, cargarlo inmediatamente en document.fonts
        // y asignar una family para que la plantilla/preview lo use de inmediato.
        try {
            if (font1 instanceof File) {
                const fam = 'EditedPrimary_' + Date.now().toString()
                // loadFontFromFile está definido más arriba en este archivo
                try { loadFontFromFile(font1, fam) } catch (err) { console.warn('loadFontFromFile fallo para primary:', err) }
                fontConfig.value.primaryFamily = fam
                try { target.fonts.primaryFamily = fam } catch (e) {}
            } else if (font1 && font1.preloadedUrl) {
                const fam = 'EditedPrimary_' + Date.now().toString()
                loadFontFromUrl(font1.preloadedUrl, fam).then(() => {
                    fontConfig.value.primaryFamily = fam
                    try { target.fonts.primaryFamily = fam } catch (e) {}
                }).catch(err => console.warn('loadFontFromUrl fallo para primary:', err))
            }

            if (font2 instanceof File) {
                const fam2 = 'EditedSecondary_' + Date.now().toString()
                try { loadFontFromFile(font2, fam2) } catch (err) { console.warn('loadFontFromFile fallo para secondary:', err) }
                fontConfig.value.secondaryFamily = fam2
                try { target.fonts.secondaryFamily = fam2 } catch (e) {}
            } else if (font2 && font2.preloadedUrl) {
                const fam2 = 'EditedSecondary_' + Date.now().toString()
                loadFontFromUrl(font2.preloadedUrl, fam2).then(() => {
                    fontConfig.value.secondaryFamily = fam2
                    try { target.fonts.secondaryFamily = fam2 } catch (e) {}
                }).catch(err => console.warn('loadFontFromUrl fallo para secondary:', err))
            }
        } catch (e) {
            console.warn('Error cargando fuentes tras editar tipografía:', e)
        }

        if (/^\d+$/.test(id)) {
            try {
                const formData = new FormData();
                formData.append('nombre', name);
                formData.append('tamanio_titulo', title);
                formData.append('tamanio_subtitulo', sub);
                formData.append('tamanio_parrafo', para);
                // Si font1/font2 son File, anexarlos; si son preloadedUrl (strings), anexar la URL como campo
                if (font1 instanceof File) {
                    formData.append('font1', font1);
                } else if (font1 && font1.preloadedUrl) {
                    formData.append('font1', font1.preloadedUrl);
                } else if (typeof font1 === 'string' && font1) {
                    formData.append('font1', font1);
                }

                if (font2 instanceof File) {
                    formData.append('font2', font2);
                } else if (font2 && font2.preloadedUrl) {
                    formData.append('font2', font2.preloadedUrl);
                } else if (typeof font2 === 'string' && font2) {
                    formData.append('font2', font2);
                }

                console.log('Enviando FormData para actualizar tipografía (files o URLs si aplican):', formData);

                const resp = await fetch(`http://localhost:3000/api/tipografias/${id}`, {
                    method: 'PUT',
                    body: formData
                });
                if (!resp.ok) {
                    const t = await resp.text().catch(()=>'');
                    throw new Error(`Server responded ${resp.status} ${t}`);
                }
            } catch (err) {
                console.error('Error actualizando tipografía en servidor:', err);
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar la tipografía en el servidor. Cambios guardados localmente.' });
            }
        }

        Swal.fire({ icon: 'success', title: 'Guardado', text: 'Tipografía actualizada correctamente.' });
    }
};



const loadTypography = async (item) => {
    if (!item || !item.fonts) return
    fontConfig.value.titleSize = item.fonts.titleSize
    fontConfig.value.subtitleSize = item.fonts.subtitleSize
    fontConfig.value.paragraphSize = item.fonts.paragraphSize
    // asignar display/url
    fontConfig.value.primaryFont = item.fonts.primaryFont || ''
    fontConfig.value.secondaryFont = item.fonts.secondaryFont || ''

    // intentar cargar fonts desde URL si parecen URLs
    const tryLoadUrlAsFamily = async (url, which) => {
        if (!url || typeof url !== 'string') return
        // si comienza con / o http, intentamos cargar
        if (url.startsWith('/') || url.startsWith('http')) {
            const family = (which === 'primary' ? 'LoadedPrimary_' : 'LoadedSecondary_') + Date.now().toString()
            await loadFontFromUrl(url, family)
            if (which === 'primary') {
                fontConfig.value.primaryFamily = family
                // también guardar la family en el item para que la tarjeta muestre la fuente
                try { item.fonts.primaryFamily = family } catch (e) {}
            }
            else {
                fontConfig.value.secondaryFamily = family
                try { item.fonts.secondaryFamily = family } catch (e) {}
            }
        }
    }

    // preguntar si desea la tipografía



    // activar la tipografia en el backend

    const result = await Swal.fire({
        title: "Cargar Tipografía",
        text: `¿Deseas activar la tipografía "${item.name}" para previsualización?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, activar",
        cancelButtonText: "Cancelar"
    })
    if (!result.isConfirmed) return

    const response = await fetch(`http://localhost:3000/api/tipografias/${item.id}/activate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // ✅ Indica que envías JSON
        },
        body: JSON.stringify({active: true})  // ✅ Convierte el objeto a string JSON
        });
    if (!response.ok) {
        const t = await response.text().catch(()=>'')
        console.error(`Error activating typography on server: ${response.status} ${t}`)
    }


    // kick off loads but don't block UI
    tryLoadUrlAsFamily(fontConfig.value.primaryFont, 'primary')
    tryLoadUrlAsFamily(fontConfig.value.secondaryFont, 'secondary')
    // Clear font errors when loading typography
    fontErrors.value.primaryFont = null
    fontErrors.value.secondaryFont = null

    Swal.fire({
        icon: 'success',
        title: 'Tipografía cargada',
        text: `La tipografía "${item.name}" ha sido cargada exitosamente! Deseas ir al home para verla en acción?`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ir al Home',
        cancelButtonText: 'Quedarme aquí',
    }).then((result) => {
        if (result.isConfirmed) {
            // redirigir al home
            window.location.href = '/'
        }
    })
}

const deleteTypography = (id) => {
    const item = savedTypography.value.find(p => p.id === id)
    if (!item) return

    Swal.fire({
        title: "Estas seguro?",
        text: "Esta acción no se puede revertir!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "Cancelar"
    }).then(async (result) => {
        if (!result.isConfirmed) return

        // intentar eliminar en el backend si id es numérico
        try {
            const idStr = String(item.id || '')
            const isNumeric = /^\d+$/.test(idStr)
            if (isNumeric) {
                const resp = await fetch(`http://localhost:3000/api/tipografias/${idStr}`, { method: 'DELETE' })
                if (!resp.ok) {
                    const t = await resp.text().catch(()=>'')
                    throw new Error(`Server: ${resp.status} ${t}`)
                }
            }

        savedTypography.value = savedTypography.value.filter(p => p.id !== id)
        saveTypographiesToStorage()

            Swal.fire({ title: 'Eliminado!', text: 'Tu tipografía ha sido eliminada.', icon: 'success' })
        } catch (err) {
            console.error('Error eliminando tipografía:', err)
            // eliminar localmente de todas formas
            savedTypography.value = savedTypography.value.filter(p => p.id !== id)
            saveTypographiesToStorage()
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar la tipografía en el servidor. Entrada local eliminada.' })
        }
    })
}

// Context menu state and handlers
const contextMenu = ref({ visible: false, x: 0, y: 0, item: null, type: null })

const openContextMenu = (event, item, type) => {
    event.preventDefault && event.preventDefault()
    contextMenu.value = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        item,
        type
    }
}

const closeContextMenu = () => {
    contextMenu.value.visible = false
    contextMenu.value.item = null
    contextMenu.value.type = null
}

const contextLoad = () => {
    const it = contextMenu.value.item
    if (!it) return closeContextMenu()
    if (contextMenu.value.type === 'palette') {
        loadPalette(it)
    } else if (contextMenu.value.type === 'typography') {
        loadTypography(it)
    }
    closeContextMenu()
}

const contextDelete = () => {
    const it = contextMenu.value.item
    if (!it) return closeContextMenu()
    if (contextMenu.value.type === 'palette') {
        deletePalette(it.id)
    } else if (contextMenu.value.type === 'typography') {
        deleteTypography(it.id)
    }
    closeContextMenu()
}

const editPalette = async (palette) => {
    if (!palette) return

    // Construir HTML del modal con inputs para nombre y 5 colores
    const id = String(palette.id || '')
    const paletteColors = (palette.colors && palette.colors.slice(0,5)) || [{value:''},{value:''},{value:''},{value:''},{value:''}]
    const html = `
        <div class="swal-edit-palette">
            <style>
                .swal-input-error{border-color:#dc3545!important;box-shadow:0 0 0 3px rgba(220,53,69,0.08);}
                .swal-error-msg{color:#dc3545;font-size:0.85rem;margin-top:4px;margin-bottom:6px;}
                .swal-field-label{display:block;font-weight:600;margin-bottom:6px;color:#34495e;font-size:0.9rem}
                /* evitar overflow horizontal en la modal */
                .swal-edit-palette { max-width: 520px; box-sizing: border-box; }
                .swal-edit-palette .swal-color-row { display:flex; gap:8px; align-items:center; margin-bottom:6px; }
                .swal-edit-palette .swal-color-container { flex:1; min-width:0; }
                .swal-edit-palette .swal-palette-color-text { width:100%; box-sizing:border-box; max-width:360px; }
                @media (max-width:520px) {
                    .swal-edit-palette { max-width: 90vw; }
                    .swal-edit-palette .swal-palette-color-text { max-width: 100%; }
                }
            </style>
            <label class="swal-field-label" for="swal-palette-name">Nombre</label>
            <input id="swal-palette-name" class="swal2-input" placeholder="Nombre" value="${escapeHtml(palette.name || '')}">
            <div id="swal-palette-name-error" class="swal-error-msg" aria-live="polite"></div>
            ${[0,1,2,3,4].map(i => `
                <div class="swal-color-row">
                    <input id="swal-palette-color-${i}" type="color" value="${escapeHtml(paletteColors[i] && paletteColors[i].value ? paletteColors[i].value : (i===4? '#ffffff' : '#000000'))}" style="width:48px;height:36px;border-radius:6px;border:1px solid #ccc;"/>
                    <div class="swal-color-container">
                        <input id="swal-palette-color-text-${i}" class="swal2-input swal-palette-color-text" value="${escapeHtml(paletteColors[i] && paletteColors[i].value ? paletteColors[i].value : (i===4? '#ffffff' : '#000000'))}" />
                        <div id="swal-palette-color-error-${i}" class="swal-error-msg" aria-live="polite"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `

    const { value: confirm } = await Swal.fire({
        title: 'Editar paleta',
        html,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
            didOpen: () => {
            // sincronizar inputs color <-> text y validar en tiempo real
            const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

            const nameEl = document.getElementById('swal-palette-name')
            const nameErrorEl = document.getElementById('swal-palette-name-error')

            const setError = (el, errMsg) => {
                if (!el) return
                if (errMsg) {
                    el.classList.add('swal-input-error')
                } else {
                    el.classList.remove('swal-input-error')
                }
            }

            const setErrorMsg = (errEl, msg) => {
                if (!errEl) return
                errEl.textContent = msg || ''
            }

            const validateName = () => {
                const v = (nameEl && nameEl.value || '').trim()
                if (!v) {
                    setError(nameEl, true)
                    setErrorMsg(nameErrorEl, 'El nombre no puede estar vacío')
                    return false
                }
                setError(nameEl, false)
                setErrorMsg(nameErrorEl, '')
                return true
            }

            // attach instant validation for name
            if (nameEl) {
                nameEl.addEventListener('input', validateName)
                // initial validation
                validateName()
            }

                for (let i = 0; i < 5; i++) {
                const colorEl = document.getElementById(`swal-palette-color-${i}`)
                const textEl = document.getElementById(`swal-palette-color-text-${i}`)
                const errEl = document.getElementById(`swal-palette-color-error-${i}`)
                if (!colorEl || !textEl) continue

                const validateColorField = () => {
                    const v = (textEl && textEl.value || '').trim()
                    if (!v) {
                        setError(textEl, true)
                        setErrorMsg(errEl, 'El color no puede estar vacío')
                        return false
                    }
                    // Aceptamos tanto #RGB como #RRGGBB en la validación pero NO normalizamos aquí.
                    // La expansión se realizará al enviar (preConfirm) para evitar cambios automáticos.
                    if (!hexPattern.test(v) && !hexPattern.test(expandHex(v))) {
                        setError(textEl, true)
                        setErrorMsg(errEl, 'Formato inválido. Use #RRGGBB o #RGB')
                        return false
                    }
                    // Es válido: no forzamos cambios en los inputs para no sorprender al usuario
                    setError(textEl, false)
                    setErrorMsg(errEl, '')
                    return true
                }

                // cuando cambie el color picker, actualizar el campo de texto y validar
                colorEl.addEventListener('input', (e) => {
                    try { textEl.value = e.target.value } catch (__) {}
                    validateColorField()
                })

                // cuando cambie el texto, sólo validar (no normalizar ni reescribir inputs)
                textEl.addEventListener('input', (e) => {
                    // mantener lo que el usuario escribe; sólo validar el formato
                    validateColorField()
                })

                // initial validation
                validateColorField()
            }
        },
        preConfirm: () => {
            const nameEl = document.getElementById('swal-palette-name')
            const name = nameEl ? nameEl.value.trim() : ''
            const colors = []
            for (let i = 0; i < 5; i++) {
                const colorInput = document.getElementById(`swal-palette-color-${i}`)
                const colorText = document.getElementById(`swal-palette-color-text-${i}`)
                const raw = (colorText && colorText.value) ? colorText.value.trim() : (colorInput && colorInput.value) ? colorInput.value : ''
                colors.push(expandHex(raw))
            }

            // Validaciones
            if (!name) {
                Swal.showValidationMessage('El nombre no puede estar vacío')
                return false
            }
            const hexPattern = /^#([A-Fa-f0-9]{6})$/ // ya expandimos todo a 6
            for (let i = 0; i < colors.length; i++) {
                if (!hexPattern.test(colors[i])) {
                    Swal.showValidationMessage(`El color ${i+1} no es un hex válido: ${colors[i]}`)
                    return false
                }
            }

            return { name, colors }
        }
    })

    if (!confirm) return

    const { name, colors } = confirm

    // Actualizar localmente y en servidor si aplica
    const target = savedPalettes.value.find(p => String(p.id) === id)
    if (target) {
        // Mapear a estructura interna
        target.name = name
        target.colors = colors.map((c, idx) => ({ id: `${id}-c${idx+1}`, label: `Color ${idx+1}`, value: c }))

        try { savePalettesToStorage() } catch (e) {}

        // Si id es numérico, enviar PUT
        if (/^\d+$/.test(id)) {
            try {
                const payload = { name, color1: colors[0], color2: colors[1], color3: colors[2], color4: colors[3], color5: colors[4] }
                const resp = await fetch(`http://localhost:3000/api/colors/${id}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                })
                if (!resp.ok) {
                    const t = await resp.text().catch(()=>'')
                    throw new Error(`Server: ${resp.status} ${t}`)
                }
            } catch (err) {
                console.error('Error actualizando paleta en servidor:', err)
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar la paleta en el servidor. Cambios guardados localmente.' })
            }
        }

        Swal.fire({ icon: 'success', title: 'Guardado', text: 'Paleta actualizada correctamente.' })
    }
}

// pequeño helper para escapar HTML en inputs del modal
const escapeHtml = (str) => {
    if (!str) return ''
    return String(str).replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m] })
}

// reemplazamos el antiguo contextEdit para que abra el editor enriquecido para paletas
const contextEdit = async () => {
    const it = contextMenu.value.item
    if (!it) return closeContextMenu()

    if (contextMenu.value.type === 'palette') {
        closeContextMenu()
        await editPalette(it)
    } else if (contextMenu.value.type === 'typography') {
        closeContextMenu()
        // Abrir editor enriquecido para tipografías
        await editTypography(it)
    }

    closeContextMenu()
}

const _onDocumentClick = (e) => {
    //<bos>�rrar si se hace click fuera del men�
    if (!contextMenu.value.visible) return
    const menuEl = document.getElementById('fcontextmenu')
    if (menuEl && !menuEl.contains(e.target)) {
        closeContextMenu()
    }
}

const _onEscape = (e) => {
    if (e.key === 'Escape') closeContextMenu()
}


onMounted(() => {
    document.addEventListener('click', _onDocumentClick)
    document.addEventListener('keydown', _onEscape)
    fetchPalettesFromAPI()
    // Cargar tipografías desde servidor y storage (fallback)
    fetchTypographiesFromAPI()
    loadTypographiesFromStorage()

    // Cargar la última paleta guardada en localStorage (persistencia)
    const savedPalette = themeManager.loadPalette()
    if (savedPalette) {
        themeManager.applyPalette(savedPalette)
    }
})

onUnmounted(() => {
    document.removeEventListener('click', _onDocumentClick)
    document.removeEventListener('keydown', _onEscape)
})

const saveTypographiesToStorage = () => {
    try {
        localStorage.setItem('dashboard-typographies', JSON.stringify(savedTypography.value))
    } catch (error) {
        console.error('Error guardando tipograf�as en localStorage:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al guardar las tipografías. Inténtalo de nuevo.'
        })
    }
}

const loadTypographiesFromStorage = () => {
    try {
        const stored = localStorage.getItem('dashboard-typographies')
        if (stored) {
            savedTypography.value = JSON.parse(stored)
        }
    } catch (error) {
        console.error('Error cargando tipografías desde localStorage:', error)
        savedTypography.value = []
    }
}

const loadPalette = async (palette) => {
    if (!palette || !palette.colors) return

    // Primera validación: confirmar si quiere cargar la paleta
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres cargar la paleta "${palette.name}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cargar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom',
            confirmButton: 'swal2-confirm-custom',
            cancelButton: 'swal2-cancel-custom'
        }
    })

    // Si confirma, proceder con la carga
    if (result.isConfirmed) {
        colorConfig.value = palette.colors.map(color => ({ ...color }))

        // Aplicar colores al template real
        applyColorsToTemplate(palette.colors)

        // Guardar y aplicar paleta de forma persistente
        themeManager.savePalette(palette)
        themeManager.applyPalette(palette)

        // Segunda validación: mostrar éxito y preguntar si quiere ir al home
        const goHomeResult = await Swal.fire({
            icon: 'success',
            title: 'Paleta cargada',
            text: `La paleta "${palette.name}" ha sido cargada exitosamente! Deseas ir al home para verla en acción?`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ir al Home',
            cancelButtonText: 'Quedarme aquí',
        })
        if (goHomeResult.isConfirmed) {
            // redirigir al home
            window.location.href = '/'
        }
    }
}


const deletePalette = async (paletteId) => {
    const palette = savedPalettes.value.find(p => p.id === paletteId)
    if (!palette) return

    const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede revertir!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "Cancelar"
    })

    if (!result.isConfirmed) return

    // Intentar eliminar en el backend si el id parece numérico (id desde BD)
    try {
        const idStr = String(palette.id || '')
        const isNumeric = /^\d+$/.test(idStr)
        if (isNumeric) {
            // El endpoint esperado es /api/colors/:id (ajusta si tu ruta es distinta)
            const resp = await fetch(`http://localhost:3000/api/colors/${idStr}`, { method: 'DELETE' })
            if (!resp.ok) {
                // Si el servidor respondió con error, lanzar para mostrar el mensaje
                const text = await resp.text().catch(() => '')
                throw new Error(`Server responded ${resp.status} ${text}`)
            }
        }

        // Eliminar localmente siempre
        savedPalettes.value = savedPalettes.value.filter(p => String(p.id) !== String(paletteId))
        try { savePalettesToStorage() } catch (e) { /* no crítico */ }

        await Swal.fire({
            title: "Eliminado!",
            text: "Tu paleta ha sido eliminada.",
        icon: "success"
        })
    } catch (error) {
        console.error('Error eliminando paleta:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la paleta en el servidor. La entrada local puede haber sido removida.'
        })
    }
}

const savePalettesToStorage = () => {
    try {
        localStorage.setItem('dashboard-palettes', JSON.stringify(savedPalettes.value))
    } catch (error) {
        console.error('Error guardando paletas en localStorage:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al guardar las paletas. Inténtalo de nuevo.'
        })
    }
}

const fetchPalettesFromAPI = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/colors')
        if (!response.ok) throw new Error('Error fetching palettes')
        const data = await response.json()
        console.log('Paletas desde API:', data)

        // Esperamos que cada fila venga con campos: id_color, name, color1..color5, created_at
        for (const row of data) {
            try {
                const id = row.id_color != null ? String(row.id_color) : (row.id || ('local-' + Date.now().toString()))
                const name = row.name || row.nombre || `Paleta ${id}`

                // Mapear las columnas color1..color5 a la estructura interna [{id,label,value},...]
                const colors = []
                const colorFields = ['color1','color2','color3','color4','color5']
                const defaultLabels = ['Color 1','Color 2','Color 3','Color 4','Color 5']
                for (let i = 0; i < colorFields.length; i++) {
                    const field = colorFields[i]
                    const raw = (row[field] || '').toString().trim()
                    const value = raw && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(raw) ? raw : (i === 4 ? '#ffffff' : '#000000')
                    colors.push({ id: `${id}-c${i+1}`, label: defaultLabels[i], value })
                }

                const createdAt = row.created_at || row.createdAt || new Date().toISOString()

                // Evitar duplicados por id
                const exists = savedPalettes.value.find(p => String(p.id) === String(id) || p.name === name)
                if (!exists) {
                    savedPalettes.value.push({
                        id,
                        name,
                        colors,
                        createdAt
                    })
                }
            } catch (innerErr) {
                console.warn('Error mapeando fila de paleta desde API, saltando:', innerErr, row)
            }
        }

        // Persistir en storage para que la UI las muestre incluso offline
        try { savePalettesToStorage() } catch (e) { /* no crítico */ }

    } catch (error) {
        console.error('Error fetching palettes from API:', error)
    }
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// helper: mapear arreglo de colores a payload esperado por la API
const mapColorsPayload = (colorsArr) => {
    const fields = ['color1','color2','color3','color4','color5']
    const payload = {}
    for (let i = 0; i < fields.length; i++) {
        const raw = (colorsArr && colorsArr[i] && colorsArr[i].value) ? colorsArr[i].value : (i === 4 ? '#ffffff' : '#000000')
        // Expandir hex cortos al construir el payload (solo al enviar al backend)
        payload[fields[i]] = expandHex(raw)
    }
    return payload
}

// helper: extrae solo el nombre del archivo desde una URL o path
const fileBasename = (pathOrUrl) => {
    if (!pathOrUrl) return ''
    try {
        // Si es una URL, extraer pathname
        const u = new URL(pathOrUrl, window.location.origin)
        const parts = u.pathname.split('/')
        return parts[parts.length - 1]
    } catch (e) {
        // si no es una URL válida, simplemente separar por / o \\
        const parts = String(pathOrUrl).split(/[/\\\\]/)
        return parts[parts.length - 1]
    }
}

// helper: extrae el nombre limpio de la fuente sin números ni timestamps
const getCleanFontName = (pathOrUrl) => {
    if (!pathOrUrl) return 'Sin fuente'

    const filename = fileBasename(pathOrUrl)
    if (!filename) return 'Sin fuente'

    // Eliminar extensión
    const nameWithoutExt = filename.replace(/\.(ttf|otf|woff2?)$/i, '')

    // Eliminar timestamps y números al inicio (formato: números-números-nombre)
    const cleanName = nameWithoutExt.replace(/^\d+-\d+-/, '')

    // Eliminar números al final y convertir guiones a espacios
    const fontName = cleanName
        .replace(/-\d+$/, '') // eliminar números al final
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalizar cada palabra
        .join(' ') // unir con espacios

    return fontName || 'Fuente personalizada'
}

// helper: obtiene el nombre de familia CSS para usar en font-family
const getFontFamilyName = (pathOrUrl, type = 'primary') => {
    if (!pathOrUrl) return type === 'primary' ? 'Saira, Arial, sans-serif' : 'Patua One, serif'

    const filename = fileBasename(pathOrUrl)
    if (!filename) return type === 'primary' ? 'Saira, Arial, sans-serif' : 'Patua One, serif'

    // Eliminar extensión
    const nameWithoutExt = filename.replace(/\.(ttf|otf|woff2?)$/i, '')

    // Eliminar timestamps y números al inicio
    const cleanName = nameWithoutExt.replace(/^\d+-\d+-/, '')

    // Eliminar números al final y convertir guiones a espacios
    const fontName = cleanName
        .replace(/-\d+$/, '')
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    // Crear un nombre de familia CSS válido
    const cssFamilyName = `"${fontName || 'Custom Font'}", ${type === 'primary' ? 'sans-serif' : 'serif'}`

    // Cargar la fuente automáticamente si es una URL local
    if (pathOrUrl.startsWith('/uploads/')) {
        loadFontFromUrl(pathOrUrl, fontName || 'Custom Font')
    }

    return cssFamilyName
}

// Cargar paletas al inicializar el componente
// onMounted(() => { // Moved to the main onMounted for cleaner code
//     loadPalettesFromStorage()
//     loadTypographiesFromStorage()
// })

//validar los tamaños de fuente
const validateFontSizes = () => {
    let isValid = true;
    if (fontConfig.value.titleSize < 20 || fontConfig.value.titleSize > 80) {
        isValid = false;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Tamaño de títulos inválido: debe estar entre 20 y 80 px'
        });
    }
    if (fontConfig.value.subtitleSize < 16 || fontConfig.value.subtitleSize > 60) {
        isValid = false;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Tamaño de subtítulos inválido: debe estar entre 16 y 60 px'
        });
    }
    if (fontConfig.value.paragraphSize < 12 || fontConfig.value.paragraphSize > 24) {
        isValid = false;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Tamaño de párrafos inválido: debe estar entre 12 y 24 px'
        });
    }
    return isValid;
}

// Funciones de validación y normalización de colores
// Expande hex cortos (#RGB) a formato completo #RRGGBB y normaliza a minúsculas
const expandHex = (hex) => {
    if (!hex || typeof hex !== 'string') return hex
    const h = hex.trim()
    const m3 = /^#([A-Fa-f0-9]{3})$/.exec(h)
    if (m3) {
        const chars = m3[1].split('')
        return '#' + chars.map(c => (c + c)).join('').toLowerCase()
    }
    const m6 = /^#([A-Fa-f0-9]{6})$/.exec(h)
    if (m6) return '#' + m6[1].toLowerCase()
    return h
}

const isValidHexColor = (color) => {
    if (!color || typeof color !== 'string') return false
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return hexPattern.test(color)
}

const validateColor = (colorId, colorValue) => {
    if (!colorValue || colorValue.trim() === '') {
        colorErrors.value[colorId] = 'El color no puede estar vacío'
        return false
    }

    // Aceptamos tanto #RGB como #RRGGBB en la validación, pero NO normalizamos aquí.
    // La expansión a 6 caracteres se hará únicamente al preparar el payload para el backend.
    const normalized = expandHex(colorValue)

    if (!isValidHexColor(normalized)) {
        colorErrors.value[colorId] = 'Formato inválido. Use #RRGGBB o #RGB (ej: #ff0000)'
        return false
    }

    // No reescribimos ni forzamos el value del modelo/input aquí para evitar cambios automáticos
    // que confundan al usuario. Solo limpiamos el error.
    delete colorErrors.value[colorId]
    return true
}

const onColorInput = (colorId, colorValue) => {
    // No normalizamos automáticamente aquí. Guardamos el valor tal cual el usuario lo escribió
    // y validamos aceptando formatos cortos (#RGB) o largos (#RRGGBB).
    try {
        const idx = colorConfig.value.findIndex(c => c.id === colorId)
        if (idx !== -1) colorConfig.value[idx].value = colorValue
    } catch (e) {}

    // Actualizar el input[type=color] únicamente si el valor ya es un hex de 6 caracteres
    try {
        const picker = document.getElementById(colorId)
        if (picker && typeof colorValue === 'string') {
            // sólo asignar al color picker si es un hex válido de 6 caracteres (incluye #)
            if (/^#[A-Fa-f0-9]{6}$/.test(colorValue)) picker.value = colorValue
        }
    } catch (e) {}

    // Validar pero sin mutar el valor
    validateColor(colorId, colorValue)
}

const hasColorError = (colorId) => {
    return colorErrors.value.hasOwnProperty(colorId)
}

const getColorError = (colorId) => {
    return colorErrors.value[colorId] || ''
}


</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

#dashboard-color-config {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    padding: 5rem 0;
    min-height: 80vh;
}

.color-config-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(20px);
}

.config-sidebar {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    height: fit-content;
    position: sticky;
    top: 2rem;
}

.config-tabs {
    display: flex;
    margin-bottom: 2rem;
    border-bottom: 2px solid #ecf0f1;
}

.tab-button {
    flex: 1;
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    color: #6c757d;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: #495057;
        background: #f8f9fa;
    }

    &.active {
        color: #667eea;
        border-bottom-color: #667eea;
        background: rgba(102, 126, 234, 0.05);
    }
}

.tab-content {
    min-height: 400px;
}

.config-section {
    margin-bottom: 2rem;

    &:last-of-type {
        margin-bottom: 0;
    }
}

.section-title {
    color: #2c3e50;
    font-weight: 700;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 0.75rem;
    display: flex;
    align-items: center;
}

.font-inputs {
    margin-bottom: 1.5rem;
}

.font-input-group {
    margin-bottom: 1rem;
}

.font-label {
    display: block;
    font-weight: 600;
    color: #34495e;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.font-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #ecf0f1;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
}

.font-uploads {
    margin-bottom: 1.5rem;
}

.font-upload-group {
    margin-bottom: 1.5rem;
}

.file-upload-wrapper {
    position: relative;
}

.file-input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.file-upload-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: #f8f9fa;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    color: #6c757d;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background: #e9ecef;
        border-color: #adb5bd;
        color: #495057;
    }
}

.font-file-info {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: #28a745;
    font-weight: 500;
}

.color-inputs {
    margin-bottom: 2rem;
}

.color-input-group {
    margin-bottom: 1.5rem;
}

.color-label {
    display: block;
    font-weight: 600;
    color: #34495e;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.color-input-wrapper {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.color-picker {
    width: 50px;
    height: 40px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    &::-webkit-color-swatch {
        border: none;
        border-radius: 6px;
    }
}

.color-text {
    flex: 1;
    padding: 0.5rem 1rem;
    border: 2px solid #ecf0f1;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &.error {
        border-color: #dc3545;
        background-color: #fff5f5;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);

        &:focus {
            border-color: #dc3545;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2);
        }
    }
}

.color-error-message {
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 6px;
    color: #721c24;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    animation: slideDown 0.3s ease;

    i {
        color: #dc3545;
        font-size: 0.9rem;
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.sidebar-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;

    .btn {
        border-radius: 8px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.8rem;
        padding: 0.65rem 1.25rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn-save {
        background: #ff6b35;
        color: white;

        &:hover {
            background: #ff5722;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(255, 107, 53, 0.3);
        }

        &:active {
            transform: translateY(0);
        }
    }

    .btn-reset {
        background: white;
        color: #6c757d;
        border: 2px solid #dee2e6 !important;

        &:hover {
            background: #f8f9fa;
            border-color: #adb5bd !important;
            color: #495057;
        }

        &:active {
            background: #e9ecef;
        }
    }
}

.dashboard-preview {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.preview-title {
    color: #2c3e50;
    font-weight: 700;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
}

.typography-preview {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 2px solid #e9ecef;
}

.preview-icon {
    width: 40px;
    height: 40px;
    background: #28a745;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;

    i {
        color: white;
        font-size: 1.2rem;
    }
}

.preview-title-text {
    color: #2c3e50;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.preview-text {
    color: #6c757d;
    line-height: 1.6;
    margin: 0;
}

.current-config {
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 2px solid #e9ecef;
}

.config-subtitle {
    color: #2c3e50;
    font-weight: 700;
    margin-bottom: 1rem;
    font-size: 1rem;
}

.config-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.config-tag {
    background: #667eea;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
}

.color-palette {
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 2px solid #e9ecef;
}

.color-usage {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.color-usage-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.color-swatch {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    border: 2px solid #e9ecef;
}

.color-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.color-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
}

.usage-bar {
    width: 100%;
    height: 8px;
    background: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
}

.usage-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
}

.usage-percentage {
    font-size: 0.8rem;
    color: #6c757d;
    font-weight: 500;
}

.preview-container {
    border: 2px solid #ecf0f1;
    border-radius: 10px;
    overflow: hidden;
    min-height: 400px;
}

.preview-header {
    padding: 1rem 1.5rem;
    color: white;
    transition: all 0.3s ease;
}

.preview-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.preview-logo {
    font-weight: 700;
    font-size: 1.2rem;
}

.preview-menu {
    display: flex;
    gap: 1.5rem;

    span {
        font-size: 0.9rem;
        opacity: 0.9;
        cursor: pointer;
        transition: opacity 0.3s ease;

        &:hover {
            opacity: 1;
        }
    }
}

.preview-content {
    padding: 1.5rem;
}

.preview-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.preview-card {
    padding: 1rem;
    border-radius: 10px;
    color: white;
    text-align: center;
    transition: all 0.3s ease;

    i {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        display: block;
    }

    span {
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
}

.preview-section {
    padding: 1.5rem;
    border-radius: 10px;
    color: white;
    transition: all 0.3s ease;

    h6 {
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    p {
        margin: 0;
        opacity: 0.9;
        line-height: 1.5;
    }
}

.combined-preview {
    border: 2px solid #ecf0f1;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 2rem;
    background: var(--preview-background, #ffffff);
    /* allow preview to be themed via CSS custom properties set on the element */
}

/* Fix: paragraphs inside the preview must use the preview 'accent' (color 3).
   There are global rules (e.g. `p { color: var(--accent-color) !important; }`) that
   can override the preview's intended variables. We add a higher-specificity rule
   and !important to ensure preview paragraphs use --preview-accent. */
.dashboard-preview .combined-preview p,
.dashboard-preview .combined-preview .c-card p,
.dashboard-preview .combined-preview .card-desc {
    color: var(--preview-accent, #6c757d) !important;
    fill: var(--preview-accent, #6c757d) !important;
}

/* Force color 2 (preview-secondary) on specific preview texts requested */
.dashboard-preview .combined-preview .hero-title,
.dashboard-preview .combined-preview .hero-subtitle,
.dashboard-preview .combined-preview .c-card h6,
.dashboard-preview .combined-preview .c-card .card-title,
.dashboard-preview .combined-preview .combined-footer .footer-title {
    color: var(--preview-secondary, #ff5900) !important;
    fill: var(--preview-secondary, #ff5900) !important;
}

.combined-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background-color: var(--preview-primary, #212529);
    color: var(--preview-header-text, #ffffff);
}

.combined-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
}

.logo-mark {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: inline-block;
    background-color: var(--preview-secondary, #ff5900);
}

.combined-menu {
    display: flex;
    align-items: center;
    gap: 1rem;

    .combined-menu-item {
        opacity: 0.95;
        cursor: pointer;
        font-size: var(--preview-paragraph-size, 16px);
        color: var(--preview-success, #343a40);
    }
}

.cta-btn {
    border: none;
    border-radius: 999px;
    padding: 0.45rem 0.9rem;
    font-weight: 600;
    background-color: var(--preview-secondary, #ff5900);
    color: var(--preview-background, #ffffff);
    transition: background-color 0.18s ease, transform 0.18s ease;
}

.combined-hero {
    padding: 2rem 1.25rem;
    border-top: 1px solid #ecf0f1;
    background: linear-gradient(135deg, var(--preview-primary, #212529) 0%, var(--preview-secondary, #ff5900) 100%);
    color: var(--preview-hero-text, rgba(255,255,255,0.95));
}

.hero-title {
    margin: 0 0 0.5rem 0;
    line-height: 1.15;
    font-size: var(--preview-title-size, 40px);
    font-family: var(--preview-font-family-primary, 'Patua One, serif');
    color: var(--preview-secondary, #ff5900);
}

.hero-subtitle {
    margin: 0 0 1.25rem 0;
    font-size: var(--preview-subtitle-size, 28px);
    font-family: var(--preview-font-family-secondary, 'Saira, Arial, sans-serif');
    color: var(--preview-secondary, #ff5900);
}

.hero-actions {
    display: flex;
    gap: 0.75rem;
}

.xl-btn {
    padding: 0.6rem 1.1rem;
    border-radius: 10px;
    font-weight: 700;
    border: 2px solid transparent;
}

.xl-btn.primary {
    background-color: var(--preview-secondary, #ff5900);
    color: var(--preview-background, #ffffff);
}

.xl-btn.ghost {
    background: transparent;
    border-color: var(--preview-secondary, #ff5900);
    color: var(--preview-secondary, #ff5900);
}

.xl-btn.ghost {
    background: transparent;
}

.combined-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    padding: 1rem 1.25rem 1.25rem;
    background-color: var(--preview-background, #ffffff);
}

.c-card {
    border: 1px solid #e9ecef;
    border-radius: 10px;
    padding: 1rem;
    text-align: left;

    i {
        font-size: 1.25rem;
        margin-bottom: 0.35rem;
        display: inline-block;
        color: var(--preview-secondary, #ff5900);
    }
    h6 {
        margin: 0 0 0.25rem 0;
        font-weight: 700;
        color: var(--preview-secondary, #ff5900);
        font-size: var(--preview-subtitle-size, 18px);
    }
    p {
        margin: 0;
        color: var(--preview-accent, #6c757d);
        font-size: var(--preview-paragraph-size, 16px);
        line-height: 1.5;
    }
}

.icon-accent { color: var(--preview-secondary, #ff5900); }
.card-title { color: var(--preview-secondary, #ff5900); }
.card-desc { color: var(--preview-accent, #6c757d); }

@include media-breakpoint-down(lg) {
    .config-sidebar {
        position: static;
        margin-bottom: 2rem;
    }

    .config-tabs {
        flex-direction: column;
        border-bottom: none;
        border-right: 2px solid #ecf0f1;
        margin-bottom: 0;
        margin-right: 1rem;
    }

    .tab-button {
        border-bottom: none;
        border-right: 3px solid transparent;
        text-align: left;
        justify-content: flex-start;

        &.active {
            border-bottom-color: transparent;
            border-right-color: #667eea;
        }
    }

    .tab-content {
        min-height: auto;
    }

    .preview-cards {
        grid-template-columns: 1fr;
    }

    .config-tags {
        justify-content: center;
    }

    .color-usage-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .color-info {
        width: 100%;
    }
}

@include media-breakpoint-down(md) {
    .config-tabs {
        flex-direction: row;
        border-right: none;
        border-bottom: 2px solid #ecf0f1;
        margin-right: 0;
        margin-bottom: 2rem;
    }

    .tab-button {
        border-right: none;
        border-bottom: 3px solid transparent;
        text-align: center;
        justify-content: center;
        padding: 0.75rem 1rem;
        font-size: 0.8rem;

        &.active {
            border-right-color: transparent;
            border-bottom-color: #667eea;
        }
    }
}

/* Estilos para el campo de nombre de paleta en la sección de colores */
.palette-name-section {
    margin-bottom: 2rem;
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;

    .palette-name-title {
        font-size: 1rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 0.75rem;
        margin-bottom: 5px;
        display: flex;
        align-items: center;

        i {
            color: #667eea;
        }
    }

    .palette-name-input {
        .form-control {
            border: 1px solid #ced4da;
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
            width: 100%;

            &:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
            }
        }
    }
}

.typography-name-section {
    margin-bottom: 2rem;
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;

    .typography-name-title {
        font-size: 1rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;

        i {
            color: #667eea;
        }
    }

    .typography-name-input {
        .form-control {
            border: 1px solid #ced4da;
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
            width: 100%;

            &:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
            }
        }
    }
}

/* Estilos para la sección de paletas guardadas (fuera del sidebar) */
.saved-palettes-section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;

    .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;

        i {
            color: #667eea;
        }

        .palette-count {
            font-size: 1rem;
            font-weight: 500;
            color: #6c757d;
            margin-left: 0.5rem;
        }
    }

    .no-palettes {
        text-align: center;
        padding: 3rem 1rem;
        color: #6c757d;

        i {
            font-size: 4rem;
            color: #dee2e6;
            margin-bottom: 1.5rem;
        }

        p {
            margin-bottom: 0.5rem;
            font-weight: 500;
            font-size: 1.1rem;
        }

        small {
            font-size: 0.9rem;
        }
    }

    .palettes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;

        @include media-breakpoint-down(md) {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
    }

    .palette-card {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 1.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

        &:hover {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            transform: translateY(-4px);
            border-color: #667eea;
        }

        .palette-header {
            margin-bottom: 1rem;

            .palette-name {
                font-size: 1.1rem;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 0.25rem;
            }

            .palette-date {
                color: #6c757d;
                font-size: 0.85rem;
            }
        }

        .palette-colors {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1.25rem;
            flex-wrap: wrap;
            justify-content: center;

            .color-preview {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover {
                    transform: scale(1.15);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }
            }
        }

        .palette-actions {
            display: flex;
            gap: 0.75rem;
            justify-content: center;

            .btn {
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                border-radius: 8px;
                transition: all 0.3s ease;
                font-weight: 500;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
            }
        }
    }

    /* Estilos específicos para la vista de tipografías (lista horizontal por item) */
    .typographies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }

    .typographies-grid .palette-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.25rem;
        overflow: hidden;
        box-sizing: border-box;
        min-height: 200px;
    }

    .typographies-grid .palette-header {
        flex: 0 0 auto;
        min-width: 180px;
        max-width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .typographies-grid .palette-colors {
        flex: 1 1 0%;
        display: block;
        margin-right: 1rem;
        min-width: 0; /* allow children to shrink */
    }

    .typographies-grid .palette-colors .color-preview {
        width: 100%;
        height: auto;
        border-radius: 8px;
        border: 1px solid #dee2e6;
        box-shadow: none;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        box-sizing: border-box;
    }

    .typographies-grid .palette-colors .color-preview > div {
        padding: 10px 14px;
        min-width: 0;
    }

    .typographies-grid .palette-actions {
        margin-left: auto;
        display: flex;
        gap: 0.5rem;
    }

    /* Font names line under the sample - make them wrap/truncate safely */
    .typographies-grid .palette-colors .font-names {
        display:flex;
        gap:12px;
        justify-content:center;
        margin-top:10px;
        color:#495057;
        font-size:0.95rem;
        flex-wrap:wrap;
    }
    .typographies-grid .palette-colors .font-names div {
        max-width:100%;
        word-break:break-word;
        overflow-wrap:anywhere;
    }
}

/* Estilos para validaciones de tipografía */
.font-input.error, .file-input.error {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 3px rgba(220,53,69,0.08);
}

.input-error-message {
    color: #dc3545;
    font-size: 0.85rem;
    margin-top: 0.4rem;
}

/* Context menu styles */
.context-menu {
    min-width: 160px;
    background: #ffffff;
    border-radius: 8px;
    padding: 0.35rem 0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border: 1px solid rgba(0,0,0,0.06);
}
.context-menu .context-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.95rem;
    color: #343a40;
}
.context-menu .context-item:hover {
    background: #f8f9fa;
}
.context-menu .context-item.text-danger {
    color: #dc3545;
}

/* Typography sample styles */
.typography-sample {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.typography-sample .sample-line {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
.typography-sample .sample-line A, .typography-sample .sample-line a {
    line-height: 1;
}
.typography-sample .sample-label {
    font-size: 0.85rem;
    color: #6c757d;
    margin-left: 0.5rem;
}

/* Estilos para la sección de información de fuentes */
.font-info-section {
    margin-top: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.font-item {
    margin-bottom: 8px;
}

.font-item:last-child {
    margin-bottom: 0;
}

.font-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #495057;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.font-name {
    font-size: 0.85rem;
    color: #212529;
    font-weight: 500;
    word-break: break-word;
    line-height: 1.3;
}

/* Estilos para la sección footer de la vista previa */
.combined-footer {
    padding: 2rem;
    text-align: center;
    border-radius: 0 0 10px 10px;
    background-color: var(--preview-success, #343a40);
    color: var(--preview-footer-text, #ffffff);
}

.footer-content h5 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    color: var(--preview-secondary, #ff5900);
}
.footer-content p {
    margin-bottom: 1.5rem;
    opacity: 0.9;
    color: var(--preview-accent, #ffffff);
}
.footer-btn {
    transition: all 0.3s ease;
    background-color: var(--preview-secondary, #ff5900);
    color: var(--preview-background, #ffffff);
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}
.footer-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
