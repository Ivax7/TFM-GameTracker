import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suggestions } from './suggestions.entity';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectRepository(Suggestions)
    private readonly suggestionRepo: Repository<Suggestions>,
  ) {}

  // Obtener todas las sugerencias
  findAll(): Promise<Suggestions[]> {
    return this.suggestionRepo.find({
      order: { date: 'DESC' },
    });
  }

  // Crear una nueva sugerencia
  create(suggestion: Partial<Suggestions>): Promise<Suggestions> {
    const newSuggestion = this.suggestionRepo.create({
      ...suggestion,
      date: new Date(),
    });
    return this.suggestionRepo.save(newSuggestion);
  }
}
