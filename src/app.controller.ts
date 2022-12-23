import { Controller, Get, Param, Post, Render, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AppService } from "./app.service";
import * as dotenv from "dotenv";

dotenv.config();

@Controller("")
export class AppController {
  constructor(private appService: AppService) {}

  /**
   * homepage
   */
  @Get()
  @Render("homepage.ejs")
  homepage() {
    return;
  }

  /**
   * Get Webhook
   * @param req
   * @param res
   */
  @Get("/webhook")
  getWebhook(@Req() req: Request, @Res() res: Response): any {
    return this.appService.getWebhook(req, res);
  }

  /**
   * Post Webhook
   * @param req
   * @param res
   */
  @Post("/webhook")
  postWebhook(@Req() req: Request, @Res() res: Response): any {
    return this.appService.postWebhook(req, res);
  }

  @Post("/set-profile")
  async handleSetupProfile(@Req() req: Request, @Res() res: Response) {
    try {
      await this.appService.handleSetupProfileAPI();
      return res.redirect("/");
    } catch (e) {
      console.log(e);
    }
  }

  @Get("/set-profile")
  @Render("profile.ejs")
  getSetupProfilePage(@Req() req: Request, @Res() res: Response) {
    return;
  }
}
