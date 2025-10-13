<template>
    <PageSection id="dashboard-color-config"
                 :darken="false"
                 :no-padding="false">
        <PageSectionHeader :title="'Configuración de Apariencia'"
                           :subtitle="'Personaliza colores y tipografía de tu dashboard'"
                           :center="true"/>

        <PageSectionContent>
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
                                            v-model="fontConfig.titleSize"
                                            class="font-input"
                                            min="20"
                                            max="80"
                                        />
                                    </div>
                                    
                                    <div class="font-input-group">
                                        <label class="font-label">Tamaño de Subtítulos (px)</label>
                                        <input 
                                            type="number" 
                                            v-model="fontConfig.subtitleSize"
                                            class="font-input"
                                            min="16"
                                            max="60"
                                        />
                                    </div>
                                    
                                    <div class="font-input-group">
                                        <label class="font-label">Tamaño de Párrafos (px)</label>
                                        <input 
                                            type="number" 
                                            v-model="fontConfig.paragraphSize"
                                            class="font-input"
                                            min="12"
                                            max="24"
                                        />
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
                                                accept=".ttf,.otf,.woff,.woff2"
                                                class="file-input"
                                            />
                                            <button class="file-upload-btn" @click="$refs.primaryFontInput.click()">
                                                <i class="fa-solid fa-upload me-2"></i>
                                                Seleccionar archivo .ttf
                                            </button>
                                        </div>
                                        <div v-if="fontConfig.primaryFont" class="font-file-info">
                                            <i class="fa-solid fa-check-circle text-success me-1"></i>
                                            {{ fontConfig.primaryFont }}
                                        </div>
                                    </div>
                                    
                                    <div class="font-upload-group">
                                        <label class="font-label">Fuente Secundaria (.ttf)</label>
                                        <div class="file-upload-wrapper">
                                            <input 
                                                type="file" 
                                                ref="secondaryFontInput"
                                                @change="handleSecondaryFontUpload"
                                                accept=".ttf,.otf,.woff,.woff2"
                                                class="file-input"
                                            />
                                            <button class="file-upload-btn" @click="$refs.secondaryFontInput.click()">
                                                <i class="fa-solid fa-upload me-2"></i>
                                                Seleccionar archivo .ttf
                                            </button>
                                        </div>
                                        <div v-if="fontConfig.secondaryFont" class="font-file-info">
                                            <i class="fa-solid fa-check-circle text-success me-1"></i>
                                            {{ fontConfig.secondaryFont }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="sidebar-actions">
                                <button class="btn btn-success btn-sm me-2" @click="saveCurrentPalette">
                                    <i class="fa-solid fa-save me-1"></i>
                                    Guardar Paleta
                                </button>
                                <button class="btn btn-outline-secondary btn-sm" @click="resetChanges">
                                    <i class="fa-solid fa-undo me-1"></i>
                                    Resetear
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
                            <div class="typography-preview" :style="{ 
                                fontFamily: fontConfig.primaryFont || 'Arial, sans-serif',
                                fontSize: fontConfig.paragraphSize + 'px'
                            }">
                                <div class="preview-icon">
                                    <i class="fa-solid fa-map-pin"></i>
                                </div>
                                <h1 class="preview-title-text" :style="{ 
                                    fontSize: fontConfig.titleSize + 'px',
                                    fontFamily: fontConfig.secondaryFont || 'Arial, sans-serif'
                                }">
                                    Travel Guide
                                </h1>
                                <p class="preview-text">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                                </p>
                            </div>
                            
                            
                            
                            
                            
                            <div class="preview-container">
                                <!-- Header Preview -->
                                <div class="preview-header" :style="{ backgroundColor: colorConfig[0].value }">
                                    <div class="preview-nav">
                                        <div class="preview-logo">Logo</div>
                                        <div class="preview-menu">
                                            <span>Inicio</span>
                                            <span>Dashboard</span>
                                            <span>Configuración</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Content Preview -->
                                <div class="preview-content">
                                    <div class="preview-cards">
                                        <div class="preview-card" :style="{ backgroundColor: colorConfig[1].value }">
                                            <i class="fa-solid fa-chart-bar"></i>
                                            <span>Estadística 1</span>
                                        </div>
                                        <div class="preview-card" :style="{ backgroundColor: colorConfig[2].value }">
                                            <i class="fa-solid fa-users"></i>
                                            <span>Estadística 2</span>
                                        </div>
                                        <div class="preview-card" :style="{ backgroundColor: colorConfig[3].value }">
                                            <i class="fa-solid fa-cog"></i>
                                            <span>Estadística 3</span>
                                        </div>
                                    </div>
                                    
                                    <div class="preview-section" :style="{ backgroundColor: colorConfig[4].value }">
                                        <h6>Sección de Contenido</h6>
                                        <p>Este es un ejemplo de cómo se verá tu dashboard con los colores seleccionados.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sección de Paletas Guardadas -->
                <div class="row mt-5">
                    <div class="col-12">
                        <div class="saved-palettes-section">
                            <h4 class="section-title">
                                <i class="fa-solid fa-save me-2"></i>
                                Paletas Guardadas
                                <span class="palette-count">({{ savedPalettes.length }})</span>
                            </h4>
                            
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
                                    
                                    <div class="palette-actions">
                                        <button 
                                            class="btn btn-sm btn-primary"
                                            @click="loadPalette(palette)"
                                            title="Cargar paleta"
                                        >
                                            <i class="fa-solid fa-upload me-1"></i>
                                            Cargar
                                        </button>
                                        <button 
                                            class="btn btn-sm btn-outline-danger"
                                            @click="deletePalette(palette.id)"
                                            title="Eliminar paleta"
                                        >
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
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
import {ref} from "vue"

const colorConfig = ref([
    {
        id: 'primary-color',
        label: 'Color Primario',
        value: '#667eea'
    },
    {
        id: 'secondary-color',
        label: 'Color Secundario',
        value: '#764ba2'
    },
    {
        id: 'accent-color',
        label: 'Color de Acento',
        value: '#f093fb'
    },
    {
        id: 'success-color',
        label: 'Color de Éxito',
        value: '#4facfe'
    },
    {
        id: 'background-color',
        label: 'Color de Fondo',
        value: '#f8f9fa'
    }
])

const fontConfig = ref({
    titleSize: 40,
    subtitleSize: 28,
    paragraphSize: 16,
    primaryFont: '',
    secondaryFont: ''
})

const activeTab = ref('colors')

// Variables para gestión de paletas
const newPaletteName = ref('')
const savedPalettes = ref([])

// Variables para validación de colores
const colorErrors = ref({})

const handlePrimaryFontUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        fontConfig.value.primaryFont = file.name
        // Aquí podrías cargar la fuente dinámicamente
        loadFont(file, 'primary-font')
    }
}

const handleSecondaryFontUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        fontConfig.value.secondaryFont = file.name
        // Aquí podrías cargar la fuente dinámicamente
        loadFont(file, 'secondary-font')
    }
}

const loadFont = (file, fontName) => {
    const reader = new FileReader()
    reader.onload = (e) => {
        const fontData = e.target.result
        const fontFace = new FontFace(fontName, fontData)
        fontFace.load().then((loadedFont) => {
            document.fonts.add(loadedFont)
        }).catch((error) => {
            console.error('Error loading font:', error)
        })
    }
    reader.readAsArrayBuffer(file)
}

const saveChanges = () => {
    // Aquí implementarías la lógica para guardar los cambios
    console.log('Guardando configuración:', { colorConfig: colorConfig.value, fontConfig: fontConfig.value })
    alert('Configuración guardada exitosamente!')
}

const resetChanges = () => {
    // Resetear a valores por defecto
    colorConfig.value = [
        { id: 'primary-color', label: 'Color Primario', value: '#667eea' },
        { id: 'secondary-color', label: 'Color Secundario', value: '#764ba2' },
        { id: 'accent-color', label: 'Color de Acento', value: '#f093fb' },
        { id: 'success-color', label: 'Color de Éxito', value: '#4facfe' },
        { id: 'background-color', label: 'Color de Fondo', value: '#f8f9fa' }
    ]
    fontConfig.value = {
        titleSize: 40,
        subtitleSize: 28,
        paragraphSize: 16,
        primaryFont: '',
        secondaryFont: ''
    }
    alert('Configuración reseteada a valores por defecto!')
}

// Funciones para gestión de paletas
const saveCurrentPalette = () => {
    if (!newPaletteName.value.trim()) {
        alert('Por favor ingresa un nombre para la paleta')
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
        alert('Por favor corrige los errores en los colores antes de guardar la paleta')
        return
    }
    
    // Verificar si ya existe una paleta con ese nombre
    const existingPalette = savedPalettes.value.find(p => p.name.toLowerCase() === newPaletteName.value.toLowerCase())
    if (existingPalette) {
        if (!confirm('Ya existe una paleta con ese nombre. ¿Deseas reemplazarla?')) {
            return
        }
        // Eliminar la paleta existente
        savedPalettes.value = savedPalettes.value.filter(p => p.id !== existingPalette.id)
    }
    
    // Crear nueva paleta
    const newPalette = {
        id: Date.now().toString(),
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
    
    alert('Paleta guardada exitosamente!')
}

const loadPalette = (palette) => {
    if (confirm(`¿Cargar la paleta "${palette.name}"? Esto reemplazará los colores actuales.`)) {
        // Cargar los colores de la paleta
        colorConfig.value = palette.colors.map(color => ({ ...color }))
        alert('Paleta cargada exitosamente!')
    }
}

const deletePalette = (paletteId) => {
    const palette = savedPalettes.value.find(p => p.id === paletteId)
    if (palette && confirm(`¿Eliminar la paleta "${palette.name}"?`)) {
        savedPalettes.value = savedPalettes.value.filter(p => p.id !== paletteId)
        savePalettesToStorage()
        alert('Paleta eliminada exitosamente!')
    }
}

const savePalettesToStorage = () => {
    try {
        localStorage.setItem('dashboard-palettes', JSON.stringify(savedPalettes.value))
    } catch (error) {
        console.error('Error guardando paletas en localStorage:', error)
        alert('Error al guardar las paletas. Inténtalo de nuevo.')
    }
}

const loadPalettesFromStorage = () => {
    try {
        const stored = localStorage.getItem('dashboard-palettes')
        if (stored) {
            savedPalettes.value = JSON.parse(stored)
        }
    } catch (error) {
        console.error('Error cargando paletas desde localStorage:', error)
        savedPalettes.value = []
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

// Cargar paletas al inicializar el componente
loadPalettesFromStorage()

// Funciones de validación de colores
const isValidHexColor = (color) => {
    // Patrón para validar formato hexadecimal (#RRGGBB o #RGB)
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexPattern.test(color);
}

const validateColor = (colorId, colorValue) => {
    if (!colorValue || colorValue.trim() === '') {
        colorErrors.value[colorId] = 'El color no puede estar vacío';
        return false;
    }
    
    if (!isValidHexColor(colorValue)) {
        colorErrors.value[colorId] = 'Formato inválido. Use #RRGGBB o #RGB (ej: #ff0000)';
        return false;
    }
    
    // Si es válido, eliminar el error
    delete colorErrors.value[colorId];
    return true;
}

const onColorInput = (colorId, colorValue) => {
    validateColor(colorId, colorValue);
}

const hasColorError = (colorId) => {
    return colorErrors.value.hasOwnProperty(colorId);
}

const getColorError = (colorId) => {
    return colorErrors.value[colorId] || '';
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
    
    .btn {
        border-radius: 8px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.8rem;
        padding: 0.5rem 1rem;
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

// Estilos para el campo de nombre de paleta en la sección de colores
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

// Estilos para la sección de paletas guardadas (fuera del sidebar)
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
}
</style>
