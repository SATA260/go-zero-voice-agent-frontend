import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display/cubism4'

// 必须将 PIXI 挂载到 window 上，pixi-live2d-display 才能正常工作
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).PIXI = PIXI
}

class Live2DService {
  private static instance: Live2DService
  public model: Live2DModel | null = null
  public app: PIXI.Application | null = null

  private constructor() { }

  public static getInstance(): Live2DService {
    if (!Live2DService.instance) {
      Live2DService.instance = new Live2DService()
    }
    return Live2DService.instance
  }

  /**
   * 初始化 Live2D 模型
   * @param canvas 挂载的 canvas 元素
   * @param modelUrl 模型文件路径
   */
  public async init(canvas: HTMLCanvasElement, modelUrl: string): Promise<void> {
    // 防止重复初始化，先清理
    this.destroy()

    this.app = new PIXI.Application({
      view: canvas,
      autoStart: true,
      resizeTo: canvas.parentElement as HTMLElement,
      backgroundAlpha: 0,
    })

    try {
      this.model = await Live2DModel.from(modelUrl)

      // 修正视线焦点的逻辑
      const originalFocus = this.model.focus
      this.model.focus = (x: number, y: number) => {
        if (this.model) {
          originalFocus.call(this.model, x, y + 268)
        }
      }

      this.app.stage.addChild(this.model)
      this.model.scale.set(0.1)

      // 打印可用表情，方便调试
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('Live2D 初始化完成，可用表情:', (this.model.internalModel.settings as any).expressions)
    } catch (error) {
      console.error('Live2D 模型加载失败:', error)
    }
  }

  /**
   * 设置表情
   * @param expressionId 表情的索引(number) 或 名称(string)
   */
  public setExpression(expressionId: string | number): void {
    if (!this.model) return
    try {
      this.model.expression(expressionId)
      console.log(`表情已切换: ${expressionId}`)
    } catch (e) {
      console.warn(`表情切换失败: ${expressionId}`, e)
    }
  }

  /**
   * 随机设置一个表情
   */
  public setRandomExpression(): void {
    if (!this.model) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expressions = (this.model.internalModel.settings as any).expressions
    if (expressions && expressions.length > 0) {
      const randomIndex = Math.floor(Math.random() * (expressions.length - 2))
      this.setExpression(randomIndex)
    }
  }

  /**
   * 销毁资源
   */
  public destroy(): void {
    if (this.model) {
      this.model.destroy()
      this.model = null
    }
    if (this.app) {
      this.app.destroy(true)
      this.app = null
    }
  }
}

export const live2dService = Live2DService.getInstance()
