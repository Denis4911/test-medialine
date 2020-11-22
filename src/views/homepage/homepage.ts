import { Component, Vue } from "vue-property-decorator";
import { Action, Getter, State } from "vuex-class";

@Component
export default class Homepage extends Vue {
  @State("items") items: any;
  @Action("addToCart") addToCart: any;
  @Getter("getCart") cart: any;
  @Action("removeFromCart") removeFromCart: any;
  @Action("setItemsCountToCart") setItemsCountToCart: any;

  isInCart(item: any) {
    return (
      this.cart.items &&
      this.cart.items.find((cartItem: any) => {
        return cartItem.item && cartItem.item.id === item.id;
      })
    );
  }

  toggleInCart(item: any) {
    if (this.cart.items && this.isInCart(item)) {
      this.removeFromCart(item);
    } else {
      this.addToCart(item);
    }

    setTimeout(() => {
      window.scrollTo({
        left: 0,
        top: 20000,
        behavior: "smooth"
      });
    }, 300);
  }

  get categoriesList() {
    // А уже тут сворачиваю все товары в категории, потому что это специфика отображения и должно выполняться уже в компоненте (или геттере Vuex, но мне больше нравится тут)
    let categories: any = [];
    (this.items || {}).forEach((item: any) => {
      if (
        categories
          .map((cat: any) => {
            return cat.id;
          })
          .indexOf(item.group_id) === -1
      ) {
        categories.push({
          id: item.group_id,
          name: item.group_name,
          items: [item]
        });
      } else {
        categories
          .find((cat: any) => {
            return cat.id === item.group_id;
          })
          .items.push(item);
      }
    });
    return categories;
  }

  usdCourse: number = 60;
  previousCourse: any = null;

  getPrice(usd_price: number) {
    // Рассчитываем цену в рублях, учитываем что на основании плохих данных может получиться чушь после запятой
    return (Number(usd_price) * this.usdCourse).toFixed(2);
  }

  openedCategories: any = [];

  beforeMount(): void {
    //  Раскрываем все категории по умолчанию
    this.openedCategories = [
      ...new Set(
        this.items.map((item: any) => {
          return item.group_id;
        })
      )
    ];

    // Раз в 15 минут меняем курс доллара на рандомный
    setInterval(() => {
      this.previousCourse = this.usdCourse;
      this.usdCourse = Math.floor(20 + Math.random() * 61);
    }, 15000);
  }

  toggleOpened(id: any) {
    if (this.openedCategories.indexOf(id) > -1) {
      this.openedCategories.splice(this.openedCategories.indexOf(id), 1);
    } else {
      this.openedCategories.push(id);
    }
  }
}
