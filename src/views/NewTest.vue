<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-file-input
          v-model="selectedImage"
          accept="image/*"
          @change="handleImageChange"
        ></v-file-input>

        <!-- ... -->
      </v-col>
    </v-row>
    <v-img :src="selectedImageUrl" class="mt-4"></v-img>
  </v-container>
</template>

<script>
import Tesseract from "tesseract.js";

export default {
  data() {
    return {
      selectedImage: null,
      selectedImageUrl: "",
      ocrResult: "",
    };
  },
  methods: {
    handleImageChange(event) {
      this.selectedImage = event;
      this.selectedImageUrl = URL.createObjectURL(this.selectedImage);
    },
    async performOCR() {
      if (this.selectedImage) {
        const result = await Tesseract.recognize(
          this.selectedImage,
          "kor" // 한글 언어 코드 (kor)
        );
        this.ocrResult = result.data.text;
      }
    },
  },
};
</script>
