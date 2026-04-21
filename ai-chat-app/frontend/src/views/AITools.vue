<template>
  <div class="ai-tools-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>AI Chat</h2>
        <button @click="logout" class="logout-btn">退出</button>
      </div>

      <nav class="nav">
        <router-link to="/chat" class="nav-item">
          <span>💬</span> AI 聊天
        </router-link>
        <router-link to="/friends" class="nav-item">
          <span>👥</span> 好友
        </router-link>
        <router-link to="/ai-tools" class="nav-item active">
          <span>🛠️</span> AI 工具
        </router-link>
      </nav>
    </aside>

    <main class="tools-main">
      <div class="tools-content">
        <h1>AI 工具集</h1>
        <p class="subtitle">探索各种强大的 AI 功能</p>

        <div class="tools-grid">
          <!-- AI 写作助手 -->
          <div class="tool-card" @click="selectTool('writing')">
            <div class="tool-icon">✍️</div>
            <h3>AI 写作助手</h3>
            <p>帮助您撰写文章、邮件、报告等各种文本内容</p>
          </div>

          <!-- AI 翻译 -->
          <div class="tool-card" @click="selectTool('translation')">
            <div class="tool-icon">🌐</div>
            <h3>AI 翻译</h3>
            <p>支持多种语言的智能翻译服务</p>
          </div>

          <!-- AI 代码助手 -->
          <div class="tool-card" @click="selectTool('coding')">
            <div class="tool-icon">💻</div>
            <h3>AI 代码助手</h3>
            <p>代码生成、调试、优化和解释</p>
          </div>

          <!-- AI 图像生成 -->
          <div class="tool-card" @click="selectTool('image')">
            <div class="tool-icon">🎨</div>
            <h3>AI 图像生成</h3>
            <p>根据文字描述生成精美图片</p>
          </div>

          <!-- AI 语音转文字 -->
          <div class="tool-card" @click="selectTool('speech-to-text')">
            <div class="tool-icon">🎤</div>
            <h3>语音转文字</h3>
            <p>将语音内容快速转换为文字</p>
          </div>

          <!-- AI 数据分析 -->
          <div class="tool-card" @click="selectTool('data-analysis')">
            <div class="tool-icon">📊</div>
            <h3>数据分析</h3>
            <p>智能分析数据并提供洞察建议</p>
          </div>
        </div>

        <!-- 工具使用区域 -->
        <div v-if="selectedTool" class="tool-workspace">
          <button @click="selectedTool = null" class="back-btn">← 返回</button>
          
          <h2>{{ toolNames[selectedTool] }}</h2>
          
          <div class="input-section">
            <textarea 
              v-model="inputText"
              :placeholder="toolPlaceholders[selectedTool]"
              rows="6"
            ></textarea>
            <button @click="processTool" :disabled="loading || !inputText.trim()">
              {{ loading ? '处理中...' : '开始处理' }}
            </button>
          </div>

          <div v-if="result" class="result-section">
            <h3>结果：</h3>
            <div class="result-content">{{ result }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

type ToolType = 'writing' | 'translation' | 'coding' | 'image' | 'speech-to-text' | 'data-analysis'

const selectedTool = ref<ToolType | null>(null)
const inputText = ref('')
const result = ref('')
const loading = ref(false)

const toolNames: Record<ToolType, string> = {
  'writing': 'AI 写作助手',
  'translation': 'AI 翻译',
  'coding': 'AI 代码助手',
  'image': 'AI 图像生成',
  'speech-to-text': '语音转文字',
  'data-analysis': '数据分析'
}

const toolPlaceholders: Record<ToolType, string> = {
  'writing': '请输入您想要写作的主题或大纲...',
  'translation': '请输入要翻译的文本（可指定目标语言）...',
  'coding': '请描述您想要实现的代码功能...',
  'image': '请描述您想要生成的图片内容...',
  'speech-to-text': '请上传音频文件或输入语音内容...',
  'data-analysis': '请输入您要分析的数据或描述分析需求...'
}

const selectTool = (tool: ToolType) => {
  selectedTool.value = tool
  inputText.value = ''
  result.value = ''
}

const processTool = async () => {
  if (!inputText.value.trim() || !selectedTool.value) return
  
  loading.value = true
  result.value = ''
  
  try {
    // 调用后端 AI 工具接口
    const res = await axios.post('/api/ai-tools/process', {
      tool: selectedTool.value,
      input: inputText.value
    })
    result.value = res.data.result
  } catch (error: any) {
    // 如果后端未实现，返回模拟结果
    result.value = getMockResult(selectedTool.value, inputText.value)
  } finally {
    loading.value = false
  }
}

const getMockResult = (tool: ToolType, input: string): string => {
  const mockResults: Record<ToolType, string> = {
    'writing': `【AI 写作结果】\n\n基于您的主题"${input}"，这是一篇示例文章：\n\n在这个快速发展的时代，${input}成为了人们关注的焦点。首先，我们需要了解其背景和意义...\n\n（这是一个演示结果，实际使用时会连接真实的 AI 模型）`,
    'translation': `【AI 翻译结果】\n\n原文：${input}\n\n译文：[Translated text would appear here]\n\n（这是一个演示结果，实际使用时会连接真实的翻译 API）`,
    'coding': `【AI 代码结果】\n\n基于您的需求"${input}"，以下是生成的代码示例：\n\n\`\`\`javascript\n// 示例代码\nfunction solution() {\n  // 实现逻辑\n  return result;\n}\n\`\`\`\n\n（这是一个演示结果，实际使用时会连接真实的代码生成模型）`,
    'image': `【AI 图像生成结果】\n\n正在根据您的描述"${input}"生成图片...\n\n图片生成 URL: [image-url]\n\n（这是一个演示结果，实际使用时会连接真实的图像生成 API）`,
    'speech-to-text': `【语音转文字结果】\n\n转换后的文本：${input}\n\n（这是一个演示结果，实际使用时会连接真实的语音识别 API）`,
    'data-analysis': `【数据分析结果】\n\n基于您的数据"${input}"，分析结果如下：\n\n1. 数据趋势：呈现上升态势\n2. 关键指标：增长率约为 15%\n3. 建议：继续优化相关策略\n\n（这是一个演示结果，实际使用时会连接真实的数据分析模型）`
  }
  return mockResults[tool]
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.ai-tools-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  margin: 0;
  color: #333;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.nav {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.75rem;
  text-align: left;
  text-decoration: none;
  color: #666;
  background: #f5f5f5;
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.nav-item.active,
.nav-item:hover {
  background: #667eea;
  color: white;
}

.tools-main {
  flex: 1;
  background: #f5f5f5;
  overflow-y: auto;
}

.tools-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.tool-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.tool-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.tool-card p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.tool-workspace {
  margin-top: 2rem;
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.tool-workspace h2 {
  color: #333;
  margin-bottom: 1.5rem;
}

.input-section {
  margin-bottom: 1.5rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #667eea;
}

.input-section button {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

.input-section button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.result-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border-left: 4px solid #667eea;
}

.result-section h3 {
  color: #333;
  margin-bottom: 1rem;
}

.result-content {
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
