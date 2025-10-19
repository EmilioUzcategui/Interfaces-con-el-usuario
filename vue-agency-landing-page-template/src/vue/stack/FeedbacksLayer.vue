<template>
    <ActivitySpinner :visible="Boolean(spinnerActive)"
                     :message="String(spinnerMessage)"/>

    <Loader v-if="loaderEnabled"
            :visible="Boolean(loaderActive && !isExcludedRoute)"
            :refresh-count="Number(loaderPageRefreshCount)"
            :smooth-transition-enabled="Boolean(loaderSmoothTransitionEnabled)"
            @rendered="_onLoaderRendered"
            @ready="_onLoaderReady"
            @leaving="_onLoaderWillLeave"
            @completed="_onLoaderCompleted"/>

    <slot v-if="isReady"/>
</template>

<script setup>
import {inject, provide, ref, watch, computed, onMounted, nextTick} from "vue"
import {useRoute} from "vue-router"
import {useLayout} from "/src/composables/layout.js"
import ActivitySpinner from "/src/vue/components/loaders/ActivitySpinner.vue"
import Loader from "/src/vue/components/loaders/Loader.vue"

const layout = useLayout()

const loaderEnabled = inject("loaderEnabled")
const LoaderAnimationStatus = inject("LoaderAnimationStatus")
const loaderActive = inject("loaderActive")
const loaderPageRefreshCount = inject("loaderPageRefreshCount")
const loaderSmoothTransitionEnabled = inject("loaderSmoothTransitionEnabled")
const loaderAnimationStatus = inject("loaderAnimationStatus")
const spinnerActive = inject("spinnerActive")
const spinnerMessage = inject("spinnerMessage")

const route = useRoute()
const excludedNames = new Set(["dashboard", "login", "register"]) 
const isExcludedRoute = computed(() => excludedNames.has(route.name))

const isReady = computed(() => {
    if(!loaderEnabled)
        return true
    if(isExcludedRoute.value)
        return true
    return loaderAnimationStatus.value === LoaderAnimationStatus.TRACKING_PROGRESS ||
           loaderAnimationStatus.value === LoaderAnimationStatus.LEAVING
})

const _onLoaderRendered = () => {
    loaderAnimationStatus.value = LoaderAnimationStatus.RENDERED
}

const _onLoaderReady = () => {
    loaderAnimationStatus.value = LoaderAnimationStatus.TRACKING_PROGRESS
}

const _onLoaderWillLeave = () => {
    loaderAnimationStatus.value = LoaderAnimationStatus.LEAVING
}

const _onLoaderCompleted = () => {
    loaderActive.value = false
}

onMounted(() => {
    console.log("[v0] FeedbacksLayer onMounted - route.name:", route.name, "isExcludedRoute:", isExcludedRoute.value)
    nextTick(() => {
        if(isExcludedRoute.value) {
            console.log("[v0] FeedbacksLayer onMounted - enabling scroll for excluded route")
            loaderActive.value = false
            layout.setBodyScrollEnabled(true)
        }
    })
})

watch(isExcludedRoute, (newValue) => {
    console.log("[v0] FeedbacksLayer watch isExcludedRoute:", newValue)
    if(newValue) {
        nextTick(() => {
            console.log("[v0] FeedbacksLayer watch - enabling scroll for excluded route")
            loaderActive.value = false
            layout.setBodyScrollEnabled(true)
        })
    }
}, { immediate: true })

watch(() => loaderEnabled.value, (newValue) => {
    if(newValue) {
        loaderAnimationStatus.value = LoaderAnimationStatus.INITIALIZED
    }
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>
