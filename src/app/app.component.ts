import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpuService } from '@/services/cpu.service';
import { Systeminformation as SI } from 'systeminformation';
import { CpuStatus } from '@/types';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule],
})
export class AppComponent {
  cpuData = computed<SI.CpuData | null>(() => this._cpuService.cpuData());
  cpuStatus = computed<CpuStatus | null>(() => this._cpuService.cpuStatus());

  constructor(private readonly _cpuService: CpuService) {
    this._cpuService.startService(1000);
    effect(() => console.log(this.cpuStatus()));
  }
}
