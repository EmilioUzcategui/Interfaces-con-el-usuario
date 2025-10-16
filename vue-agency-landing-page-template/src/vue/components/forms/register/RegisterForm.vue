<template>
    <div class="register-form">
        <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="name" class="form-label">Nombre completo</label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    v-model="form.name"
                    :class="{ 'is-invalid': errors.name }"
                    required
                >
                <div v-if="errors.name" class="invalid-feedback">
                    {{ errors.name }}
                </div>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    v-model="form.email"
                    :class="{ 'is-invalid': errors.email }"
                    required
                >
                <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                </div>
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    v-model="form.password"
                    :class="{ 'is-invalid': errors.password }"
                    required
                >
                <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                </div>
            </div>

            <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
                <input 
                    type="password" 
                    class="form-control" 
                    id="confirmPassword" 
                    v-model="form.confirmPassword"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    required
                >
                <div v-if="errors.confirmPassword" class="invalid-feedback">
                    {{ errors.confirmPassword }}
                </div>
            </div>

            <div v-if="message" class="alert" :class="messageType">
                {{ message }}
            </div>

            <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Registrando...' : 'Registrarse' }}
                </button>
            </div>

            <div class="text-center mt-3">
                <p>¿Ya tienes cuenta? <a href="/login" class="text-decoration-none">Inicia sesión</a></p>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
});

const errors = reactive({});
const message = ref('');
const messageType = ref('');
const loading = ref(false);

const validateForm = () => {
    // Limpiar errores anteriores
    Object.keys(errors).forEach(key => delete errors[key]);
    
    let isValid = true;

    // Validar nombre
    if (!form.name.trim()) {
        errors.name = 'El nombre es requerido';
        isValid = false;
    }

    // Validar email
    if (!form.email.trim()) {
        errors.email = 'El email es requerido';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = 'El email no es válido';
        isValid = false;
    }

    // Validar contraseña
    if (!form.password) {
        errors.password = 'La contraseña es requerida';
        isValid = false;
    } else if (form.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
        isValid = false;
    }

    // Validar confirmación de contraseña
    if (!form.confirmPassword) {
        errors.confirmPassword = 'Confirma tu contraseña';
        isValid = false;
    } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
        isValid = false;
    }

    return isValid;
};

const handleSubmit = async () => {
    if (!validateForm()) {
        return;
    }

    loading.value = true;
    message.value = '';

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: form.name,
                email: form.email,
                password: form.password
            })
        });

        const data = await response.json();

        if (response.ok) {
            message.value = '¡Registro exitoso! Redirigiendo al login...';
            messageType.value = 'alert-success';
            
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } else {
            message.value = data.error || 'Error en el registro';
            messageType.value = 'alert-danger';
        }
    } catch (error) {
        message.value = 'Error de conexión. Intenta de nuevo.';
        messageType.value = 'alert-danger';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.register-form {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    padding: 12px;
    font-weight: 600;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    transform: translateY(-1px);
}

.form-control:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
</style>