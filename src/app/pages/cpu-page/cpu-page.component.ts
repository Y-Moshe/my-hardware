import { Component, OnInit, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Systeminformation as SI } from 'systeminformation'
import 'chartjs-adapter-moment'

import { HardwareService } from '@/services/hardware.service'
import { CpuUtilizationChartComponent } from '@/components'

@Component({
  selector: 'app-cpu-page',
  standalone: true,
  imports: [CommonModule, CpuUtilizationChartComponent, ReactiveFormsModule],
  templateUrl: './cpu-page.component.html',
})
export class CpuPageComponent implements OnInit {
  cpuData = signal<SI.CpuData | null>(null)
  cpuLabel = computed(() => {
    const data = this.cpuData()
    return data ? `${data.manufacturer} ${data.brand}@${data.speed}GHz` : ''
  })

  isServiceRunning = computed(() => this._hwService.isServiceRunning())
  cpuStatus = computed(() => this._hwService.cpuStatus())
  cpuCurrentLoad = computed(() =>
    this._hwService.cpuStatus()?.load.currentLoad.toFixed(2)
  )

  refreshRate = 1000
  maxRecords = 60
  randomizeCpuTemperature = false

  serviceCtrlForm!: FormGroup

  private readonly _hwService = inject(HardwareService)
  private readonly _fb = inject(FormBuilder)

  ngOnInit(): void {
    this.serviceCtrlForm = this._fb.group({
      refreshRate: this._fb.control(this.refreshRate, [
        Validators.required,
        Validators.min(500),
      ]),
      maxRecords: this._fb.control(this.maxRecords, [
        Validators.required,
        Validators.min(10),
      ]),
      randomizeCpuTemperature: this._fb.control(this.randomizeCpuTemperature),
    })

    this._hwService
      .getCpuData()
      .then((data) => this.cpuData.set(data))
      .catch(console.log)
  }

  handleSubmit() {
    const { refreshRate, maxRecords, randomizeCpuTemperature } =
      this.serviceCtrlForm.value

    this.refreshRate = refreshRate
    this.maxRecords = maxRecords
    this.randomizeCpuTemperature = randomizeCpuTemperature

    this._hwService.restartService(this.refreshRate)
  }

  handleStopService() {
    this._hwService.stopService()
  }
}
