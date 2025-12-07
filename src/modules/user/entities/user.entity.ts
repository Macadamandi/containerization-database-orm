import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ValueTransformer,
} from 'typeorm';

const BigIntTransformer: ValueTransformer = {
  to: (value: number | null) =>
    value !== null && value !== undefined ? value.toString() : value,
  from: (value: string | number | null) =>
    value !== null && value !== undefined ? Number(value) : value,
};

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ type: 'int' })
  version: number;

  @Column({ type: 'bigint', transformer: BigIntTransformer })
  createdAt: number;

  @Column({ type: 'bigint', transformer: BigIntTransformer })
  updatedAt: number;
}
