<template>
  <div class="push"></div>
  <div class="footer center">
    <div>
      By Crystal {{ year }}
    </div>
  </div>
<script type="application/javascript" defer src="https://static.elfsight.com/platform/platform.js" data-use-service-core defer></script>
<div class="elfsight-app-9ded2d07-fa35-442c-87e5-01e3da5a5c57" data-elfsight-app-lazy></div>
</template>
<script>
const d = new Date()
const currentYear = d.getFullYear()
export default {
  data() {
    return {
      year: currentYear
    }
  }
}
</script>