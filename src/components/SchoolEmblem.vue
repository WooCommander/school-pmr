<script setup lang="ts">
defineProps<{ size?: string | number }>()
</script>

<template>
  <div
    class="emblem"
    :style="{ width: (size || 44) + 'px', height: (size || 44) + 'px' }"
    aria-hidden="true"
  >
    <span class="emblem__top">SCHOOL</span>
    <span class="emblem__num">1</span>
    <div class="emblem__bar"></div>
  </div>
</template>

<style lang="scss" scoped>
.emblem {
  background: $navy;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.emblem__top {
  font-size: calc(v-bind('(+size || 44)') * 0.16px);
  font-size: 7px;
  color: rgba($white, .6);
  letter-spacing: .8px;
  font-weight: 500;
  line-height: 1;
}

.emblem__num {
  font-size: 22px;
  font-weight: 700;
  color: $white;
  line-height: 1;
}

.emblem__bar {
  position: absolute;
  bottom: 6px;
  left: 20%;
  right: 20%;
  height: 2px;
  background: $gold;
  border-radius: 1px;
}
</style>
