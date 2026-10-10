export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category_id: string | null;
  image_url: string | null;
  platform: string;
  rating: number;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  release_date: string | null;
  publisher: string | null;
  developer: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  game_id: string | null;
  game_title: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

export interface Order {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  customer_city: string | null;
  total: number;
  status: string;
  payment_method: string;
  notes: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

export interface CartItem {
  game: Game;
  quantity: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  discount_percent: number;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
  created_at: string;
}
