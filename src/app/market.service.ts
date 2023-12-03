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
    { id: 4918, price: 1400000 },
  ];

  recipeOverrides = [768086];

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

            if (this.recipeOverrides.includes(itemInfo.id)) {
              itemInfo.recipes = this.getRecipeOverrides(marketItems);
            }

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
    let item = marketItems.find((marketItem) => marketItem.id === id);

    // magical shard = sealed black magical crystal x 0.9
    if (id === 4918) {
      item = marketItems.find((marketItem) => marketItem.id === 768160);
      item!.price = item!.price * 0.9;
    }

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

  getRecipeOverrides = (marketItems: MarketItem[]) => {
    const opalID = 4266;
    const opal = this.getMarketPriceData(opalID, marketItems);

    const gemPolisherID = 4481;
    const gemPolisher = this.getMarketPriceData(gemPolisherID, marketItems);

    return [
      {
        id: 768086,
        name: 'Manos Processing Stone',
        icon_image: 'New_Icon/06_PC_EquipItem/00_Common/00_ETC/00768086',
        ingredients: [
          {
            id: opalID,
            sub_id: 0,
            name: 'Moonlight Opal',
            icon_image: 'New_Icon/03_ETC/07_ProductMaterial/00004076',
            grade_type: 0,
            market_main_category: 25,
            db_type: 'item',
            amount: 30,
            price: opal.price || 0,
            total: opal.price * 30 || 0,
          },
          {
            id: 4915,
            sub_id: 0,
            name: 'Manos Stone',
            icon_image: 'New_Icon/03_ETC/07_ProductMaterial/00004915',
            grade_type: 3,
            market_main_category: 255,
            db_type: 'item',
            amount: 5,
            price: 5000000,
            total: 25000000,
          },
          {
            id: 4918,
            sub_id: 0,
            name: 'Magical Shard',
            icon_image: 'New_Icon/03_ETC/07_ProductMaterial/00004918',
            grade_type: 0,
            market_main_category: 255,
            db_type: 'item',
            amount: 50,
            price: 1400000,
            total: 70000000,
          },
          {
            id: gemPolisherID,
            sub_id: 0,
            name: 'Gem Polisher',
            icon_image: 'New_Icon/06_PC_EquipItem/00_Common/00_ETC/00016128',
            grade_type: 3,
            market_main_category: 40,
            db_type: 'item',
            amount: 15,
            price: gemPolisher.price || 0,
            total: gemPolisher.price * 15 || 0,
          },
        ],
        products: [
          {
            id: 768086,
            name: 'Manos Processing Stone',
            icon_image: 'New_Icon/06_PC_EquipItem/00_Common/00_ETC/00016847',
            grade_type: 4,
            select_rate: 1000000,
            amounts: [1, 1],
          },
        ],
        action_type: 'manufacture-craft',
        db_type: 'processing-recipe',
        ingredients_total_price: 0,
        profit: 0,
        margin: 0,
      },
    ];
  };
}
