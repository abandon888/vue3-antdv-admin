<template>
  <a-card :title="title">
    <a-list item-layout="vertical">
      <a-list-item v-for="(item, index) in newsItems" :key="index">
        <a-list-item-meta>
          <template #avatar>
            <img v-if="item.sourceLogo" :src="item.sourceLogo" alt="source logo" />
          </template>
          <template #title>
            <span>{{ item.source }}</span>
          </template>
          <template #description>
            <span>{{ item.title }}</span>
          </template>
        </a-list-item-meta>
        <div v-if="expandedKeys.includes(index)">
          <p>{{ item.description }}</p>
          <CommentSection />
        </div>
        <a-button type="link" @click="toggleExpand(index)">
          {{ expandedKeys.includes(index) ? '收起' : '展开' }}
        </a-button>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, defineProps } from 'vue';
  import CommentSection from './button.vue';

  interface NewsItem {
    source: string;
    sourceLogo?: string;
    title: string;
    description: string;
  }

  const props = defineProps<{
    title: string;
    newsItems: NewsItem[];
  }>();

  const expandedKeys = ref<number[]>([]);

  const toggleExpand = (index: number) => {
    if (expandedKeys.value.includes(index)) {
      expandedKeys.value = expandedKeys.value.filter((key) => key !== index);
    } else {
      expandedKeys.value.push(index);
    }
  };
</script>

<style scoped>
  a-card {
    max-width: 600px;
    margin: auto;
    margin-top: 20px;
  }

  a-list-item-meta-title {
    font-weight: bold;
  }

  a-list-item-meta-description {
    color: #333;
  }

  a-button {
    margin-top: 10px;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
</style>
