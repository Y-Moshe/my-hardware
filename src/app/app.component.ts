import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'

import { AppFooterComponent, AppHeaderComponent } from '@/components'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, AppHeaderComponent, AppFooterComponent, RouterOutlet],
})
export class AppComponent {}
