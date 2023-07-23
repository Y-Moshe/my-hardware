import { Component, OnInit, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Systeminformation as SI } from 'systeminformation'
import 'chartjs-adapter-moment'

import { HardwareService } from '@/services/hardware.service'
import { DisksUsageChartComponent, InfoTableComponent } from '@/components'
import { CpuCoreStatus } from '@/types'
import { BytesToPipe } from '@/pipes/bytes-to.pipe'

@Component({
  selector: 'app-disk-page',
  standalone: true,
  imports: [
    CommonModule,
    DisksUsageChartComponent,
    InfoTableComponent,
    FormsModule,
  ],
  templateUrl: './disk-page.component.html',
  providers: [BytesToPipe],
  host: {
    class: 'main-layout full',
  },
})
export class DiskPageComponent implements OnInit {
  disksData = signal<SI.DiskLayoutData | null>(null)
  disksStatus = computed(() => this._hwService.diskStatus())

  selectedStats: 'usage' | 'io' = 'usage'

  disksInfoTable = computed(() => {
    const fsSize = this.disksStatus()?.fsSize
    if (!fsSize) return {} as Record<string, string | number>

    const info = fsSize.reduce<Record<string, string | number>>(
      (prev, curr) => {
        prev['Total Size'] = (prev['Total Size'] as number) + curr.size
        prev['Total Used'] = (prev['Total Used'] as number) + curr.used
        prev['Total Free'] = (prev['Total Free'] as number) + curr.available
        prev[`${curr.mount} Size`] = curr.size
        prev[`${curr.mount} Used`] = curr.used
        prev[`${curr.mount} Free`] = curr.available
        return prev
      },
      {
        'Total Size': 0,
        'Total Used': 0,
        'Total Free': 0,
      }
    )

    Object.keys(info).forEach(
      (key) => (info[key] = this._bytesTo.transform(info[key] as number))
    )

    return info
  })

  hwServiceSettings = computed(() => this._hwService.settings())
  private readonly _hwService = inject(HardwareService)
  private readonly _bytesTo = inject(BytesToPipe)

  ngOnInit(): void {
    this._hwService
      .getDisksLayout()
      .then((data) => this.disksData.set(data))
      .catch(console.log)
  }

  trackByCoreIndex(index: number, core: CpuCoreStatus) {
    return index
  }
}
