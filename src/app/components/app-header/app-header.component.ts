import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import {
  bootstrapCpu,
  bootstrapThreeDotsVertical,
} from '@ng-icons/bootstrap-icons'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent],
  templateUrl: './app-header.component.html',
  viewProviders: [provideIcons({ bootstrapCpu, bootstrapThreeDotsVertical })],
})
export class AppHeaderComponent {}
