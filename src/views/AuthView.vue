<template>
  <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
    <!-- 登录流程 -->
    <Stepper
      v-if="isLoginMode"
      :key="loginStepperKey"
      :initial-step="1"
      :on-step-change="handleStepChange"
      :on-final-step-completed="handleLogin"
      :next-button-props="{ disabled: !canProceedLogin }"
      back-button-text="返回"
      :next-button-text="loginNextButtonText"
      step-circle-container-class-name="auth-stepper-container"
    >
      <div class="step-content">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent text-center mb-6">
          欢迎回来喵~
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-pink-700 mb-2">邮箱</label>
            <input
              v-model="loginForm.email"
              type="email"
              placeholder="请输入邮箱喵~"
              class="w-full px-4 py-2 bg-white/80 border-2 border-pink-200 rounded-lg text-gray-800 placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
            />
          </div>
        </div>
        <div class="mt-6 text-center">
          <button
            @click="switchToRegister"
            class="switch-btn bg-transparent border-none text-pink-500 hover:text-purple-500 text-sm transition-colors font-medium cursor-pointer"
          >
            还没有账号？去注册喵~
          </button>
        </div>
      </div>

      <div class="step-content">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent text-center mb-6">
          输入密码
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-pink-700 mb-2">密码</label>
            <input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码喵~"
              class="w-full px-4 py-2 bg-white/80 border-2 border-pink-200 rounded-lg text-gray-800 placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>
      </div>
    </Stepper>

    <!-- 注册流程 -->
    <Stepper
      v-else
      :key="registerStepperKey"
      :initial-step="1"
      :on-step-change="handleStepChange"
      :on-final-step-completed="handleRegister"
      :next-button-props="{ disabled: !canProceedRegister }"
      back-button-text="返回"
      :next-button-text="registerNextButtonText"
      step-circle-container-class-name="auth-stepper-container"
    >
      <div class="step-content">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent text-center mb-6">
          注册新账号
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-pink-700 mb-2">邮箱</label>
            <input
              v-model="registerForm.email"
              type="email"
              placeholder="请输入邮箱喵~"
              class="w-full px-4 py-2 bg-white/80 border-2 border-pink-200 rounded-lg text-gray-800 placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
            />
          </div>
        </div>
        <div class="mt-6 text-center">
          <button
            @click="switchToLogin"
            class="switch-btn bg-transparent border-none text-pink-500 hover:text-purple-500 text-sm transition-colors font-medium cursor-pointer"
          >
            已有账号？去登录喵~
          </button>
        </div>
      </div>

      <div class="step-content">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent text-center mb-6">
          验证邮箱
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-pink-700 mb-2">验证码</label>
            <div class="flex gap-2">
              <input
                v-model="registerForm.code"
                type="text"
                placeholder="请输入验证码喵~"
                class="flex-1 px-4 py-2 bg-white/80 border-2 border-pink-200 rounded-lg text-gray-800 placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
              />
              <button
                @click="handleSendCode"
                :disabled="isSendingCode || countdown > 0"
                class="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap font-medium shadow-md"
              >
                {{ countdown > 0 ? `${countdown}s` : isSendingCode ? '发送中...' : '发送验证码' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="step-content">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent text-center mb-6">
          设置密码
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-pink-700 mb-2">密码</label>
            <input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码（至少6位）喵~"
              class="w-full px-4 py-2 bg-white/80 border-2 border-pink-200 rounded-lg text-gray-800 placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
              @keyup.enter="handleRegister"
            />
          </div>
        </div>
      </div>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import Stepper from '@/components/Stepper/Stepper.vue';
import { useUserStore } from '@/stores/modules/user';

const router = useRouter();
const userStore = useUserStore();

const isLoginMode = ref(true);
const currentStep = ref(1);
const errorMessage = ref('');
const isSendingCode = ref(false);
const countdown = ref(0);

// 添加一个 key 用于重置 Stepper
const loginStepperKey = ref(0);
const registerStepperKey = ref(0);

const loginForm = ref({
  email: '',
  password: '',
});

const registerForm = ref({
  email: '',
  code: '',
  password: '',
});

const canProceedLogin = computed(() => {
  if (currentStep.value === 1) {
    return loginForm.value.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.value.email);
  } else if (currentStep.value === 2) {
    return loginForm.value.password.length >= 6;
  }
  return false;
});

const canProceedRegister = computed(() => {
  if (currentStep.value === 1) {
    return registerForm.value.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email);
  } else if (currentStep.value === 2) {
    return registerForm.value.code.length > 0;
  } else if (currentStep.value === 3) {
    return registerForm.value.password.length >= 6;
  }
  return false;
});

const loginNextButtonText = computed(() => {
  return currentStep.value === 2 ? '登录' : '继续';
});

const registerNextButtonText = computed(() => {
  return currentStep.value === 3 ? '注册' : '继续';
});

const handleStepChange = (step: number) => {
  currentStep.value = step;
  errorMessage.value = '';
};

const switchToRegister = () => {
  isLoginMode.value = false;
  currentStep.value = 1;
  errorMessage.value = '';
};

const switchToLogin = () => {
  isLoginMode.value = true;
  currentStep.value = 1;
  errorMessage.value = '';
};

const handleSendCode = async () => {
  if (!registerForm.value.email || isSendingCode.value || countdown.value > 0) {
    return;
  }

  try {
    errorMessage.value = '';
    isSendingCode.value = true;
    await userStore.sendCode(registerForm.value.email);

    ElMessage.success('验证码已发送，请查收邮箱喵~');

    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  } catch (error) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || '发送验证码失败，请重试';
    ElMessage.error(message);
    errorMessage.value = message;
  } finally {
    isSendingCode.value = false;
  }
};

const handleLogin = async () => {
  if (!canProceedLogin.value) return;

  try {
    errorMessage.value = '';
    await userStore.login(loginForm.value.email, loginForm.value.password);
    ElMessage.success('登录成功喵~');
    router.push('/voice-chat');
  } catch (error) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || '登录失败，请检查邮箱和密码';
    ElMessage.error(message);
    errorMessage.value = message;

    // 重置 Stepper 回到第一步
    loginStepperKey.value++;
    currentStep.value = 1;
  }
};

const handleRegister = async () => {
  if (!canProceedRegister.value) return;

  try {
    errorMessage.value = '';
    await userStore.register(
      registerForm.value.email,
      registerForm.value.code,
      registerForm.value.password
    );
    ElMessage.success('注册成功喵~');
    router.push('/voice-chat');
  } catch (error) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || '注册失败，请重试';
    ElMessage.error(message);
    errorMessage.value = message;

    // 重置 Stepper 回到第一步
    registerStepperKey.value++;
    currentStep.value = 1;
  }
};
</script>

<style scoped>
.step-content {
  min-height: 200px;
}

:deep(.auth-stepper-container) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 240, 245, 0.9) 100%);
  border: 2px solid rgba(236, 72, 153, 0.2);
  box-shadow: 0 20px 60px rgba(236, 72, 153, 0.15), 0 10px 20px rgba(168, 85, 247, 0.1);
}

/* 修改Stepper组件的颜色 */
:deep(.auth-stepper-container) {
  /* 步骤指示器背景色 */
  --step-inactive-bg: #fce7f3;
  --step-active-bg: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  --step-complete-bg: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);

  /* 步骤指示器文字颜色 */
  --step-inactive-color: #f472b6;
  --step-active-color: #ffffff;
  --step-complete-color: #ffffff;

  /* 进度条颜色 */
  --progress-bg: #fbcfe8;
  --progress-fill: linear-gradient(90deg, #ec4899 0%, #a855f7 100%);
}

/* 覆盖步骤指示器样式 */
:deep(.auth-stepper-container .relative.outline-none) {
  background: var(--step-inactive-bg) !important;
  color: var(--step-inactive-color) !important;
}

:deep(.auth-stepper-container .relative.outline-none[style*="background-color: rgb(39, 255, 100)"]) {
  background: var(--step-active-bg) !important;
  color: var(--step-active-color) !important;
}

/* 按钮样式 */
:deep(.auth-stepper-container button:not(:disabled)) {
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%) !important;
  color: white !important;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

:deep(.auth-stepper-container button:not(:disabled):hover) {
  background: linear-gradient(135deg, #db2777 0%, #9333ea 100%) !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(236, 72, 153, 0.4);
}

:deep(.auth-stepper-container button:disabled) {
  background: #fce7f3 !important;
  color: #f9a8d4 !important;
}

/* 返回按钮样式 */
:deep(.auth-stepper-container button.text-zinc-400) {
  background: transparent !important;
  color: #ec4899 !important;
  box-shadow: none !important;
}

:deep(.auth-stepper-container button.text-zinc-400:hover) {
  color: #a855f7 !important;
  background: transparent !important;
  transform: none;
}

/* 登录注册切换按钮样式 */
.step-content button.switch-btn {
  background: transparent !important;
  color: #ec4899 !important;
  box-shadow: none !important;
  text-shadow: none !important;
  padding: 0 !important;
}

.step-content button.switch-btn:hover {
  background: transparent !important;
  color: #a855f7 !important;
  box-shadow: none !important;
  text-shadow: none !important;
}
</style>

<style>
/* Element Plus Message 粉色主题样式 */
.el-message.el-message--success {
  background: linear-gradient(135deg, #fce7f3 0%, #fae8ff 100%) !important;
  border: 2px solid #ec4899 !important;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2) !important;
}

.el-message.el-message--success .el-message__content {
  color: #ec4899 !important;
  font-weight: 500;
}

.el-message.el-message--success .el-message__icon {
  color: #ec4899 !important;
}

.el-message.el-message--error {
  background: linear-gradient(135deg, #fee2e2 0%, #fce7f3 100%) !important;
  border: 2px solid #f43f5e !important;
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.2) !important;
}

.el-message.el-message--error .el-message__content {
  color: #dc2626 !important;
  font-weight: 500;
}

.el-message.el-message--error .el-message__icon {
  color: #f43f5e !important;
}
</style>
