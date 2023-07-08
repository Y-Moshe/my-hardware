import { Injectable, signal } from '@angular/core'
import { ElectronService } from 'ngx-electron'

import { Systeminformation as SI } from 'systeminformation'
import { CpuStatus } from '@/types'

@Injectable({
  providedIn: 'root',
})
export class CpuService {
  cpuData = signal<SI.CpuData | null>(null)
  cpuStatus = signal<CpuStatus | null>(null)

  intervalId: NodeJS.Timer | null = null

  constructor(private readonly _electronService: ElectronService) {
    this._getCpuData().then((data) => this.cpuData.set(data))
  }

  public startService(refreshRate: number): void {
    this.intervalId = setInterval(async () => {
      const status = await this._getCpuStatus()
      this.cpuStatus.set(status)
    }, refreshRate)
  }

  public stopService(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  public restartService(refreshRate: number): void {
    this.stopService()
    this.startService(refreshRate)
  }

  // Private methods

  private _getCpuData(): Promise<SI.CpuData> {
    return this._electronService.ipcRenderer.invoke('getCpuData')
  }

  private _getCpuStatus(): Promise<CpuStatus> {
    return this._electronService.ipcRenderer.invoke('getCpuStatus')
  }
}
