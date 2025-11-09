<template>
    <p class="foxy-footer-copyright text-1"
       v-html="formattedCopyright"/>
</template>

<script setup>
import {computed} from "vue"
import {useStrings} from "/src/composables/strings.js"

const strings = useStrings()

const props = defineProps({
    holder: String,
    url: String,
    license: String,
})

const formattedCopyright = computed(() => {
    // Obtener el HTML base desde el helper
    const base = strings.getCopyrightMessage(
        new Date().getFullYear().toString(),
        props.holder,
        props.url,
        props.license
    )

    // Si la plantilla incluye un enlace, inyectar una clase en el <a>
    // para poder aplicarle estilos específicos. En caso contrario,
    // envolver el nombre del holder en un <span> con la clase.
    if (/\<a\s+[^>]*>/.test(base)) {
        // Agregar class a la primera etiqueta <a ...>
        return base.replace(/<a\s+([^>]*)>/i, '<a class="copyright-holder" $1>')
    }

    // No hay <a>, envolver el holder en un span (reemplazando la primera
    // aparición del nombre tal cual). Esto protege casos donde holder
    // no viene con URL.
    const escapedHolder = props.holder ? props.holder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : ''
    if (escapedHolder && new RegExp(escapedHolder).test(base)) {
        return base.replace(new RegExp(escapedHolder), `<span class="copyright-holder">${props.holder}</span>`)
    }

    return base
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

p {
    color: var(--success-color, $light-5);
    padding: 0;
    margin: 0;
}

/* Forzar que el enlace del copyright use el color 2 de la paleta */
::v-deep .foxy-footer-copyright a {
    color: var(--secondary-color) !important;
}

/* Estilo para el holder cuando se inyecta como clase */
::v-deep .foxy-footer-copyright .copyright-holder {
    color: var(--secondary-color) !important;
}

</style>