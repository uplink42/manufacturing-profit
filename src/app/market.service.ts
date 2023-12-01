import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { ItemWithPrices, Item, ItemShort, MarketItem } from './types';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private http = inject(HttpClient);

  itemsWithRecipe = new BehaviorSubject<ItemWithPrices[]>([]);

  staticPrices = [
    { id: 4915, price: 5000000 },
    { id: 4918, price: 1300000 },
  ];

  getCraftableItems() {
    const items = [
      { name: "Manos Alchemist's Clothes" },
      { name: 'Manos Belt' },
      { name: 'Manos Butcher Knife' },
      { name: "Manos Cook's Clothes" },
      { name: "Manos Craftsman's Clothes" },
      { name: 'Manos Earring' },
      { name: "Manos Fisher's Clothes" },
      { name: 'Manos Fluid Collector' },
      { name: "Manos Gatherer's Clothes" },
      { name: 'Manos Hoe' },
      { name: "Manos Hunter's Clothes" },
      { name: 'Manos Lumbering Axe' },
      { name: 'Manos Necklace' },
      { name: 'Manos Pickaxe' },
      { name: 'Manos Processing Stone' },
      { name: 'Manos Riding Crop' },
      { name: 'Manos Ring' },
      { name: 'Manos Sailing Log' },
      { name: "Manos Sailor's Clothes" },
      { name: 'Manos Tanning Knife' },
      { name: "Manos Trainer's Clothes" },
    ];

    this.getCentralMarketData().subscribe((marketItems) => {
      items.forEach((i) => {
        this.searchItemInMarket(i.name)
          .pipe(switchMap((item) => this.getItemFromMarket(item.id)))
          .subscribe((result) => {
            const marketData = this.getMarketPriceData(result.id, marketItems);

            const itemInfo = {
              id: result.id,
              name: result.name,
              price: marketData?.price || 0,
              fourteen_day_volume: marketData?.fourteen_day_volume || 0,
              icon: marketData?.icon_image,
              recipes: result.item_is_product_of_processing_recipes,
            };

            itemInfo.recipes?.forEach((recipe) => {
              let ingredientsTotalPrice = 0;
              recipe.ingredients?.forEach((ingredient) => {
                const marketData = this.getMarketPriceData(
                  ingredient.id,
                  marketItems
                );

                ingredient.price = marketData?.price;
                ingredient.total = ingredient.price * ingredient.amount;
                ingredientsTotalPrice += ingredient.total;
              });

              recipe.ingredients_total_price = ingredientsTotalPrice;
              recipe.profit =
                itemInfo.price * 0.85475 - recipe.ingredients_total_price;
              recipe.margin = (recipe.profit / itemInfo.price) * 100;
            });

            this.itemsWithRecipe.next([
              ...this.itemsWithRecipe.value,
              itemInfo,
            ]);
          });
      });
    });
  }

  getItemFromMarket(id: number) {
    return this.http
      .get<any>(`https://apiv2.bdolytics.com/en/EU/db/item/${id}`)
      .pipe(map((result) => result.data as Item));
  }

  searchItemInMarket(query: string) {
    return this.http
      .get<any>(`https://apiv2.bdolytics.com/en/EU/db/query?q=${query}`)
      .pipe(map((result) => result.data?.[0] as ItemShort));
  }

  getCentralMarketData() {
    return this.http
      .get<any>('https://apiv2.bdolytics.com/en/EU/market/central-market-data')
      .pipe(map((result) => result.data as MarketItem[]));
  }

  getMarketPriceData(id: number, marketItems: MarketItem[]) {
    const item = marketItems.find((marketItem) => marketItem.id === id);
    if (item) {
      return item;
    }

    return {
      enhancement_level: 0,
      fourteen_day_volume: 0,
      grade_type: 0,
      icon_image: '',
      id: 0,
      in_stock: 0,
      item_id: 0,
      market_main_category: 0,
      market_sub_category: 0,
      name: '',
      price: this.staticPrices.find((s) => s.id === id)?.price || 0,
      price_change: 0,
      sub_id: 0,
      total_trades: 0,
      volume_change: 0,
    };
  }
}
