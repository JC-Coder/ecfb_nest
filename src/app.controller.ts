import { Controller, Get, Param, Post, Render, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AppService } from "./app.service";
import request from "request";
import * as dotenv from "dotenv";

dotenv.config();

@Controller("")
export class AppController {
  private VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  private PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

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
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
      // Check the mode and token sent is correct
      if (mode === "subscribe" && token === this.VERIFY_TOKEN) {
        // Respond with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  }

  /**
   * Post Webhook
   * @param req
   * @param res
   */
  @Post("/webhook")
  postWebhook(@Req() req: Request, @Res() res: Response): any {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === "page") {
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function (entry) {
        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log("Sender PSID: " + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          this.appService.handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          this.appService.handlePostback(sender_psid, webhook_event.postback);
        }
      });

      // Return a '200 OK' response to all events
      res.status(200).send("EVENT_RECEIVED");
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
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
