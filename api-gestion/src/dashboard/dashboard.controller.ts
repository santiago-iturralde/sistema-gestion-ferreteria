import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get() // GET localhost:3000/dashboard
  getResumen() {
    return this.dashboardService.getResumen();
  }
}