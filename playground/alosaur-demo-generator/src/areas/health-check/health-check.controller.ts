import { Controller, Get, Content } from 'alosaur/mod.ts';
@Controller('/health')
export class HealthCheckController {
  @Get()
  check() {
    return Content('OK', 200);
  }
}
