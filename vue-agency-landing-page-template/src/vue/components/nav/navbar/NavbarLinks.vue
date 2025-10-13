<template>
    <div class="foxy-navbar-links-wrapper">
        <ul class="foxy-navbar-links" :class="`${collapsed ? 'collapsed' : ''}`">
            <li v-for="link in parsedLinks">
                <Link :url="link.path">
                    <button class="foxy-nav-link"
                            :class="[link.buttonClass, link.isLogin ? 'foxy-nav-link-login' : '']"
                            @click="_onLinkClicked">
                        <i v-if="link.faIcon"
                           :class="link.faIcon"
                           class="foxy-nav-link-icon"/>

                        <span>
                            {{link.label}}
                        </span>
                    </button>
                </Link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue"
import {useRouter} from "vue-router"
import Link from "/src/vue/components/generic/Link.vue"

const router = useRouter()
const props = defineProps({
    items: Array,
    collapsed: Boolean
})
const emit = defineEmits(['linkClicked'])

const transitionLinks = ref([])

const parsedLinks = computed(() => {
    return props.items.map((item, index) => ({
        path: item.path,
        label: item.label,
        faIcon: item.faIcon,
        isLogin: item.path === '/login',
        buttonClass: {
            active: item.isActive,
            hidden: transitionLinks.value.indexOf(index) === -1
        }
    }))
})

onMounted(() => {
    _executeTransition(props.collapsed)
})

watch(() => props.collapsed, (newVal) => {
    _executeTransition(newVal)
})

const _executeTransition = (collapsed) => {
    transitionLinks.value = []
    if (collapsed) return

    parsedLinks.value.forEach((_, i) => {
        setTimeout(() => {
            transitionLinks.value.push(i)
        }, 50 * i)
    })
}

const _onLinkClicked = () => {
    emit('linkClicked')
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

ul.foxy-navbar-links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;

    @include media-breakpoint-down(lg) {
        flex-direction: column;
        margin: 2px 0 15px;
    }
}

ul.foxy-navbar-links.collapsed {
    @include media-breakpoint-down(lg) {
        display: none;
    }
}

button.foxy-nav-link {
    background-color: transparent;
    border: 0;
    padding: 0 0 0 1.2rem;

    font-family: $font-family-base;
    color: $light-3;
    text-transform: uppercase;

    @include media-breakpoint-down(xl) {
        padding: 0 0 0 0.9rem;
    }

    @include media-breakpoint-down(lg) {
        padding: 0!important;
        min-width: 160px;
        text-align: left;
        margin-left: 12px;
        margin-bottom: 8px;
        font-size: 0.85rem;

        transition: 0.2s ease-in margin-left, 0.2s ease-in opacity;
    }

    @media (max-height: 400px) {
        margin-bottom: 4px;
    }
}

i.foxy-nav-link-icon {
    display: none;

    min-width: 1.4rem;
    margin-right: 10px;
    color: $light-6;
    transition: color 0.4s;

    @include media-breakpoint-down(lg) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
}

button.foxy-nav-link.hidden {
   @include media-breakpoint-down(lg) {
       opacity: 0;
       margin-left: 80px;
   }
}

button.foxy-nav-link:hover, button.foxy-nav-link.active {
    color: lighten($primary, 5%);
    i.foxy-nav-link-icon {
        color: lighten($primary, 25%);
    }
}

button.foxy-nav-link-login {
    background: linear-gradient(135deg, $primary 0%, darken($primary, 10%) 100%);
    color: white !important;
    border-radius: 20px;
    padding: 8px 16px !important;
    margin-left: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    @include media-breakpoint-down(lg) {
        margin-left: 12px;
        margin-top: 8px;
        width: fit-content;
    }

    &:hover {
        background: linear-gradient(135deg, lighten($primary, 5%) 0%, $primary 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba($primary, 0.3);
        color: white !important;
    }

    &.active {
        background: linear-gradient(135deg, darken($primary, 5%) 0%, darken($primary, 15%) 100%);
        color: white !important;
    }

    i.foxy-nav-link-icon {
        color: white !important;
        display: inline-flex !important;
        margin-right: 8px;
    }
}
</style>