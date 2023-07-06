import { Component, computed, effect } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Systeminformation as SI } from 'systeminformation'

import { AppFooterComponent, AppHeaderComponent } from '@/components'
import { CpuService } from '@/services/cpu.service'
import { CpuStatus } from '@/types'
import { RouterModule, RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, AppHeaderComponent, AppFooterComponent, RouterOutlet],
})
export class AppComponent {
  cpuData = computed<SI.CpuData | null>(() => this._cpuService.cpuData())
  cpuStatus = computed<CpuStatus | null>(() => this._cpuService.cpuStatus())

  constructor(private readonly _cpuService: CpuService) {
    this._cpuService.startService(1000)
    effect(() => console.log(this.cpuStatus()))
  }
}
