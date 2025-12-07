import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

type PublicUser = Omit<User, 'password'>;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private mapUser(user: User): PublicUser {
    return {
      id: user.id,
      login: user.login,
      version: Number(user.version),
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }

  async findAll(): Promise<PublicUser[]> {
    const users = await this.userRepository.find();
    return users.map((u) => this.mapUser(u));
  }

  async findById(id: string): Promise<PublicUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return this.mapUser(user);
  }

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const existing = await this.userRepository.findOne({
      where: { login: dto.login },
    });
    if (existing)
      throw new BadRequestException(
        `User with login '${dto.login}' already exists`,
      );

    const now = Date.now();
    const user = this.userRepository.create({
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.userRepository.save(user);
    return this.mapUser(saved);
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<PublicUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    if (user.password !== dto.oldPassword)
      throw new ForbiddenException('Old password is incorrect');

    user.password = dto.newPassword;
    user.version = Number(user.version) + 1;
    user.updatedAt = Date.now();

    const saved = await this.userRepository.save(user);
    return this.mapUser(saved);
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    const affected = (result as { affected?: number | string }).affected;
    const affectedNum = Number(affected ?? 0);
    if (Number.isNaN(affectedNum) || affectedNum === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
