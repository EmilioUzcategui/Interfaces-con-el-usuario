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
import { ref, nextTick, onMounted, onActivated, onBeforeUnmount } from 'vue'
import PageSection from '/src/vue/components/layout/PageSection.vue'
import PageSectionHeader from '/src/vue/components/layout/PageSectionHeader.vue'
import PageSectionContent from '/src/vue/components/layout/PageSectionContent.vue'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

/* =======================
   PROPS
======================= */
const props = defineProps({
  id: String
})

/* =======================
   STATE
======================= */
const images = ref([])
const videos = ref([])

const isPlayerOpen = ref(false)
const isPlaying = ref(false)
const activeVideo = ref(null)

const audioTracks = ref([])
const subtitleTracks = ref([])
const selectedAudioId = ref('original')
const selectedSubtitleId = ref('off')

const uiVolume = ref(1)
const uiMuted = ref(false)

const playerVideoEl = ref(null)
const playerAudioEl = ref(null)

/* =======================
   SWIPER CONFIG
======================= */
const modules = [Navigation, Pagination]

const breakpoints = {
  640: { slidesPerView: 2 },
  1024: { slidesPerView: 3 }
}

const videoBreakpoints = {
  640: { slidesPerView: 1 },
  1024: { slidesPerView: 2 }
}

/* =======================
   HELPERS
======================= */
function toDisplayName(input) {
  if (!input) return ''

  const name = String(input)
    .split('/')
    .pop()
    .replace(/\.[^/.]+$/, '')

  const parts = name.split(/[\s_-]+/)
  const hasLetter = (s) => /[a-zA-Z]/.test(s)

  const lastNumericIndex = (() => {
    for (let i = parts.length - 1; i >= 0; i--) {
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

  const lastWithLetters = [...parts]
    .reverse()
    .find((p) => hasLetter(p.replace(/^\d+/, '')))

  return lastWithLetters
    ? lastWithLetters.replace(/^\d+/, '').trim()
    : ''
}

/* =======================
   LOADERS
======================= */
async function reloadImages() {
  try {
    const resp = await fetch('/api/uploads/user-images')
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const data = await resp.json()

    images.value = Array.isArray(data?.images)
      ? data.images
          .map((img) => ({
            url: img?.url,
            name: toDisplayName(img?.filename || img?.url)
          }))
          .filter((img) => img.url)
      : []
  } catch (e) {
    console.error('Error cargando imágenes:', e)
    images.value = []
  }
}

async function reloadVideos() {
  try {
    const resp = await fetch('/api/uploads/video-packages')
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const data = await resp.json()

    videos.value = Array.isArray(data?.videos)
      ? data.videos
          .map((pkg) => {
            const url = pkg?.video?.url
            return {
              id: pkg?.id || url,
              url,
              name: pkg?.name || toDisplayName(pkg?.video?.filename || url),
              audios: (pkg?.audios || []).map((a, i) => ({
                id: a?.url || `audio-${i}`,
                url: a?.url,
                name: toDisplayName(a?.filename || a?.url) || `Audio ${i + 1}`
              })),
              subtitles: (pkg?.subtitles || []).map((s, i) => ({
                id: s?.url || `sub-${i}`,
                url: s?.url,
                name: toDisplayName(s?.filename || s?.url) || `Subtítulos ${i + 1}`
              })),
              createdAt: pkg?.createdAt
            }
          })
          .filter((v) => v.url)
      : []
  } catch (e) {
    console.error('Error cargando videos:', e)
    videos.value = []
  }
}

/* =======================
   LIFECYCLE
======================= */
onMounted(() => {
  reloadImages()
  reloadVideos()
  window.addEventListener('keydown', onKeydown)
})

onActivated(() => {
  reloadImages()
  reloadVideos()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

/* =======================
   PLAYER
======================= */
async function openPlayer(video) {
  activeVideo.value = video
  isPlayerOpen.value = true
  isPlaying.value = false

  audioTracks.value = [
    { id: 'original', name: 'Original', url: null },
    ...(video.audios || [])
  ]
  subtitleTracks.value = [
    { id: 'off', name: 'Sin subtítulos', url: null },
    ...(video.subtitles || [])
  ]

  selectedAudioId.value = 'original'
  selectedSubtitleId.value = 'off'

  await nextTick()
  applySubtitleSelection()
  applyAudioSelection()
}

function closePlayer() {
  stopExternalAudio()
  isPlayerOpen.value = false
  activeVideo.value = null
  isPlaying.value = false
}

function togglePlayPause() {
  const video = playerVideoEl.value
  if (!video) return
  video.paused ? video.play() : video.pause()
}

function onKeydown(e) {
  if (e.key === 'Escape' && isPlayerOpen.value) closePlayer()
}

/* =======================
   AUDIO / SUBS
======================= */
function getSelectedAudio() {
  return audioTracks.value.find((a) => a.id === selectedAudioId.value)
}

function getSelectedSubtitle() {
  return subtitleTracks.value.find((s) => s.id === selectedSubtitleId.value)
}

function stopExternalAudio() {
  if (!playerAudioEl.value) return
  playerAudioEl.value.pause()
  playerAudioEl.value.src = ''
}

function applySubtitleSelection() {
  const video = playerVideoEl.value
  if (!video) return

  video.querySelectorAll('track').forEach((t) => t.remove())
  const selected = getSelectedSubtitle()
  if (!selected || selected.id === 'off') return

  const track = document.createElement('track')
  track.kind = 'subtitles'
  track.src = selected.url
  track.default = true
  video.appendChild(track)
}

async function applyAudioSelection() {
  const video = playerVideoEl.value
  const audio = playerAudioEl.value
  if (!video || !audio) return

  const selected = getSelectedAudio()
  if (!selected || selected.id === 'original') {
    stopExternalAudio()
    return
  }

  video.muted = true
  audio.src = selected.url
  await audio.play()
}

function toggleMute() {
  uiMuted.value = !uiMuted.value
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
