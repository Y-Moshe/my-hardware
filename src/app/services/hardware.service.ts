import { Injectable, signal } from '@angular/core'
import { ElectronService } from 'ngx-electron'

import { Systeminformation as SI } from 'systeminformation'
import {
  HardwareStatus,
  HardwareServiceSettings,
  MemStatus,
  DiskStatus,
  CpuStatus,
} from '@/types'

@Injectable({
  providedIn: 'root',
})
export class HardwareService {
  cpuStatus = signal<CpuStatus | null>(null)
  memStatus = signal<MemStatus | null>(null)
  diskStatus = signal<DiskStatus | null>(null)

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
      const {
        cpuCurrentLoad,
        cpuCurrentSpeed,
        cpuTemperature,
        memCurrentLoad,
        disksIO,
        fsSize,
      } = await this._getHardwareStatus()

      this.cpuStatus.set({
        load: cpuCurrentLoad,
        speed: cpuCurrentSpeed,
        temperature: cpuTemperature,
      })
      this.memStatus.set(memCurrentLoad)
      this.diskStatus.set({
        disksIO,
        fsSize,
      })
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

  public getMemoryLayout(): Promise<SI.MemLayoutData[]> {
    return this._electronService.ipcRenderer.invoke('getMemoryLayout')
  }

  private _getHardwareStatus(): Promise<HardwareStatus> {
    return this._electronService.ipcRenderer.invoke('getHardwareStatus')
  }
}
