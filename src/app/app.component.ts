import { Component, OnInit, computed, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'

import {
  AppFooterComponent,
  AppHeaderComponent,
  ServiceSettingsFormComponent,
} from '@/components'
import { HardwareService } from '@/services/hardware.service'
import { HardwareServiceSettings } from '@/types'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    AppHeaderComponent,
    ServiceSettingsFormComponent,
    AppFooterComponent,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit {
  serviceSettings = computed(() => this._hwService.settings())
  isServiceRunning = computed(() => this._hwService.isServiceRunning())

  private readonly _hwService = inject(HardwareService)

  ngOnInit(): void {
    this._hwService.startService()
  }

  handleSubmit(settings: HardwareServiceSettings) {
    this._hwService.setSettings(settings)
    this._hwService.restartService()
  }

  handleToggleService() {
    this.isServiceRunning()
      ? this._hwService.stopService()
      : this._hwService.startService()
  }
}
