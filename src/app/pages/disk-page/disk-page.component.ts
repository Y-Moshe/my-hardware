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
    if (!fsSize) return []

    const totals = fsSize.reduce(
      (prev, curr) => {
        prev.size += curr.size
        prev.used += curr.used
        prev.free += curr.available
        return prev
      },
      {
        size: 0,
        used: 0,
        free: 0,
      }
    )

    const info = fsSize.map((drive) => [
      drive.mount,
      this._bytesTo.transform(drive.size),
      this._bytesTo.transform(drive.used),
      this._bytesTo.transform(drive.available),
    ])

    info.unshift([
      'Total Usage',
      this._bytesTo.transform(totals.size),
      this._bytesTo.transform(totals.used),
      this._bytesTo.transform(totals.free),
    ])
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
