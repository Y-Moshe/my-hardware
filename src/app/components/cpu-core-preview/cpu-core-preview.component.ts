import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgxGaugeModule } from 'ngx-gauge'
import colors from 'tailwindcss/colors'

@Component({
  selector: 'app-cpu-core-preview',
  standalone: true,
  imports: [CommonModule, NgxGaugeModule],
  templateUrl: './cpu-core-preview.component.html',
})
export class CpuCorePreviewComponent {
  @Input() load: number = 0
  @Input() speed: number = 0
  @Input() temperature: number = 0

  get label() {
    return `${this.speed}GHz ${this.temperature ? this.temperature + '°C' : ''}`
  }

  get color() {
    return colors.sky[400]
  }

  thresholds = {
    '0': {
      color: colors.green[200],
    },
    '25': {
      color: colors.yellow[200],
    },
    '50': {
      color: colors.orange[200],
    },
    '75': {
      color: colors.red[500],
    },
  }
}
