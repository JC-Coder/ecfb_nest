import { Injectable } from "@nestjs/common";
import request from "request";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { HttpService } from "@nestjs/axios";

dotenv.config();

@Injectable()
export class AppService {
  private PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  private VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  constructor(private httpService: HttpService) {}

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
          console.log("message");
          this.handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          console.log("postback");
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
  handleMessage(sender_psid, received_message): any {
    let response;

    // Check if the message contains text
    if (received_message.text) {
      // Create the payload for a basic text message
      response = {
        text: `You sent the message: "${received_message.text}". Now send me an image!`,
      };
    } else if (received_message.attachments) {
      // Get the URL of the message attachment
      let attachment_url = received_message.attachments[0].payload.url;
      response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "Is this the right picture?",
                subtitle: "Tap a button to answer.",
                image_url: attachment_url,
                buttons: [
                  {
                    type: "postback",
                    title: "Yes!",
                    payload: "yes",
                  },
                  {
                    type: "postback",
                    title: "No!",
                    payload: "no",
                  },
                ],
              },
            ],
          },
        },
      };
    }

    // Sends the response message
    this.callSendAPI(sender_psid, response);
  }

  /**
   * Handles messaging_postbacks events
   * @param sender_psid
   * @param received_postback
   */
  async handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    switch (payload) {
      case "yes":
        response = { text: "Thanks!" };
        break;
      case "no":
        response = { text: "Oops, try sending another image." };
        break;
      case "GET_STARTED":
        //   let username = await homepageService.getFacebookUsername(sender_psid);
        //   response = {text: `Hi there. Welcome ${username} to my tech shop`}
        break;
    }

    // Send the message to acknowledge the postback
    this.callSendAPI(sender_psid, response);
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
      .post("https://graph.facebook.com/v6.0/me/messages?access_token=${this.PAGE_ACCESS_TOKEN}", request_body)
      .subscribe({
        complete: () => {
          console.log("message sent!");
        },
        error: (err) => {
          console.error("Unable to send message:" + err);
        },
      });

    // // Send the HTTP request to the Messenger Platform
    // request(
    //   {
    //     uri: "https://graph.facebook.com/v6.0/me/messages",
    //     qs: { access_token: this.PAGE_ACCESS_TOKEN },
    //     method: "POST",
    //     json: request_body,
    //   },
    //   (err, res, body) => {
    //     if (!err) {
    //       console.log("message sent!");
    //     } else {
    //       console.error("Unable to send message:" + err);
    //     }
    //   }
    // );
  }

  async handleSetupProfileAPI(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let url = `https://graph.facebook.com/v15.0/me/messenger_profile?access_token=${this.PAGE_ACCESS_TOKEN}`;

        let request_body = {
          get_started: { payload: "GET_STARTED" },
          persistent_menu: [
            {
              locale: "default",
              composer_input_disabled: false,
              call_to_actions: [
                {
                  type: "postback",
                  title: "Talk to an agent",
                  payload: "CARE_HELP",
                },
                {
                  type: "postback",
                  title: "Outfit suggestions",
                  payload: "CURATION",
                },
                {
                  type: "web_url",
                  title: "Shop now",
                  url: "https://www.originalcoastclothing.com/",
                  webview_height_ratio: "full",
                },
              ],
            },
          ],
          whitelisted_domains: ["https://ecfb-nest-jc.adaptable.app"],
        };

        // send the HTTP request to the messenger platform
        this.httpService
          .post(url, request_body)
          .subscribe({
            complete: () => {
                resolve("Done");
            },
            error: (err) => {
                reject("Unable to send message:" + err);
            },
          });

        // Send the HTTP request to the Messenger Platform
        // request(
        //   {
        //     uri: url,
        //     method: "POST",
        //     json: request_body,
        //   },
        //   (err, res, body) => {
        //     if (!err) {
        //       resolve("Done");
        //     } else {
        //       reject("Unable to send message:" + err);
        //     }
        //   }
        // );
      } catch (e) {
        reject(e);
      }
    });
  }
}
