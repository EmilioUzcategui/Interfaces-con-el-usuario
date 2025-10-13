<template>
    <footer class="dashboard-footer">
        <div class="footer-container">
            <!-- Main Footer Content -->
            <div class="footer-main">
                <div class="row g-4">
                    <!-- Company Info -->
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="footer-section">
                            <div class="footer-logo">
                                <i class="fa-solid fa-tachometer-alt"></i>
                                <span>Dashboard Pro</span>
                            </div>
                            <p class="footer-description">
                                Tu plataforma de gestión personalizada con herramientas avanzadas de configuración y análisis en tiempo real.
                            </p>
                            <div class="social-links">
                                <a href="#" class="social-link">
                                    <i class="fa-brands fa-linkedin"></i>
                                </a>
                                <a href="#" class="social-link">
                                    <i class="fa-brands fa-twitter"></i>
                                </a>
                                <a href="#" class="social-link">
                                    <i class="fa-brands fa-github"></i>
                                </a>
                                <a href="#" class="social-link">
                                    <i class="fa-brands fa-discord"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div class="col-12 col-md-6 col-lg-2">
                        <div class="footer-section">
                            <h5 class="footer-title">Enlaces Rápidos</h5>
                            <ul class="footer-links">
                                <li><Link :href="'/dashboard'" :label="'Inicio'"/></li>
                                <li><Link :href="'#dashboard-stats'" :label="'Estadísticas'"/></li>
                                <li><Link :href="'#dashboard-features'" :label="'Características'"/></li>
                                <li><Link :href="'#dashboard-color-config'" :label="'Configuración'"/></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Features -->
                    <div class="col-12 col-md-6 col-lg-3">
                        <div class="footer-section">
                            <h5 class="footer-title">Características</h5>
                            <ul class="footer-links">
                                <li><Link :href="'#'" :label="'Personalización'"/></li>
                                <li><Link :href="'#'" :label="'Analytics'"/></li>
                                <li><Link :href="'#'" :label="'Integraciones'"/></li>
                                <li><Link :href="'#'" :label="'API'"/></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Support -->
                    <div class="col-12 col-md-6 col-lg-3">
                        <div class="footer-section">
                            <h5 class="footer-title">Soporte</h5>
                            <ul class="footer-links">
                                <li><Link :href="'#'" :label="'Centro de Ayuda'"/></li>
                                <li><Link :href="'#'" :label="'Documentación'"/></li>
                                <li><Link :href="'#'" :label="'Comunidad'"/></li>
                                <li><Link :href="'#'" :label="'Contacto'"/></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="row align-items-center">
                    <div class="col-12 col-md-6">
                        <div class="copyright">
                            <span>&copy; 2024 Dashboard Pro. Todos los derechos reservados.</span>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="footer-legal">
                            <Link :href="'#'" :label="'Política de Privacidad'"/>
                            <Link :href="'#'" :label="'Términos de Servicio'"/>
                            <Link :href="'#'" :label="'Cookies'"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import Link from "/src/vue/components/generic/Link.vue"
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.dashboard-footer {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: white;
    margin-top: auto;
}

.footer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 3rem 2rem 1rem;
    
    @include media-breakpoint-down(md) {
        padding: 2rem 1rem 1rem;
    }
}

.footer-main {
    margin-bottom: 2rem;
}

.footer-section {
    margin-bottom: 2rem;
    
    @include media-breakpoint-down(md) {
        text-align: center;
    }
}

.footer-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    
    i {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }
}

.footer-description {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
}

.social-links {
    display: flex;
    gap: 1rem;
    
    @include media-breakpoint-down(md) {
        justify-content: center;
    }
}

.social-link {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
        background: linear-gradient(135deg, #667eea, #764ba2);
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }
    
    i {
        font-size: 1.1rem;
    }
}

.footer-title {
    color: white;
    font-weight: 700;
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
        margin-bottom: 0.5rem;
        
        a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: color 0.3s ease;
            font-size: 0.9rem;
            
            &:hover {
                color: #667eea;
            }
        }
    }
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1.5rem;
    
    @include media-breakpoint-down(md) {
        text-align: center;
    }
}

.copyright {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    
    @include media-breakpoint-down(md) {
        margin-bottom: 1rem;
    }
}

.footer-legal {
    display: flex;
    gap: 1.5rem;
    justify-content: flex-end;
    
    @include media-breakpoint-down(md) {
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    a {
        color: rgba(255, 255, 255, 0.6);
        text-decoration: none;
        font-size: 0.85rem;
        transition: color 0.3s ease;
        
        &:hover {
            color: #667eea;
        }
    }
}
</style>


