<template>
<div class="filter-section">
    <div class="section-header filter-header" @click="toggleCollapse">
        <h4>Data Filtering</h4>
        <span class="collapse-icon" :class="{ collapsed: isCollapsed }">&#9660;</span>
    </div>
    <transition name="collapse">
        <div v-show="!isCollapsed" class="filter-content">
            <div v-for="item in filterConfig" :key="item.key" class="filter-item">
                <!-- 组件标题 -->
                <label>{{ item.label }}</label>

                <!-- 输入select,显示选择框 -->
                <select v-if="item.type === 'select'"
                :value="localConfig[item.key]"
                @change="updateField(item.key, $event.target.value)">
                <!-- 选项列表 -->
                <option v-for="opt in item.options" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <!-- 其他类型可扩展 -->
            </div>
        </div>
    </transition>
</div>
</template>

<script setup>
/* no-undef */
/* eslint-disable */
import { ref, watch } from 'vue'
const props = defineProps({
    filterConfig: Array,
    modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

const localConfig = ref({ ...props.modelValue })
const isCollapsed = ref(true)

watch(() => props.modelValue, (val) => {
    localConfig.value = { ...val }
})

function updateField(key, value) {
    localConfig.value[key] = value
    emit('update:modelValue', { ...localConfig.value })
}

function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.filter-section {
    margin-bottom: 16px;
    border-radius: 8px;
    background: var(--bg-secondary);
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 8px 12px;
    user-select: none;
}
.collapse-icon {
    font-size: 16px;
    margin-left: 8px;
    transition: transform 0.2s;
}
.collapse-icon.collapsed {
    transform: rotate(-90deg);
}
.filter-content {
    padding: 8px 16px 12px 16px;
}
.filter-item {
    margin-bottom: 12px;
}
.collapse-enter-active, .collapse-leave-active {
    transition: max-height 0.25s cubic-bezier(.4,0,.2,1), opacity 0.2s;
}
.collapse-enter-from, .collapse-leave-to {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
}
.collapse-enter-to, .collapse-leave-from {
    max-height: 300px;
    opacity: 1;
}
</style>
