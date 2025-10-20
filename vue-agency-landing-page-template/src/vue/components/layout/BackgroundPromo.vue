<template>
    <div class="foxy-promo-background">
        <div :class="`foxy-promo-background-overlay-${faded ? `faded` : `default`}`"/>
    </div>
</template>

<script setup>
const props = defineProps({
    faded: Boolean
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

div.foxy-promo-background {
    position: absolute;
    height: calc(100% + 4rem);
    width: 100%;
    z-index: -1;

    background-image: url('/src/assets/header-bg.jpeg');
    background-position: center;
    background-size: cover;
}

div.foxy-promo-background-overlay-default {
    position: relative;
    height: 100%;
    width: 100%;

    /* Usar variables CSS dinámicas */
    background: linear-gradient(135deg, var(--primary-color, #212529) 0%, var(--secondary-color, #ff5900) 100%);
}

div.foxy-promo-background-overlay-faded {
    position: relative;
    height: 100%;
    width: 100%;

    /* Usar variables CSS dinámicas */
    background: linear-gradient(135deg, var(--primary-color, #212529) 0%, var(--secondary-color, #ff5900) 100%);
    opacity: 0.8;
}
</style>