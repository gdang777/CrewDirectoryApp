import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('prices')
@Index(['productId', 'cityCode', 'createdAt'])
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.prices)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column()
  cityCode: string; // IATA city code

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string; // USD, EUR, etc.

  @Column({ nullable: true })
  store: string; // Store name or identifier

  @Column({ nullable: true })
  url: string; // Product URL

  @CreateDateColumn()
  createdAt: Date;
}
