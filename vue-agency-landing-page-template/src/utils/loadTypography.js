export async function loadTypography() {
    try {
        // No cargar tipografías en el dashboard para evitar conflictos
        if (window.location.pathname.includes('/dashboard')) {
            console.log("🚫 Dashboard detectado - omitiendo carga de tipografías")
            return
        }

        const response = await fetch("http://localhost:3000/api/tipografias/activa")
        const data = await response.json()
        console.log("Respuesta tipografía del backend:", data)

        const fontConfig = Array.isArray(data) ? data[0] : data
        if (!fontConfig || !fontConfig.font1 || !fontConfig.font2) {
            console.warn("⚠️ No hay configuración de tipografía válida")
            return
        }

        // Helper: Detecta si es una fuente local (archivo) o Google Font
        const isLocalFont = (font) =>
            font && (font.startsWith("/") || font.includes(".ttf") || font.includes(".otf") || font.includes(".woff"))

        // Helper: Extrae nombre de fuente del archivo
        // Ejemplo: "/uploads/fonts/1760905994567-597847758-circular-std-medium-500.ttf" → "Circular Std Medium"
        const extractFontName = (fontPath) => {
            const filename = fontPath.split("/").pop() // "1760905994567-597847758-circular-std-medium-500.ttf"
            const nameWithoutExt = filename.replace(/\.(ttf|otf|woff2?)$/i, "") // "1760905994567-597847758-circular-std-medium-500"

            // Elimina timestamps y números al inicio (formato: números-números-nombre)
            const cleanName = nameWithoutExt.replace(/^\d+-\d+-/, "") // "circular-std-medium-500"

            // Elimina números al final y convierte guiones a espacios
            const fontName = cleanName
                .replace(/-\d+$/, "") // "circular-std-medium"
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // ["Circular", "Std", "Medium"]
                .join(" ") // "Circular Std Medium"

            return fontName || "Custom Font"
        }

        const font1IsLocal = isLocalFont(fontConfig.font1)
        const font2IsLocal = isLocalFont(fontConfig.font2)

        let font1Name = fontConfig.font1
        let font2Name = fontConfig.font2

        // Crear elemento <style> para @font-face y variables CSS
        const style = document.createElement("style")
        let cssContent = ""

        if (font1IsLocal || font2IsLocal) {
            console.log("📁 Cargando fuentes desde archivos locales...")

            if (font1IsLocal) {
                font1Name = extractFontName(fontConfig.font1)
                const fontUrl = fontConfig.font1.startsWith("http")
                    ? fontConfig.font1
                    : `http://localhost:3000${fontConfig.font1}`

                cssContent += `
          @font-face {
            font-family: '${font1Name}';
            src: url('${fontUrl}') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `
                console.log(`✅ Font1 configurada: ${font1Name} desde ${fontConfig.font1}`)
            }

            if (font2IsLocal) {
                font2Name = extractFontName(fontConfig.font2)
                const fontUrl = fontConfig.font2.startsWith("http")
                    ? fontConfig.font2
                    : `http://localhost:3000${fontConfig.font2}`

                cssContent += `
          @font-face {
            font-family: '${font2Name}';
            src: url('${fontUrl}') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `
                console.log(`✅ Font2 configurada: ${font2Name} desde ${fontConfig.font2}`)
            }
        } else {
            console.log("🌐 Cargando fuentes desde Google Fonts...")
            const googleFont1 = fontConfig.font1.replace(/ /g, "+")
            const googleFont2 = fontConfig.font2.replace(/ /g, "+")
            const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${googleFont1}&family=${googleFont2}&display=swap`

            const link = document.createElement("link")
            link.rel = "stylesheet"
            link.href = googleFontsUrl
            document.head.appendChild(link)
            console.log("✅ Google Fonts cargadas:", fontConfig.font1, fontConfig.font2)
        }

        cssContent += `
      :root {
        --font-base: '${font2Name}', sans-serif;
        --font-headings: '${font1Name}', sans-serif;
        --font-primary: '${font2Name}', sans-serif;
        --font-secondary: '${font1Name}', sans-serif;
        --size-title: ${fontConfig.tamanio_titulo}px;
        --size-subtitle: ${fontConfig.tamanio_subtitulo}px;
        --size-paragraph: ${fontConfig.tamanio_parrafo}px;
      }
      
      /* Aplicar fuentes a todas las secciones */
      h1, h2, h3, h4, h5, h6, .foxy-section-header-title {
        font-family: var(--font-secondary) !important;
        font-size: var(--size-title) !important;
      }
      
      .foxy-section-header-subtitle, .subheading {
        font-family: var(--font-primary) !important;
        font-size: var(--size-subtitle) !important;
      }
      
      p, .text, .lead {
        font-family: var(--font-primary) !important;
        font-size: var(--size-paragraph) !important;
      }
      
      /* Aplicar fuentes a botones y links */
      button, .btn, .btn-primary, .btn-secondary, .btn-outline-primary, .btn-outline-secondary {
        font-family: var(--font-primary) !important;
        font-size: var(--size-paragraph) !important;
      }
      
      /* Aplicar fuentes a links de navbar */
      .navbar-nav .nav-link, .navbar-brand, .navbar-text {
        font-family: var(--font-primary) !important;
        font-size: var(--size-paragraph) !important;
      }
      
      /* Aplicar fuentes a otros elementos de navegación */
      a, .link, .nav-link {
        font-family: var(--font-primary) !important;
        font-size: var(--size-paragraph) !important;
      }
    `

        style.textContent = cssContent
        document.head.appendChild(style)

        console.log("✅ Variables CSS aplicadas:")
        console.log(`   --font-base: ${font2Name}`)
        console.log(`   --font-headings: ${font1Name}`)
        console.log(`   --font-primary: ${font2Name}`)
        console.log(`   --font-secondary: ${font1Name}`)
        console.log(`   --size-title: ${fontConfig.tamanio_titulo}px`)
        console.log(`   --size-subtitle: ${fontConfig.tamanio_subtitulo}px`)
        console.log(`   --size-paragraph: ${fontConfig.tamanio_parrafo}px`)
    } catch (error) {
        console.error("❌ Error cargando tipografía:", error)
    }
}
