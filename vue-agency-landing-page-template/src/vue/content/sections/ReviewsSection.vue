<template>
    <!-- Services Section -->
    <PageSection variant="success"
                 :id="props.id">
        <!-- Title -->
        <PageSectionHeader title="Client *Reviews*"
                           subtitle="What people say about us!"/>

        <!-- Content -->
                <PageSectionContent>
                        <div class="reviews-swiper">
                                <Swiper
                                    v-if="images.length"
                                    :key="images.length"
                                    :modules="modules"
                                    :slides-per-view="1"
                                    :space-between="16"
                                    :slides-per-group="1"
                                    :navigation="true"
                                    :pagination="{ clickable: true }"
                                    :breakpoints="breakpoints"
                                    :watch-overflow="true"
                                >
                                    <SwiperSlide v-for="(img, i) in images" :key="img.url || i">
                                        <div class="slide">
                                            <img :src="img.url" :alt="img.name || `Imagen ${i+1}`" />
                                            <div v-if="img.name" class="caption">{{ img.name }}</div>
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                                <div v-else class="empty-state">
                                    No hay imágenes de usuarios para mostrar.
                                </div>
                        </div>

                        <div class="videos-swiper">
                                <Swiper
                                    v-if="videos.length"
                                    :key="videos.length"
                                    :modules="modules"
                                    :slides-per-view="1"
                                    :space-between="16"
                                    :slides-per-group="1"
                                    :navigation="true"
                                    :pagination="{ clickable: true }"
                                    :breakpoints="videoBreakpoints"
                                    :watch-overflow="true"
                                >
                                    <SwiperSlide v-for="(vid, i) in videos" :key="vid.url || i">
                                        <button class="video-slide" type="button" @click="openPlayer(vid)">
                                            <video
                                                class="video-preview"
                                                :src="vid.url"
                                                muted
                                                playsinline
                                                preload="metadata"
                                            />
                                            <div v-if="vid.name" class="caption">{{ vid.name }}</div>
                                        </button>
                                    </SwiperSlide>
                                </Swiper>
                                <div v-else class="empty-state">
                                    No hay videos para mostrar.
                                </div>
                        </div>

                        <teleport to="body">
                            <div v-if="isPlayerOpen" class="mini-player-overlay" @click.self="closePlayer">
                                <div class="mini-player">
                                    <button class="mini-player-close" type="button" @click="closePlayer">×</button>
                                    <div v-if="activeVideo?.name" class="mini-player-title">{{ activeVideo.name }}</div>

                                    <div class="mini-player-controls">
                                        <div class="mini-control">
                                            <span class="mini-control-label">Reproducir</span>
                                            <button
                                                class="mini-control-btn"
                                                type="button"
                                                :aria-label="isPlaying ? 'Pausar' : 'Continuar'"
                                                @click="togglePlayPause"
                                            >
                                                {{ isPlaying ? '⏸️' : '▶️' }}
                                            </button>
                                        </div>
                                        <div class="mini-control">
                                            <span class="mini-control-label">Audio</span>
                                            <select class="mini-control-select" v-model="selectedAudioId" @change="applyAudioSelection">
                                                <option v-for="t in audioTracks" :key="t.id" :value="t.id">{{ t.name }}</option>
                                            </select>
                                        </div>
                                        <div class="mini-control">
                                            <span class="mini-control-label">Subtítulos</span>
                                            <select class="mini-control-select" v-model="selectedSubtitleId" @change="applySubtitleSelection">
                                                <option v-for="t in subtitleTracks" :key="t.id" :value="t.id">{{ t.name }}</option>
                                            </select>
                                        </div>
                                        <div class="mini-control">
                                            <span class="mini-control-label">Volumen</span>
                                            <input
                                                class="mini-control-range"
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                v-model.number="uiVolume"
                                                @input="applyVolume"
                                            />
                                            <button class="mini-control-btn" type="button" @click="toggleMute">
                                                {{ uiMuted ? 'Mute' : 'Sonido' }}
                                            </button>
                                        </div>
                                    </div>

                                    <video
                                        v-if="activeVideo?.url"
                                        ref="playerVideoEl"
                                        :key="activeVideo.url"
                                        class="mini-player-video"
                                        :src="activeVideo.url"
                                        controls
                                        playsinline
                                        @play="onPlayerPlay"
                                        @pause="onPlayerPause"
                                        @ended="onPlayerEnded"
                                        @seeking="onPlayerSeek"
                                        @ratechange="onPlayerRateChange"
                                        @volumechange="onPlayerVolumeChange"
                                        @loadedmetadata="onPlayerLoadedMetadata"
                                    />

                                    <audio ref="playerAudioEl" class="sr-only" />
                                </div>
                            </div>
                        </teleport>
                </PageSectionContent>
    </PageSection>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import PageSection from "/src/vue/components/layout/PageSection.vue"
import PageSectionHeader from "/src/vue/components/layout/PageSectionHeader.vue"
import PageSectionContent from "/src/vue/components/layout/PageSectionContent.vue"
// Swiper (ya está en deps)
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const props = defineProps({
    id: String
})

const modules = [Navigation, Pagination]
const breakpoints = {
    1200: { slidesPerView: 3, slidesPerGroup: 3 },
    992:  { slidesPerView: 2, slidesPerGroup: 2 },
    0:    { slidesPerView: 1, slidesPerGroup: 1 }
}

const videoBreakpoints = {
    1200: { slidesPerView: 3, slidesPerGroup: 3 },
    992:  { slidesPerView: 2, slidesPerGroup: 2 },
    0:    { slidesPerView: 1, slidesPerGroup: 1 }
}

const images = ref([])
const videos = ref([])

const audioTracks = ref([
    { id: 'original', name: 'Original', url: null }
])
const subtitleTracks = ref([
    { id: 'off', name: 'Sin subtítulos', url: null }
])

const selectedAudioId = ref('original')
const selectedSubtitleId = ref('off')

const uiVolume = ref(1)
const uiMuted = ref(false)

const isPlaying = ref(false)

const isPlayerOpen = ref(false)
const activeVideo = ref(null)

const playerVideoEl = ref(null)
const playerAudioEl = ref(null)

function toDisplayName(filenameOrUrl) {
    if (!filenameOrUrl) return ''

    // Si viene como URL, extraer el último segmento
    const lastPart = String(filenameOrUrl).split('/').filter(Boolean).pop() || ''
    const decoded = decodeURIComponent(lastPart)

    // Quitar querystring y extensión
    const noQuery = decoded.split('?')[0]
    const withoutExt = noQuery.replace(/\.[a-z0-9]+$/i, '')

    // Limpieza mínima (local): guiones/underscores -> espacios
    const normalized = withoutExt.replace(/[-_]+/g, ' ').trim()

    const parts = normalized.split(/\s+/).filter(Boolean)
    const hasLetter = (s) => /[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ]/.test(s)

    // Caso típico: empieza con timestamps/ids numéricos.
    // Ej: 1768943709239-317554929-paisaje-1.jpg => "paisaje 1"
    if (parts.length && /^\d+$/.test(parts[0])) {
        let i = 0
        while (i < parts.length && /^\d+$/.test(parts[i])) i += 1
        const tail = parts.slice(i).join(' ').trim()
        if (tail) return tail
    }

    // "Desde que deje de haber números hacia adelante":
    // tomar todo lo que venga después del último token que sea SOLO números.
    const lastNumericIndex = (() => {
        for (let i = parts.length - 1; i >= 0; i -= 1) {
            if (/^\d+$/.test(parts[i])) return i
        }
        return -1
    })()

    if (lastNumericIndex !== -1 && lastNumericIndex < parts.length - 1) {
        const tail = parts
            .slice(lastNumericIndex + 1)
            .map((p) => p.replace(/^\d+/, ''))
            .filter(Boolean)

        const result = tail.join(' ').trim()
        if (result) return result
    }

    // Fallback: última parte que tenga letras (por si el nombre termina en números)
    const lastWithLetters = [...parts].reverse().find((p) => hasLetter(p.replace(/^\d+/, '')))
    return lastWithLetters ? lastWithLetters.replace(/^\d+/, '').trim() : ''
}

onMounted(async () => {
    try {
        const resp = await fetch('/api/uploads/user-images')
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()

        // backend devuelve: { images: [{ filename, url }] }
        images.value = Array.isArray(data?.images)
            ? data.images
                .map((img) => ({
                    url: img?.url,
                    name: toDisplayName(img?.filename || img?.url)
                }))
                .filter((img) => Boolean(img.url))
            : []
    } catch (e) {
        console.error('No se pudieron cargar las imágenes de usuarios:', e)
        images.value = []
    }
})

onMounted(async () => {
    try {
        const resp = await fetch('/api/uploads/video-packages')
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()

        // backend: { videos: [{ id, name, createdAt, video, subtitles, audios }] }
        videos.value = Array.isArray(data?.videos)
            ? data.videos
                .map((pkg) => {
                    const url = pkg?.video?.url
                    const name = pkg?.name || toDisplayName(pkg?.video?.filename || url)
                    const audios = Array.isArray(pkg?.audios)
                        ? pkg.audios.map((a, idx) => ({
                            id: a?.url || `audio-${idx}`,
                            url: a?.url,
                            name: toDisplayName(a?.filename || a?.url) || `Audio ${idx + 1}`
                        })).filter((a) => Boolean(a.url))
                        : []
                    const subtitles = Array.isArray(pkg?.subtitles)
                        ? pkg.subtitles.map((s, idx) => ({
                            id: s?.url || `sub-${idx}`,
                            url: s?.url,
                            name: toDisplayName(s?.filename || s?.url) || `Subtítulos ${idx + 1}`
                        })).filter((s) => Boolean(s.url))
                        : []

                    return {
                        id: pkg?.id || url,
                        url,
                        name,
                        audios,
                        subtitles,
                        createdAt: pkg?.createdAt
                    }
                })
                .filter((v) => Boolean(v.url))
            : []
    } catch (e) {
        console.error('No se pudieron cargar los videos subidos:', e)
        videos.value = []
    }
})

async function openPlayer(videoItem) {
    // defaults cada vez que se abre
    selectedAudioId.value = 'original'
    selectedSubtitleId.value = 'off'

    // Cargar pistas por video (desde backend)
    audioTracks.value = [
        { id: 'original', name: 'Original', url: null },
        ...(Array.isArray(videoItem?.audios) ? videoItem.audios : [])
    ]
    subtitleTracks.value = [
        { id: 'off', name: 'Sin subtítulos', url: null },
        ...(Array.isArray(videoItem?.subtitles) ? videoItem.subtitles : [])
    ]

    activeVideo.value = videoItem
    isPlayerOpen.value = true
    isPlaying.value = false

    await nextTick()
    // Inicializar controles de volumen basados en el video
    if (playerVideoEl.value) {
        uiVolume.value = typeof playerVideoEl.value.volume === 'number' ? playerVideoEl.value.volume : 1
        uiMuted.value = !!playerVideoEl.value.muted
    }
    applySubtitleSelection()
    applyAudioSelection()
}

function closePlayer() {
    stopExternalAudio()
    isPlayerOpen.value = false
    activeVideo.value = null
    isPlaying.value = false
}

async function togglePlayPause() {
    const video = playerVideoEl.value
    if (!video) return

    if (video.paused) {
        try { await video.play() } catch (_) { }
    } else {
        try { video.pause() } catch (_) { }
    }
}

function onKeydown(e) {
    if (e.key === 'Escape' && isPlayerOpen.value) closePlayer()
}

onMounted(() => {
    window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
})

function getSelectedAudio() {
    return audioTracks.value.find((t) => t.id === selectedAudioId.value) || audioTracks.value[0]
}

function getSelectedSubtitle() {
    return subtitleTracks.value.find((t) => t.id === selectedSubtitleId.value) || subtitleTracks.value[0]
}

function stopExternalAudio() {
    const audio = playerAudioEl.value
    if (!audio) return
    try { audio.pause() } catch (_) { }
    audio.src = ''
}

function applySubtitleSelection() {
    const video = playerVideoEl.value
    const selected = getSelectedSubtitle()
    if (!video) return

    // Limpiar tracks previos (para cambiar entre múltiples vtt)
    Array.from(video.querySelectorAll('track')).forEach((t) => t.remove())

    if (selected.id === 'off' || !selected.url) {
        const tracks = video.textTracks
        if (!tracks) return
        for (let i = 0; i < tracks.length; i += 1) tracks[i].mode = 'disabled'
        return
    }

    const trackEl = document.createElement('track')
    trackEl.kind = 'subtitles'
    trackEl.label = selected.name || 'Subtítulos'
    trackEl.srclang = 'es'
    trackEl.src = selected.url
    trackEl.default = true
    video.appendChild(trackEl)

    // Forzar showing si el navegador lo deja
    const tracks = video.textTracks
    if (!tracks) return
    for (let i = 0; i < tracks.length; i += 1) tracks[i].mode = 'showing'
}

async function applyAudioSelection() {
    const video = playerVideoEl.value
    const audio = playerAudioEl.value
    if (!video || !audio) return

    const selected = getSelectedAudio()
    if (!selected || selected.id === 'original' || !selected.url) {
        stopExternalAudio()
        video.muted = uiMuted.value
        video.volume = uiVolume.value
        return
    }

    // Usar audio externo: silenciar el video y sincronizar.
    video.muted = true

    const shouldPlay = !video.paused
    audio.src = selected.url
    audio.load()

    await new Promise((resolve) => {
        const done = () => {
            audio.removeEventListener('loadedmetadata', done)
            resolve()
        }
        audio.addEventListener('loadedmetadata', done)
    })

    try {
        audio.currentTime = video.currentTime || 0
    } catch (_) { }

    audio.playbackRate = video.playbackRate || 1
    audio.volume = uiVolume.value
    audio.muted = uiMuted.value

    if (shouldPlay) {
        try { await audio.play() } catch (_) { }
    }
}

function onPlayerLoadedMetadata() {
    applySubtitleSelection()
    applyAudioSelection()
}

function onPlayerPlay() {
    isPlaying.value = true
    const audio = playerAudioEl.value
    const video = playerVideoEl.value
    const selected = getSelectedAudio()
    if (!audio || !video || selected.id === 'original') return
    try { audio.currentTime = video.currentTime || 0 } catch (_) { }
    audio.play().catch(() => { })
}

function onPlayerPause() {
    isPlaying.value = false
    const audio = playerAudioEl.value
    const selected = getSelectedAudio()
    if (!audio || selected.id === 'original') return
    try { audio.pause() } catch (_) { }
}

function onPlayerEnded() {
    isPlaying.value = false
}

function onPlayerSeek() {
    const audio = playerAudioEl.value
    const video = playerVideoEl.value
    const selected = getSelectedAudio()
    if (!audio || !video || selected.id === 'original') return
    try { audio.currentTime = video.currentTime || 0 } catch (_) { }
}

function onPlayerRateChange() {
    const audio = playerAudioEl.value
    const video = playerVideoEl.value
    const selected = getSelectedAudio()
    if (!audio || !video || selected.id === 'original') return
    audio.playbackRate = video.playbackRate || 1
}

function onPlayerVolumeChange() {
    const audio = playerAudioEl.value
    const video = playerVideoEl.value
    const selected = getSelectedAudio()
    if (!video) return

    // Si está usando audio original, reflejar cambios del control nativo
    if (selected.id === 'original') {
        uiVolume.value = typeof video.volume === 'number' ? video.volume : uiVolume.value
        uiMuted.value = !!video.muted
        return
    }

    // Con audio externo el volumen nativo queda deshabilitado (video está muted),
    // así que ignoramos este evento y usamos el slider propio.
    if (!audio) return
}

function applyVolume() {
    const video = playerVideoEl.value
    const audio = playerAudioEl.value
    const selected = getSelectedAudio()

    if (selected.id === 'original') {
        if (!video) return
        video.volume = uiVolume.value
        video.muted = uiMuted.value
        return
    }

    if (!audio) return
    audio.volume = uiVolume.value
    audio.muted = uiMuted.value
}

function toggleMute() {
    uiMuted.value = !uiMuted.value
    applyVolume()
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.slide {
    position: relative;
}

.reviews-swiper img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 8px;
}

.caption {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font-size: 0.9rem;
    line-height: 1.2;
    text-align: center;
    backdrop-filter: blur(2px);
}

.empty-state {
    padding: 16px;
    text-align: center;
    opacity: 0.8;
}

.videos-swiper {
    margin-top: 24px;
}

.video-slide {
    position: relative;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    width: 100%;
    text-align: left;
}

.video-preview {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
    background: #000;
}

.mini-player-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
}

.mini-player {
    width: min(920px, 100%);
    background: #111;
    border-radius: 12px;
    padding: 12px;
    position: relative;
}

.mini-player-title {
    color: #fff;
    font-weight: 600;
    margin: 4px 0 10px;
    padding-right: 36px;
}

.mini-player-controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 4px 0 10px;
}

.mini-control {
    display: flex;
    align-items: center;
    gap: 8px;
}

.mini-control-label {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.9rem;
}

.mini-control-select {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: #fff;
    border-radius: 8px;
    padding: 6px 10px;
}

.mini-control-select option {
    color: #111;
}

.mini-control-range {
    width: 140px;
}

.mini-control-btn {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: #fff;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer;
}

.mini-player-video {
    width: 100%;
    max-height: 70vh;
    border-radius: 10px;
    background: #000;
}

.mini-player-close {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.35);
    color: #fff;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
