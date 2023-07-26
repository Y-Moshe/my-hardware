import { Component, Input, OnInit } from '@angular/core'
import { CommonModule, KeyValue } from '@angular/common'

@Component({
  selector: 'app-info-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-table.component.html',
})
export class InfoTableComponent implements OnInit {
  @Input() headers: string[] | null = null
  /** Required if headers passed to the component! */
  @Input() rows: (string | number)[][] | null = null
  @Input() informations: Record<string, string | number> = {}

  ngOnInit(): void {
    this.headers && this.headers.unshift('')
  }

  trackByIndex(
    index: number,
    item: KeyValue<string, string | number> | (string | number)[]
  ) {
    return index
  }

  sortBy() {
    return 0
  }
}
