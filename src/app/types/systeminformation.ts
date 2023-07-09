import { Systeminformation } from 'systeminformation'

export interface CpuStatus {
  temperature: Systeminformation.CpuTemperatureData
  speed: Systeminformation.CpuCurrentSpeedData
  load: Systeminformation.CurrentLoadData
}

export interface DisksStatus {
  disksIO: Systeminformation.DisksIoData
  disksUsage: Systeminformation.FsSizeData
}
