<template>
  <PageSection :id="props.id">
    <PageSectionHeader title="Nuestra Galería" subtitle="Momentos destacados" />
    <PageSectionContent>
      <div v-if="images.length > 0" ref="carouselEl" class="slick-carousel">
        <div v-for="img in images" :key="img.id || img.filename" class="slide">
          <div class="slide-content">
            <img :src="img.url" :alt="img.name" />
            <div class="caption">{{ img.name }}</div>
          </div>
        </div>
      </div>
      <div v-else class="loading-placeholder">
        Cargando galería...
      </div>
    </PageSectionContent>
  </PageSection>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import PageSection from '/src/vue/components/layout/PageSection.vue'
import PageSectionHeader from '/src/vue/components/layout/PageSectionHeader.vue'
import PageSectionContent from '/src/vue/components/layout/PageSectionContent.vue'

const props = defineProps({ id: String })
const carouselEl = ref(null)
const images = ref([])
const isInitialized = ref(false)

async function fetchImages() {
  console.log('=== CARRUSEL: fetchImages LLAMADO ===')
  try {
    const res = await fetch('/api/uploads/user-images')
    console.log('Respuesta del API:', res.status, res.statusText)
    
    if (!res.ok) {
      console.error('Error en la respuesta del API')
      return
    }
    
    const data = await res.json()
    console.log('Datos completos recibidos:', data)
    console.log('Cantidad de imágenes:', data.images?.length || 0)
    
    // Filtramos para asegurar que hay url
    images.value = (data.images || []).filter(i => i.url)
    console.log('Imágenes después del filtro:', images.value)
    console.log('Nombres de las imágenes:')
    images.value.forEach(img => {
      console.log(`  - ID: ${img.id} | Nombre: ${img.name} | Filename: ${img.filename}`)
    })
    
    // Inicializar slick después de cargar datos
    if (images.value.length > 0) {
      console.log('Inicializando Slick Carousel')
      nextTick(() => initSlick())
    } else {
      console.log('No hay imágenes para mostrar')
    }
    console.log('====================================')
  } catch (e) {
    console.error('Error cargando carrusel:', e)
  }
}

function initSlick() {
  const $ = window.jQuery || window.$
  if (!$ || !carouselEl.value) return
  
  const $el = $(carouselEl.value)
  
  // Si ya existía, destruir para recargar
  if ($el.hasClass('slick-initialized')) {
    $el.slick('unslick')
  }

  $el.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992,  settings: { slidesToShow: 2 } },
      { breakpoint: 600,  settings: { slidesToShow: 1 } }
    ]
  })
  isInitialized.value = true
}

onMounted(() => {
  fetchImages()
  
  // Auto-refrescar cada 10 segundos para detectar cambios
  const intervalId = setInterval(() => {
    console.log('⟳ Auto-refresh del carrusel...')
    fetchImages()
  }, 10000) // 10 segundos
  
  // Guardar el ID del intervalo para limpiarlo al desmontar
  onBeforeUnmount(() => {
    console.log('Limpiando intervalo de auto-refresh')
    clearInterval(intervalId)
    
    const $ = window.jQuery || window.$
    if ($ && carouselEl.value) {
      const $el = $(carouselEl.value)
      if ($el.hasClass('slick-initialized')) {
        $el.slick('unslick')
      }
    }
  })
})

</script>

<style scoped>
.slick-carousel {
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem; /* Espacio para flechas */
}
.slide {
  padding: 0 10px;
}
.slide-content {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.slide img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}
.caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  backdrop-filter: blur(2px);
}

.loading-placeholder {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* Modificaciones visuales a slick */
:deep(.slick-prev), :deep(.slick-next) {
  z-index: 10;
  width: 30px;
  height: 30px;
}
:deep(.slick-prev) { left: -10px; }
:deep(.slick-next) { right: -10px; }
:deep(.slick-prev:before), :deep(.slick-next:before) {
  color: #4f46e5; /* Color primario */
  font-size: 30px;
}
:deep(.slick-dots li button:before) {
  font-size: 10px;
  color: #4f46e5;
}
</style>
