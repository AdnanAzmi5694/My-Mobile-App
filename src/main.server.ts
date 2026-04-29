import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { environment } from './environments/environment';

if (environment.production) {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
}

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
