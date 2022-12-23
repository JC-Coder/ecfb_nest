export const TemplateMessage = {
  sendProductsTemplate: () => {
    return {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Headphones",
              image_url: "https://bit.ly/imageHeadphones",
              subtitle: "Bose Noise Cancelling Wireless Bluetooth Headphones",
              default_action: {
                type: "web_url",
                url: "https://bit.ly/webHeadphones",
                webview_height_ratio: "tall",
              },
              buttons: [
                {
                  type: "postback",
                  title: "Add to cart",
                  payload: "ADD_CART",
                },
                {
                  type: "postback",
                  title: "Main menu",
                  payload: "BACK_TO_MAIN_MENU",
                },
              ],
            },
            {
              title: "TV",
              image_url: "https://bit.ly/imageTV",
              subtitle: "Master of quality & Incredible clarity",
              default_action: {
                type: "web_url",
                url: "https://bit.ly/webTelevision",
                webview_height_ratio: "tall",
              },
              buttons: [
                {
                  type: "postback",
                  title: "Add to cart",
                  payload: "ADD_CART",
                },
                {
                  type: "postback",
                  title: "Main menu",
                  payload: "BACK_TO_MAIN_MENU",
                },
              ],
            },
            {
              title: "Playstation",
              image_url: "https://bit.ly/imagePlaystation",
              subtitle: "Incredible games & Endless entertainment",
              default_action: {
                type: "web_url",
                url: "https://bit.ly/webPlaystation",
                webview_height_ratio: "tall",
              },
              buttons: [
                {
                  type: "postback",
                  title: "Add to cart",
                  payload: "ADD_CART",
                },
                {
                  type: "postback",
                  title: "Main menu",
                  payload: "BACK_TO_MAIN_MENU",
                },
              ],
            },
          ],
        },
      },
    };
  },

//   sendLookupOrderTemplate() {
//     return {
//       attachment: {
//         type: "template",
//         payload: {
//           template_type: "button",
//           text: "OK. Let's set info about your order so i won't need to ask for them in the future.",
//           buttons: [
//             {
//               type: "postback",
//               title: "Set info",
//               payload: "SET_INFO_ORDER",
//             },
//             {
//               type: "postback",
//               title: "Main menu",
//               payload: "BACK_TO_MAIN_MENU",
//             },
//           ],
//         },
//       },
//     };
//   },

  backToMainMenuTemplate() {
    return {
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
  },
};
