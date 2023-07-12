import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'

import { AppFooterComponent, AppHeaderComponent } from '@/components'
import { HardwareService } from '@/services/hardware.service'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, AppHeaderComponent, AppFooterComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly _hwService = inject(HardwareService)

  ngOnInit(): void {
    this._hwService.startService(1000)
  }
}
