<template>
    <hr class="solid-divider"
        :class="props.class">
</template>

<script setup>
const props = defineProps({
    class: String
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

hr.solid-divider {
    width: 60px;
    color: var(--accent-color, black);
    opacity: 1;
    border: 2px solid var(--accent-color, black);
    margin: 0 auto;
    background-color: var(--accent-color, black);
}
</style>