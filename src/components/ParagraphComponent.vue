<template>
  <div class="paragraph">
    <p>{{ content }}</p>
  </div>
</template>

<script>
export default {
  name: "ParagraphComponent",
  props: {
    number: String,
    title: String,
    content: String,
  },
  computed: {},
};
</script>

<style scoped>
/* 필요한 스타일링 작업 수행 */
</style>
