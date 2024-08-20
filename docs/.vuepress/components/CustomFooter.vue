<template>
  <div class="push"></div>
  <div class="footer center">
    <div>
      By Crystal {{ year }}
    </div>
  </div>
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
