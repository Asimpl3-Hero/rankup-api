import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { VideosModule } from './videos/videos.module';

@Module({
  controllers: [AppController],
  imports: [VideosModule],
})
export class AppModule {}
