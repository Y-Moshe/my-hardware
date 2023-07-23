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
import { ChartConfiguration, ChartDataset } from 'chart.js'
import DatalabelsPlugin from 'chartjs-plugin-datalabels'
import colors from 'tailwindcss/colors'

import { Systeminformation as SI } from 'systeminformation'
import { BytesToPipe } from '@/pipes/bytes-to.pipe'

@Component({
  selector: 'app-disks-usage-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './disks-usage-chart.component.html',
  providers: [BytesToPipe],
})
export class DisksUsageChartComponent implements OnChanges {
  chartType: ChartConfiguration['type'] = 'doughnut'

  chartDatasets: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  }

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: {
      duration: 300,
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 20,
          font: {
            family: 'Roboto',
            size: 16,
          },
          color: 'white',
        },
      },
      datalabels: {
        formatter: (value) => this._bytesToPipe.transform(value),
        font: {
          family: 'Roboto',
          size: 16,
        },
        align: (context) => (context.dataIndex % 2 === 0 ? 'center' : 'bottom'),
        color: colors.blue['200'],
      },
      tooltip: {
        callbacks: {
          label: ({ parsed }) => this._bytesToPipe.transform(parsed),
        },
      },
    },
  }
  chartPlugins = [DatalabelsPlugin]

  private readonly _bytesToPipe = inject(BytesToPipe)

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective
  @Input({ required: true }) disksFsData: SI.FsSizeData[] | null | undefined =
    []

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disksFsData']) {
      this.updateDatasets(changes['disksFsData'].currentValue)
    }
  }

  updateDatasets(disksFsData: SI.FsSizeData[] | null | undefined) {
    if (this.chart && this.chart.data && disksFsData) {
      // Create labels for each disk, Total, Used and Free
      const labels = disksFsData.reduce<string[]>((temp, fs) => {
        temp.push(`${fs.mount} Total`)
        temp.push(`${fs.mount} Used`)
        temp.push(`${fs.mount} Free`)
        return temp
      }, [])
      this.chartDatasets.labels = labels

      const labelsLength = this.chartDatasets.labels!.length
      const datasets: ChartDataset[] = []

      disksFsData.forEach((fs, idx) => {
        // Initialize data and sync with labels length
        const data = new Array(labelsLength).fill(0)
        // Update only the "Drive(C:, ..etc)" data in the array by calculating based on the index (idx)
        data.splice(idx * 3, 3, fs.size, fs.used, fs.available)

        datasets.push({ data })
      })

      this.chart.data.datasets = datasets
    }

    this.chart?.update('none')
  }
}
