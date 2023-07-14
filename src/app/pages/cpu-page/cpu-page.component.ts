import { Component, OnInit, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Systeminformation as SI } from 'systeminformation'
import 'chartjs-adapter-moment'

import { HardwareService } from '@/services/hardware.service'
import {
  CpuCorePreviewComponent,
  CpuUtilizationChartComponent,
} from '@/components'
import { CpuCoreStatus } from '@/types'

@Component({
  selector: 'app-cpu-page',
  standalone: true,
  imports: [
    CommonModule,
    CpuUtilizationChartComponent,
    CpuCorePreviewComponent,
  ],
  templateUrl: './cpu-page.component.html',
  host: {
    class: 'main-layout full',
  },
})
export class CpuPageComponent implements OnInit {
  cpuData = signal<SI.CpuData | null>(null)
  cpuLabel = computed(() => {
    const data = this.cpuData()
    return data ? `${data.manufacturer} ${data.brand}@${data.speed}GHz` : ''
  })

  cpuStatus = computed(() => this._hwService.cpuStatus())
  cpuCurrentLoad = computed(() =>
    this._hwService.cpuStatus()?.load.currentLoad.toFixed(2)
  )
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

  hwServiceSettings = computed(() => this._hwService.settings())
  private readonly _hwService = inject(HardwareService)

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
