<template>
    <PageSection id="dashboard-hero"
                 :darken="false"
                 :no-padding="false">
        <div class="dashboard-hero-container">
            <div class="container-xxl">
                <div class="row align-items-center min-vh-100">
                    <div class="col-12 col-lg-6">
                        <div class="hero-content">
                            <h1 class="hero-title">
                                ¡Bienvenido al 
                                <span class="gradient-text">Dashboard</span>!
                            </h1>
                            <p class="hero-subtitle">
                                Esta es tu nueva landing page personalizada con un diseño moderno y colores vibrantes.
                            </p>
                            <div class="hero-buttons">
                                <button class="btn btn-primary btn-lg me-3" @click="scrollToConfig">
                                    <i class="fa-solid fa-rocket me-2"></i>
                                    Explorar
                                </button>
                                <button class="btn btn-outline-secondary btn-lg" @click="scrollToConfig">
                                    <i class="fa-solid fa-cog me-2"></i>
                                    Configuración
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6">
                        <div class="hero-visual">
                            <div class="floating-cards">
                                <div class="card card-1">
                                    <i class="fa-solid fa-chart-line"></i>
                                    <span>Analytics</span>
                                </div>
                                <div class="card card-2">
                                    <i class="fa-solid fa-users"></i>
                                    <span>Usuarios</span>
                                </div>
                                <div class="card card-3">
                                    <i class="fa-solid fa-cog"></i>
                                    <span>Config</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageSection>
</template>

<script setup>
import PageSection from "/src/vue/components/layout/PageSection.vue"

const scrollToConfig = () => {
    const configSection = document.getElementById('dashboard-color-config')
    if (configSection) {
        configSection.scrollIntoView({ behavior: 'smooth' })
    }
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.dashboard-hero-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        opacity: 0.3;
    }
}

.hero-content {
    color: white;
    z-index: 2;
    position: relative;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    
    @include media-breakpoint-down(md) {
        font-size: 2.5rem;
    }
}

.gradient-text {
    background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
}

.hero-buttons {
    .btn {
        border-radius: 50px;
        padding: 12px 30px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
        
        &.btn-primary {
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            border: none;
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
            }
        }
        
        &.btn-outline-secondary {
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            
            &:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.5);
                transform: translateY(-2px);
            }
        }
    }
}

.hero-visual {
    position: relative;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.floating-cards {
    position: relative;
    width: 100%;
    height: 100%;
}

.card {
    position: absolute;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 2rem;
    color: white;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    animation: float 6s ease-in-out infinite;
    
    i {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        display: block;
    }
    
    span {
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    &:hover {
        transform: translateY(-10px) scale(1.05);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
}

.card-1 {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
}

.card-2 {
    top: 30%;
    right: 20%;
    animation-delay: 2s;
}

.card-3 {
    bottom: 20%;
    left: 30%;
    animation-delay: 4s;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}
</style>
