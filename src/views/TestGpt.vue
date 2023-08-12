<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="chat-card" elevation="10">
          <v-card-title class="chat-title"> Chat with AI </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div>
              <v-textarea
                v-model="inputText"
                label="Ask me anything"
                rows="4"
                outlined
                class="input-area"
              ></v-textarea>
              <v-btn @click="generateText(inputText)" color="primary" class="ask-button">Ask</v-btn>
            </div>
            <v-divider class="divider"></v-divider>
            <v-row justify="center">
              <v-col cols="12" sm="6">
                <v-file-input
                  v-model="selectedImage"
                  accept="image/*"
                  @change="handleImageChange"
                ></v-file-input>
                <v-img v-if="selectedImageUrl" :src="selectedImageUrl" class="mt-4"></v-img>
                <v-btn @click="performOCR" color="primary">해당 사진 바로 질문하기</v-btn>

                <v-card v-if="ocrResult" class="mt-4">
                  <v-card-title>Extracted Text:</v-card-title>
                  <v-card-text>{{ ocrResult }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-container>
          <v-row justify="center">
            <v-col cols="12" sm="10">
              <v-card class="response-box" elevation="4">
                <v-card-text class="response-text">{{ generatedText }}</v-card-text>
                <v-btn v-if="showLikeButton" @click="likeResponse" color="primary">👍Like</v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <!-- <v-card>
          <v-card-title>Generated Text</v-card-title>
          <v-card-text>{{ generatedText }}</v-card-text>
        </v-card> -->
      </v-col>
    </v-row>
    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title> Chat GPT에게 답변을 받는중입니다. </v-card-title>
        <v-card-text> </v-card-text>
        <v-progress-linear class="progress-line" :indeterminate="true"></v-progress-linear>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import Tesseract from "tesseract.js";

export default {
  data() {
    return {
      inputText: "",
      generatedText: "",
      loading: false,
      showDialog: false,
      showLikeButton: true,
      selectedImage: null,
      selectedImageUrl: "",
      ocrResult: "",
    };
  },
  watch() {
    generatedText;
  },
  methods: {
    async generateText(textThing) {
      const apiKey = "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"; // 발급받은 API 키로 대체
      const prompt = textThing;
      this.showDialog = true;
      try {
        const response = await axios
          .post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [
                { role: "user", content: prompt },
                {
                  role: "system",
                  content:
                    "수학문제를 풀어주는 프로그램이며 명쾌하게 답변을 해주고 계산식을 보여주어야 한다. 너무 복잡하게 답변을 하면안되고 간단명료하게 3줄정도로 할것 이유도 설명해줄 것",
                },
              ],
              temperature: 1.25,
              top_p: 1,
              frequency_penalty: 0,
              presence_penalty: 0,
            },
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
    likeResponse() {
      this.showLikeButton = false;
      // 좋아요 버튼을 눌렀을 때 추가 로직을 수행할 수 있습니다.
    },
    async performOCR() {
      if (this.selectedImage) {
        const result = await Tesseract.recognize(
          this.selectedImage,
          "kor" // 한글 언어 코드 (kor)
        );
        this.ocrResult = result.data.text;
        // this.inputText = this.ocrResult;
        this.generateText(this.ocrResult);
      }
    },
    handleImageChange(event) {
      this.selectedImage = event;
      this.selectedImageUrl = URL.createObjectURL(this.selectedImage);
    },
  },
};
</script>

<style scoped>
.progress-line {
  margin-top: 10px;
  margin-bottom: 10px;
}
.response-box {
  background-color: #f4f4f4;
  padding: 20px 35px;
  text-align: center;
  border-radius: 5px;
}
.chat-card {
  background-color: #f5f5f5; /* 연한 그레이 */
  border-radius: 15px;
}

.chat-title {
  font-size: 24px;
  font-weight: bold;
  color: #42b983; /* 연두색 */
}

.chat-card .v-card-text {
  padding: 20px 35px;
}

.input-area {
  color: #444444; /* 진한 그레이 */
}

.ask-button {
  margin-top: 15px;
}

.response-text {
  font-size: 18px;
  margin-bottom: 10px;
}

.like-button {
  margin-top: 15px;
}

.divider {
  margin: 10px 10px;
}
</style>
