<template>
    <!-- Icon Stack -->
    <span class="icon-stack fa-stack">
        <!-- background circle uses secondary color as before -->
        <i class="fas fa-circle fa-stack-2x" style="color: var(--secondary-color, #ff5900);"/>
        <!-- icon glyph now uses the secondary color instead of being forced white -->
        <i class="fa-stack-1x" :class="props.faIcon" :style="{'color': 'var(--secondary-color, #ff5900)'}"/>
    </span>
</template>

<script setup>
/**
 * @property {String} faIcon
 */
const props = defineProps({
    faIcon: String
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

span.icon-stack {
    @include generate-dynamic-styles-with-hash((
        xxxl: (font-size: 3rem),
        xxl:  (font-size: 2.5rem),
        xl:   (font-size: 2.25rem),
        lg:   (font-size: 2rem),
        md:   (font-size: 1.5rem),
        sm:   (font-size: 1.25rem),
    ));
}
</style>