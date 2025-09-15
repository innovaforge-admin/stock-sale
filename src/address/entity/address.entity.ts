import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../client/entity/client.entity';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @Column({ type: 'varchar', length: 80, nullable: true })
  label: string; // Home, Office, etc.

  @Column({ type: 'varchar', length: 180, nullable: false })
  street: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  number: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  floorApt: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  province: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  postalCode: string;

  @Column({ type: 'varchar', length: 80, nullable: false, default: 'AR' })
  country: string;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relation with Client
  @ManyToOne(() => Client, (client) => client.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;
}
