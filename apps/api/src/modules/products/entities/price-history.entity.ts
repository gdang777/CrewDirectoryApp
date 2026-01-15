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

@Entity('price_history')
@Index(['productId', 'cityCode', 'createdAt'])
export class PriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column()
  cityCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  homeBaseAmount: number; // Price at crew's home base

  @Column({ nullable: true })
  homeBaseCurrency: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  priceDeltaPercent: number; // Percentage difference vs home base

  @CreateDateColumn()
  createdAt: Date;
}
