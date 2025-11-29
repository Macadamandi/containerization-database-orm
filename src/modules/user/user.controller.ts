import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate as isUUID } from 'uuid';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid user id');
    const user = this.userService.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Put(':id')
  updatePassword(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    if (!isUUID(id)) throw new BadRequestException('Invalid user id');
    try {
      return this.userService.updatePassword(id, dto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw error;
    }
  }
  @Delete(':id')
  @HttpCode(204)
  deleteById(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid user id');
    this.userService.deleteById(id);
  }
}
