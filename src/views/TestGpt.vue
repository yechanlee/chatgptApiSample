<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-textarea v-model="inputText" label="Input Text" rows="4" outlined></v-textarea>

        <v-dialog v-model="showDialog" max-width="500px">
          <v-card>
            <v-card-title> Chat GPT에게 답변을 받는중입니다. </v-card-title>
            <v-card-text> </v-card-text>
            <v-progress-linear class="progress-line" :indeterminate="true"></v-progress-linear>
          </v-card>
        </v-dialog>
        <v-btn @click="generateText" color="primary">Generate Text</v-btn>
        <v-divider></v-divider>
        <v-card>
          <v-card-title>Generated Text</v-card-title>
          <v-card-text>{{ generatedText }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.progress-line {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      inputText: "",
      generatedText: "",
      loading: false,
      showDialog: false,
    };
  },
  watch() {
    generatedText;
  },
  methods: {
    async generateText() {
      const apiKey = "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"; // 발급받은 API 키로 대체
      const prompt = this.inputText;
      this.showDialog = true;
      try {
        const response = await axios
          .post(
            "https://api.openai.com/v1/chat/completions",
            { model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
            }
          )
          .then((data) => {
            this.generatedText = data.data.choices[0].message.content;
            console.log(this.generatedText);
          });

        this.generatedText = response.data.choices[0].content;
        this.showDialog = false;
      } catch (error) {
        this.showDialog = false;
        console.error("Error generating text:", error);
      }
    },
  },
};
</script>
