import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Systeminformation as SI } from 'systeminformation'
import { BytesToPipe } from '@/pipes/bytes-to.pipe'

@Component({
  selector: 'app-disk-drive-preview',
  standalone: true,
  imports: [CommonModule, BytesToPipe],
  templateUrl: './disk-drive-preview.component.html',
})
export class DiskDrivePreviewComponent {
  @Input({ required: true }) diskLayoutData!: SI.DiskLayoutData
  @Input({ required: true }) index!: number
  @Input() selectedIndex: number | null = null

  @Output() onClick = new EventEmitter<number>()

  get selectedClass() {
    return {
      selected: this.index === this.selectedIndex,
    }
  }
  get driveTypeClass() {
    const regex = new RegExp('(ssd|nvme)', 'gi')
    return {
      'bg-ssd-drive': regex.test(this.diskLayoutData.type),
      'bg-hdd-drive': !regex.test(this.diskLayoutData.type),
    }
  }
}
