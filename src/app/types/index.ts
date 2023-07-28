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

export interface CpuCoreStatus {
  load: number
  speed: number
  temperature: number
}

export interface MemSlotData {
  Size: string
  Slot: string
  Type: string
  'Clock Speed': string
  'Form Factor': string
  Manufacturer: string
  'Part Number': string
  'Serial Number': string
  'Configured Voltage': string
}

export type AppTheme = 'light' | 'dark'

export interface HardwareServiceSettings {
  refreshRate: number
  maxRecords: number
  theme: AppTheme
}
