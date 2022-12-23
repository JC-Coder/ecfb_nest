import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { TemplateMessage } from "../templates/template";

dotenv.config();

@Injectable()
export class BotService {
  private PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  private carts = [];

  constructor(private httpService: HttpService) {}

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
              payload: "CUSTOMER_SERVICE",
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
          .post(
            `https://graph.facebook.com/v6.0/me/messages?access_token=${this.PAGE_ACCESS_TOKEN}`,
            request_body
          )
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

  /**
   * Function to hand over to customer service .
   * @param sender_psid
   * @returns
   */
  talkToCustomerService(sender_psid) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {
          text: "Thanks for visiting us. you're now being transferred to a customer service agent. kindly leave your message. If you need to browse shop again kinly restart this conversation using the menu",
        };

        await this.sendMessage(sender_psid, response);
        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Send products
   * @param sender_psid
   * @returns
   */
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

  /**
   * Main menu
   * @param sender_psid
   * @returns
   */
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

  /**
   * Add cart item
   */
  async addItemToCart(sender_psid, payload?: any) {
    let userCart = this.carts.find((item) => item.userId === sender_psid);

    if (!userCart) {
      this.carts.push({
        userId: sender_psid,
        products: [{ name: "test", qty: 1 }],
      });
    }

    let response = {
      template_type: "button",
      text: "Item added to cart successfully",
      buttons: [
        {
          type: "postback",
          title: "View cart",
          payload: "MY_CART",
        },
        {
          type: "postback",
          title: "Continue shopping",
          payload: "PRODUCTS",
        },
      ],
    };

    return new Promise(async (resolve, reject) => {
      try {
        await this.sendMessage(sender_psid, response);
        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Send user cart
   */
  getCart(sender_psid: any) {
    // cart schema
    let cartSchemaSample = [
      {
        userId: "idjdafj",
        products: [{ name: "pq", qty: 1 }],
      },
    ];

    let userCart = this.carts.find((item) => item.userId === sender_psid);

    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "receipt",
          recipient_name: "Stephane Crozatier",
          order_number: "12345678902",
          currency: "USD",
          payment_method: "Visa 2345",
          order_url: "http://originalcoastclothing.com/order?order_id=123456",
          timestamp: "1428444852",
          address: {
            street_1: "1 Hacker Way",
            street_2: "",
            city: "Menlo Park",
            postal_code: "94025",
            state: "CA",
            country: "US",
          },
          summary: {
            subtotal: 75.0,
            shipping_cost: 4.95,
            total_tax: 6.19,
            total_cost: 56.14,
          },
          adjustments: [
            {
              name: "New Customer Discount",
              amount: 20,
            },
            {
              name: "$10 Off Coupon",
              amount: 10,
            },
          ],
          elements: [
            {
              title: "Classic White T-Shirt",
              subtitle: "100% Soft and Luxurious Cotton",
              quantity: 2,
              price: 50,
              currency: "USD",
              image_url: "http://originalcoastclothing.com/img/whiteshirt.png",
            },
            {
              title: "Classic Gray T-Shirt",
              subtitle: "100% Soft and Luxurious Cotton",
              quantity: 1,
              price: 25,
              currency: "USD",
              image_url: "http://originalcoastclothing.com/img/grayshirt.png",
            },
          ],
        },
      },
    };

    return new Promise(async (resolve, reject) => {
      try {
        await this.sendMessage(sender_psid, response);
        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  }
}
