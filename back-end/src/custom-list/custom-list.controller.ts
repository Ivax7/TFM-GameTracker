import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { CustomListsService } from './custom-list.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('custom-lists')
export class CustomListController {
  constructor(private customListsService: CustomListsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyLists(@Req() req) {
    return this.customListsService.getByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() data: { title: string; description?: string }) {
    return this.customListsService.create(req.user.userId, data);
  }
}
