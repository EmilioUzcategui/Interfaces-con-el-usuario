<template>
    <footer class="foxy-footer">
        <slot/>
    </footer>
</template>

<script setup>
</script>

<style lang="scss">
@import "/src/scss/_theming.scss";

.foxy-footer {
    /* Usar color4 de la paleta (mapeado a --success-color en themeManager) */
    background-color: var(--success-color, $footer-bg-color);
}
</style>