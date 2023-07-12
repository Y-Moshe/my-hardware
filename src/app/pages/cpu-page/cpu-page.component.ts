import { Component, OnInit, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Systeminformation as SI } from 'systeminformation'
import 'chartjs-adapter-moment'

import { HardwareService } from '@/services/hardware.service'
import { CpuUtilizationChartComponent } from '@/components'

@Component({
  selector: 'app-cpu-page',
  standalone: true,
  imports: [CommonModule, CpuUtilizationChartComponent],
  templateUrl: './cpu-page.component.html',
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

  hwServiceSettings = computed(() => this._hwService.settings())
  private readonly _hwService = inject(HardwareService)

  ngOnInit(): void {
    this._hwService
      .getCpuData()
      .then((data) => this.cpuData.set(data))
      .catch(console.log)
  }
}
