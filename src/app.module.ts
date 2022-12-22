import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BotModule } from "./bot/bot.module";
import { BotService } from "./bot/bot.service";

@Module({
  imports: [HttpModule, BotModule],
  controllers: [AppController],
  providers: [AppService, BotService],
  exports: [AppService]
})
export class AppModule {}
