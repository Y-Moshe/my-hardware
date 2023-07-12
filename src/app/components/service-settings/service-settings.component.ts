import { Component, OnInit, computed, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'

import { HardwareService } from '@/services/hardware.service'
import { HardwareServiceSettings } from '@/types'

@Component({
  selector: 'app-service-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-settings.component.html',
})
export class ServiceSettingsComponent implements OnInit {
  form!: FormGroup

  settings = computed(() => this._hwService.settings())
  toggledLabel = computed(() =>
    this._hwService.isServiceRunning() ? 'Stop service' : 'Start service'
  )

  private readonly _fb = inject(FormBuilder)
  private readonly _hwService = inject(HardwareService)

  ngOnInit(): void {
    const { refreshRate, maxRecords, randomizeCpuTemperature } = this.settings()

    this.form = this._fb.group({
      refreshRate: this._fb.control(refreshRate, [
        Validators.required,
        Validators.min(500),
      ]),
      maxRecords: this._fb.control(maxRecords, [
        Validators.required,
        Validators.min(10),
      ]),
      randomizeCpuTemperature: this._fb.control(randomizeCpuTemperature),
    })
  }

  handleSubmit() {
    if (!this.form.valid) return

    this._hwService.setSettings(this.form.value as HardwareServiceSettings)
    this._hwService.restartService()
  }

  handleStopService() {
    this._hwService.stopService()
  }
}
