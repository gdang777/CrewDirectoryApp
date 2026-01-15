import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Price } from './price.entity';
import { AffiliateLink } from './affiliate-link.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  sku: string; // Stock Keeping Unit

  @Column()
  category: string; // chocolate, cosmetics, spirits, etc.

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>; // Additional product data

  @OneToMany(() => Price, (price) => price.product)
  prices: Price[];

  @OneToMany(() => AffiliateLink, (link) => link.product)
  affiliateLinks: AffiliateLink[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
