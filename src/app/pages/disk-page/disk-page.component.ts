import { Component, OnInit, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Systeminformation as SI } from 'systeminformation'
import 'chartjs-adapter-moment'

import { HardwareService } from '@/services/hardware.service'
import {
  DiskDrivePreviewComponent,
  DisksUsageChartComponent,
  InfoTableComponent,
} from '@/components'
import { BytesToPipe } from '@/pipes/bytes-to.pipe'

@Component({
  selector: 'app-disk-page',
  standalone: true,
  imports: [
    CommonModule,
    DisksUsageChartComponent,
    DiskDrivePreviewComponent,
    InfoTableComponent,
  ],
  templateUrl: './disk-page.component.html',
  providers: [BytesToPipe],
  host: {
    class: 'main-layout full',
  },
})
export class DiskPageComponent implements OnInit {
  disksLayoutData = signal<SI.DiskLayoutData[]>([])
  disksStatus = computed(() => this._hwService.diskStatus())

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

  disksDriveInfo = computed(() => {
    const disksData = this.disksLayoutData()
    if (!disksData) return []

    return disksData.map((data) => ({
      Device: data.device,
      Type: data.type,
      Name: data.name,
      Vendor: data.vendor,
      Size: this._bytesTo.transform(data.size),
      'Serial Number': data.serialNum,
      'Interface Type': data.interfaceType,
    }))
  })
  selectedDiskDriveIdx = signal<number | null>(null)
  selectedDiskDrive = computed(() => {
    const drivesData = this.disksDriveInfo()
    const idx = this.selectedDiskDriveIdx()
    if (!drivesData || idx === null)
      return {} as Record<string, string | number>

    return drivesData[idx]
  })

  hwServiceSettings = computed(() => this._hwService.settings())
  private readonly _hwService = inject(HardwareService)
  private readonly _bytesTo = inject(BytesToPipe)

  ngOnInit(): void {
    this._hwService
      .getDisksLayout()
      .then((data) => this.disksLayoutData.set(data))
      .catch(console.log)
  }

  trackByDriveIndex(index: number, drive: SI.DiskLayoutData) {
    return index
  }

  handleSelectedSlot(index: number) {
    this.selectedDiskDriveIdx.set(index)
  }
}
