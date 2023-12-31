import { importProvidersFrom } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { ElectronService } from 'ngx-electron'

import { AppComponent } from './app/app.component'
import { appRoutes } from './app/app-routes'

bootstrapApplication(AppComponent, {
  providers: [
    ElectronService,
    provideRouter(appRoutes),
    provideAnimations(),
    // importProvidersFrom
  ],
}).catch((err) => console.error(err))
