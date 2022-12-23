export const TemplateMessage = {
    // the products displayed here is gotten from the fakestore api 
  sendProductsTemplate: () => {
    return {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
              image_url: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
              subtitle: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
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
              title: "Mens Casual Premium Slim Fit T-Shirts",
              image_url: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
              subtitle: "Slim-fitting style, contrast raglan long sleeve three-button henley placket, light weight & soft fabric for breathable and comfortable wearing",
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
              title: "Mens Cotton Jacket",
              image_url: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
              subtitle: "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors",
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
            {
                title: "Mens Casual Slim Fit",
                image_url: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
                subtitle: "he color could be slightly different between on the screen and in practice",
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
              {
                title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
                image_url: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
                subtitle: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl",
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
              {
                title: "Solid Gold Petite Micropave",
                image_url: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
                subtitle: "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States",
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
              {
                title: "White Gold Plated Princess",
                image_url: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
                subtitle: "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her",
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
