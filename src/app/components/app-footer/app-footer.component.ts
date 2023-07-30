import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HardwareService } from '@/services/hardware.service'

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-footer.component.html',
})
export class AppFooterComponent {
  private readonly _hwService = inject(HardwareService)

  openLinkedIn(e: MouseEvent) {
    e.preventDefault()
    this._hwService.openLinkedIn()
  }
}
