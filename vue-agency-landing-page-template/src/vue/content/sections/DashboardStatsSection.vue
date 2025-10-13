<template>
    <PageSection id="dashboard-stats"
                 :darken="false"
                 :no-padding="false">
        <PageSectionHeader :title="'Estadísticas en Tiempo Real'"
                           :subtitle="'Mantente al día con los datos más importantes'"
                           :center="true"/>

        <PageSectionContent>
            <div class="row g-4">
                <div class="col-12 col-md-6 col-lg-3" v-for="stat in stats" :key="stat.id">
                    <div class="stat-card" :class="stat.colorClass">
                        <div class="stat-icon">
                            <i :class="stat.icon"></i>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-number">{{ stat.value }}</h3>
                            <p class="stat-label">{{ stat.label }}</p>
                            <div class="stat-trend" :class="stat.trendClass">
                                <i :class="stat.trendIcon"></i>
                                <span>{{ stat.trend }}</span>
                            </div>
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

const stats = ref([
    {
        id: 1,
        value: "2,847",
        label: "Usuarios Activos",
        icon: "fa-solid fa-users",
        trend: "+12%",
        trendIcon: "fa-solid fa-arrow-up",
        trendClass: "positive",
        colorClass: "stat-blue"
    },
    {
        id: 2,
        value: "98.5%",
        label: "Uptime",
        icon: "fa-solid fa-server",
        trend: "+0.2%",
        trendIcon: "fa-solid fa-arrow-up",
        trendClass: "positive",
        colorClass: "stat-green"
    },
    {
        id: 3,
        value: "1,234",
        label: "Ventas Hoy",
        icon: "fa-solid fa-shopping-cart",
        trend: "+8%",
        trendIcon: "fa-solid fa-arrow-up",
        trendClass: "positive",
        colorClass: "stat-purple"
    },
    {
        id: 4,
        value: "45.2K",
        label: "Ingresos",
        icon: "fa-solid fa-dollar-sign",
        trend: "+15%",
        trendIcon: "fa-solid fa-arrow-up",
        trendClass: "positive",
        colorClass: "stat-orange"
    }
])
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

#dashboard-stats {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 5rem 0;
}

.stat-card {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2);
    }
    
    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    
    &.stat-blue::before {
        background: linear-gradient(90deg, #667eea, #764ba2);
    }
    
    &.stat-green::before {
        background: linear-gradient(90deg, #56ab2f, #a8e6cf);
    }
    
    &.stat-purple::before {
        background: linear-gradient(90deg, #a8edea, #fed6e3);
    }
    
    &.stat-orange::before {
        background: linear-gradient(90deg, #ff9a9e, #fecfef);
    }
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    
    i {
        font-size: 1.5rem;
        color: white;
    }
}

.stat-blue .stat-icon {
    background: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-green .stat-icon {
    background: linear-gradient(135deg, #56ab2f, #a8e6cf);
}

.stat-purple .stat-icon {
    background: linear-gradient(135deg, #a8edea, #fed6e3);
}

.stat-orange .stat-icon {
    background: linear-gradient(135deg, #ff9a9e, #fecfef);
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #2c3e50;
}

.stat-label {
    color: #7f8c8d;
    font-weight: 500;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.9rem;
}

.stat-trend {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 0.9rem;
    
    i {
        margin-right: 0.5rem;
    }
    
    &.positive {
        color: #27ae60;
    }
    
    &.negative {
        color: #e74c3c;
    }
}
</style>

