<template>
  <div class="admin-layout">
    <AdminSidebar />

    <div class="admin-layout__main">
      <AdminHeader />
      <div class="admin-layout__content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/modules/admin/components/AdminHeader.vue'
import AdminSidebar from '@/modules/admin/components/AdminSidebar.vue'
</script>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  background: $surface;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
}

.admin-layout__main {
  flex: 1;
  min-width: 0;
}

.admin-layout__content {
  padding: 24px;
}
</style>
