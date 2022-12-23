import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { HttpService } from "@nestjs/axios";
import { BotService } from "./bot/bot.service";
import axios, { Axios } from "axios";

dotenv.config();

@Injectable()
export class AppService {
  private PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  private VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  constructor(
    private httpService: HttpService,
    private botService: BotService
  ) {}

  /**
   * Get webhook
   */
  getWebhook(req: Request, res: Response) {
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
   * Post webhook
   */
  postWebhook(req: Request, res: Response) {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === "page") {
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach((entry) => {
        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log("Sender PSID: " + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          this.handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          this.handlePostback(sender_psid, webhook_event.postback);
        }
      });

      // Return a '200 OK' response to all events
      res.status(200).send("EVENT_RECEIVED");
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  }

  /**
   * Handles messages events
   * @param sender_psid
   * @param received_message
   */
  async handleMessage(sender_psid, received_message) {
    // handle quick replies
    if (
      received_message &&
      received_message.quick_reply &&
      received_message.quick_reply.payload
    ) {
      let payload = received_message.quick_reply.payload;

      if (payload === "PRODUCTS") {
        await this.botService.sendProducts(sender_psid);
      } else if (payload === "MY_CART") {
        await this.botService.getCart(sender_psid);
      } else if (payload === "CUSTOMER_SERVICE") {
        await this.botService.talkToCustomerService(sender_psid);
      }

      return;
    }
  }

  /**
   * Handles messaging_postbacks events
   * @param sender_psid
   * @param received_postback
   */
  async handlePostback(sender_psid, received_postback) {
    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    // Set the response based on the postback payload
    switch (payload) {
      case "GET_STARTED":
      case "RESTART_CONVERSATION":
        await this.botService.sendMessageWelcomeNewUser(sender_psid);
        break;
      case "PRODUCTS":
        await this.botService.sendProducts(sender_psid);
        break;
      case "CUSTOMER_SERVICE":
        await this.botService.talkToCustomerService(sender_psid);
        break;
      case "BACK_TO_CATEGORIES":
        await this.botService.sendProducts(sender_psid);
        break;
      case "MY_CART":
        await this.botService.getCart(sender_psid);
        break;
      case "ADD_CART":
        console.log("ADD CART PAYLOAD====================");
        console.log(received_postback);
        await this.botService.addItemToCart(sender_psid);
        break;
      case "BACK_TO_MAIN_MENU":
        await this.botService.backToMainMenu(sender_psid);
        break;
      case "CHECKOUT":
        await this.botService.checkout(sender_psid);
        break;

      default:
        console.log("run default switch case ");
    }
  }

  /**
   * Sends response messages via the Send API
   * @param sender_psid
   * @param response
   */
  callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
      recipient: {
        id: sender_psid,
      },
      message: response,
    };

    // send the HTTP request to the messenger platform
    this.httpService
      .post(
        `https://graph.facebook.com/v6.0/me/messages?access_token=${this.PAGE_ACCESS_TOKEN}`,
        request_body
      )
      .subscribe({
        complete: () => {
          console.log("message sent!");
        },
        error: (err) => {
          console.error("Unable to send message:" + err);
        },
      });
  }

  async handleSetupProfileAPI(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let url = `https://graph.facebook.com/v15.0/me/messenger_profile?access_token=${this.PAGE_ACCESS_TOKEN}`;

        // note if error , comment out the nested persisted menu

        let request_body = {
          get_started: { payload: "GET_STARTED" },
          persistent_menu: [
            {
              locale: "default",
              composer_input_disabled: false,
              call_to_actions: [
                {
                  type: "postback",
                  title: "Browse Products",
                  payload: "PRODUCTS",
                },
                {
                  type: "postback",
                  title: "Talk to customer service",
                  payload: "CUSTOMER_SERVICE",
                },
                {
                  type: "postback",
                  title: "Restart conversation",
                  payload: "RESTART_CONVERSATION",
                },
                {
                  type: "web_url",
                  title: "Visit developer",
                  url: "https://jc-coder.vercel.app/",
                  webview_height_ratio: "full",
                },
              ],
            },
          ],
          whitelisted_domains: ["https://ecfb-nest-jc.adaptable.app"],
        };

        // send the HTTP request to the messenger platform
        this.httpService.post(url, request_body).subscribe({
          complete: () => {
            resolve("Done");
          },
          error: (err) => {
            reject("Unable to send message:" + err);
          },
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
