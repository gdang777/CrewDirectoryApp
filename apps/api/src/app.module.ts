import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { PlaybooksModule } from './modules/playbooks/playbooks.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { ChatModule } from './modules/chat/chat.module';
import { CrewMatchModule } from './modules/crew-match/crew-match.module';
import { AudioWalksModule } from './modules/audio-walks/audio-walks.module';
import { AdminModule } from './modules/admin/admin.module';
import { UsersModule } from './modules/users/users.module';
import { PlacesModule } from './modules/places/places.module';
import { UploadModule } from './modules/upload/upload.module';
import { AiModule } from './modules/ai/ai.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { GigsModule } from './modules/gigs/gigs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    PlaybooksModule,
    ProductsModule,
    CrewMatchModule,
    AudioWalksModule,
    AdminModule,
    UsersModule,
    PlacesModule,
    ChatModule,
    UploadModule,
    AiModule,
    RecommendationsModule,
    GigsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
