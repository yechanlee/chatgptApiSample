<template>
  <div class="paragraph">
    <h2>{{ number }}. {{ title }}</h2>
    <p>{{ content }}</p>
  </div>
</template>

<script>
export default {
  name: "ParagraphComponent",
  props: {
    number: String,
    title: String,
  },
  computed: {
    content() {
      return this.$slots.default[0].text;
    },
  },
};
</script>

<style scoped>
/* 필요한 스타일링 작업 수행 */
</style>
