/* src/layouts/DefaultLayout.vue */
/* 侧边栏 */
.sidebar {
  width: 256px;
  background-color: var(--surface-variant); /* Changed to surface-variant for light gray */
  display: flex;
  flex-direction: column;
  padding: 12px 12px 24px 12px;
}

.nav-item.active {
  background-color: var(--secondary-container); /* Use the updated secondary-container */
  color: var(--on-secondary-container);
  font-weight: 700;
}

/* src/views/InsightSpotView.vue */
/* Configuration Panel */
.config-panel {
  background-color: var(--surface-variant); /* Changed to surface-variant for light gray */
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

/* Button Styling */
.m3-button.filled {
  background-color: var(--primary-color); /* Will now be dark gray/black */
  color: var(--md-sys-color-on-primary);
  border: none;
}

.m3-button.outlined {
  background-color: transparent;
  color: var(--primary-color); /* Will now be dark gray/black */
  border: 1px solid var(--outline-color);
}
.m3-button.outlined:hover {
   background-color: var(--md-sys-color-surface-tint-layer-1); /* Use neutral tint */
} 