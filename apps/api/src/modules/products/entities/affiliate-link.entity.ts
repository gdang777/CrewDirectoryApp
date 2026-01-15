import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('affiliate_links')
export class AffiliateLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.affiliateLinks)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column()
  url: string; // Deep link URL

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  commissionPercent: number; // 5-8% affiliate commission

  @Column({ default: 0 })
  clickCount: number;

  @Column({ default: 0 })
  purchaseCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
