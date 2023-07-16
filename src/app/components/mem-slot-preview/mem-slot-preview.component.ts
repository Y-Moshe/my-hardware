import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MemSlotData } from '@/types'

@Component({
  selector: 'app-mem-slot-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mem-slot-preview.component.html',
})
export class MemSlotPreviewComponent {
  @Input({ required: true }) memData!: MemSlotData
  @Input({ required: true }) index!: number
  @Input() selectedIndex: number | null = null

  @Output() onClick = new EventEmitter<number>()

  get selectedClass() {
    this.memData['Configured Voltage']
    return {
      selected: this.index === this.selectedIndex,
    }
  }

  get topLeftLabel() {
    return this.memData.Slot
  }
  get topRightLabel() {
    return `${this.memData.Type} ${this.memData.Size}`
  }
  get bottomLeftLabel() {
    return `${this.memData['Form Factor']} ${this.memData.Manufacturer}`
  }
  get bottomRightLabel() {
    return (
      this.memData['Part Number'] +
      this.memData['Serial Number'] +
      this.memData['Configured Voltage']
    )
  }
}
