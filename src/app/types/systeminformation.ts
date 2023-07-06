import { Systeminformation } from 'systeminformation';

export interface CpuStatus {
  temperature: Systeminformation.CpuTemperatureData;
  speed: Systeminformation.CpuCurrentSpeedData;
}
