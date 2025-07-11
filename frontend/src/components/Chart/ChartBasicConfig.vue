<template>
<div class="chart-basic-config">
    <h4 class="basic-config-title">Basic Configuration</h4>
    <!-- Title -->
    <div class="basic-config-item">
        <label for="chart-title">Title</label>
        <input id="chart-title" v-model="localConfig.title"/>
    </div>
        <!-- Theme -->
    <div class="basic-config-item">
        <label for="color-scheme">Theme</label>
        <select id="color-scheme" v-model="localConfig.colorScheme">
            <!-- 动态跟随文件夹中主题文件增加 -->
            <option v-for="theme in themeList" :key="theme" :value="theme">
                {{ theme.charAt(0).toUpperCase() + theme.slice(1) }}
            </option>
        </select>
    </div>
    <!-- Animation -->
    <div class="basic-config-item">
        <label for="animation">Animation</label>
        <label class="switch">
            <input id="animation" type="checkbox" v-model="localConfig.animation" />
            <span class="slider"></span>
        </label>
        <span style="margin-left:8px;min-width:32px;">{{ localConfig.animation ? 'On' : 'Off' }}</span>
    </div>
    <!-- Null Handling -->
    <div class="basic-config-item" v-if="showNullHandling">
        <label for="null-handling">Null Handling</label>
        <select id="null-handling" v-model="localConfig.nullHandling">
            <option value="ignoreNull">Ignore (Default)</option>
            <option value="fillZero">Fill with 0</option>
            <option value="fillNearest">Nearest Neighbor</option>
            <option value="linearInterpolate">Linear Interpolate</option>
            <option value="fillCubicSpline">Cubic Spline</option>
            <option value="fillPolynomial">Polynomial Interpolate</option>
            <option value="fillStepBefore">Step Before</option>
            <option value="fillStepAfter">Step After</option>
            <option value="fillBasis">Basis</option>
            <option value="fillCardinal">Cardinal</option>
            <option value="fillMonotone">Monotone</option>
            <option value="fillAkima">Akima</option>
        </select>
    </div>
    <!-- Legend 开关 -->
    <div class="basic-config-item">
        <label for="legend-toggle">Legend</label>
        <label class="switch">
            <input id="legend-toggle" type="checkbox" v-model="localConfig.legendVisible" />
            <span class="slider"></span>
        </label>
        <span style="margin-left:8px;min-width:32px;">{{ localConfig.legendVisible ? 'On' : 'Off' }}</span>
    </div>
    <!-- Legend 位置选择 -->
    <div class="basic-config-item" v-if="localConfig.legendVisible">
        <label for="legend-position">Legend Position</label>
        <select id="legend-position" v-model="localConfig.legendPosition">
            <option v-for="pos in legendPositions" :key="pos.value" :value="pos.value">{{ pos.label }}</option>
        </select>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
// This component is for basic configuration shared by all chart types
// 该组件用于所有图表的通用基础配置
import { ref, onMounted, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    showNullHandling: {
        type: Boolean,
        default: true
    },
    // 传入当前用于绘图的数据
    chartData: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['update:modelValue'])

// Use a computed property for two-way binding with parent
// 本地副本，避免直接修改父组件数据
const localConfig = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

// 主题列表（可手动维护或通过接口/fetch获取）
const themeList = ref(['default'])

onMounted(async () => {
    // 先尝试后端接口
    try {
        const res = await fetch('/api/themes')
        if (res.ok) {
            const arr = await res.json()
            themeList.value = arr
            return
        }
    } catch (e) {}
    // 后端接口不可用时，降级为静态 themes.json
    try {
        const res = await fetch('/themes/themes.json')
        if (res.ok) {
            const arr = await res.json()
            themeList.value = arr
        }
    } catch (e) {}
})

//TODO 在localConfig中增加legendVisible和legendPosition
const legendPositions = [
    { value: 'bottom', label: 'Bottom' },
    { value: 'top', label: 'Top' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' }
]
</script>

<style scoped>
.chart-basic-config {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 16px 12px 8px 12px;
    margin-bottom: 16px;
    background: #fafbfc;
    transition: background 0.2s, border 0.2s;
    animation: fadeInUp 0.6s ease;
    animation-fill-mode: both;
    animation-delay: 0.35s;
}
.basic-config-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}
.basic-config-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: nowrap;
}
.basic-config-item label {
    width: 120px;
    font-size: 14px;
    color: #333;
    transition: color 0.2s;
}
.basic-config-item input[type="text"],
.basic-config-item select {
    flex: 1;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background: #fff;
    color: #222;
    transition: background 0.2s, color 0.2s, border 0.2s;
}
.basic-config-item input[type="checkbox"] {
    margin-left: 0;
    margin-right: 6px;
}
.switch {
    position: relative;
    display: inline-block;
    width: 38px;
    height: 22px;
    margin-left: 6px;
}
.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}
.slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: var(--bg-secondary);
    transition: .3s;
    border-radius: 22px;
    border: 2px solid var(--border-color, #ccc);
}
.switch input:checked + .slider {
    background-color: #2fcb51be;
}

/* 深色模式适配 */
[data-theme="dark"] .chart-basic-config {
    border: 1px solid #444;
    background: var(--bg-secondary);
}
[data-theme="dark"] .basic-config-title {
    color: #e6e6e6;
}
[data-theme="dark"] .basic-config-item label {
    color: #e6e6e6;
}
[data-theme="dark"] #chart-title {
    background: #23272e !important;
    color: #e6e6e6 !important;
    border: 1px solid #444 !important;
    caret-color: #e6e6e6;
}
[data-theme="dark"] .basic-config-item input[type="text"],
[data-theme="dark"] .basic-config-item select {
    background: var(--bg-secondary);
    color: #e6e6e6;
    border: 1px solid #444;
}
</style>
