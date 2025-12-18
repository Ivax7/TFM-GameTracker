import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/games/toggle')
  toggleGame(
    @Req() req,
    @Param('id') listId: number,
    @Body() game: any
  ) {
    return this.customListsService.toggleGame(
      req.user.userId,
      listId,
      game
    );
  }

  // Get custom-list-detail
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(
    @Param('id') id: string,
    @Req() req
  ) {
    return this.customListsService.getListById(
      Number(id),
      req.user.id
    );
  }
}
