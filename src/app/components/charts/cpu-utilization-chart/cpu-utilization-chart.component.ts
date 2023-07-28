import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { BaseChartDirective, NgChartsModule } from 'ng2-charts'
import { ChartConfiguration } from 'chart.js'
import colors from 'tailwindcss/colors'
import 'chartjs-adapter-moment'

import { Systeminformation as SI } from 'systeminformation'
import { AppTheme } from '@/types'

@Component({
  selector: 'app-cpu-utilization-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './cpu-utilization-chart.component.html',
})
export class CpuUtilizationChartComponent implements OnChanges {
  cpuChartType: ChartConfiguration['type'] = 'line'

  cpuChartDatasets: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'CPU Load',
        borderColor: colors.sky['400'],
        pointBackgroundColor: colors.sky['500'],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors.red['400'],
        pointHitRadius: 10,
        fill: true,
      },
      {
        data: [],
        label: 'Temperature',
        borderColor: colors.orange['400'],
        pointBackgroundColor: colors.orange['500'],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors.red['400'],
        pointHitRadius: 10,
        yAxisID: 'tempYAxis',
        fill: true,
      },
    ],
    labels: [],
  }

  cpuChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: {
      duration: 300,
    },
    scales: {
      y: {
        position: 'right',
        min: 0,
        max: 100,
        ticks: {
          font: {
            family: 'Roboto',
            size: 16,
          },
          color: () =>
            this.theme === 'light' ? colors.sky['400'] : colors.sky['200'],
          textStrokeWidth: (ctx) => (ctx.tick.value === 100 ? 1 : 0),
          textStrokeColor: colors.sky[200],
          stepSize: 25,
          callback: (value) => (value ? value + '%' : ''),
        },
      },
      tempYAxis: {
        position: 'left',
        min: 0,
        suggestedMax: 100,
        ticks: {
          font: {
            family: 'Roboto',
            size: 16,
          },
          stepSize: 25,
          color(ctx) {
            switch (ctx.tick.value) {
              case 0:
                return colors.slate[100]
              case 25:
                return colors.green[400]
              case 50:
                return colors.yellow[400]
              case 75:
                return colors.orange[400]
              default:
                return colors.red[500]
            }
          },
          textStrokeWidth: (ctx) => (ctx.tick.value === 100 ? 1 : 0),
          textStrokeColor: colors.red[200],
          callback: (value) => (value ? value + '°C' : ''),
        },
      },
      x: {
        position: 'bottom',
        display: false,
        type: 'time',
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: 'Roboto',
            size: 16,
          },
        },
      },
      tooltip: {
        callbacks: {
          label({ dataset, datasetIndex, formattedValue }) {
            const unit = datasetIndex === 0 ? '%' : '°C'
            return `${dataset.label}: ${(+formattedValue).toFixed(2)}${unit}`
          },
        },
      },
    },
  }

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective
  @ViewChild('cpuCanvasRef') cpuCanvasRef?: ElementRef<HTMLCanvasElement>

  @Input() theme: AppTheme = 'dark'
  @Input() maxRecords: number = 60
  @Input({ required: true }) cpuLoad: SI.CurrentLoadData | null | undefined =
    null
  @Input({ required: true }) cpuTemperature:
    | SI.CpuTemperatureData
    | null
    | undefined = null

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cpuLoad'] && changes['cpuTemperature']) {
      this.updateDatasets(
        changes['cpuLoad'].currentValue,
        changes['cpuTemperature'].currentValue
      )
    }

    if (changes['theme']) {
      this.applyThemeColors(changes['theme'].currentValue)
    }

    if (changes['maxRecords']) {
      this.updateDatasetMaxRecords(changes['maxRecords'].currentValue)
    }
  }

  applyThemeColors(theme: AppTheme) {
    if (theme === 'light') {
      this.cpuChartOptions!.plugins!.legend!.labels!.color = colors.slate['600']
    } else if (theme === 'dark') {
      this.cpuChartOptions!.plugins!.legend!.labels!.color = colors.blue['100']
    }

    this.chart?.render()
  }

  updateDatasets(
    currentLoad: SI.CurrentLoadData | null | undefined,
    currentTemp: SI.CpuTemperatureData | null | undefined
  ) {
    const currentTime = Date.now()

    if (this.chart && this.chart.data && currentLoad && currentTemp) {
      const utilizationData = this.chart.data.datasets[0].data
      const temperatureData = this.chart.data.datasets[1].data

      // If maximum records have been reached, remove the first inserted record
      if (utilizationData.length >= this.maxRecords) {
        utilizationData.shift()
        temperatureData.shift()
      }

      // Pushing the new data values
      utilizationData.push({ x: currentTime, y: currentLoad.currentLoad })
      temperatureData.push({ x: currentTime, y: currentTemp.main })

      if (this.chart.data.labels) {
        const labelsData = this.chart.data.labels
        labelsData.length >= this.maxRecords && labelsData.shift()
        labelsData.push(currentTime)
      }

      this.chart.update('none')
    }
  }

  updateDatasetMaxRecords(max: number) {
    if (this.chart && this.chart.data && this.chart.data.labels) {
      const utilizationData = this.chart.data.datasets[0].data.slice(-max + 1)
      const temperatureData = this.chart.data.datasets[1].data.slice(-max + 1)
      const labelsData = this.chart.data.labels.slice(-max + 1)
      this.chart.data.datasets[0].data = utilizationData
      this.chart.data.datasets[1].data = temperatureData
      this.chart.data.labels = labelsData

      this.chart.update('none')
    }
  }

  ngAfterViewInit(): void {
    const ctx = this.cpuCanvasRef?.nativeElement.getContext('2d')
    const utilizationGradient = ctx?.createLinearGradient(0, 0, 0, 600)
    const temperatureGradient = ctx?.createLinearGradient(0, 0, 0, 600)

    if (ctx && utilizationGradient && temperatureGradient) {
      utilizationGradient.addColorStop(0.3, 'rgba(59, 130, 246, 0.7)')
      utilizationGradient.addColorStop(1, 'rgba(186, 230, 253, 0.3)')

      temperatureGradient.addColorStop(0.3, 'rgba(253, 224, 71, 0.3)')
      temperatureGradient.addColorStop(1, 'rgba(251, 146, 60, 0.7)')
    }

    this.cpuChartDatasets.datasets[0].backgroundColor = utilizationGradient
    this.cpuChartDatasets.datasets[1].backgroundColor = temperatureGradient
  }
}
