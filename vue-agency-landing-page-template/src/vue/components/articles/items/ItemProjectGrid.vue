<template>
    <div class="foxy-project-item"
         :class="{
            'foxy-project-item-hidden': !isShowing,
            'foxy-project-item-appear': isShowing,
         }"
         @click="_onItemSelected">
        <div class="foxy-project-item-thumb-wrapper">
            <ImageView :src="props.image"
                       :alt="props.title"
                       :spinner-enabled="false"
                       ref="imageView"
                       class="foxy-project-item-thumb"/>

            <div class="foxy-project-item-thumb-overlay">
                <div class="foxy-project-item-thumb-overlay-content eq-h6">
                    <i class="fas fa-eye fa-2x"/>
                </div>
            </div>
        </div>

        <div class="foxy-project-item-description-wrapper">
            <button class="foxy-project-item-title"
                    v-html="props.title"/>

            <p class="foxy-project-item-category text-muted"
               v-html="props.category"/>
        </div>
    </div>
</template>

<script setup>
import ImageView from "/src/vue/components/generic/ImageView.vue"
import {inject, onMounted, onUnmounted, ref, watch} from "vue"
import {useLayout} from "/src/composables/layout.js"

const layout = useLayout()
const projectModalTarget = inject("projectModalTarget")

const props = defineProps({
    title: String,
    category: String,
    description: String,
    tags: Array,
    links: Array,
    image: String,
    index: Number,
    transitionCount: Number
})

const isShowing = ref(false)
const interval = ref(null)
const timeout = ref(null)
const imageView = ref(null)

onMounted(() => {
    _resetTransition()
    _appear()
})

onUnmounted(() => {
    _resetTransition()
})

watch(() => props.transitionCount, () => {
    _resetTransition()
    _appear()
})

const _resetTransition = () => {
    isShowing.value = false

    clearInterval(interval.value)
    interval.value = null

    clearTimeout(timeout.value)
    timeout.value = null
}

const _appear = () => {
    _checkLoadCompletion()
}

const _checkLoadCompletion = () => {
    interval.value = setInterval(() => {
        if(imageView.value && !imageView.value.isLoading()) {
            _scheduleTransition()
        }
    }, 1000/30)
}

const _scheduleTransition = () => {
    clearInterval(interval.value)
    interval.value = null

    const index = props.index || 0
    timeout.value = setTimeout(() => {
        isShowing.value = true
        clearTimeout(timeout.value)
        timeout.value = null
    }, 30 + index * 60)
}

const _onItemSelected = () => {
    projectModalTarget.value = {
        title: props.title,
        description: props.description,
        category: props.category,
        tags: props.tags,
        links: props.links,
        image: props.image
    }
}
</script>

<style lang="scss">
@import "/src/scss/_theming.scss";

div.foxy-project-item {
    display: inline-flex;
    flex-direction: column;
    position: relative;
    margin-top: calc(var(--project-logo-size)/3);
    cursor: pointer;

    &-hidden {
        opacity: 0;
    }

    &-appear {
        animation: appear 0.3s ease-out forwards;
    }
}

@keyframes appear {
    from {
        opacity:0;
        transform: scale(0.3) translateY(-30%);
    }
    to {
        opacity:1
    }
}

div.foxy-project-item-thumb-wrapper {
    position: relative;
    margin: 0 auto;
    cursor: pointer;
    height: var(--project-logo-size);
    width: var(--project-logo-size);
    overflow: hidden;
    border-radius: 25%;
    /* allow the wrapper background to show behind icon images (useful for transparent PNGs) */
    background: transparent;
    transition: background ease-in-out 0.25s, transform ease-in-out 0.25s;

    & .image-view {
        width: 100%;
        height: 100%;
    }
}

div.foxy-project-item-thumb-overlay {
    position: absolute;
    top: 0;
    opacity: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
    border-radius: 25%;

    /* overlay sits above the image; we'll use a ::before pseudo-element to paint
       a translucent layer using the palette color (--success-color). The pseudo
       element is placed behind the overlay content so the icon (eye) remains
       fully opaque while the image below gets a colored tint. */
    background: transparent;
    transition: opacity ease-in-out 0.25s;
    z-index: 2;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 25%;
        background: var(--success-color, $success);
        opacity: 0; /* revealed on hover via parent opacity + this value */
        transition: opacity ease-in-out 0.25s;
        z-index: 1;
        pointer-events: none;
    }

    &-content {
        color: $white;
        position: relative;
        z-index: 3;
    }
}

button.foxy-project-item-title {
    border: none;
    padding: 0;
    background-color: transparent;
    color: var(--secondary-color, $dark);

    margin: calc(var(--project-logo-size)/12) 0 0;
    font-size: calc(var(--project-logo-size)/7.8);
    font-family: $headings-font-family;
    @include media-breakpoint-down(lg) {
        margin: calc(var(--project-logo-size)/12) 0 0;
        font-size: calc(var(--project-logo-size)/6.1);
    }
}

 p.foxy-project-item-category {
    margin: 0;
    padding: 0;
     color: var(--secondary-color, $text-muted);

    font-size: calc(var(--project-logo-size)/10.5);
    @include media-breakpoint-down(lg) {
        font-size: calc(var(--project-logo-size)/7.5);
    }
}

div.foxy-project-item:hover {
    div.foxy-project-item-thumb-overlay {
        opacity: 1;
        /* tint the image with a translucent layer of the success color */
        &::before { opacity: 0.18; }
    }

    /* change the rounded icon background to palette color 4 (success) and the title color
       to the same palette color for consistency */
    div.foxy-project-item-thumb-wrapper {
        background: var(--success-color, $success);
        transform: translateY(-2%);
    }

    button.foxy-project-item-title {
        color: var(--success-color, $success);
        transition: color ease-in-out 0.3s;
    }
}

</style>