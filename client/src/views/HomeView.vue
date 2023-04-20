<script setup lang="ts">
import { ref } from 'vue';
import useChat from '@/composables/useChat';

const { contents, sendMessage } = useChat();

const content = ref('');

const onSendClick = async () => {
  if (!content.value) return;

  await sendMessage(content.value);

  content.value = '';
};
</script>

<template>
  <main class="h-full bg-slate-800">
    <div class="container mx-auto co">
      <div v-for="c in contents" :key="c.id">{{ c.role }}:{{ c.content }}</div>
    </div>
    <div>
      <div><input type="text" v-model="content" /></div>
      <div>
        <button @click="onSendClick">送信</button>
      </div>
    </div>
  </main>
</template>
