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
    <div class="container mx-auto">
      <div class="text-yellow-100">Non Stream ver</div>
      <div class="mx-auto mt-8 w-1/2 px-1 py-4 bg-slate-700 text-yellow-100">
        <div v-for="c in contents" :key="c.id">{{ c.role }}：{{ c.content }}</div>
      </div>
      <div class="mt-4">
        <div class="text-center"><textarea type="text" v-model="content" class="w-1/3 px-2 py-1" /></div>
        <div class="mt-4 text-center">
          <button class="px-8 py-2 rounded bg-yellow-400 font-bold" @click="onSendClick">送信</button>
        </div>
      </div>
      <div class="mx-auto mt-4 text-center text-white underline">
        <router-link to="stream">to Stream Version</router-link>
      </div>
    </div>
  </main>
</template>
