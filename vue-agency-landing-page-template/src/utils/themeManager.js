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
  if (palette && typeof palette === 'object' && palette.colors && Array.isArray(palette.colors)) {
    console.log("🔍 Detectado formato de paleta con array de colores")
    const cssVars = [
      "--primary-color",
      "--secondary-color",
      "--accent-color",
      "--success-color",
      "--background-color"
    ]

    palette.colors.forEach((colorObj, i) => {
      const value = colorObj?.value || "#000000"
      const varName = cssVars[i] || `--color-${i + 1}`
      document.documentElement.style.setProperty(varName, value)
      console.log(`  ${varName}: ${value}`)
    })
    console.log("✅ Paleta aplicada exitosamente (formato objeto con colors)")
    return
  }

  // Si es un arreglo directo (como tus paletas guardadas), mapearlo
  if (Array.isArray(palette)) {
    console.log("🔍 Detectado formato de array directo")
    const cssVars = [
      "--primary-color",
      "--secondary-color",
      "--accent-color",
      "--success-color",
      "--background-color"
    ]

    palette.forEach((colorObj, i) => {
      const value = colorObj?.value || "#000000"
      const varName = cssVars[i] || `--color-${i + 1}`
      document.documentElement.style.setProperty(varName, value)
      console.log(`  ${varName}: ${value}`)
    })
    console.log("✅ Paleta aplicada exitosamente (formato array)")
    return
  }

  // Si es un objeto plano {primary-color: "#fff"}
  console.log("🔍 Detectado formato de objeto plano")
  Object.entries(palette).forEach(([key, value]) => {
    const varName = key.startsWith('--') ? key : `--${key}`
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
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPalette)
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
  const cssVars = [
    "--primary-color",
    "--secondary-color", 
    "--accent-color",
    "--success-color",
    "--background-color"
  ]
  
  console.log("Variables CSS actuales:")
  cssVars.forEach(varName => {
    const value = computedStyle.getPropertyValue(varName).trim()
    console.log(`  ${varName}: ${value}`)
  })
  console.log("=== END DEBUG ===")
}

export const themeManager = {
  applyPalette,
  savePalette,
  loadPalette,
  loadPaletteWhenReady,
  clearPalette,
  debugPaletteState
}
