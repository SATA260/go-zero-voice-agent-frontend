<template>
  <div class="home h-screen w-screen">
    <Particles
      :particle-count="200"
      :particle-spread="10"
      :speed="0.1"
      :particle-colors="['#22223b', '#4a4e69', '#9a8c98', '#222831', '#393e46', '#3a3a40']"
      :move-particles-on-hover="false"
      :particle-hover-factor="1"
      :alpha-particles="false"
      :particle-base-size="100"
      :size-randomness="1"
      :camera-distance="20"
      :disable-rotation="false"
      class="w-full h-full"
    />
    <CardNav
      logo="nil"
      logoAlt="Go Zero Voice Agent"
      :items="items"
      baseColor="#ffffff"
      menuColor="#000"
      buttonBgColor="#111"
      buttonTextColor="#fff"
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
          :textColors="['#000000']"
        />
      </div>
    </main>

    <div></div>
  </div>
</template>

<script setup lang="ts">
import Particles from '@/components/Particles/Particles.vue'
import CardNav from '@/components/CardNav/CardNav.vue'
import TextType from '@/components/TextType/TextType.vue'

const items = [
  {
    label: 'Tech Stack',
    bgColor: '#0D0716',
    textColor: '#fff',
    links: [
      { label: 'WebRTC', ariaLabel: 'WebRTC Tech Stack' },
      { label: 'Go-Zero', ariaLabel: 'Backend Tech Stack' },
      { label: 'AI', ariaLabel: 'AI Tech Stack' },
    ],
  },
  {
    label: 'Features',
    bgColor: '#170D27',
    textColor: '#fff',
    links: [
      { label: 'Speech Recognition', ariaLabel: 'Speech Recognition Feature' },
      { label: 'Speech Synthesis', ariaLabel: 'Speech Synthesis Feature' },
      { label: 'Intelligent Chat', ariaLabel: 'Intelligent Chat Feature' },
    ],
  },
  {
    label: 'Team Members',
    bgColor: '#271E37',
    textColor: '#fff',
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
  background-color: rgb(236, 220, 243);
}
.texttype-center {
  padding-top: 180px;
  font-size: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
1
