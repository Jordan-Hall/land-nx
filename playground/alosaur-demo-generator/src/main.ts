import { App } from 'alosaur/mod.ts';
import { HealthCheckArea } from './areas/health-check/health-check.area.ts';

const app = new App({
  areas: [HealthCheckArea],
});

app.listen();
