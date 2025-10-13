<template>
    <PageSection id="dashboard-features"
                 :darken="false"
                 :no-padding="false">
        <PageSectionHeader :title="'Características Principales'"
                           :subtitle="'Descubre todas las funcionalidades disponibles'"
                           :center="true"/>

        <PageSectionContent>
            <div class="row g-4">
                <div class="col-12 col-md-6 col-lg-4" v-for="feature in features" :key="feature.id">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i :class="feature.icon"></i>
                        </div>
                        <h4 class="feature-title">{{ feature.title }}</h4>
                        <p class="feature-description">{{ feature.description }}</p>
                        <div class="feature-action">
                            <button class="btn btn-outline-primary">
                                <i class="fa-solid fa-arrow-right me-2"></i>
                                Explorar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageSectionContent>
    </PageSection>
</template>

<script setup>
import PageSection from "/src/vue/components/layout/PageSection.vue"
import PageSectionHeader from "/src/vue/components/layout/PageSectionHeader.vue"
import PageSectionContent from "/src/vue/components/layout/PageSectionContent.vue"
import {ref} from "vue"

const features = ref([
    {
        id: 1,
        title: "Analytics Avanzado",
        description: "Obtén insights detallados sobre el rendimiento de tu aplicación con métricas en tiempo real.",
        icon: "fa-solid fa-chart-line"
    },
    {
        id: 2,
        title: "Gestión de Usuarios",
        description: "Administra usuarios, permisos y roles de manera eficiente y segura.",
        icon: "fa-solid fa-user-shield"
    },
    {
        id: 3,
        title: "Personalización",
        description: "Customiza la apariencia y funcionalidad según tus necesidades específicas.",
        icon: "fa-solid fa-palette"
    },
    {
        id: 4,
        title: "Integraciones",
        description: "Conecta con servicios externos y APIs para ampliar las capacidades.",
        icon: "fa-solid fa-plug"
    },
    {
        id: 5,
        title: "Notificaciones",
        description: "Mantén a tus usuarios informados con un sistema de notificaciones inteligente.",
        icon: "fa-solid fa-bell"
    },
    {
        id: 6,
        title: "Seguridad",
        description: "Protege tus datos con las mejores prácticas de seguridad y encriptación.",
        icon: "fa-solid fa-lock"
    }
])
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

#dashboard-features {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 5rem 0;
    position: relative;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
    }
}

.feature-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 2.5rem;
    text-align: center;
    color: white;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
    
    &:hover {
        transform: translateY(-10px);
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
}

.feature-icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    transition: all 0.3s ease;
    
    i {
        font-size: 2rem;
        color: white;
    }
}

.feature-card:hover .feature-icon {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.feature-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: white;
}

.feature-description {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 2rem;
    font-size: 1rem;
}

.feature-action {
    .btn {
        border-radius: 25px;
        padding: 10px 25px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: white;
        background: rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        
        &:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
        }
    }
}
</style>

