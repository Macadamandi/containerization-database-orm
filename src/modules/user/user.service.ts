import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(({ password: _, ...rest }) => rest);
  }

  findById(id: string): Omit<User, 'password'> {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const { password: _, ...rest } = user;
    return rest;
  }

  create(dto: CreateUserDto): Omit<User, 'password'> {
    const { login, password } = dto;

    if (this.users.find((user) => user.login === login)) {
      throw new BadRequestException(
        `User with login '${login}' already exists`,
      );
    }

    const user: User = {
      id: randomUUID(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(user);
    const { password: _, ...rest } = user;
    return rest;
  }

  updatePassword(id: string, dto: UpdatePasswordDto): Omit<User, 'password'> {
    const { oldPassword, newPassword } = dto;
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    if (user.password !== oldPassword)
      throw new ForbiddenException('Old password is incorrect');
    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    const { password: _, ...rest } = user;
    return rest;
  }

  deleteById(id: string): boolean {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users.splice(userIndex, 1);
    return true;
  }
}
