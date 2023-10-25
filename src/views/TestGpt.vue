<template>
  <v-container fluid class="testGpt">
    <v-row>
      <v-col>
        <v-container>
          <v-row justify="center">
            <v-col cols="12" sm="10">
              <v-card class="response-box" elevation="4">
                <!-- <v-card-text class="response-text">{{ generatedText }}</v-card-text> -->
                <paragraph-component
                  v-for="(paragraph, index) in paragraphs"
                  :key="index"
                  :content="paragraph"
                />
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row> </v-row>

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
import ParagraphComponent from "../components/ParagraphComponent.vue";

export default {
  name: "TestGpt",
  components: {
    ParagraphComponent,
  },
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
      paragraphs: [],
      messages: [
        {
          role: "system",
          content:
            "너는 나에게 한국어로 반말을 하며, 내가하는 대화의 맞춤법을 검사하는 AI야. 어떤부분이 틀렸는지 정확하게 짚어주고 올바른 표현은 무엇인지 알려주지. 뻐스 등과 같이 영어식 표현도 올바른 버스 라고 알려주기도하지.",
        },
      ],
    };
  },
  watch() {
    generatedText;
  },
  methods: {
    async generateText(textThing) {
      const apiKey = "sk-diUCKLNmp8DCeUU*******"; // 발급받은 API 키로 대체
      const prompt = textThing;
      this.showDialog = true;
      try {
        this.messages.push({ role: "user", content: prompt });
        const response = await axios
          .post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: this.messages,
              temperature: 1,
              top_p: 1,
              frequency_penalty: 0,
              presence_penalty: 0,
              max_tokens: 256,
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
            this.paragraphs = this.generatedText.split("\n");
            this.messages.push(data.data.choices[0].message);
            console.log(this.generatedText);
          });

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
