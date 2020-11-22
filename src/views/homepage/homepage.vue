<template>
  <main class="homepage">
    <section class="homepage__items">
      <div class="container">
        <h2 class="homepage__subtitle">Список товаров</h2>
        <ul class="homepage__items-list">
          <li
            v-for="(cat, key) in categoriesList"
            :key="key"
            class="homepage__items-list-elem"
          >
            <div class="homepage__items-list-elem-head">
              <span class="homepage__items-list-elem-head-name">{{
                cat.name
              }}</span>
              <button
                class="homepage__items-list-elem-head-toggler"
                :class="{
                  'homepage__items-list-elem-head-toggler_active':
                    openedCategories && openedCategories.indexOf(cat.id) > -1
                }"
                @click="toggleOpened(cat.id)"
              >
                <svg
                  id="Capa_1"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 256 256"
                  style="enable-background:new 0 0 256 256;"
                  xml:space="preserve"
                >
                  <g>
                    <g>
                      <polygon
                        points="225.813,48.907 128,146.72 30.187,48.907 0,79.093 128,207.093 256,79.093 		"
                      />
                    </g>
                  </g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                </svg>
              </button>
            </div>
            <transition name="fade">
              <ul
                v-if="openedCategories && openedCategories.indexOf(cat.id) > -1"
                class="homepage__items-list-elem-goods"
              >
                <li
                  v-for="(item, keyInner) in cat.items"
                  :key="keyInner"
                  class="homepage__items-list-elem-goods-item"
                >
                  <article class="homepage__items-list-elem-goods-item-inner">
                    <button
                      class="homepage__items-list-elem-goods-item-basket"
                      :class="{
                        'homepage__items-list-elem-goods-item-basket_active': isInCart(
                          item
                        )
                      }"
                      @click="toggleInCart(item)"
                    ></button>
                    <p class="homepage__items-list-elem-goods-item-param">
                      <span
                        class="homepage__items-list-elem-goods-item-param-title"
                        >Название:
                      </span>
                      {{ item.title }}
                    </p>
                    <p class="homepage__items-list-elem-goods-item-param">
                      <span
                        class="homepage__items-list-elem-goods-item-param-title"
                        >Доступно:
                      </span>
                      {{ item.available }}
                    </p>
                    <p
                      class="homepage__items-list-elem-goods-item-param"
                      :class="{
                        'homepage__items-list-elem-goods-item-param_decremented':
                          previousCourse && previousCourse > usdCourse,
                        'homepage__items-list-elem-goods-item-param_incremented':
                          previousCourse && previousCourse < usdCourse
                      }"
                    >
                      <span
                        class="homepage__items-list-elem-goods-item-param-title"
                        >Цена, руб.:
                      </span>
                      {{ getPrice(item.usd_price) }}
                    </p>
                  </article>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </div>
    </section>
    <section
      v-if="cart && cart.items && cart.items.length"
      class="homepage__cart"
    >
      <div class="container">
        <h2 class="homepage__subtitle">Корзина</h2>
        <div class="homepage__cart-list-wrapper">
          <table class="homepage__cart-list">
            <thead class="homepage__cart-list-head">
              <tr class="homepage__cart-list-head-row">
                <td class="homepage__cart-list-head-row-cell">
                  Наименование товара
                </td>
                <td class="homepage__cart-list-head-row-cell">Количество</td>
                <td class="homepage__cart-list-head-row-cell">Цена, руб.</td>
                <td class="homepage__cart-list-head-row-cell"></td>
              </tr>
            </thead>
            <tbody class="homepage__cart-list-body">
              <tr
                v-for="(item, key) in cart.items"
                :key="key"
                class="homepage__cart-list-body-row"
              >
                <td class="homepage__cart-list-body-row-cell">
                  {{ item.item.title }}
                </td>
                <td class="homepage__cart-list-body-row-cell">
                  <input
                    type="number"
                    class="homepage__cart-list-body-row-cell-input"
                    :value="item.count"
                    @blur="
                      setItemsCountToCart({
                        item: item,
                        count: $event.target.value
                      })
                    "
                  />
                  <span
                    v-if="item.item && item.item.available < 10"
                    class="homepage__cart-list-body-row-cell-availability"
                    >Количество ограничено</span
                  >
                </td>
                <td class="homepage__cart-list-body-row-cell">
                  <span
                    class="homepage__cart-list-body-row-cell-inner"
                    :class="{
                      'homepage__cart-list-body-row-cell-inner_decremented':
                        previousCourse && previousCourse > usdCourse,
                      'homepage__cart-list-body-row-cell-inner_incremented':
                        previousCourse && previousCourse < usdCourse
                    }"
                    >{{ getPrice(item.item.usd_price) }} / шт.</span
                  >
                </td>
                <td class="homepage__cart-list-body-row-cell">
                  <button
                    class="homepage__cart-list-body-row-cell-remover"
                    @click="removeFromCart(item.item)"
                  >
                    Удалить из корзины
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            class="homepage__cart-sum"
            :class="{
              'homepage__cart-sum_decremented':
                previousCourse && previousCourse > usdCourse,
              'homepage__cart-sum_incremented':
                previousCourse && previousCourse < usdCourse
            }"
          >
            Общая стоимость, руб.: {{ getPrice(cart.sum) }}
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" src="./homepage.ts"></script>
<style src="./homepage.css"></style>
