import { Component, OnInit, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Systeminformation as SI } from 'systeminformation'

import { HardwareService } from '@/services/hardware.service'
import {
  MemoryUsageChartComponent,
  InfoTableComponent,
  MemSlotPreviewComponent,
} from '@/components'
import { BytesToPipe } from '@/pipes/bytes-to.pipe'
import { MemSlotData } from '@/types'

@Component({
  selector: 'app-memory-page',
  standalone: true,
  imports: [
    CommonModule,
    MemoryUsageChartComponent,
    InfoTableComponent,
    MemSlotPreviewComponent,
  ],
  templateUrl: './memory-page.component.html',
  providers: [BytesToPipe],
  host: {
    class: 'main-layout full',
  },
})
export class MemoryPageComponent implements OnInit {
  memLayoutData = signal<SI.MemLayoutData[] | null>(null)
  memStatus = computed(() => this._hwService.memStatus())

  memInfoTable = computed(() => {
    const memStatus = this.memStatus()
    if (!memStatus) return {} as Record<string, string | number>

    return {
      'Total RAM': this._bytesTo.transform(memStatus.total),
      'RAM Used': this._bytesTo.transform(memStatus.used),
      'RAM Free': this._bytesTo.transform(memStatus.free),
      'Total Swap File': this._bytesTo.transform(memStatus.swaptotal),
      'Swap Used': this._bytesTo.transform(memStatus.swapused),
      'Swap Free': this._bytesTo.transform(memStatus.swapfree),
    }
  })

  memInfoSlots = computed(() => {
    const memData = this.memLayoutData()
    if (!memData) return []

    return memData.map((data) => ({
      Size: this._bytesTo.transform(data.size),
      Slot: data.bank.replace('BANK', 'Slot'),
      Type: data.type,
      'Clock Speed': data.clockSpeed + 'MHz',
      'Form Factor': data.formFactor,
      Manufacturer: data.manufacturer || '',
      'Part Number': data.partNum,
      'Serial Number': data.serialNum,
      'Configured Voltage': data.voltageConfigured + 'V',
    }))
  })
  memSelectedSlotIdx = signal<number | null>(null)
  memSelectedSlot = computed(() => {
    const slotData = this.memInfoSlots()
    const idx = this.memSelectedSlotIdx()
    if (!slotData || idx === null) return {} as Record<string, string | number>

    return slotData[idx]
  })

  private readonly _hwService = inject(HardwareService)
  private readonly _bytesTo = inject(BytesToPipe)

  ngOnInit(): void {
    this._hwService
      .getMemoryLayout()
      .then((data) => this.memLayoutData.set(data))
      .catch(console.log)
  }

  trackBySlotIndex(index: number, slot: MemSlotData) {
    return index
  }

  handleSelectedSlot(index: number) {
    this.memSelectedSlotIdx.set(index)
  }
}
