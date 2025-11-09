// src/utils/themeManager.js
const COLOR_STORAGE_KEY = "userPalette"

/**
 * 🔹 Aplica una paleta de colores (soporta tu formato [{label,value},...])
 */
export function applyPalette(palette) {
  if (!palette) {
    console.log("⚠️ No se proporcionó paleta para aplicar")
    return
  }

  console.log("🎨 Aplicando paleta:", palette)

  // Si es un objeto con estructura {id, name, colors: [...]}
  if (palette && typeof palette === "object" && palette.colors && Array.isArray(palette.colors)) {
    console.log("🔍 Detectado formato de paleta con array de colores")
    const cssVars = ["--primary-color", "--secondary-color", "--accent-color", "--success-color", "--background-color"]

    palette.colors.forEach((colorObj, i) => {
      const value = colorObj?.value || "#000000"
      const varName = cssVars[i] || `--color-${i + 1}`
      document.documentElement.style.setProperty(varName, value)
      console.log(`  ${varName}: ${value}`)
    })

    // También actualizar variables relacionadas con textos
    if (palette.colors.length >= 2) {
      document.documentElement.style.setProperty("--text-normal", palette.colors[2]?.value || "#000000")
      document.documentElement.style.setProperty("--headings-color", palette.colors[2]?.value || "#000000")
    }

    // Actualizar clases CSS personalizadas para Bootstrap
    updateBootstrapClasses(palette.colors)

    // Forzar actualización de estilos
    forceStyleUpdate()
    console.log("✅ Paleta aplicada exitosamente (formato objeto con colors)")
    return
  }

  // Si es un arreglo directo (como tus paletas guardadas), mapearlo
  if (Array.isArray(palette)) {
    console.log("🔍 Detectado formato de array directo")
    const cssVars = ["--primary-color", "--secondary-color", "--accent-color", "--success-color", "--background-color"]

    palette.forEach((colorObj, i) => {
      const value = colorObj?.value || "#000000"
      const varName = cssVars[i] || `--color-${i + 1}`
      document.documentElement.style.setProperty(varName, value)
      console.log(`  ${varName}: ${value}`)
    })

    // También actualizar variables relacionadas con textos
    if (palette.length >= 3) {
      document.documentElement.style.setProperty("--text-normal", palette[2]?.value || "#000000")
      document.documentElement.style.setProperty("--headings-color", palette[2]?.value || "#000000")
    }

    // Actualizar clases CSS personalizadas para Bootstrap
    updateBootstrapClasses(palette)

    // Forzar actualización de estilos
    forceStyleUpdate()
    console.log("✅ Paleta aplicada exitosamente (formato array)")
    return
  }

  // Si es un objeto plano {primary-color: "#fff"}
  console.log("🔍 Detectado formato de objeto plano")
  Object.entries(palette).forEach(([key, value]) => {
    const varName = key.startsWith("--") ? key : `--${key}`
    document.documentElement.style.setProperty(varName, value)
    console.log(`  ${varName}: ${value}`)
  })
  console.log("✅ Paleta aplicada exitosamente (formato objeto)")
}

/**
 * 💾 Guarda y aplica la paleta
 */
export function savePalette(palette) {
  try {
    localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(palette))
  } catch (e) {
    console.error("Error guardando paleta:", e)
  }
  applyPalette(palette)
}

/**
 * 🔁 Carga la paleta desde localStorage y la aplica
 */
export function loadPalette() {
  try {
    const saved = localStorage.getItem(COLOR_STORAGE_KEY)
    console.log("🔍 Intentando cargar paleta desde localStorage:", saved)

    if (saved) {
      const palette = JSON.parse(saved)
      console.log("✅ Paleta cargada exitosamente:", palette)
      applyPalette(palette)
      return palette
    } else {
      console.log("ℹ️ No hay paleta guardada en localStorage")
    }
  } catch (e) {
    console.error("❌ Error cargando paleta:", e)
  }
  return null
}

/**
 * 🔄 Carga la paleta cuando el DOM esté listo
 */
export function loadPaletteWhenReady() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPalette)
  } else {
    loadPalette()
  }
}

/**
 * 🧹 Limpia la paleta (por ejemplo, al cerrar sesión)
 */
export function clearPalette() {
  localStorage.removeItem(COLOR_STORAGE_KEY)
}

/**
 * 🔍 Función de debugging para verificar el estado actual
 */
export function debugPaletteState() {
  console.log("🔍 === DEBUG PALETTE STATE ===")
  console.log("localStorage userPalette:", localStorage.getItem(COLOR_STORAGE_KEY))

  const computedStyle = getComputedStyle(document.documentElement)
  const cssVars = ["--primary-color", "--secondary-color", "--accent-color", "--success-color", "--background-color"]

  console.log("Variables CSS actuales:")
  cssVars.forEach((varName) => {
    const value = computedStyle.getPropertyValue(varName).trim()
    console.log(`  ${varName}: ${value}`)
  })
  console.log("=== END DEBUG ===")
}

/**
 * 🎨 Actualiza las clases CSS personalizadas para Bootstrap
 */
function updateBootstrapClasses(colors) {
  if (!colors || colors.length < 2) return
  const primaryColor = colors[0]?.value || colors[0] || "#007bff"
  const secondaryColor = colors[1]?.value || colors[1] || "#ff5900"
  const accentColor = colors[2]?.value || colors[2] || "#000000"
  const successColor = colors[3]?.value || colors[3] || "#343a40"

  // Crear o actualizar estilos CSS personalizados
  let customStyles = document.getElementById("dynamic-bootstrap-overrides")
  if (!customStyles) {
    customStyles = document.createElement("style")
    customStyles.id = "dynamic-bootstrap-overrides"
    document.head.appendChild(customStyles)
  }

  customStyles.textContent = `
    .text-primary {
      color: ${secondaryColor} !important;
    }
    .text-primary-light {
      color: ${secondaryColor} !important;
    }
    .foxy-testimonial-author {
      color: ${accentColor} !important;
    }
    .foxy-testimonial-author span {
      color: ${secondaryColor} !important;
    }
    .question-icon {
      color: ${secondaryColor} !important;
    }
    span[class*="text-primary"] {
      color: ${secondaryColor} !important;
    }
    .foxy-item-feature h5 {
      color: ${secondaryColor} !important;
    }
    .foxy-item-feature p {
      color: ${accentColor} !important;
    }
    .foxy-item-feature .text-muted {
      color: ${accentColor} !important;
    }
    .foxy-item-feature .icon-stack .fa-circle {
      color: ${secondaryColor} !important;
    }
    .foxy-item-feature .icon-stack .fa-stack-1x {
      color: white !important;
    }
    .foxy-item-faq-question h5 {
      color: ${secondaryColor} !important;
    }
    .foxy-item-faq-question p {
      color: ${accentColor} !important;
    }
    .foxy-item-faq-question .text-light-7 {
      color: ${accentColor} !important;
    }
    .foxy-item-faq-question .question-icon {
      color: ${secondaryColor} !important;
    }
    .foxy-timeline-item h3 {
      color: ${secondaryColor} !important;
    }
    .foxy-timeline-item .badge {
      color: ${accentColor} !important;
    }
    .foxy-timeline-item .text-muted {
      color: ${accentColor} !important;
    }
    .foxy-project-info-featured-content .title {
      color: ${accentColor} !important;
    }
    .foxy-project-info-featured-content .project-title {
      color: ${secondaryColor} !important;
    }
    .foxy-project-info-featured-content .description {
      color: ${accentColor} !important;
    }
    button.foxy-dynamic-button.btn.btn-xl {
      color: white !important;
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .foxy-dynamic-button {
      color: white !important;
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .foxy-dynamic-button:hover {
      color: white !important;
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .foxy-dynamic-button:focus {
      color: white !important;
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .foxy-dynamic-button:active {
      color: white !important;
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .btn-primary-light.foxy-dynamic-button {
      color: white !important;
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .btn-primary-light.foxy-dynamic-button:hover {
      color: white !important;
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .btn-submit.foxy-dynamic-button {
      color: white !important;
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .btn-submit.foxy-dynamic-button:hover {
      color: white !important;
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .swiper-pagination-bullet {
      background-color: ${accentColor} !important;
    }
    .swiper-pagination-bullet:hover {
      background-color: ${secondaryColor} !important;
    }
    .swiper-pagination-bullet-active {
      background-color: ${secondaryColor} !important;
    }
    .foxy-contact-form-row input:focus,
    .foxy-contact-form-row textarea:focus {
      border-color: ${secondaryColor} !important;
    }
    .foxy-contact-form-row .form-group-focused .input-group-attach {
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .foxy-contact-form-row input:-webkit-autofill:focus {
      border-color: ${secondaryColor} !important;
    }
    .social-links .social-link {
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .social-links .social-link:hover {
      background-color: ${primaryColor} !important;
      border-color: ${primaryColor} !important;
    }
    .social-links .social-link-color-black {
      background-color: ${secondaryColor} !important;
      border-color: ${secondaryColor} !important;
    }
    .social-links .social-link-color-black:hover {
      background-color: ${primaryColor} !important;
      border-color: ${primaryColor} !important;
    }
    .foxy-testimonial-item {
      background-color: ${successColor} !important;
    }
    .foxy-section-success {
      background-color: ${successColor} !important;
    }
  `
}

/**
 * 🔄 Fuerza la actualización de estilos para asegurar que los cambios se apliquen
 */
function forceStyleUpdate() {
  // Forzar reflow para que los estilos se recalculen
  document.documentElement.offsetHeight

  // Forzar actualización específica de botones
  const buttons = document.querySelectorAll(".foxy-dynamic-button")
  buttons.forEach((button) => {
    button.style.backgroundColor = "var(--secondary-color)"
    button.style.borderColor = "var(--secondary-color)"
    button.style.color = "white"
  })

  // Forzar actualización específica de elementos de Swiper
  const swiperBullets = document.querySelectorAll(".swiper-pagination-bullet")
  swiperBullets.forEach((bullet) => {
    if (bullet.classList.contains("swiper-pagination-bullet-active")) {
      bullet.style.backgroundColor = "var(--secondary-color)"
    } else {
      bullet.style.backgroundColor = "var(--accent-color)"
    }
  })

  // Forzar actualización específica de campos del formulario
  const formInputs = document.querySelectorAll(".foxy-contact-form-row input, .foxy-contact-form-row textarea")
  formInputs.forEach((input) => {
    // Aplicar estilos cuando el campo está enfocado
    if (input === document.activeElement) {
      input.style.borderColor = "var(--secondary-color)"
    }
  })

  const formAttachments = document.querySelectorAll(".foxy-contact-form-row .form-group-focused .input-group-attach")
  formAttachments.forEach((attachment) => {
    attachment.style.backgroundColor = "var(--secondary-color)"
    attachment.style.borderColor = "var(--secondary-color)"
  })

  // Forzar actualización específica de enlaces sociales
  const socialLinks = document.querySelectorAll(".social-links .social-link")
  socialLinks.forEach((link) => {
    link.style.backgroundColor = "var(--secondary-color)"
    link.style.borderColor = "var(--secondary-color)"
  })

  // Forzar actualización específica de iconos de servicios
  const serviceIcons = document.querySelectorAll(".foxy-item-feature .icon-stack .fa-circle")
  serviceIcons.forEach((icon) => {
    icon.style.color = "var(--secondary-color)"
  })

  // Disparar evento personalizado para notificar cambios de color
  window.dispatchEvent(new CustomEvent("colorPaletteUpdated"))
}

export const themeManager = {
  applyPalette,
  savePalette,
  loadPalette,
  loadPaletteWhenReady,
  clearPalette,
  debugPaletteState,
}
