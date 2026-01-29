<template>
  <PageSection :id="props.id">
    <PageSectionHeader title="Carrusel *Slick*" subtitle="Un carrusel simple en la página principal" />
    <PageSectionContent>
      <div ref="carouselEl" class="slick-carousel">
        <div class="slide">
          <img src="/images/portfolio/project-logo-1.png" alt="Proyecto 1" />
        </div>
        <div class="slide">
          <img src="/images/portfolio/project-logo-2.png" alt="Proyecto 2" />
        </div>
        <div class="slide">
          <img src="/images/portfolio/project-logo-3.png" alt="Proyecto 3" />
        </div>
        <div class="slide">
          <img src="/images/portfolio/project-logo-4.png" alt="Proyecto 4" />
        </div>
      </div>
    </PageSectionContent>
  </PageSection>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import PageSection from '/src/vue/components/layout/PageSection.vue'
import PageSectionHeader from '/src/vue/components/layout/PageSectionHeader.vue'
import PageSectionContent from '/src/vue/components/layout/PageSectionContent.vue'

// Importar CSS de slick (Vite lo soporta)
// Usar jQuery y Slick cargados globalmente desde CDN

const props = defineProps({ id: String })
const carouselEl = ref(null)

onMounted(() => {
  const $ = window.jQuery || window.$
  if (!$) {
    console.error('jQuery no está disponible. Asegúrate de cargar el CDN en index.html')
    return
  }
  const $el = $(carouselEl.value)
  $el.slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    dots: false,
    swipe: true,
    swipeToSlide: true,
    touchMove: true,
    autoplay: false,
    adaptiveHeight: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992,  settings: { slidesToShow: 3 } },
      { breakpoint: 768,  settings: { slidesToShow: 2 } },
      { breakpoint: 480,  settings: { slidesToShow: 1 } }
    ]
  })
})

onBeforeUnmount(() => {
  const $ = window.jQuery || window.$
  const $el = $ ? $(carouselEl.value) : null
  if ($el && $el.hasClass('slick-initialized')) {
    $el.slick('unslick')
  }
})
</script>

<style scoped>
.slick-carousel {
  width: 100%;
  margin: 0 auto;
}
.slide {
  display: flex;
  align-items: center;
  justify-content: center;
}
.slide img {
  max-width: 100%;
  height: 80px;
  object-fit: contain;
}
/* Ajustes visuales del tema slick */
.slick-dots li button:before { color: #4f46e5; }
.slick-prev:before, .slick-next:before { color: #4f46e5; }
</style>
