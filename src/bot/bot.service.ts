import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { TemplateMessage } from "../templates/template";

dotenv.config();

@Injectable()
export class BotService {
  private PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  constructor(
    private httpService: HttpService
  ) {}

    /**
   * Get username of user
   */
    async getFacebookUsername(sender_psid) {
      return new Promise(async (resolve, reject) => {
        try {
          let url = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${this.PAGE_ACCESS_TOKEN}`;
          const res = await this.httpService.get(url).toPromise();
          const body = res.data;
          let username = `${body.last_name} ${body.first_name}`;
          resolve(username);
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * send welcome message
     * @param sender_psid 
     * @returns 
     */
  async sendMessageWelcomeNewUser(sender_psid) {
    return new Promise(async (resolve, reject) => {
      try {
        let username = await this.getFacebookUsername(sender_psid);

        // send text message
        let response1 = {
          text: `Hi ${username}! Welcome to our online store. Jc store is your no 1 store to get quality products`,
        };

        // send an image
        let response2 = {
          attachment: {
            type: "image",
            payload: {
              url: "https://iili.io/HzmOQn9.png",
            },
          },
        };

        let response3 = {
          text: "We have lots of amazing products in store for you",
        };

        //send a quick reply
        let response4 = {
          text: "Kindly navigate our store with the menu below",
          quick_replies: [
            {
              content_type: "text",
              title: "Browse Products",
              payload: "PRODUCTS",
            },
            {
              content_type: "text",
              title: "My cart",
              payload: "MY_CART",
            },
            {
              content_type: "text",
              title: "Talk with customer service",
              payload: "TALK_AGENT",
            },
          ],
        };

        await this.sendMessage(sender_psid, response1);
        await this.sendMessage(sender_psid, response2);
        await this.sendMessage(sender_psid, response3);
        await this.sendMessage(sender_psid, response4);
        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  }


  /**
   * Send message function 
   * @param sender_psid 
   * @param response 
   * @returns 
   */
  async sendMessage(sender_psid, response) {
    return new Promise(async (resolve, reject) => {
      try {
        //mark message as read
        await this.markMessageRead(sender_psid);
        await this.sendTypingOn(sender_psid);

        // Construct the message body
        let request_body = {
          recipient: {
            id: sender_psid,
          },
          message: response,
        };

        // Send the HTTP request to the Messenger Platform
        this.httpService
          .post( `https://graph.facebook.com/v6.0/me/messages?access_token=${this.PAGE_ACCESS_TOKEN}`, request_body)
          .subscribe({
            complete: () => {
              resolve("done");
            },
            error: (err) => {
              reject(err);
            },
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  requestTalkToAgent(sender_psid) {
    return new Promise((resolve, reject) => {
      try {
        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  }

  sendProducts(sender_psid) {
    return new Promise(async (resolve, reject) => {
      try {
        // send a generic messagee
        let response = TemplateMessage.sendProductsTemplate();

        await this.sendMessage(sender_psid, response);
        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  }

  sendLookupOrder(sender_psid) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = TemplateMessage.sendLookupOrderTemplate();
        await this.sendMessage(sender_psid, response);
        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  }

  setInfoOrderByWebView(sender_psid) {
    return new Promise((resolve, reject) => {
      try {
        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  }

  backToMainMenu(sender_psid) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = TemplateMessage.backToMainMenuTemplate();
        await this.sendMessage(sender_psid, response);

        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  }



 

  /**
   * Typing request
   * @param sender_psid
   * @returns
   */

  sendTypingOn(sender_psid) {
    return new Promise((resolve, reject) => {
      try {
        let request_body = {
          recipient: {
            id: sender_psid,
          },
          sender_action: "typing_on",
        };

        let url = `https://graph.facebook.com/v6.0/me/messages?access_token=${this.PAGE_ACCESS_TOKEN}`;

        this.httpService.post(url, request_body).subscribe({
          complete() {
            resolve("done");
          },
          error(err) {
            reject(err);
          },
        });
      } catch (e) {
        reject(e);
      }
    });
  }


  /**
   * mark message as read
   * @param sender_psid 
   * @returns 
   */
  markMessageRead(sender_psid: any) {
    return new Promise((resolve, reject) => {
      try {
        let request_body = {
          recipient: {
            id: sender_psid,
          },
          sender_action: "mark_seen",
        };

        let url = `https://graph.facebook.com/v6.0/me/messages?access_token=${this.PAGE_ACCESS_TOKEN}`;

        this.httpService.post(url, request_body).subscribe({
          complete() {
            resolve("done");
          },
          error(err) {
            reject(err);
          },
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
