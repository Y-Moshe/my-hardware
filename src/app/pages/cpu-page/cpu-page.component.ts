import { Component, OnInit, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Systeminformation as SI } from 'systeminformation'
import 'chartjs-adapter-moment'

import { HardwareService } from '@/services/hardware.service'
import { UserSettingsService } from '@/services/user-settings.service'
import {
  CpuCorePreviewComponent,
  CpuUtilizationChartComponent,
  InfoTableComponent,
} from '@/components'
import { CpuCoreStatus } from '@/types'

@Component({
  selector: 'app-cpu-page',
  standalone: true,
  imports: [
    CommonModule,
    CpuUtilizationChartComponent,
    CpuCorePreviewComponent,
    InfoTableComponent,
  ],
  templateUrl: './cpu-page.component.html',
  host: {
    class: 'main-layout full',
  },
})
export class CpuPageComponent implements OnInit {
  cpuData = signal<SI.CpuData | null>(null)
  cpuStatus = computed(() => this._hwService.cpuStatus())

  cpuInfoTable = computed(() => {
    const cpuData = this.cpuData()
    const cpuStatus = this.cpuStatus()
    if (!cpuData || !cpuStatus) return {} as Record<string, string | number>

    const { manufacturer, brand, speed: baseSpeed } = cpuData
    const { load, speed } = cpuStatus

    return {
      CPU: `${manufacturer} ${brand}@${baseSpeed}GHz`,
      Utilization: load.currentLoad.toFixed(2) + '%',
      Speed: speed.avg.toFixed(2) + 'GHz',
      Cores: cpuData.cores,
      'Physical Cores': cpuData.physicalCores,
      Socket: cpuData.socket,
    }
  })

  cpuCoresStatus = computed<CpuCoreStatus[] | undefined>(() =>
    this.cpuStatus()?.load.cpus.map((core, i) => {
      const coreSpeed = this.cpuStatus()?.speed.cores[i]
      const coreTemperature = this.cpuStatus()?.temperature.cores[i]

      return {
        load: +core.load.toFixed(2),
        speed: coreSpeed || 0,
        temperature: coreTemperature || 0,
      }
    })
  )

  userSettings = computed(() => this._userSettingsService.settings())
  private readonly _hwService = inject(HardwareService)
  private readonly _userSettingsService = inject(UserSettingsService)

  ngOnInit(): void {
    this._hwService
      .getCpuData()
      .then((data) => this.cpuData.set(data))
      .catch(console.log)
  }

  trackByCoreIndex(index: number, core: CpuCoreStatus) {
    return index
  }
}
