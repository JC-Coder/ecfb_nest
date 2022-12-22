import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { BotService } from "./bot.service";

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ BotService],
  exports: [BotService]
})
export class BotModule {}
