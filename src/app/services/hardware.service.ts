import { Injectable, signal } from '@angular/core'
import { ElectronService } from 'ngx-electron'

import { Systeminformation as SI } from 'systeminformation'
import { CpuStatus, DisksStatus, HardwareServiceSettings } from '@/types'

type HardwareStatus = {
  cpuStatus: CpuStatus
  disksStatus: DisksStatus
  memoryStatus: SI.MemData
}

@Injectable({
  providedIn: 'root',
})
export class HardwareService {
  cpuStatus = signal<CpuStatus | null>(null)
  memoryStatus = signal<SI.MemData | null>(null)
  disksStatus = signal<DisksStatus | null>(null)

  settings = signal<HardwareServiceSettings>({
    refreshRate: 1000,
    maxRecords: 60,
    randomizeCpuTemperature: false,
  })
  isServiceRunning = signal<boolean>(false)
  intervalId: NodeJS.Timer | null = null

  constructor(private readonly _electronService: ElectronService) {}

  public setSettings(settings: HardwareServiceSettings) {
    this.settings.set(settings)
  }

  public startService(): void {
    if (this.isServiceRunning()) return

    this.intervalId = setInterval(async () => {
      const results = await this._getHardwareStatus()

      this.cpuStatus.set(results.cpuStatus)
      this.memoryStatus.set(results.memoryStatus)
      this.disksStatus.set(results.disksStatus)
    }, this.settings().refreshRate)

    this.isServiceRunning.set(true)
  }

  public stopService(): void {
    if (this.isServiceRunning()) {
      this.intervalId && clearInterval(this.intervalId)
      this.intervalId = null
      this.isServiceRunning.set(false)
    }
  }

  public restartService(): void {
    this.stopService()
    this.startService()
  }

  public getCpuData(): Promise<SI.CpuData> {
    return this._electronService.ipcRenderer.invoke('getCpuData')
  }

  public getDisksLayout(): Promise<SI.DiskLayoutData> {
    return this._electronService.ipcRenderer.invoke('getDisksLayout')
  }

  public getMemoryLayout(): Promise<SI.MemLayoutData> {
    return this._electronService.ipcRenderer.invoke('getMemoryLayout')
  }

  private async _getHardwareStatus(): Promise<HardwareStatus> {
    const [cpuStatus, disksStatus, memoryStatus] = await Promise.all([
      this._electronService.ipcRenderer.invoke('getCpuStatus'),
      this._electronService.ipcRenderer.invoke('getDisksStatus'),
      this._electronService.ipcRenderer.invoke('getMemoryStatus'),
    ])

    return {
      cpuStatus,
      disksStatus,
      memoryStatus,
    }
  }
}
