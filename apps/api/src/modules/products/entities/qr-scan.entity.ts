import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('qr_scans')
export class QRScan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  qrCode: string; // Scanned QR code data

  @Column({ nullable: true })
  userId: string; // User who scanned

  @Column()
  cityCode: string; // City where scan occurred

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  commissionAmount: number; // $0.20 per scan

  @Column({ default: false })
  processed: boolean; // Whether commission was processed

  @CreateDateColumn()
  createdAt: Date;
}
