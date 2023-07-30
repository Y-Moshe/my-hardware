import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CpuPageComponent } from '../cpu-page/cpu-page.component'
import { MemoryPageComponent } from '../memory-page/memory-page.component'
import { DiskPageComponent } from '../disk-page/disk-page.component'

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    CpuPageComponent,
    MemoryPageComponent,
    DiskPageComponent,
  ],
  templateUrl: './home-page.component.html',
  host: {
    class: 'main-layout full',
  },
})
export class HomePageComponent {}
