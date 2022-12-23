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
    console.log("CHECK 1")
    return new Promise(async (resolve, reject) => {
      try {
        let username = await this.getFacebookUsername(sender_psid);

        // send text message
        let response1 = {
          text: `Hi ${username} Welcome to tech shop , where you will find what you need`,
        };

        // send an image
        let response2 = {
          attachment: {
            type: "image",
            payload: {
              url: "https://iili.io/HzPOyoQ.jpg",
            },
          },
        };

        let response3 = {
          text: "At any time, use the menu below to navigate through the features",
        };

        //send a quick reply
        let response4 = {
          text: "What can i do to help you today ",
          quick_replies: [
            {
              content_type: "text",
              title: "Categories",
              payload: "CATEGORIES",
            },
            {
              content_type: "text",
              title: "Lookup Order",
              payload: "LOOKUP_ORDER",
            },
            {
              content_type: "text",
              title: "Talk to an agent",
              payload: "TALK_AGENT",
            },
          ],
        };

        console.log("CHECK 2")

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

  async sendMessage(sender_psid, response) {
    console.log("CHECK 3")
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

  sendCategories(sender_psid) {
    return new Promise(async (resolve, reject) => {
      try {
        // send a generic messagee
        let response = TemplateMessage.sendCategoriesTemplate();

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

  showHeadphones(sender_psid) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = TemplateMessage.sendHeadphonesTemplate();
        await this.sendMessage(sender_psid, response);
        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  }

  showTvs(sender_psid) {
    return new Promise((resolve, reject) => {
      try {
        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  }

  showPlaystations(sender_psid) {
    return new Promise((resolve, reject) => {
      try {
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
