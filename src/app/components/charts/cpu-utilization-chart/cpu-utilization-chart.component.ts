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
        borderColor: 'rgba(59, 130, 246, 1)',
        pointBackgroundColor: 'rgba(148, 159, 177, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148, 159, 177, 0.8)',
        fill: true,
      },
      {
        data: [],
        label: 'Temperature',
        borderColor: 'rgba(251, 146, 60, 1)',
        pointBackgroundColor: 'rgba(148, 159, 177, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148, 159, 177, 0.8)',
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
          stepSize: 25,
          callback: (value) => (value ? value + '%' : ''),
        },
      },
      tempYAxis: {
        position: 'left',
        min: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 25,
          color(ctx) {
            switch (ctx.tick.value) {
              case 0:
                return colors.slate[500]
              case 25:
                return colors.green[600]
              case 50:
                return colors.yellow[600]
              case 75:
                return colors.orange[600]
              default:
                return colors.red[600]
            }
          },
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

  @Input() maxRecords: number = 60
  @Input() randomizeCpuTemperature: boolean = false
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
  }

  updateDatasets(
    currentLoad: SI.CurrentLoadData | null | undefined,
    currentTemp: SI.CpuTemperatureData | null | undefined
  ) {
    const currentTime = Date.now()

    if (this.chart && this.chart.data && currentLoad && currentTemp) {
      // Getting the last `maxRecords` value
      const records = this.maxRecords - 1
      const utilizationData = this.chart.data.datasets[0].data.slice(-records)
      const temperatureData = this.chart.data.datasets[1].data.slice(-records)

      // Pushing the new values to round to the `maxRecords` value
      utilizationData.push({ x: currentTime, y: currentLoad.currentLoad })
      temperatureData.push({
        x: currentTime,
        // Use randomizeCpuTemperature in case the temperatures are not available and only if enabled (for demo purposes)
        y: this.randomizeCpuTemperature
          ? Math.random() * 100
          : currentTemp.main,
      })

      // Updating the data sources
      this.chart.data.datasets[0].data = utilizationData
      this.chart.data.datasets[1].data = temperatureData

      if (this.chart.data.labels) {
        const labelsData = this.chart.data.labels.slice(-records)
        labelsData.push(currentTime)
        this.chart.data.labels = labelsData
      }

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
