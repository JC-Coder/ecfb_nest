import { Injectable } from "@nestjs/common";
import request from "request";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class AppService {
  private PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  /**
   * Handles messages events
   * @param sender_psid
   * @param received_message
   */
  public handleMessage(sender_psid, received_message): any {
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
  public async handlePostback(sender_psid, received_postback) {
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
  public callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
      recipient: {
        id: sender_psid,
      },
      message: response,
    };

    // Send the HTTP request to the Messenger Platform
    request(
      {
        uri: "https://graph.facebook.com/v6.0/me/messages",
        qs: { access_token: this.PAGE_ACCESS_TOKEN },
        method: "POST",
        json: request_body,
      },
      (err, res, body) => {
        if (!err) {
          console.log("message sent!");
        } else {
          console.error("Unable to send message:" + err);
        }
      }
    );
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

        // Send the HTTP request to the Messenger Platform
        request(
          {
            uri: url,
            method: "POST",
            json: request_body,
          },
          (err, res, body) => {
            if (!err) {
              resolve("Done");
            } else {
              reject("Unable to send message:" + err);
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }
}
