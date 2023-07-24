import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'

import { HardwareServiceSettings } from '@/types'

@Component({
  selector: 'app-service-settings-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-settings-form.component.html',
})
export class ServiceSettingsFormComponent implements OnInit {
  form!: FormGroup

  @Input({ required: true }) settings!: HardwareServiceSettings
  @Input({ required: true }) isServiceRunning!: boolean

  @Output() onSubmit = new EventEmitter<HardwareServiceSettings>()
  @Output() onToggleService = new EventEmitter<void>()

  get toggledLabel() {
    return this.isServiceRunning ? 'Stop service' : 'Start service'
  }

  private readonly _fb = inject(FormBuilder)

  ngOnInit(): void {
    const { refreshRate, maxRecords, randomizeCpuTemperature, theme } =
      this.settings

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
      theme: this._fb.control(theme),
    })
  }

  handleSubmit() {
    if (!this.form.valid) return
    this.onSubmit.emit(this.form.value as HardwareServiceSettings)
  }
}
