<template>
  <PageSection id="dashboard-multimedia" :darken="false" :no-padding="false">
    <PageSectionHeader :title="'Multimedia'" :subtitle="'Sube una imagen .jpg y recórtala'" :center="true" />

    <PageSectionContent>
      <!-- Subir Imagen -->
      <div class="multimedia-form card">
        <div class="form-row">
          <label for="imageName" class="form-label">Nombre de la imagen</label>
          <input id="imageName" v-model="imageName" type="text" class="form-input" placeholder="Ej: portada-proyecto" />
        </div>

        <div class="form-row">
          <label for="imageFile" class="form-label">Archivo (.jpg)</label>
          <input id="imageFile" ref="fileInput" type="file" class="form-input" accept="image/jpeg,.jpg" @change="onFileChange" />
          <small class="hint">Solo se permiten archivos JPG</small>
        </div>

        <div class="preview-grid" v-if="imageUrl">
          <div class="preview-left">
            <h4 class="section-title">Editor (Cropper)</h4>
            <div class="cropper-shell">
              <img ref="imageEl" :src="imageUrl" alt="Imagen seleccionada" class="cropper-image" />
            </div>
            <div class="controls">
              <button class="btn" @click="resetCrop">Reset</button>
              <button class="btn" @click="rotateLeft">Rotar -90°</button>
              <button class="btn" @click="rotateRight">Rotar +90°</button>
              <button class="btn primary" @click="generateCropped">Generar recorte</button>
              <button class="btn primary" :disabled="!canSave || isSubmitting" @click="submitForm">{{ isSubmitting ? 'Enviando…' : 'Enviar' }}</button>
            </div>
          </div>

          <div class="preview-right">
            <h4 class="section-title">Vista previa recorte</h4>
            <div class="result-shell" v-if="croppedUrl">
              <img :src="croppedUrl" alt="Vista previa recortada" class="result-image" />
            </div>
            <div v-else class="placeholder">Aún no has generado un recorte</div>
          </div>
        </div>
      </div>

      <!-- Subir Video -->
      <div class="multimedia-form card">
        <h3 class="block-title">Subir video</h3>

        <div class="form-row">
          <label for="videoName" class="form-label">Nombre del video</label>
          <input id="videoName" v-model="videoName" type="text" class="form-input" placeholder="Ej: demo-producto" />
        </div>

        <div class="form-row">
          <label for="videoFile" class="form-label">Archivo (.mp4)</label>
          <input id="videoFile" ref="videoFileInput" type="file" class="form-input" accept="video/mp4,.mp4" @change="onVideoFileChange" />
          <small class="hint">Solo se permiten archivos MP4</small>
        </div>

        <div class="form-row">
          <label for="subtitle1" class="form-label">Subtítulos 1 (.vtt)</label>
          <input id="subtitle1" ref="subtitle1Input" type="file" class="form-input" accept="text/vtt,.vtt" @change="onSubtitle1Change" />
        </div>

        <div class="form-row">
          <label for="subtitle2" class="form-label">Subtítulos 2 (.vtt)</label>
          <input id="subtitle2" ref="subtitle2Input" type="file" class="form-input" accept="text/vtt,.vtt" @change="onSubtitle2Change" />
        </div>

        <div class="form-row">
          <label for="audio1" class="form-label">Audio 1 (.mp3)</label>
          <input id="audio1" ref="audio1Input" type="file" class="form-input" accept="audio/mpeg,.mp3" @change="onAudio1Change" />
        </div>

        <div class="form-row">
          <label for="audio2" class="form-label">Audio 2 (.mp3)</label>
          <input id="audio2" ref="audio2Input" type="file" class="form-input" accept="audio/mpeg,.mp3" @change="onAudio2Change" />
        </div>

        <div class="controls">
          <button class="btn primary" :disabled="!canSubmitVideo || isSubmittingVideo" @click="submitVideo">
            {{ isSubmittingVideo ? 'Enviando…' : 'Enviar video' }}
          </button>
        </div>

        <div v-if="videoUploadResult" class="upload-result">
          <div class="upload-result-title">Subido:</div>
          <div class="upload-result-item">Video: {{ videoUploadResult.video?.url }}</div>
          <div v-if="videoUploadResult.subtitles?.length" class="upload-result-item">
            Subtítulos: {{ videoUploadResult.subtitles.map(s => s.url).join(' | ') }}
          </div>
          <div v-if="videoUploadResult.audios?.length" class="upload-result-item">
            Audios: {{ videoUploadResult.audios.map(a => a.url).join(' | ') }}
          </div>
        </div>
      </div>

      <!-- LISTADO Y EDICIÓN (NUEVO) -->
      <div class="multimedia-form card" style="margin-top: 2rem;">
        <h3 class="block-title">Galería Multimedia</h3>
        
        <div class="tabs">
          <button :class="['tab-btn', { active: activeTab === 'images' }]" @click="activeTab = 'images'">Imágenes</button>
          <button :class="['tab-btn', { active: activeTab === 'videos' }]" @click="activeTab = 'videos'">Videos</button>
        </div>

        <!-- Lista Imágenes -->
        <div v-if="activeTab === 'images'" class="media-list">
          <div v-if="loadingImages" class="loading">Cargando imágenes...</div>
          <div v-else-if="imagesList.length === 0" class="empty">No hay imágenes.</div>
          <div v-else class="media-grid">
            <div v-for="img in imagesList" :key="img.id" class="media-item">
              <div class="media-thumb">
                <img :src="img.url" :alt="img.name" />
              </div>
              <div class="media-info">
                <div v-if="editingId === img.id" class="edit-row">
                  <input v-model="editNameModel" class="form-input small" />
                  <button class="btn-icon check" @click="saveImageName(img)">💾</button>
                  <button class="btn-icon cancel" @click="cancelEdit">❌</button>
                </div>
                <div v-else class="display-row">
                  <span class="media-name">{{ img.name }}</span>
                  <button class="btn-icon edit" @click="startEdit(img)">✏️</button>
                </div>
                <small class="filename">{{ img.filename }}</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista Videos -->
        <div v-if="activeTab === 'videos'" class="media-list">
          <div v-if="loadingVideos" class="loading">Cargando videos...</div>
          <div v-else-if="videosList.length === 0" class="empty">No hay videos.</div>
          <div v-else class="media-list-vertical">
            <div v-for="vid in videosList" :key="vid.id" class="media-row-item">
               <div class="media-icon">🎬</div>
               <div class="media-info-row">
                 <div v-if="editingVideoId === vid.id" class="edit-row">
                    <input v-model="editVideoNameModel" class="form-input small" />
                    <button class="btn-icon check" @click="saveVideoName(vid)">💾</button>
                    <button class="btn-icon cancel" @click="cancelVideoEdit">❌</button>
                 </div>
                 <div v-else class="display-row">
                    <span class="media-name">{{ vid.name }}</span>
                    <button class="btn-icon edit" @click="startVideoEdit(vid)">✏️</button>
                 </div>
                 <small class="filename">{{ vid.video?.filename }}</small>
               </div>
            </div>
          </div>
        </div>
      </div>

    </PageSectionContent>

    <PageSectionFooter>
      <!-- Footer content if needed -->
    </PageSectionFooter>
  </PageSection>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount, onMounted } from 'vue'
import PageSection from '/src/vue/components/layout/PageSection.vue'
import PageSectionHeader from '/src/vue/components/layout/PageSectionHeader.vue'
import PageSectionContent from '/src/vue/components/layout/PageSectionContent.vue'
import PageSectionFooter from '/src/vue/components/layout/PageSectionFooter.vue'
import XLButton from '/src/vue/components/widgets/XLButton.vue'

import Cropper from 'cropperjs'

// --- CROPPER / UPLOAD LOGIC ---
const imageName = ref('')
const fileInput = ref(null)
const imageEl = ref(null)
const imageUrl = ref('')
const croppedUrl = ref('')
let cropper = null
const isSubmitting = ref(false)

const videoName = ref('')
const videoFileInput = ref(null)
const subtitle1Input = ref(null)
const subtitle2Input = ref(null)
const audio1Input = ref(null)
const audio2Input = ref(null)

const selectedVideoFile = ref(null)
const selectedSubtitle1 = ref(null)
const selectedSubtitle2 = ref(null)
const selectedAudio1 = ref(null)
const selectedAudio2 = ref(null)

const isSubmittingVideo = ref(false)
const videoUploadResult = ref(null)

const canSave = computed(() => !!imageName.value && !!croppedUrl.value)
const canSubmitVideo = computed(() => !!videoName.value && !!selectedVideoFile.value)

// --- GALLERY LOGIC ---
const activeTab = ref('images')
const imagesList = ref([])
const videosList = ref([])
const loadingImages = ref(false)
const loadingVideos = ref(false)

const editingId = ref(null)
const editNameModel = ref('')

const editingVideoId = ref(null)
const editVideoNameModel = ref('')

async function fetchImages() {
  loadingImages.value = true
  try {
    const res = await fetch('/api/uploads/user-images')
    const data = await res.json()
    console.log('Frontend received images:', data.images)
    imagesList.value = data.images || []
  } catch (e) {
    console.error('Error fetching images:', e)
  } finally {
    loadingImages.value = false
  }
}

async function fetchVideos() {
  loadingVideos.value = true
  try {
    const res = await fetch('/api/uploads/video-packages')
    const data = await res.json()
    videosList.value = data.videos || []
  } catch (e) {
    console.error('Error fetching videos:', e)
  } finally {
    loadingVideos.value = false
  }
}

// Edit Images
function startEdit(img) {
  editingId.value = img.id
  editNameModel.value = img.name
  // Cancelar otros edits
  editingVideoId.value = null
}

function cancelEdit() {
  editingId.value = null
  editNameModel.value = ''
}

async function saveImageName(img) {
  if (!editNameModel.value.trim()) return
  try {
    const res = await fetch(`/api/uploads/user-image/${img.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editNameModel.value })
    })
    if (res.ok) {
      const data = await res.json()
      // Actualizar localmente
      const idx = imagesList.value.findIndex(i => i.id === img.id)
      if (idx !== -1) imagesList.value[idx] = data.entry
      cancelEdit()
    } else {
      alert('Error actualizando nombre')
    }
  } catch (e) {
    console.error(e)
    alert('Error de conexión')
  }
}

// Edit Videos
function startVideoEdit(vid) {
  editingVideoId.value = vid.id
  editVideoNameModel.value = vid.name
  // Cancelar otros edits
  editingId.value = null
}

function cancelVideoEdit() {
  editingVideoId.value = null
  editVideoNameModel.value = ''
}

async function saveVideoName(vid) {
  if (!editVideoNameModel.value.trim()) return
  try {
    const res = await fetch(`/api/uploads/video-package/${vid.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editVideoNameModel.value })
    })
    if (res.ok) {
      const data = await res.json()
      const idx = videosList.value.findIndex(v => v.id === vid.id)
      if (idx !== -1) videosList.value[idx] = data.entry
      cancelVideoEdit()
    } else {
      alert('Error actualizando nombre de video')
    }
  } catch (e) {
    console.error(e)
    alert('Error de conexión')
  }
}

onMounted(() => {
  fetchImages()
  fetchVideos()
})


// --- EXISTING FUNCTIONS ---
function onFileChange(evt) {
  const file = evt.target.files?.[0]
  if (!file) return

  const isJpg = file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg')
  if (!isJpg) {
    alert('Por favor selecciona un archivo .jpg')
    evt.target.value = ''
    return
  }

  const url = URL.createObjectURL(file)
  imageUrl.value = url
  croppedUrl.value = ''

  nextTick(() => {
    if (cropper) {
      cropper.destroy()
      cropper = null
    }
    cropper = new Cropper(imageEl.value, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: NaN,
      autoCropArea: 0.8,
      responsive: true,
      background: true,
      zoomOnWheel: true
    })
  })
}

function onVideoFileChange(evt) {
  const file = evt.target.files?.[0]
  if (!file) return
  const isMp4 = file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4')
  if (!isMp4) {
    alert('Por favor selecciona un archivo .mp4')
    evt.target.value = ''
    selectedVideoFile.value = null
    return
  }
  selectedVideoFile.value = file
  videoUploadResult.value = null
}

function onSubtitle1Change(evt) {
  const file = evt.target.files?.[0] || null
  if (file && !file.name.toLowerCase().endsWith('.vtt')) {
    alert('El archivo de subtítulos debe ser .vtt')
    evt.target.value = ''
    selectedSubtitle1.value = null
    return
  }
  selectedSubtitle1.value = file
}

function onSubtitle2Change(evt) {
  const file = evt.target.files?.[0] || null
  if (file && !file.name.toLowerCase().endsWith('.vtt')) {
    alert('El archivo de subtítulos debe ser .vtt')
    evt.target.value = ''
    selectedSubtitle2.value = null
    return
  }
  selectedSubtitle2.value = file
}

function onAudio1Change(evt) {
  const file = evt.target.files?.[0] || null
  if (file && !file.name.toLowerCase().endsWith('.mp3')) {
    alert('El archivo de audio debe ser .mp3')
    evt.target.value = ''
    selectedAudio1.value = null
    return
  }
  selectedAudio1.value = file
}

function onAudio2Change(evt) {
  const file = evt.target.files?.[0] || null
  if (file && !file.name.toLowerCase().endsWith('.mp3')) {
    alert('El archivo de audio debe ser .mp3')
    evt.target.value = ''
    selectedAudio2.value = null
    return
  }
  selectedAudio2.value = file
}

function resetCrop() { if (cropper) cropper.reset() }
function rotateLeft() { if (cropper) cropper.rotate(-90) }
function rotateRight() { if (cropper) cropper.rotate(90) }

function generateCropped() {
  if (!cropper) return
  const selection = cropper.getCropperSelection()
  if (!selection) {
    alert('Selecciona un área de recorte sobre la imagen')
    return
  }
  selection
    .$toCanvas({ imageSmoothingEnabled: true, imageSmoothingQuality: 'high' })
    .then((canvas) => {
      croppedUrl.value = canvas.toDataURL('image/jpeg', 0.92)
    })
    .catch((err) => {
      console.error('Error generando canvas del recorte:', err)
      alert('Ocurrió un error al generar el recorte')
    })
}

async function submitForm() {
  if (!canSave.value) {
    alert('Completa el nombre y genera un recorte primero')
    return
  }
  try {
    isSubmitting.value = true
    const blob = await (await fetch(croppedUrl.value)).blob()
    const safeName = (imageName.value || 'imagen').toLowerCase().replace(/[^a-z0-9\-_.]/g, '-')
    const file = new File([blob], `${safeName}.jpg`, { type: 'image/jpeg' })

    const formData = new FormData()
    formData.append('image', file)
    formData.append('name', safeName)

    const resp = await fetch('http://localhost:3000/api/uploads/user-image', {
      method: 'POST',
      body: formData
    })
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: resp.statusText }))
      throw new Error(err.error || 'Error al subir la imagen')
    }
    const data = await resp.json()
    alert(`Imagen enviada correctamente\nURL: ${data.url}`)
    
    // Refresh list
    fetchImages()
    imageName.value = ''
    imageUrl.value = ''
    croppedUrl.value = ''
    if (cropper) cropper.destroy()
    cropper = null

  } catch (e) {
    console.error('Submit error:', e)
    alert(`No se pudo enviar la imagen: ${e.message}`)
  } finally {
    isSubmitting.value = false
  }
}

async function submitVideo() {
  if (!canSubmitVideo.value) {
    alert('Completa el nombre del video y selecciona un archivo .mp4')
    return
  }

  try {
    isSubmittingVideo.value = true
    videoUploadResult.value = null

    const safeName = (videoName.value || 'video').toLowerCase().replace(/[^a-z0-9\-_.]/g, '-')
    const formData = new FormData()
    formData.append('name', safeName)
    formData.append('video', selectedVideoFile.value)
    if (selectedSubtitle1.value) formData.append('subtitle1', selectedSubtitle1.value)
    if (selectedSubtitle2.value) formData.append('subtitle2', selectedSubtitle2.value)
    if (selectedAudio1.value) formData.append('audio1', selectedAudio1.value)
    if (selectedAudio2.value) formData.append('audio2', selectedAudio2.value)

    const resp = await fetch('/api/uploads/video-package', {
      method: 'POST',
      body: formData
    })

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: resp.statusText }))
      throw new Error(err.error || 'Error al subir el video')
    }

    const data = await resp.json()
    videoUploadResult.value = data
    alert(`Video enviado correctamente\nVideo: ${data.video?.url || ''}`)

    // Refresh list
    fetchVideos()
    videoName.value = ''
    selectedVideoFile.value = null
    /* Reset file inputs manually if needed */

  } catch (e) {
    console.error('Video submit error:', e)
    alert(`No se pudo enviar el video: ${e.message}`)
  } finally {
    isSubmittingVideo.value = false
  }
}

onBeforeUnmount(() => {
  if (cropper) { cropper.destroy(); cropper = null }
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
})
</script>

<style scoped>
.multimedia-form { padding: 1.25rem; }
.multimedia-form + .multimedia-form { margin-top: 1rem; }
.block-title { margin: 0 0 1rem; font-weight: 800; }
.form-row { margin-bottom: 1rem; }
.form-label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
.form-input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #ddd; border-radius: 8px; }
.form-input.small { padding: 0.25rem 0.5rem; font-size: 0.9rem; margin-right: 0.5rem; }
.hint { color: #777; font-size: 0.85rem; }

.preview-grid { display: grid; grid-template-columns: 2fr 3fr; gap: 1rem; margin-top: 1rem; }
.section-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }

.cropper-shell { position: relative; width: 100%; min-height: 600px; background: #fafafa; border: 1px dashed #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.cropper-image { max-width: 100%; display: block; }

.controls { margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }
.btn { padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid #ccc; background: #fff; cursor: pointer; }
.btn.primary { background: #4f46e5; color: #fff; border-color: #4f46e5; }
.btn-icon { background: none; border: none; cursor: pointer; font-size: 1.1rem; padding: 0 0.25rem; }
.btn-icon:hover { transform: scale(1.1); }

.result-shell { width: 100%; min-height: 500px; border: 1px solid #eee; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #fff; }
.result-image { width: clamp(60%, 80%, 100%); height: auto; max-height: 600px; border-radius: 6px; }
.placeholder { color: #999; font-size: 0.9rem; }

.upload-result { margin-top: 0.75rem; padding: 0.75rem; border: 1px solid #eaeaea; border-radius: 8px; background: #fafafa; }
.upload-result-title { font-weight: 700; margin-bottom: 0.25rem; }
.upload-result-item { font-size: 0.9rem; color: #444; word-break: break-all; }

/* TABS & LISTS */
.tabs { margin-bottom: 1rem; display: flex; gap: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
.tab-btn { background: none; border: none; padding: 0.5rem 1rem; cursor: pointer; font-weight: 600; color: #666; font-size: 1rem; border-radius: 4px; }
.tab-btn.active { background: #4f46e5; color: #fff; }

.media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
.media-item { border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
.media-thumb { width: 100%; height: 100px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; }
.media-thumb img { max-width: 100%; max-height: 100%; object-fit: cover; }
.media-info { padding: 0.5rem; }
.display-row, .edit-row { display: flex; align-items: center; justify-content: space-between; gap: 0.25rem; margin-bottom: 0.25rem; }
.media-name { font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px; }
.filename { display: block; font-size: 0.75rem; color: #999; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.media-list-vertical { display: flex; flex-direction: column; gap: 0.5rem; }
.media-row-item { display: flex; align-items: center; gap: 1rem; border: 1px solid #eee; padding: 0.5rem; border-radius: 6px; }
.media-icon { font-size: 1.5rem; }
.media-info-row { flex: 1; }
</style>