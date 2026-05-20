<template>
  <div class="admin-layout">
    <AdminSidebar :open="mobileMenuOpen" @close="mobileMenuOpen = false" />

    <div class="admin-layout__main">
      <AdminHeader
        :menu-open="mobileMenuOpen"
        @toggle-menu="mobileMenuOpen = !mobileMenuOpen"
      />
      <div class="admin-layout__content" @click="mobileMenuOpen = false">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminHeader from '@/modules/admin/components/AdminHeader.vue'
import AdminSidebar from '@/modules/admin/components/AdminSidebar.vue'

const mobileMenuOpen = ref(false)
</script>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  background:
    radial-gradient(circle at top right, rgba($gold, .08), transparent 22%),
    linear-gradient(180deg, #f3f6fb 0%, #eef2f8 100%);

  @media (min-width: 1025px) {
    height: 100vh;
    overflow: hidden;
  }
}

.admin-layout__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  @media (min-width: 1025px) {
    height: 100vh;
    overflow: hidden;
  }
}

.admin-layout__content {
  padding: 24px;

  @media (min-width: 1025px) {
    flex: 1;
    overflow-y: auto;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
}
</style>
