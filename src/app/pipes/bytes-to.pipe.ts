import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'bytesTo',
  standalone: true,
})
export class BytesToPipe implements PipeTransform {
  transform(bytes?: number | null, to?: 'KB' | 'MB' | 'GB' | 'TB'): string {
    if (!bytes) return ''

    if (to) {
      switch (to) {
        case 'MB':
          return (bytes / 1048576).toFixed(2) + 'MB'
        case 'GB':
          return (bytes / 1073741824).toFixed(2) + 'GB'
        case 'TB':
          return (bytes / 1099511627776).toFixed(2) + 'TB'

        // KB
        default:
          return (bytes / 1024).toFixed(2) + 'KB'
      }
    }

    if (bytes > 0 && bytes <= 1048576) return (bytes / 1024).toFixed(2) + 'KB'
    else if (bytes > 1048576 && bytes <= 1073741824)
      return (bytes / 1048576).toFixed(2) + 'MB'
    else if (bytes > 1073741824 && bytes <= 1099511627776)
      return (bytes / 1073741824).toFixed(2) + 'GB'
    else return (bytes / 1099511627776).toFixed(2) + 'TB'
  }
}
