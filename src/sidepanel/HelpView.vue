<script setup>
import { ref } from 'vue'
import { User, Message, Wallet, House } from '@element-plus/icons-vue'

const activeCollapse = ref() // 默认收起状态
const qrType = ref('alipay') // 默认支付宝
const qrCodes = {
  alipay: '/qrcode/alipay.jpg',
  wechat: '/qrcode/wechat.png',
}
</script>

<template>
  <el-container>
    <el-main class="container">
      <el-row :gutter="20" class="main-row">
        <!-- 支持 -->
        <el-col :xs="24" :sm="24" :md="8" class="card-col">
          <el-card class="help-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span class="card-title">支持</span>
                <el-icon class="card-title-icon">
                  <User />
                </el-icon>
              </div>
            </template>
            <div class="contact-content">
              <div class="contact-item">
                <el-icon>
                  <Message />
                </el-icon>
                联系作者
                <el-link type="primary" href="mailto:s1716082907@gmail.com">
                  s1716082907@gmail.com
                </el-link>
              </div>
              <div class="contact-item">
                <el-icon>
                  <House />
                </el-icon>
                代码仓库
                <el-link
                  type="success"
                  href="https://github.com/SssTwins/name2email"
                  target="_blank"
                >
                  https://github.com/SssTwins/name2email
                </el-link>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 打赏（添加折叠功能） -->
        <!-- 打赏卡片 -->
        <el-col :xs="24" :sm="24" :md="8" class="card-col">
          <el-collapse v-model="activeCollapse" class="custom-collapse">
            <el-collapse-item name="donate">
              <template #title>
                <div class="collapse-header">
                  <el-icon>
                    <Wallet />
                  </el-icon>
                  <span class="card-title">打赏</span>
                </div>
              </template>
              <el-card class="help-card" shadow="hover">
                <div class="donate-content">
                  <!-- 切换按钮 -->
                  <div class="qr-switch">
                    <el-radio-group v-model="qrType" size="small">
                      <el-radio-button label="alipay">支付宝</el-radio-button>
                      <el-radio-button label="wechat">微信</el-radio-button>
                    </el-radio-group>
                  </div>

                  <!-- 二维码图片 -->
                  <el-image :src="qrCodes[qrType]" class="qrcode" fit="cover">
                    <template #error>
                      <div class="error-tip">二维码加载失败</div>
                    </template>
                  </el-image>
                </div>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style scoped>
/* 新增切换按钮样式 */
.qr-switch {
  margin-bottom: 15px;
  text-align: center;

  :deep(.el-radio-group) {
    background: #f5f7fa;
    border-radius: 20px;
    padding: 2px;
  }

  :deep(.el-radio-button) {
    --el-radio-button-checked-bg-color: var(--el-color-primary);
    --el-radio-button-checked-text-color: white;
  }

  :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
    box-shadow: none !important;
  }
}

.error-tip {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #909399;
}

/* 新增折叠面板样式 */
.custom-collapse {
  border: none;
  background: transparent;

  :deep(.el-collapse-item__header) {
    height: 60px;
    padding: 0 15px;
    background-color: #f5f7fa;
    border-radius: 4px;
    margin-bottom: 10px;
    border: none;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
  }

  :deep(.el-collapse-item__content) {
    padding: 0;
    background: transparent;
  }
}

.collapse-header {
  display: flex;
  align-items: center;
  gap: 10px;

  .el-icon {
    color: #409eff;
    font-size: 20px;
  }

  .card-title {
    margin: 0;
    font-size: 16px;
  }
}

/* 保持原有卡片样式 */
.help-card {
  margin-top: -10px;
  border: none !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1) !important;

  &:hover {
    transform: none; /* 禁用原有悬停动画 */
  }
}

/* 保持原有容器样式不变 */
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.main-row {
  margin: -10px;
}

.card-col {
  padding: 10px;
}

.help-card {
  height: 100%;
  box-sizing: border-box;
  transition: transform 0.3s ease;
}

.help-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.card-title {
  color: #409eff;
  font-size: 18px;
}

/* 新增联系内容样式 */
.contact-content {
  padding: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;

  .el-icon {
    color: #909399;
    font-size: 20px;
  }
}

/* 捐赠内容样式 */
.donate-content {
  text-align: center;
  padding: 15px;
}

.qrcode {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.donate-buttons {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .donate-btn {
    justify-content: center;
    padding: 12px 20px;

    .el-icon {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}

@media (max-width: 768px) {
  .card-col {
    margin-bottom: 20px;
  }

  .card-title {
    font-size: 16px;
  }

  .qrcode {
    width: 200px;
    height: 200px;
  }

  .qr-switch {
    :deep(.el-radio-button) {
      display: flex;
      flex: 1;

      .el-radio-button__inner {
        width: 100%;
      }
    }
  }
}
</style>
