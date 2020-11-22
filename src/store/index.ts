import Vue from "vue";
import Vuex from "vuex";
import dataJson from "@/data/data.json";
import namesJson from "@/data/names.json";

Vue.use(Vuex);

const store = new Vuex.Store<any>({
  // По-хорошему, конечно, раскидать сущности корзины и товаров по двум модулям, но в рамках столь короткого проекта пожалуй не будем...
  modules: {},
  getters: {
    getCart(state: any) {
      let sum: number = 0;
      state.cartItems.forEach((item: any) => {
        sum = sum + item.count * item.item.usd_price;
      });
      return {
        items: state.cartItems,
        sum: sum
      };
    }
  },
  actions: {
    getHomepageData() {
      const data: any = dataJson;
      const names: any = namesJson;
      const response: any = { data: data, names: names };
      store.commit("setHomepageData", response);
      return response;
    },
    addToCart(state: any, item: any) {
      //  Это экшен потому что в реальной жизни как бы это экшен))
      return store.commit("addToCart", item);
    },
    removeFromCart(state: any, item: any) {
      return store.commit("removeFromCart", item);
    },
    setItemsCountToCart(state: any, params: any) {
      return store.commit("setItemsCountToCart", params);
    }
  },
  state: {
    items: [],
    cartItems: []
  },
  mutations: {
    setHomepageData(state: any, data: any) {
      // Первичную обработку данных в человекопонятные данные осуществляю здесь, чтобы отделить область представления от области данных. Однако, не группирую товары в категории сразу тут, поскольку это уже особенность представления а не данных. При работе с данными обычно использую либо паттерн "или", либо покрытие несколькими if
      let items = ((((data || {}).data || {}).Value || {}).Goods || []).map(
        (dataItem: any) => {
          let title: any = "";
          if (
            data.names &&
            data.names[dataItem["G"]] &&
            data.names[dataItem["G"]]["B"] &&
            data.names[dataItem["G"]]["B"][dataItem["T"]] &&
            data.names[dataItem["G"]]["B"][dataItem["T"]]["N"]
          ) {
            title = data.names[dataItem["G"]]["B"][dataItem["T"]]["N"];
          }
          return {
            title: title,
            usd_price: dataItem["C"],
            group_id: dataItem["G"],
            group_name: (data.names[dataItem["G"]] || {})["G"],
            id: dataItem["T"],
            available: dataItem["P"]
          };
        }
      );
      state.items = items;

      const cartInLS: any = localStorage.getItem("cart");

      if (cartInLS) {
        state.cartItems = JSON.parse(cartInLS);
      }
    },
    addToCart(state: any, item: any) {
      let itemInCart: any = state.cartItems.find((cartItem: any) => {
        return cartItem.item.id === item.id;
      });
      if (!itemInCart) {
        state.cartItems.push({
          count: 1,
          item: item
        });
      } else {
        itemInCart.count++;
      }
      // Пишем в LS для удобства тестирования)
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    removeFromCart(state: any, item: any) {
      let indexInCartItems: any = state.cartItems.indexOf((cartItem: any) => {
        return cartItem.item.id === item.id;
      });
      state.cartItems.splice(indexInCartItems, 1);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    setItemsCountToCart(state: any, params: any) {
      if (
        params &&
        params.count &&
        Number(params.count) &&
        !isNaN(Number(params.count)) &&
        Number(params.count) > 0
      ) {
        let itemInCart: any = state.cartItems.find((cartItem: any) => {
          return cartItem.item.id === params.item.item.id;
        });
        itemInCart.count = Number(params.count);
      } else {
        alert(
          "Пожалуйста, проверьте правильность введенных данных. Вы можете заказать от 1 товара, отрицательные значения и ноль - недопустимы"
        );
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    }
  }
});

export default store;
