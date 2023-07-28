import { Injectable, signal } from '@angular/core'
import { utilService } from '@/services/util.service'
import { UserSettings } from '@/types'

const STORAGE_KEY = 'userSettings'

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  settings = signal<UserSettings>({
    refreshRate: 1000,
    maxRecords: 60,
    theme: 'dark',
  })

  public saveSettings(settings: UserSettings) {
    this.settings.set(settings)
    utilService.saveToStorage(STORAGE_KEY, settings)
  }

  public loadUserSettings() {
    const settings = utilService.loadFromStorage<UserSettings>(STORAGE_KEY)
    settings && this.settings.set(settings)
  }
}
