<template>
  <div class="home min-h-screen w-screen">
    <Particles
      :particle-count="200"
      :particle-spread="10"
      :speed="0.1"
      :particle-colors="['#ff9ecb', '#ff66b3', '#ffc0dd', '#f3c1f4', '#ffd6e8', '#f8e6ff']"
      :move-particles-on-hover="false"
      :particle-hover-factor="1"
      :alpha-particles="false"
      :particle-base-size="100"
      :size-randomness="1"
      :camera-distance="20"
      :disable-rotation="false"
      class="particles-bg absolute inset-0"
    />
    <CardNav
      logo="nil"
      logoAlt="Go Zero Voice Agent"
      :items="items"
      baseColor="#FFEFF8"
      menuColor="#3b0d2f"
      buttonBgColor="#ff66b3"
      buttonTextColor="#ffffff"
      ease="power3.out"
    />
    <main>
      <div class="texttype-center">
        <TextType
          :text="[
            'Smart, immersive, and interactive.',
            'Live2D virtual character, always with you.',
            'Seamless voice and text interaction.',
          ]"
          :typingSpeed="200"
          :pauseDuration="3000"
          :showCursor="true"
          cursorCharacter="|"
          :textColors="['#3b0d2f']"
        />
      </div>
    </main>

    <div></div>
    <section class="intro-cards" aria-label="项目简介卡片">
      <div class="cards-container">
        <article class="intro-card" aria-labelledby="card1-title">
          <h3 id="card1-title">项目简介</h3>
          <p>
            Go Zero Voice Agent — 一个智能、沉浸式的语音交互平台，集成 Live2D 虚拟角色与 AI
            对话能力。
          </p>
        </article>
        <article class="intro-card" aria-labelledby="card2-title">
          <h3 id="card2-title">核心功能</h3>
          <p>支持语音识别、语音合成、实时会话与多模态交互，适用于教育、客服与娱乐场景。</p>
        </article>
        <article class="intro-card" aria-labelledby="card3-title">
          <h3 id="card3-title">技术栈</h3>
          <p>
            前端：Vue 3 + Vite；后端：Golang + Rust + Python；实时：WebRTC；AI：LLM + ASR + TTS。
          </p>
        </article>
        <article class="intro-card" aria-labelledby="card4-title">
          <h3 id="card4-title">使用场景</h3>
          <p>
            适用场景包括在线教育助教、虚拟客服、游戏 NPC 交互与娱乐社交应用，支持多用户实时会话。
          </p>
        </article>
        <article class="intro-card" aria-labelledby="card5-title">
          <h3 id="card5-title">部署与集成</h3>
          <p>基于docker容器化部署，提供 REST / RPC 服务与 WebRTC 支持，适用于云原生环境。</p>
        </article>
        <article class="intro-card" aria-labelledby="card6-title">
          <h3 id="card6-title">项目核心</h3>
          <p>Rust构建的高性能pbx服务器，支持高并发与低延迟的p2p通信。</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Particles from '@/components/Particles/Particles.vue'
import CardNav from '@/components/CardNav/CardNav.vue'
import TextType from '@/components/TextType/TextType.vue'

const items = [
  {
    label: 'Tech Stack',
    bgColor: '#FFF6FB',
    textColor: '#3b0d2f',
    links: [
      { label: 'WebRTC', ariaLabel: 'WebRTC Tech Stack' },
      { label: 'Go-Zero', ariaLabel: 'Backend Tech Stack' },
      { label: 'AI', ariaLabel: 'AI Tech Stack' },
    ],
  },
  {
    label: 'Features',
    bgColor: '#FFF6FB',
    textColor: '#3b0d2f',
    links: [
      { label: 'Speech Recognition', ariaLabel: 'Speech Recognition Feature' },
      { label: 'Speech Synthesis', ariaLabel: 'Speech Synthesis Feature' },
      { label: 'Intelligent Chat', ariaLabel: 'Intelligent Chat Feature' },
    ],
  },
  {
    label: 'Team Members',
    bgColor: '#FFF6FB',
    textColor: '#3b0d2f',
    links: [
      { label: 'Zhang JinYu', ariaLabel: 'Team Member Zhang San' },
      { label: 'Li XiangLin', ariaLabel: 'Team Member Li Si' },
      { label: 'Hu YouXu', ariaLabel: 'Team Member Wang Wu' },
    ],
  },
]
</script>

<style scoped>
.home {
  background: linear-gradient(180deg, #fff6fb 0%, #ffeef8 100%);
  position: relative;
}
.home > :not(.particles-bg) {
  position: relative;
  z-index: 10;
}
.particles-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.texttype-center {
  margin-top: 130px;
  font-size: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: #3b0d2f;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* Intro cards */
.intro-cards {
  display: flex;
  justify-content: center;
  margin-top: 80px;
  width: 100%;
  pointer-events: auto;
}
.cards-container {
  display: flex;
  gap: 48px;
  max-width: 1400px;
  padding: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.intro-card {
  background: rgba(255, 244, 250, 0.06); /* 轻微粉色玻璃 */
  border: 3px double rgba(255, 105, 180, 0.16); /* 粉色双边框 */
  border-radius: 12px;
  padding: 22px 20px;
  width: 320px;
  min-height: 110px;
  box-sizing: border-box;
  text-align: center;
  color: #3b0d2f;
  backdrop-filter: blur(6px);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
  box-shadow: 0 6px 18px rgba(255, 105, 180, 0.04);
}
.intro-card h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #3b0d2f;
}
.intro-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5a1a41;
}
.intro-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(255, 105, 180, 0.16);
}

@media (max-width: 900px) {
  .texttype-center {
    padding-top: 120px;
    font-size: 48px;
  }
  .intro-card {
    width: 90%;
    max-width: 420px;
  }
}
</style>
1
