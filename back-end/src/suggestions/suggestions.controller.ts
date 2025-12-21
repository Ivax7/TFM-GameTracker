import { Controller, Get, Post, Body } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { Suggestions } from './suggestions.entity';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Get()
  getAll(): Promise<Suggestions[]> {
    return this.suggestionsService.findAll();
  }

  @Post()
  create(@Body() suggestion: Partial<Suggestions>): Promise<Suggestions> {
    return this.suggestionsService.create(suggestion);
  }
}
