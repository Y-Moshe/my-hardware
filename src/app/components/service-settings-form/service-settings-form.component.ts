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

import { UserSettings } from '@/types'

@Component({
  selector: 'app-service-settings-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-settings-form.component.html',
})
export class ServiceSettingsFormComponent implements OnInit {
  form!: FormGroup

  @Input({ required: true }) settings!: UserSettings
  @Input({ required: true }) isServiceRunning!: boolean

  @Output() onSubmit = new EventEmitter<UserSettings>()
  @Output() onToggleService = new EventEmitter<void>()

  get toggledLabel() {
    return this.isServiceRunning ? 'Stop service' : 'Start service'
  }

  get activeClass() {
    return {
      active: this.isServiceRunning,
    }
  }

  activeServiceClasses(includeAnimate: boolean) {
    return {
      [this.isServiceRunning ? 'bg-green-500' : 'bg-slate-500']: true,
      'animate-ping': this.isServiceRunning && includeAnimate,
    }
  }

  private readonly _fb = inject(FormBuilder)

  ngOnInit(): void {
    const { refreshRate, maxRecords, theme } = this.settings

    this.form = this._fb.group({
      refreshRate: this._fb.control(refreshRate, [
        Validators.required,
        Validators.min(500),
      ]),
      maxRecords: this._fb.control(maxRecords, [
        Validators.required,
        Validators.min(10),
      ]),
      theme: this._fb.control(theme),
    })
  }

  hasError(fieldName: string, errorName: string) {
    const ctrl = this.form.get(fieldName)
    return ctrl?.touched && ctrl?.hasError(errorName)
  }

  handleSubmit() {
    if (!this.form.valid) return
    this.onSubmit.emit(this.form.value as UserSettings)
  }
}
