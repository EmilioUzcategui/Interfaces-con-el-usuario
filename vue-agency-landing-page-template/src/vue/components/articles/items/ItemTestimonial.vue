<template>
    <div class="foxy-testimonial-item card h-100">
        <!-- Header -->
        <div class="card-header">
            <ImageView :src="props.image"
                       :alt="props.title"
                       class="foxy-testimonial-thumbnail"/>

            <h4 class="foxy-testimonial-title ms-3 mt-2"
                v-html="parsedTitle"/>
        </div>

        <div class="card-body text-4 testimonial-text">
            <QuotedText :text="parsedQuote"/>
        </div>

        <div class="card-footer testimonial-footer">
            <p class="foxy-testimonial-author text-3">
                <span class="me-2" style="color: var(--secondary-color, var(--accent-color));">—</span>

                <span v-html="parsedAuthor"/>

                <span class="opacity-25 mx-1"> · </span>

                <span class="opacity-50"
                      v-html="props.role"/>
            </p>
        </div>
    </div>
</template>

<script setup>
import ImageView from "/src/vue/components/generic/ImageView.vue"
import {computed} from "vue"
import {useUtils} from "/src/composables/utils.js"
import QuotedText from "/src/vue/components/widgets/QuotedText.vue"

const utils = useUtils()

const props = defineProps({
    title: String,
    image: String,
    quote: String,
    role: String,
    author: String
})

const parsedTitle = computed(() => {
    return utils.parseCustomText(props.title)
})

const parsedQuote = computed(() => {
    return utils.parseCustomText(props.quote)
})

const parsedAuthor = computed(() => {
    return utils.parseCustomText(props.author)
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

div.foxy-testimonial-item {
    @include generate-dynamic-styles-with-hash((
        xxxl: (min-height: calc(100% - 25px), padding: 15px),
        md:   (min-height: 30vh)
    ));

    border: 0;
    /* Force card background to palette color 5 */
    background-color: var(--background-color, lighten($primary, 47%)) !important;
    border-radius: 20px;
    user-select: none;
}

div.card-header {
    border: none;
    padding: 1rem;
    background-color: transparent;
    display: flex;
    align-items: center;
}

div.foxy-testimonial-thumbnail {
    --icon-size:60px;
    @include media-breakpoint-down(sm) {--icon-size: 50px;}

    height: var(--icon-size);
    width: var(--icon-size);
    border:none;
}

div.card-footer {
    @include generate-dynamic-styles-with-hash((
        xxxl: (padding-top: 1rem),
        sm:   (padding-top: 0)
    ));

    border: none;
    background-color: transparent;
}

/* For reviews placed on a section with variant 'success' (section background = --success-color)
   use --background-color (palette color 5) for the text inside testimonial cards so they
   contrast with the section background. */
.testimonial-text,
.testimonial-footer {
    /* text inside the testimonial cards should use color 3 (accent) */
    color: var(--accent-color, $text-normal) !important;
}

/* override quote icon color set inline in QuotedText so it matches accent color */
.testimonial-text i.fa-quote-left,
.testimonial-text i.fa-quote-right {
    color: var(--accent-color, $text-normal) !important;
}
</style>
