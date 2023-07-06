import { Routes } from '@angular/router';

import { GeneralPageComponent } from './pages/general-page/general-page.component';
import { CpuPageComponent } from './pages/cpu-page/cpu-page.component';
import { RamPageComponent } from './pages/ram-page/ram-page.component';
import { DiskPageComponent } from './pages/disk-page/disk-page.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: GeneralPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'cpu',
    component: CpuPageComponent,
  },
  {
    path: 'ram',
    component: RamPageComponent,
  },
  {
    path: 'disk',
    component: DiskPageComponent,
  },
];
