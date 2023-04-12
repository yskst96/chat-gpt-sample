<script setup lang="ts">
import { ref } from 'vue';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

const messages = ref<Message[]>([]);
</script>

<template>
  <main class="h-full bg-slate-800">
    <div class="container mx-auto">
      <div v-for="m in messages" :key="m.id">{{ m.role }}:{{ m.text }}</div>
    </div>
  </main>
</template>
