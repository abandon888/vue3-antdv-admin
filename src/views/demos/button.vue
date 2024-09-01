<template>
  <div class="comment-section">
    <h2>全文评论</h2>
    <div v-for="(comment, index) in comments" :key="index" class="comment">
      <div class="comment-header">
        <img :src="comment.avatar" alt="avatar" class="avatar" />
        <div class="comment-details">
          <div class="comment-author">{{ comment.author }}</div>
          <div class="comment-time">{{ comment.time }}</div>
        </div>
      </div>
      <div class="comment-body">
        <p>{{ comment.text }}</p>
        <!-- <div class="comment-actions">
          <span class="emoji">😢</span>
          <span class="emoji">👍</span>
        </div> -->
      </div>
    </div>
    <div class="add-comment">
      <input v-model="newCommentText" placeholder="输入评论" />
      <button @click="addComment">评论</button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const comments = ref([]);

  const newCommentText = ref('');

  const addComment = () => {
    if (newCommentText.value.trim()) {
      comments.value.push({
        author: '新用户',
        time: new Date().toLocaleString('zh-CN', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        text: newCommentText.value,
        avatar:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnMbAtJt52Ig2grCEmbgi9XcimIhr2rEnd4w&s',
      });
      newCommentText.value = '';
    }
  };
</script>

<style scoped>
  .comment-section {
    max-width: 600px;
    margin: auto;
    padding: 20px;
  }

  .comment {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eaeaea;
  }

  .comment-header {
    display: flex;
    align-items: center;
  }

  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .comment-details {
    display: flex;
    flex-direction: column;
  }

  .comment-author {
    font-weight: bold;
  }

  .comment-time {
    color: #888;
    font-size: 0.9em;
  }

  .comment-body {
    margin-top: 10px;
  }

  .comment-actions {
    margin-top: 5px;
  }

  .comment-actions .emoji {
    margin-right: 10px;
    cursor: pointer;
  }

  .add-comment {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }

  .add-comment input {
    flex-grow: 1;
    margin-right: 10px;
    padding: 10px;
    border: 1px solid #eaeaea;
    border-radius: 5px;
  }

  .add-comment button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
</style>
