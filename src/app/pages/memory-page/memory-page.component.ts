import { Component, OnInit, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Systeminformation as SI } from 'systeminformation'
import 'chartjs-adapter-moment'

import { HardwareService } from '@/services/hardware.service'
import { MemoryUsageChartComponent } from '@/components'
import { BytesToPipe } from '@/pipes/bytes-to.pipe'

@Component({
  selector: 'app-memory-page',
  standalone: true,
  imports: [CommonModule, MemoryUsageChartComponent, BytesToPipe],
  templateUrl: './memory-page.component.html',
})
export class MemoryPageComponent implements OnInit {
  memLayoutData = signal<SI.MemLayoutData[] | null>(null)

  memStatus = computed(() => this._hwService.memStatus())
  hwServiceSettings = computed(() => this._hwService.settings())
  private readonly _hwService = inject(HardwareService)

  ngOnInit(): void {
    this._hwService
      .getMemoryLayout()
      .then((data) => this.memLayoutData.set(data))
      .catch(console.log)
  }
}
