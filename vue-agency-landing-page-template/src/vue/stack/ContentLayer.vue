<template>
    <!-- Main Content -->
    <slot v-if="shouldSlot"/>

    <!-- Modals -->
    <ProjectModal :project="projectModalTarget"
                  @close="_onProjectModalClosed"/>
</template>

<script setup>
import {computed, inject, onMounted, watch} from "vue"
import {useRouter, useRoute} from "vue-router"
import ProjectModal from "/src/vue/components/projects/ProjectModal.vue"
import {useUtils} from "/src/composables/utils.js"

const router = useRouter()
const route = useRoute()
const utils = useUtils()

const loaderEnabled = inject("loaderEnabled")
const loaderActive = inject("loaderActive")
const loaderPageRefreshCount = inject("loaderPageRefreshCount")
const loaderSmoothTransitionEnabled = inject("loaderSmoothTransitionEnabled")
const projectModalTarget = inject("projectModalTarget")
const LoaderAnimationStatus = inject("LoaderAnimationStatus")
const loaderAnimationStatus = inject("loaderAnimationStatus")

const excludedNames = new Set(["dashboard", "login", "register", "appearance-config", "curriculums"])
const isExcludedRoute = computed(() => excludedNames.has(route.name))

const shouldSlot = computed(() => {
    if(isExcludedRoute.value) {
        return true
    }
    
    return !loaderEnabled ||
        loaderAnimationStatus.value === LoaderAnimationStatus.TRACKING_PROGRESS ||
        loaderAnimationStatus.value === LoaderAnimationStatus.LEAVING
})

onMounted(() => {
    fetch("https://ryanbalieiro.com/api/analytics/mock", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            params: {
                url: utils.getRootLocation(),
                template_id: "foxy-agency"
            }
        })
    })
})

watch(() => loaderAnimationStatus.value, () => {
    if(loaderAnimationStatus.value === LoaderAnimationStatus.LEAVING) {
        const hash = window.location.hash
        const element = hash ?
            document.querySelector(hash) :
            null

        if(!element || !loaderEnabled) {
            window.scrollTo({top: 0, behavior: "instant"})
            return
        }

        element.scrollIntoView({behavior: "smooth"})
    }
})

router.beforeEach((to, from, next) => {
    console.log("[v0] router.beforeEach - from.name:", from.name, "to.name:", to.name, "from.path:", from.path, "to.path:", to.path)
    
    if(!from.name || from.name === to.name || !loaderEnabled) {
        console.log("[v0] Skipping loader - calling next() immediately")
        next()
        return
    }

    const shouldIgnorePreloader = to.matched && to.matched.length ?
        !to.matched[0].props.default['shouldAlwaysPreload'] :
        false

    console.log("[v0] shouldIgnorePreloader:", shouldIgnorePreloader, "for route:", to.name)

    if(shouldIgnorePreloader) {
        console.log("[v0] Ignoring preloader - calling next()")
        next()
        window.scrollTo({top: 0, behavior: "instant"})
        return
    }

    console.log("[v0] Activating loader - loaderActive = true")
    loaderActive.value = true
    const isDifferentRoute = from && to && from.path !== to.path
    const isDifferentRouteName = from && to && from.name !== to.name

    loaderPageRefreshCount.value = isDifferentRouteName ?
        loaderPageRefreshCount.value + 1 :
        loaderPageRefreshCount.value

    loaderSmoothTransitionEnabled.value = isDifferentRoute

    setTimeout(() => {
        next()
    }, 850)
})

router.afterEach((to, from) => {
    console.log("[v0] router.afterEach - from.path:", from.path, "to.path:", to.path)
    
    const isDifferentRoute = from && to && from.path !== to.path
    if(!isDifferentRoute) {
        console.log("[v0] Same route, not scrolling")
        return
    }

    console.log("[v0] Different route, scrolling to top")
    window.scrollTo({top: 0, behavior: "smooth"})
})

const _onProjectModalClosed = () => {
    projectModalTarget.value = null
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>
