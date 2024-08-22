<script setup>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import { onMounted } from 'vue'

onMounted(() => {
  const recaptchaScript = document.createElement('script');
  recaptchaScript.setAttribute('src', 'https://static.elfsight.com/platform/platform.js');
  recaptchaScript.setAttribute('data-use-service-core', 'true');
  recaptchaScript.setAttribute('defer', 'true');
  document.head.appendChild(recaptchaScript);
});
</script>

<template>
  <ParentLayout>
    <template #page-bottom>
      <CustomFooter />
      <div class="elfsight-app-9ded2d07-fa35-442c-87e5-01e3da5a5c57" data-elfsight-app-lazy></div>
    </template>
  </ParentLayout>
</template>
