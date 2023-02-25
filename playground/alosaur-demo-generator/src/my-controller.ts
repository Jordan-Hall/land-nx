import { Controller, Get, Content } from 'alosaur/mod.ts';

@Controller()
export class MyControllerController {
  @Get()
  check() {
    return Content('OK', 200);
  }
}
