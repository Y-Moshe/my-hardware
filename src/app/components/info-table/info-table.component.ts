import { Component, Input } from '@angular/core'
import { CommonModule, KeyValue } from '@angular/common'

@Component({
  selector: 'app-info-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-table.component.html',
})
export class InfoTableComponent {
  @Input() informations: Record<string, string | number> = {}

  trackByIndex(index: number, item: KeyValue<string, string | number>) {
    return index
  }

  sortBy() {
    return 0
  }
}
