<template>
  <div class="secondary-nav-content">
    <div class="nav-items">
      <div
        v-for="report in reports"
        :key="report.id"
        :class="['nav-item', { active: activeReportId === report.id }]"
        @click="selectReport(report.id)"
      >
        <!-- Optional: Add icons later if needed -->
        <!-- <span class="nav-icon">📊</span> -->
        {{ report.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface ReportItem {
  id: string;
  title: string;
  // Add route name or path if needed for navigation
}

// Mock data for report types
const reports = ref<ReportItem[]>([
  { id: 'progress', title: '学习进度概览' },
  { id: 'scores', title: '考试成绩分析' },
  { id: 'mastery', title: '知识点掌握度' },
]);

const route = useRoute();
const router = useRouter();
const activeReportId = ref<string | null>(null);

// Function to navigate to the selected report view
// This assumes the main content area will change based on the selection
// Currently, the router points StatisticsNav and StatisticsView to the same component
// We might need distinct views for each report type later.
const selectReport = (id: string) => {
  activeReportId.value = id;
  // Use the correct route name for the detail view
  router.push({ name: 'statistics-detail', query: { report: id } });
};

// Watch route query to set active item
watch(() => route.query.report, (newReportId) => {
  const id = Array.isArray(newReportId) ? newReportId[0] : newReportId;
  activeReportId.value = id || (reports.value.length > 0 ? reports.value[0].id : null);
}, { immediate: true });

// Set initial active item (e.g., the first report)
if (reports.value.length > 0 && !activeReportId.value) {
  selectReport(reports.value[0].id);
}

</script>

<style scoped>
/* Styles aligned with LearningNav.vue */
.secondary-nav-content {
  padding: 16px 0;
  height: 100%;
  overflow-y: auto;
}

.nav-items {
  padding: 0 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  border-radius: 24px;
  margin-bottom: 4px;
  font-size: 14px;
  color: var(--on-surface-variant, #49454F);
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.nav-item.active {
  background-color: var(--secondary-container, #E8DEF8);
  color: var(--on-secondary-container, #1D192B);
  font-weight: 500;
}

/* Optional icon styling if icons are added later */
/*
.nav-icon {
  margin-right: 12px;
  font-size: 16px;
  width: 20px;
  text-align: center;
  color: var(--on-surface-variant, #49454F);
}
.nav-item.active .nav-icon {
  color: var(--on-secondary-container, #1D192B);
}
*/
</style> 