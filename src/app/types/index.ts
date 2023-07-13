import { Systeminformation as SI } from 'systeminformation'

export interface HardwareStatus {
  cpuCurrentLoad: SI.CurrentLoadData
  cpuCurrentSpeed: SI.CpuCurrentSpeedData
  cpuTemperature: SI.CpuTemperatureData
  memCurrentLoad: SI.MemData
  disksIO: SI.DisksIoData
  fsSize: SI.FsSizeData[]
}

export type CpuStatus = {
  load: HardwareStatus['cpuCurrentLoad']
  speed: HardwareStatus['cpuCurrentSpeed']
  temperature: HardwareStatus['cpuTemperature']
}
export type MemStatus = HardwareStatus['memCurrentLoad']
export type DiskStatus = Pick<HardwareStatus, 'disksIO' | 'fsSize'>

export interface HardwareServiceSettings {
  refreshRate: number
  maxRecords: number
  randomizeCpuTemperature: boolean
}
