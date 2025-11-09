<template>
    <div class="wysiwyg-editor">
        <div class="toolbar">
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('bold')" title="Negrita">
                <i class="fa-solid fa-bold"></i>
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('italic')" title="Cursiva">
                <i class="fa-solid fa-italic"></i>
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('underline')" title="Subrayado">
                <i class="fa-solid fa-underline"></i>
            </button>
            <div class="toolbar-separator"></div>
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('justifyLeft')" title="Alinear izquierda">
                <i class="fa-solid fa-align-left"></i>
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('justifyCenter')" title="Centrar">
                <i class="fa-solid fa-align-center"></i>
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('justifyRight')" title="Alinear derecha">
                <i class="fa-solid fa-align-right"></i>
            </button>
            <div class="toolbar-separator"></div>
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('insertUnorderedList')" title="Lista con viñetas">
                <i class="fa-solid fa-list-ul"></i>
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('insertOrderedList')" title="Lista numerada">
                <i class="fa-solid fa-list-ol"></i>
            </button>
        </div>
        <div 
            ref="editorRef"
            class="editor-content"
            contenteditable="true"
            @input="handleInput"
            @blur="handleBlur"
            :style="{ minHeight: minHeight + 'px' }"
            :data-placeholder="placeholder"
        ></div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    minHeight: {
        type: Number,
        default: 150
    },
    placeholder: {
        type: String,
        default: 'Escribe aquí...'
    }
});

const emit = defineEmits(['update:modelValue']);

const editorRef = ref(null);

const formatText = (command) => {
    document.execCommand(command, false, null);
    editorRef.value?.focus();
    updateValue();
};

const handleInput = () => {
    updateValue();
};

const handleBlur = () => {
    updateValue();
};

const updateValue = () => {
    if (editorRef.value) {
        const html = editorRef.value.innerHTML;
        emit('update:modelValue', html);
    }
};

watch(() => props.modelValue, (newValue) => {
    if (editorRef.value && editorRef.value.innerHTML !== newValue) {
        editorRef.value.innerHTML = newValue || '';
    }
}, { immediate: true });

onMounted(() => {
    if (editorRef.value && !props.modelValue) {
        editorRef.value.innerHTML = '';
    }
});
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.wysiwyg-editor {
    border: 2px solid $light-3;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    
        &:focus-within {
        border-color: var(--secondary-color, #ff5900);
        box-shadow: 0 0 0 0.2rem rgba(255, 89, 0, 0.25);
    }
    
    .toolbar {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        background-color: $light-1;
        border-bottom: 1px solid $light-3;
        gap: 0.25rem;
        
        .btn {
            border: 1px solid $light-3;
            padding: 0.25rem 0.5rem;
            
            &:hover {
                background-color: $light-2;
            }
        }
        
        .toolbar-separator {
            width: 1px;
            height: 1.5rem;
            background-color: $light-3;
            margin: 0 0.25rem;
        }
    }
    
    .editor-content {
        padding: 0.75rem 1rem;
        min-height: 150px;
        outline: none;
        font-size: 1rem;
        line-height: 1.5;
        color: $dark;
        
        &:empty:before {
            content: attr(data-placeholder);
            color: $text-muted;
            pointer-events: none;
        }
        
        &:focus {
            outline: none;
        }
        
        :deep(p) {
            margin: 0 0 0.5rem 0;
            
            &:last-child {
                margin-bottom: 0;
            }
        }
        
        :deep(ul), :deep(ol) {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
        }
    }
}
</style>

