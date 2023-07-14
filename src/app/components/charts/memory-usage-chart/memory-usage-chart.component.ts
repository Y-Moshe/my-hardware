import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { BaseChartDirective, NgChartsModule } from 'ng2-charts'
import { ChartConfiguration } from 'chart.js'
import DatalabelsPlugin from 'chartjs-plugin-datalabels'
import colors from 'tailwindcss/colors'

import { Systeminformation as SI } from 'systeminformation'
import { BytesToPipe } from '@/pipes/bytes-to.pipe'

@Component({
  selector: 'app-memory-usage-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './memory-usage-chart.component.html',
  providers: [BytesToPipe],
})
export class MemoryUsageChartComponent implements OnChanges {
  memChartType: ChartConfiguration['type'] = 'pie'

  memChartDatasets: ChartConfiguration['data'] = {
    // backgroundColor: ['red', 'blue']
    datasets: [
      {
        data: [20, 30, 40, 10],
      },
    ],
    labels: ['RAM Used', 'RAM Free', 'Swap Used', 'Swap Free'],
  }

  memChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: {
      duration: 300,
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: 'Roboto',
            size: 16,
          },
          color: 'white',
        },
      },
      datalabels: {
        formatter: (value) => this._bytesToPipe.transform(value, 'GB'),
        font: {
          family: 'Roboto',
          size: 16,
        },
        color: colors.blue['200'],
      },
      tooltip: {
        callbacks: {
          label: ({ parsed }) => this._bytesToPipe.transform(parsed, 'GB'),
        },
      },
    },
  }
  pieChartPlugins = [DatalabelsPlugin]

  private readonly _bytesToPipe = inject(BytesToPipe)

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective
  @Input({ required: true }) memData: SI.MemData | null | undefined = null

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['memData']) {
      this.updateDatasets(changes['memData'].currentValue)
    }
  }

  updateDatasets(currentLoad: SI.MemData | null | undefined) {
    if (this.chart && this.chart.data && currentLoad) {
      this.chart.data.datasets[0].data[0] = currentLoad.used
      this.chart.data.datasets[0].data[1] = currentLoad.free
      this.chart.data.datasets[0].data[3] = currentLoad.swapused
      this.chart.data.datasets[0].data[2] = currentLoad.swapfree

      this.chart.update()
    }
  }
}
