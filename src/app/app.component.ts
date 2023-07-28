import { Component, OnInit, computed, inject, effect } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'

import {
  AppFooterComponent,
  AppHeaderComponent,
  ServiceSettingsFormComponent,
} from '@/components'
import { HardwareService } from '@/services/hardware.service'
import { UserSettingsService } from '@/services/user-settings.service'
import { UserSettings } from '@/types'

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
  userSettings = computed(() => this._userSettingsService.settings())
  isServiceRunning = computed(() => this._hwService.isServiceRunning())

  private readonly _hwService = inject(HardwareService)
  private readonly _userSettingsService = inject(UserSettingsService)

  constructor() {
    effect(() => {
      const { theme } = this._userSettingsService.settings()
      theme === 'dark'
        ? document.documentElement.classList.add('dark')
        : document.documentElement.classList.remove('dark')
    })
  }

  ngOnInit(): void {
    this._userSettingsService.loadUserSettings()
    this._hwService.startService()
  }

  handleSubmit(settings: UserSettings) {
    this._userSettingsService.saveSettings(settings)
    this._hwService.restartService()
  }

  handleToggleService() {
    this.isServiceRunning()
      ? this._hwService.stopService()
      : this._hwService.startService()
  }
}
