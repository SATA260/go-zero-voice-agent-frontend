<template >
  <div class="flex justify-center items-center min-h-screen">
  <div ref="containerRef" class="container">
    <div class="form-box login">
      <form action="">
        <h1>Login</h1>
        <div class="input-box">
          <input type="text" placeholder="Username" required>
          <i class="bx bxs-user"></i>
        </div>
        <div class="input-box">
          <input type="password" placeholder="Password" required>
          <i class="bx bxs-lock-alt"></i>
        </div>
        <div class="forgot-link">
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit" class="btn">Login</button>
      </form>
    </div>

    <div class="form-box register">
      <form action="">
        <h1>Registration</h1>
        <div class="input-box">
          <input type="text" placeholder="Username" required>
          <i class="bx bxs-user"></i>
        </div>
        <div class="input-box">
          <input type="email" placeholder="Email" required>
          <i class="bx bxs-envelope"></i>
        </div>
        <div class="input-box">
          <input type="password" placeholder="Password" required>
          <i class="bx bxs-lock-alt"></i>
        </div>
        <div class="forgot-link">
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit" class="btn">Register</button>
        <p>or register with social platforms</p>
        <!-- <div class="social-icons">
          <a href="#"><i class="bx bxl-google"></i></a>
          <a href="#"><i class="bx bxl-facebook"></i></a>
          <a href="#"><i class="bx bxl-github"></i></a>
          <a href="#"><i class="bx bxl-linkedin"></i></a>
        </div> -->
      </form>
    </div>

    <div class="toggle-box">
      <div class="toggle-panel toggle-left">
        <h1>Hello, Welcome!</h1>
        <p>Don't have an account?</p>
        <button @click="showRegister" class="btn register-btn">Register</button>
      </div>

      <div class="toggle-panel toggle-right">
        <h1>Welcome Back!</h1>
        <p>Already have an account?</p>
        <button @click="showLogin" class="btn login-btn">Login</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 使用模板引用
const containerRef = ref<HTMLDivElement | null>(null)

// 切换显示注册表单
const showRegister = (): void => {
  if (containerRef.value) {
    containerRef.value.classList.add('active')
  }
}

// 切换显示登录表单
const showLogin = (): void => {
  if (containerRef.value) {
    containerRef.value.classList.remove('active')
  }
}

// 如果需要，可以在组件挂载时添加其他逻辑
onMounted(() => {
  console.log('Login component mounted')
})

onUnmounted(() => {
  console.log('Login component unmounted')
})
</script>

<style scoped>

@import '@/views/LoginView/css/style.css';
</style>