import { Routes } from '@angular/router'

import { HomePageComponent } from './pages/home/home-page.component'
import { CpuPageComponent } from './pages/cpu-page/cpu-page.component'
import { MemoryPageComponent } from './pages/memory-page/memory-page.component'
import { DiskPageComponent } from './pages/disk-page/disk-page.component'

export const appRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    pathMatch: 'full',
  },
  {
    path: 'cpu',
    component: CpuPageComponent,
  },
  {
    path: 'memory',
    component: MemoryPageComponent,
  },
  {
    path: 'disk',
    component: DiskPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
]
