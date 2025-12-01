<template>
    <!-- Loader Wrapper -->
    <div v-if="visible && currentStep"
         id="foxy-loader"
         class="foxy-loader"
         :class="{
            'foxy-loader-tween-in': currentStep === Steps.WILL_ENTER,
            'foxy-loader-tween-out': currentStep === Steps.LEAVING
         }">
        <!-- Loader Content with Tangram Animation -->
        <div class="foxy-loader-content">
            <!-- Triángulos principales -->
            <div class="triangles-scale-outer">
                <div class="triangles-scale">
                    <div class="triangles-container">
                        <div class="triangle pink-triangle"
                             :class="{
                                'animation-active': currentStep >= Steps.ANIMATING_LOGO
                             }"></div>
                        <div class="triangle blue-triangle"
                             :class="{
                                'animation-active': currentStep >= Steps.ANIMATING_LOGO
                             }"></div>
                    </div>
                </div>
            </div>

            <!-- Paleta con las piezas del tangram -->
            <div class="pieces-wrapper">
                <div class="pieces-scale-outer">
                    <div class="pieces-scale">
                        <div class="pieces-palette sequence">
                            <div class="anim-box anim-1">
                                <div class="piece piece-medium"
                                     :class="{
                                        'animation-active': currentStep >= Steps.ANIMATING_LOGO
                                     }"></div>
                            </div>
                            <div class="anim-box anim-2">
                                <div class="piece-square"
                                     :class="{
                                        'animation-active': currentStep >= Steps.ANIMATING_LOGO
                                     }"></div>
                            </div>
                            <div class="anim-box anim-3">
                                <div class="piece piece-small-orange"
                                     :class="{
                                        'animation-active': currentStep >= Steps.ANIMATING_LOGO
                                     }"></div>
                            </div>
                            <div class="anim-box anim-4">
                                <div class="piece piece-small-red"
                                     :class="{
                                        'animation-active': currentStep >= Steps.ANIMATING_LOGO
                                     }"></div>
                            </div>
                            <div class="anim-box anim-5">
                                <div class="piece-parallelogram"
                                     :class="{
                                        'animation-active': currentStep >= Steps.ANIMATING_LOGO
                                     }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Barra de carga y porcentaje centrados en pantalla -->
            <div class="loader-progress-fixed">
                <div class="loading-bar"
                     :class="{
                        'loading-bar-visible': currentStep >= Steps.ANIMATING_PROGRESS,
                        'transition-none': currentStep < Steps.ANIMATING_PROGRESS
                     }">
                    <div class="loading-bar-fill"
                         :style="{ width: `${percentage}%` }"></div>
                </div>

                <div class="foxy-loader-progress-display"
                     :class="{
                        'foxy-loader-progress-display-hidden': currentStep <  Steps.ANIMATING_PROGRESS,
                        'transition-none': currentStep < Steps.ANIMATING_PROGRESS
                     }">
                    <p class="percentage text-2"
                       v-html="`${Math.round(percentage)}%`"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {onMounted, watch, ref, onUnmounted} from "vue"
import {useUtils} from "/src/composables/utils.js"
import {useLayout} from "/src/composables/layout.js"
import {useScheduler} from "/src/composables/scheduler.js"

const utils = useUtils()
const layout = useLayout()
const scheduler = useScheduler()

const props = defineProps({
    visible: Boolean,
    refreshCount: Number,
    smoothTransitionEnabled: Boolean
})

const Steps = {
    NONE: 0,
    WILL_ENTER: 1,
    ENTERING: 2,
    LOADING_LOGO: 3,
    ANIMATING_LOGO: 4,
    ANIMATING_PROGRESS: 5,
    WAITING_FOR_COMPLETION: 6,
    LEAVING: 7
}

const emit = defineEmits(['rendered', 'ready', 'leaving', 'completed'])

const schedulerTag = "loader"
const didEmitReady = ref(false)
const currentStep = ref(Steps.NONE)
const percentage = ref(0)
const loadingTime = ref(0)
let bodyScrollLocked = false

onMounted(() => {
    scheduler.clearAllWithTag(schedulerTag)
    _performTransition()
})

onUnmounted(() => {
    // Asegurar que el scroll del body se restaure si el loader se desmonta
    try { layout.setBodyScrollEnabled(true) } catch (e) { /* ignore */ }
})

watch(() => props.visible, () => {
    scheduler.clearAllWithTag(schedulerTag)
    _performTransition()
})

watch(() => props.refreshCount, () => {
    scheduler.clearAllWithTag(schedulerTag)
    percentage.value = 0
    currentStep.value = Steps.NONE
    _executeAnimatingLogoStep()
})

const _performTransition = () => {
    if(!props.visible)
        return

    percentage.value = 0
    currentStep.value = Steps.NONE

    if(props.smoothTransitionEnabled)
        _executeEnteringStep()
    else
        _executeAnimatingLogoStep()
}

const _executeEnteringStep = () => {
    currentStep.value = Steps.WILL_ENTER

    scheduler.schedule(() => {
        currentStep.value = Steps.ENTERING
    }, 30, schedulerTag)

    scheduler.schedule(() => {
        _executeAnimatingLogoStep()
    }, 350, schedulerTag)
}

const _executeAnimatingLogoStep = () => {
    emit('rendered')
    currentStep.value = Steps.LOADING_LOGO
    // Evitar bloquear el scroll repetidamente si ya está bloqueado
    try {
        if (!bodyScrollLocked) {
            layout.setBodyScrollEnabled(false)
            bodyScrollLocked = true
        }
    } catch (e) {}

    // Iniciar la animación del tangram inmediatamente
    currentStep.value = Steps.ANIMATING_LOGO
    scheduler.schedule(() => {
        _executeAnimatingProgressStep()
    }, 300, schedulerTag)
}

const _executeAnimatingProgressStep = () => {
    currentStep.value = Steps.ANIMATING_PROGRESS
    scheduler.schedule(() => {
        _executeWaitingForCompletionStep()
    }, 500, schedulerTag)
}

const _executeWaitingForCompletionStep = () => {
    currentStep.value = Steps.WAITING_FOR_COMPLETION

    const dt = 1000 / 30
    loadingTime.value = 0
    didEmitReady.value = false

    scheduler.interval(() => {
        _updateProgress(dt)
    }, dt, schedulerTag)
}

const _updateProgress = (dt) => {
    // Incrementar el tiempo de carga constantemente
    loadingTime.value += dt

    // Calcular el porcentaje basado únicamente en el tiempo transcurrido
    // 15 segundos (15000ms) = 100%
    const targetPercentage = utils.clamp((loadingTime.value / 25000) * 100, 0, 100)
    
    _incrementDisplayPercentage(targetPercentage)
}

const _getImageLoadPercentage = () => {
    const imageElements = document.querySelectorAll(".image")
    const imageLoadProgress = {loaded: 0, total: 0}
    Array.from(imageElements).map(item => {
        imageLoadProgress.total++
        if(item.getAttribute('load-status') === "loaded")
            imageLoadProgress.loaded++
    })

    if(imageLoadProgress.total <= 0)
        return 0
    return utils.clamp(imageLoadProgress.loaded*100/imageLoadProgress.total, 0, 100)
}

const _incrementDisplayPercentage = (targetPercentage) => {
    const diff = targetPercentage - percentage.value
    if(diff < 0)
        return

    // Incremento suave pero constante hacia el porcentaje objetivo
    const step = didEmitReady.value ?
        1.5 :
        1

    const smootheningPercentageIncrement = diff > step ? step : diff
    percentage.value += smootheningPercentageIncrement
    percentage.value = utils.clamp(percentage.value, 0, 100)

    if(percentage.value > 12 && !didEmitReady.value) {
        emit('ready')
        didEmitReady.value = true
    }

    // Completar cuando llegue a 100% o después de 15 segundos
    if(percentage.value >= 100 || loadingTime.value >= 25000) {
        percentage.value = 100
        _onLoadingComplete()
    }
}

const _onLoadingComplete = () => {
    scheduler.schedule(() => {
        percentage.value = 100
        _executeLeavingStep()
    }, 300, schedulerTag)
}

const _executeLeavingStep = () => {
    try {
        layout.setBodyScrollEnabled(true)
        bodyScrollLocked = false
    } catch (e) {}
    emit('leaving')

    if(window.location.hash) {
        scheduler.schedule(() => {
            currentStep.value = Steps.LEAVING
        }, 200, schedulerTag)
    }
    else {
        currentStep.value = Steps.LEAVING
    }

    scheduler.schedule(() => {
        emit('completed')
    }, 900, schedulerTag)
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

div.foxy-loader {
    position: fixed;
    z-index: 100;
    user-select: none;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: var(--primary-color, $dark);
    width: 100vw;
    height: 125vh;
    height: 125svh;
    top: -12.5vh;
    top: -12.5svh;
    transition: opacity 0.3s ease-in;

    &-tween-in {
        opacity: 0;
        transition: none!important;
        user-select: none;
        pointer-events: none;
    }

    &-tween-out {
        top: -125vh;
        transition: 1.2s top cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
}

div.foxy-loader-content {
    color: $text-normal-contrast;
    text-align: center;
    padding-bottom: 5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* === Estilos del Tangram === */
.triangles-container {
    width: 200px;
    height: 200px;
    position: relative;
    margin: 0;
}

.triangle {
    position: absolute;
    width: 0;
    height: 0;
    border: 1px solid rgba(255, 255, 255, 0.3);
    opacity: 0;

    &.animation-active {
        opacity: 1;
    }
}

/* Triángulo Rosa (Izquierda) - Color 2 */
.pink-triangle {
    border-top: 100px solid transparent;
    border-bottom: 100px solid var(--secondary-color, #D62884);
    border-left: 100px solid var(--secondary-color, #D62884);
    border-right: 100px solid transparent;
    top: 382px;
    left: 59px;
    transform: translateY(325.5px) translateX(-50px) rotate(-135deg);
    transform-origin: top left;

    &.animation-active {
        animation: pinkSequence 9s ease-in-out 0s infinite;
    }
}

/* Triángulo Azul (Arriba/Derecha) - Color 3 */
.blue-triangle {
    border-top: 100px solid var(--accent-color, #2884D6);
    border-bottom: 100px solid transparent;
    border-left: 100px solid transparent;
    border-right: 100px solid var(--accent-color, #2884D6);
    top: 0px;
    left: 100px;
    transform: translateY(325.5px) translateX(-50px) rotate(135deg);
    transform-origin: top left;

    &.animation-active {
        animation: blueSequence 9s ease-in-out 0s infinite;
    }
}

/* Paleta de piezas adicionales */
.pieces-wrapper {
    display: flex;
    gap: 24px;
    justify-content: center;
    margin-top: 20px;
    transform: translateX(-30px) translateY(-90px);
}

/* Escala responsive para los triángulos grandes */
.triangles-scale-outer {
    --s2: 1;
    width: calc(200px * var(--s2));
    height: calc(200px * var(--s2));
    margin: 50px auto;
    transform: translateX(-30px) translateY(-90px);
}

.triangles-scale {
    width: 200px;
    height: 200px;
    transform: translateX(-20px) translateY(-20px) scale(var(--s2));
    transform-origin: top left;
}

/* Escalado responsivo del conjunto */
.pieces-scale-outer {
    --s: 1;
    width: calc(800px * var(--s));
    height: calc(600px * var(--s));
    margin: 0 auto;
}

.pieces-scale {
    width: 800px;
    height: 600px;
    transform: translateX(-20px) translateY(-20px) scale(var(--s));
    transform-origin: top left;
}

/* Barra de carga centrada */
.loader-progress-fixed {
    position: fixed;
    left: 50%;
    top: 85%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 420px;
    z-index: 110;
    pointer-events: none;
    text-align: center;
}

.loading-bar {
    margin: 0 auto 0;
    margin-bottom: 12px;
    width: 60%;
    max-width: 400px;
    height: 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.2);
    overflow: hidden;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    opacity: 0;
    transition: 0.3s all ease-out;

    &.loading-bar-visible {
        opacity: 1;
    }
}

.loading-bar-fill {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color, #2884D6), var(--secondary-color, #D62884));
    transition: width 0.3s ease-out;
}

/* Contenedor animable para cada pieza */
.anim-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
}

/* Piezas del tangram */
.piece {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;

    &.animation-active {
        opacity: 1;
    }
}

/* Triángulo mediano - Color 2 */
.piece-medium {
    border-top: 70px solid transparent;
    border-bottom: 70px solid var(--secondary-color, #703EBB);
    border-left: 70px solid var(--secondary-color, #703EBB);
    border-right: 70px solid transparent;
    transform: translateY(410px) translateX(431px) rotate(-90deg);
    transform-origin: top left;
    top: 20px;
    left: 20px;

    &.animation-active {
        animation: mediumSequence 9s ease-in-out 0s infinite;
    }
}

/* Cuadrado - Color 5 */
.piece-square {
    width: 100px;
    height: 100px;
    background: var(--background-color, #10B127);
    transform: rotate(45deg) translateY(-162px) translateX(502.5px);
    top: 20px;
    left: 100px;

    &.animation-active {
        animation: squareSequence 9s ease-in-out 0s infinite;
    }
}

/* Triángulo pequeño (naranja) - Color 4 */
.piece-small-orange {
    border-top: 50px solid transparent;
    border-bottom: 50px solid var(--success-color, #F54C2C);
    border-left: 50px solid var(--success-color, #F54C2C);
    border-right: 50px solid transparent;
    transform: translateX(570px) translateY(30px) rotate(45deg);
    transform-origin: top left;
    top: 120px;
    left: 20px;

    &.animation-active {
        animation: orangeSmallSequence 9s ease-in-out 0s infinite;
    }
}

/* Triángulo pequeño (rojo/cian) - Color 5 */
.piece-small-red {
    border-top: 50px solid var(--background-color, #0EA5A5);
    border-bottom: 50px solid transparent;
    border-left: 50px solid transparent;
    border-right: 50px solid var(--background-color, #0EA5A5);
    transform: translateY(192px) translateX(279.5px) rotate(-45deg);
    top: 120px;
    left: 120px;

    &.animation-active {
        animation: redSmallSequence 9s ease-in-out 0s infinite;
    }
}

/* Paralelogramo - Color 4 */
.piece-parallelogram {
    width: 140px;
    height: 70px;
    background: var(--success-color, #FF8E22);
    transform: skew(-45deg) translateX(485px) translateY(202px) rotate(0deg);
    position: absolute;
    top: 160px;
    left: 60px;

    &.animation-active {
        animation: parallelogramSequence 9s ease-in-out 0s infinite;
    }
}

/* Animaciones del tangram */
@keyframes mediumSequence {
    0% {
        transform: translateY(412.5px) translateX(431px) rotate(-90deg);
    }
    10% {
        transform: translateY(412.5px) translateX(431px) rotate(-90deg);
    }
    20% {
        transform: translateY(360px) translateX(648.5px) rotate(-225deg);
    }
    30% {
        transform: translateY(360px) translateX(647.5px) rotate(-225deg);
    }
    40% {
        transform: translateY(20px) translateX(552px) rotate(45deg);
    }
    50% {
        transform: translateY(20px) translateX(552px) rotate(45deg);
    }
    60% {
        transform: translateY(150px) translateX(531px) rotate(135deg);
    }
    70% {
        transform: translateY(150px) translateX(531px) rotate(135deg);
    }
    80% {
        transform: translateY(320px) translateX(240px) rotate(0deg);
    }
    90% {
        transform: translateY(320px) translateX(240px) rotate(0deg);
    }
    100% {
        transform: translateY(412.5px) translateX(431px) rotate(-90deg);
    }
}

@keyframes squareSequence {
    0% {
        transform: rotate(45deg) translateY(-162px) translateX(502.5px);
    }
    10% {
        transform: rotate(45deg) translateY(-162px) translateX(502.5px);
    }
    20% {
        transform: rotate(45deg) translateY(-255px) translateX(581.5px);
    }
    30% {
        transform: rotate(45deg) translateY(-255px) translateX(581.5px);
    }
    40% {
        transform: rotate(0deg) translateY(443px) translateX(369.5px);
    }
    50% {
        transform: rotate(0deg) translateY(443px) translateX(369.5px);
    }
    60% {
        transform: translateY(172.5px) translateX(403.5px);
    }
    70% {
        transform: translateY(172.5px) translateX(403.5px);
    }
    80% {
        transform: translateY(102.5px) translateX(412.5px);
    }
    90% {
        transform: translateY(102.5px) translateX(412.5px);
    }
    100% {
        transform: rotate(45deg) translateY(-162px) translateX(502.5px);
    }
}

@keyframes orangeSmallSequence {
    0% {
        transform: translateX(570px) translateY(30px) rotate(45deg);
    }
    10% {
        transform: translateX(570px) translateY(30px) rotate(45deg);
    }
    20% {
        transform: translateX(220px) translateY(30px) rotate(225deg);
    }
    30% {
        transform: translateX(220px) translateY(30px) rotate(225deg);
    }
    40% {
        transform: translateX(350px) translateY(19px) rotate(0deg);
    }
    50% {
        transform: translateX(350px) translateY(19px) rotate(0deg);
    }
    60% {
        transform: translateX(382px) translateY(257px) rotate(0deg);
    }
    70% {
        transform: translateX(382px) translateY(257px) rotate(0deg);
    }
    80% {
        transform: translateX(594px) translateY(288px) rotate(135deg);
    }
    90% {
        transform: translateX(594px) translateY(288px) rotate(135deg);
    }
    100% {
        transform: translateX(570px) translateY(30px) rotate(45deg);
    }
}

@keyframes redSmallSequence {
    0% {
        transform: translateY(192px) translateX(279.5px) rotate(-45deg);
    }
    10% {
        transform: translateY(192px) translateX(279.5px) rotate(-45deg);
    }
    20% {
        transform: translateY(-19px) translateX(141.5px) rotate(-45deg);
    }
    30% {
        transform: translateY(-19px) translateX(141.5px) rotate(-45deg);
    }
    40% {
        transform: translateY(-79px) translateX(351.5px) rotate(-90deg);
    }
    50% {
        transform: translateY(-79px) translateX(351.5px) rotate(-90deg);
    }
    60% {
        transform: translateY(154px) translateX(283.5px) rotate(0deg);
    }
    70% {
        transform: translateY(154px) translateX(283.5px) rotate(0deg);
    }
    80% {
        transform: translateY(-16.5px) translateX(394.5px) rotate(180deg);
    }
    90% {
        transform: translateY(-16.5px) translateX(394.5px) rotate(180deg);
    }
    100% {
        transform: translateY(192px) translateX(279.5px) rotate(-45deg);
    }
}

@keyframes parallelogramSequence {
    0% {
        transform: skew(-45deg) translateX(486px) translateY(202px) rotate(0deg);
        width: 140px;
        height: 70px;
    }
    10% {
        transform: skew(-45deg) translateX(486px) translateY(202px) rotate(0deg);
        width: 140px;
        height: 70px;
    }
    20% {
        transform: skew(45deg) translateX(140px) translateY(-9px) rotate(180deg);
        width: 140px;
        height: 70px;
    }
    30% {
        transform: skew(45deg) translateX(140px) translateY(-9px) rotate(180deg);
        width: 140px;
        height: 70px;
    }
    40% {
        transform: skew(45deg) translateX(384px) translateY(-21px) rotate(270deg);
        width: 97px;
        height: 99px;
    }
    50% {
        transform: skew(45deg) translateX(384px) translateY(-21px) rotate(270deg);
        width: 97px;
        height: 99px;
    }
    60% {
        transform: skewY(45deg) translateX(342px) translateY(-176.5px) rotate(90deg);
        width: 99px;
        height: 100px;
    }
    70% {
        transform: skewY(45deg) translateX(342px) translateY(-176.5px) rotate(90deg);
        width: 99px;
        height: 100.5px;
    }
    80% {
        transform: skew(-45deg) translateX(628px) translateY(249.5px) rotate(0deg);
        width: 140px;
        height: 70px;
    }
    90% {
        transform: skew(-45deg) translateX(628px) translateY(249.5px) rotate(0deg);
        width: 140px;
        height: 70px;
    }
    100% {
        transform: skew(-45deg) translateX(486px) translateY(202px) rotate(0deg);
        width: 140px;
        height: 70px;
    }
}

@keyframes blueSequence {
    0% {
        top: 0px;
        left: 100px;
        transform: translateY(453.5px) translateX(190px) rotate(135deg);
    }
    10% {
        top: 0px;
        left: 100px;
        transform: translateY(453.5px) translateX(190px) rotate(135deg);
    }
    20% {
        top: 20px;
        left: 80px;
        transform: translateY(355.5px) translateX(119px) rotate(45deg);
    }
    30% {
        top: 20px;
        left: 80px;
        transform: translateY(355.5px) translateX(119px) rotate(45deg);
    }
    40% {
        top: 40px;
        left: 140px;
        transform: translateY(505.5px) translateX(-70px) rotate(0deg);
    }
    50% {
        top: 40px;
        left: 140px;
        transform: translateY(505.5px) translateX(-70px) rotate(0deg);
    }
    60% {
        top: 30px;
        left: 160px;
        transform: translateY(753.5px) translateX(243.1px) rotate(180deg);
    }
    70% {
        top: 30px;
        left: 160px;
        transform: translateY(753.5px) translateX(243.1px) rotate(180deg);
    }
    80% {
        top: 30px;
        left: 160px;
        transform: translateY(481px) translateX(-45.1px) rotate(360deg);
    }
    90% {
        top: 30px;
        left: 160px;
        transform: translateY(481px) translateX(-45.1px) rotate(360deg);
    }
    100% {
        top: 0px;
        left: 100px;
        transform: translateY(453.5px) translateX(190px) rotate(135deg);
    }
}

@keyframes pinkSequence {
    0% {
        top: 382px;
        left: 59px;
        transform: translateY(355.5px) translateX(-50px) rotate(-135deg);
    }
    10% {
        top: 382px;
        left: 59px;
        transform: translateY(355.5px) translateX(-50px) rotate(-135deg);
    }
    20% {
        top: 382px;
        left: 59px;
        transform: translateY(275px) translateX(139px) rotate(-180deg);
    }
    30% {
        top: 382px;
        left: 59px;
        transform: translateY(275px) translateX(138px) rotate(-180deg);
    }
    40% {
        top: 340px;
        left: 80px;
        transform: translateY(207.5px) translateX(-10px) rotate(0deg);
    }
    50% {
        top: 340px;
        left: 80px;
        transform: translateY(207.5px) translateX(-10px) rotate(0deg);
    }
    60% {
        top: 340px;
        left: 80px;
        transform: translateY(442.5px) translateX(-178px) rotate(-90deg);
    }
    70% {
        top: 340px;
        left: 80px;
        transform: translateY(442.5px) translateX(-178px) rotate(-90deg);
    }
    80% {
        top: 340px;
        left: 80px;
        transform: translateY(303.5px) translateX(-120px) rotate(-45deg);
    }
    90% {
        top: 340px;
        left: 80px;
        transform: translateY(303.5px) translateX(-120px) rotate(-45deg);
    }
    100% {
        top: 382px;
        left: 59px;
        transform: translateY(355.5px) translateX(-50px) rotate(-135deg);
    }
}

/* Display del porcentaje */
div.foxy-loader-progress-display {
    margin-top: 20px;
    overflow: hidden;
    z-index: 5;
    transition: 0.3s all ease-out;

    &-hidden {
        opacity: 0;
        margin-top: -30px;
    }

    p {
        color: $text-normal-contrast;
        margin-bottom: 5px;
        font-family: 'Lato', sans-serif;
        font-size: 1.2rem;
    }
}

div.transition-none {
    transition: none!important;
}

/* Breakpoints responsive */
@media (min-width: 1200px) {
    .triangles-scale {
        transform: translateX(-20px) translateY(-56px) scale(var(--s2));
    }
}

@media (max-width: 1200px) {
    .pieces-scale-outer {
        --s: 0.95;
    }
    .triangles-scale-outer {
        --s2: 0.95;
    }

    /* Rango: 993px - 1199px (y también <=992 si no se sobreescribe) */
    .triangles-scale {
        /* Ajusta estos valores hasta que te guste la posición en 1024px/1100px, etc. */
        transform: translateX(-20px) translateY(-51px) scale(var(--s2));
    }
}

/* Rango específico: 769px - 992px */
@media (max-width: 992px) and (min-width: 769px) {
    .pieces-scale-outer {
        --s: 0.8;
    }
    .triangles-scale-outer {
        --s2: 0.8;
    }

    .triangles-scale {
        /* Ajusta estos valores para portátiles/ tablets en horizontal (entre 769 y 992px) */
        transform: translateX(-20px) translateY(-35px) scale(var(--s2));
    }
}



@media (max-width: 768px) {
    .pieces-scale-outer {
        --s: 0.65;
    }
    .triangles-scale-outer {
        --s2: 0.65;
    }

    .triangles-scale {
        /* Ajusta estos valores para portátiles/ tablets en horizontal (entre 769 y 992px) */
        transform: translateX(-20px) translateY(-20px) scale(var(--s2));
    }
}

@media (max-width: 576px) {
    .pieces-scale-outer {
        --s: 0.52;
    }
    .triangles-scale-outer {
        --s2: 0.52;
    }
    .triangles-scale {
        transform: translateX(-20px) translateY(-4.5px) scale(var(--s2));
    }
}

@media (max-width: 420px) {
    .pieces-scale-outer {
        --s: 0.42;
    }
    .triangles-scale-outer {
        --s2: 0.42;
    }
    .triangles-scale {
        transform: translateX(-20px) translateY(5px) scale(var(--s2));
    }
}
</style>