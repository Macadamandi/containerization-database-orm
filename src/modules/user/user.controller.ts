import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
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
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid user id');
    return this.userService.findById(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Put(':id')
  @HttpCode(200)
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    if (!isUUID(id)) throw new BadRequestException('Invalid user id');
    return this.userService.updatePassword(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteById(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid user id');
    await this.userService.deleteById(id);
  }
}
