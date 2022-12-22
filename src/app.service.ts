import { Injectable } from '@nestjs/common';
import request from 'request';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AppService {
    private PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;


    async handleSetupProfileAPI(): Promise<any>{
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
              whitelisted_domains: ["https://ecfb.adaptable.app"],
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
      };
}
