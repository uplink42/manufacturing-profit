export interface ItemWithPrices {
  id: number;
  name: string;
  price: number;
  fourteen_day_volume: number;
  icon?: string;
  recipes: ProcessingRecipe[];
}

export interface ItemShort {
  item: string;
  grade_type: number;
  icon_image: string;
  id: number;
  name: string;
  sub_id: number;
}

export interface Item {
  id: number;
  sub_id: number;
  name: string;
  description: string;
  icon_image: string;
  grade_type: number;
  weight: number;
  buy_price: number;
  sell_price: number;
  repair_price: number;
  has_market_data: boolean;
  expiration_period: number;
  tooltip: (null | any)[];
  item_is_product_of_processing_recipes: ProcessingRecipe[];
  main_category: string;
  sub_category: string;
  db_type: string;
}

export interface ProcessingRecipe {
  id: number;
  name: string;
  icon_image: string;
  ingredients: Ingredient[];
  products: Product[];
  action_type: string;
  db_type: string;
  ingredients_total_price: number;
  profit: number;
  margin: number;
}

export interface Ingredient {
  id: number;
  sub_id: number;
  price?: number;
  name: string;
  icon_image: string;
  grade_type: number;
  market_main_category: number;
  db_type: string;
  amount: number;
  total: number;
}

export interface Product {
  id: number;
  name: string;
  icon_image: string;
  grade_type: number;
  select_rate: number;
  amounts: number[];
}

export interface MarketItem {
  enhancement_level: number;
  fourteen_day_volume: number;
  grade_type: number;
  icon_image: string;
  id: number;
  in_stock: number;
  item_id: number;
  market_main_category: number;
  market_sub_category: number;
  name: string;
  price: number;
  price_change: number;
  sub_id: number;
  total_trades: number;
  volume_change: number;
}
