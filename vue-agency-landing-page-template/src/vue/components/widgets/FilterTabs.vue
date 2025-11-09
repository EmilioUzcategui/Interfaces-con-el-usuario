<template>
    <div class="filter-tabs">
        <!-- Bootstrap's Button Group -->
        <div class="btn-group"
             role="group">

            <!-- Filter Items -->
            <button v-for="item in props.items"
                    type="button"
                    class="btn btn-light text-2"
                    :class="{active:_isItemSelected(item)}"
                    @click="_selectItem(item)">
                <!-- Item Label -->
                {{item}}
            </button>
        </div>
    </div>
</template>

<script setup>
import {ref} from "vue"

const props = defineProps({
    items: Array
})

const emit = defineEmits(['selected'])
const selectedItemId = ref(null)

const _isItemSelected = (item) => {
    if(selectedItemId.value === null && props.items && props.items.length > 0) {
        _selectItem(props.items[0])
    }

    return selectedItemId.value === item
}

const _selectItem = (item) => {
    selectedItemId.value = item
    emit('selected', item)
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

div.btn-group {
    margin: 0 auto;
    width: 50%;
    display: flex; /* make children share space */
    @include media-breakpoint-down(lg) {
        width: 100%;
        max-width: 600px;
    }
}

button.btn {
    @include generate-dynamic-styles-with-hash((
        xxxl: (padding: 0.3rem 2rem),
        sm: (padding: 0.3rem 0)
    ));
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1; /* distribute evenly */

    opacity: 0.95;
    background-color: transparent;
    color: var(--background-color); /* color 5 for tab texts (better contrast) */

    border: none;
    border-radius: 0;
    margin: 0;
    padding: 0.6rem 1.2rem;
    transition: background-color 160ms ease, color 160ms ease;

    /* visual separators between buttons (subtle) */
    & + & {
        border-left: 1px solid rgba(255,255,255,0.06);
    }

    &:hover {
    background-color: rgba(255,255,255,0.06);
    color: var(--background-color);
    }

    &.active {
        background-color: rgba(255,255,255,0.14);
        color: var(--background-color);
        opacity: 1;
    }

    &:focus {
        outline: none;
        box-shadow: none;
    }
}

/* Bar background (color 4) */
.filter-tabs {
    padding: 6px;
    border-radius: 30px;
    background-color: var(--success-color);
    overflow: hidden; /* Prevent children from visually escaping the pill */
}
</style>