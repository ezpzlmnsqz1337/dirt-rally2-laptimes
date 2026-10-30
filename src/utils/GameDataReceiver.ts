import type { GameData } from "@/model/GameData"

const MAX_RETRY_ATTEMPTS = 3

export type GameDataListener = (message: GameData) => any

export type OnOpenCallback = (this: WebSocket, ev: Event) => any
export type OnCloseCallback = (this: WebSocket, ev: CloseEvent) => any

export default class GameDataReceiver {
    static instance: GameDataReceiver

    protected ws: WebSocket | null = null
    protected hostname = window.location.hostname
    protected port = 20779
    protected listeners: GameDataListener[] = []
    protected retryHandler?: ReturnType<typeof setInterval>
    protected retries = 0

    static getInstance () {
      if (!GameDataReceiver.instance) {
        GameDataReceiver.instance = new GameDataReceiver()
      }
      return GameDataReceiver.instance
    }

    connect (hostname: string, port: number, onOpen: OnOpenCallback, onClose: OnCloseCallback) {
      this.hostname = hostname
      this.port = port

      if (this.ws) this.ws.close()

      this.ws = new WebSocket(`ws://${hostname}:${port}`)
      this.ws.onopen = onOpen
      this.ws.onclose = onClose
      this.ws.onmessage = m => this.onMessage(m)

      if (!this.retryHandler) this.setupRetryHandler()
    }

    private onMessage(message: MessageEvent) {
      try {
        const data = JSON.parse(message.data) as GameData
        // console.log('Received: ', data)
        this.listeners.forEach(x => x(data))
      } catch (e: unknown) {
        console.log('Error: ', (e as SyntaxError).message, message)
      }
    }

    disconnect () {
      clearInterval(this.retryHandler)
      this.retryHandler = undefined
      this.retries = 0
      this.ws?.close()
      this.ws = null
    }

    setupRetryHandler () {
      this.retryHandler = setInterval(() => {
        if (this.retries >= MAX_RETRY_ATTEMPTS) {
          clearInterval(this.retryHandler)
          this.retryHandler = undefined
          return
        }
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
          this.retry()
          console.log(`Retry WS connection attempt ${this.retries}/${MAX_RETRY_ATTEMPTS}`)
        } else {
          this.retries = 0
        }
      }, 5000)
    }

    addListener (listener: GameDataListener) {
      this.listeners.push(listener)
      return listener
    }

    removeListener (listener: GameDataListener) {
      const index = this.listeners.indexOf(listener)
      if (index !== -1) this.listeners.splice(index, 1)
    }

    retry () {
      if (!this.ws) return
      this.connect(this.hostname, this.port, this.ws.onopen!, this.ws.onclose!)
      this.retries++
    }
}
