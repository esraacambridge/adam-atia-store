import { supabase } from './supabase';
import type { Game, Category, Order, OrderItem, Customer, Offer } from './types';

export type OfferInput = Omit<Partial<Offer>, 'ends_at' | 'starts_at'> & {
  ends_at?: string | undefined;
  starts_at?: string | undefined;
};

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchGames(filters?: {
  categoryId?: string | undefined;
  search?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  platform?: string | undefined;
  sort?: string | undefined;
}): Promise<Game[]> {
  let query = supabase
    .from('games')
    .select('*, category:categories(*)')
    .eq('is_active', true);

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters?.platform && filters.platform !== 'all') {
    query = query.ilike('platform', `%${filters.platform}%`);
  }

  switch (filters?.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchGameBySlug(slug: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from('games')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchFeaturedGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(8);
  if (error) throw error;
  return data || [];
}

export async function fetchAllGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createGame(game: Partial<Game>): Promise<Game> {
  const { data, error } = await supabase
    .from('games')
    .insert(game)
    .select('*, category:categories(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateGame(id: string, updates: Partial<Game>): Promise<Game> {
  const { data, error } = await supabase
    .from('games')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, category:categories(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGame(id: string): Promise<void> {
  const { error } = await supabase.from('games').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createOrder(orderData: {
  customer: { name: string; email: string; phone: string; address: string; city: string };
  items: { game_id: string; game_title: string; price: number; quantity: number; image_url: string | null }[];
  total: number;
  payment_method: string;
  notes?: string;
}): Promise<Order> {
  const { data: customer, error: custError } = await supabase
    .from('customers')
    .insert({
      name: orderData.customer.name,
      email: orderData.customer.email,
      phone: orderData.customer.phone,
      address: orderData.customer.address,
      city: orderData.customer.city,
    })
    .select()
    .single();
  if (custError) throw custError;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      customer_name: orderData.customer.name,
      customer_email: orderData.customer.email,
      customer_phone: orderData.customer.phone,
      customer_address: orderData.customer.address,
      customer_city: orderData.customer.city,
      total: orderData.total,
      status: 'pending',
      payment_method: orderData.payment_method,
      notes: orderData.notes || null,
    })
    .select()
    .single();
  if (orderError) throw orderError;

  const itemsToInsert = orderData.items.map((item) => ({
    order_id: order.id,
    game_id: item.game_id,
    game_title: item.game_title,
    price: item.price,
    quantity: item.quantity,
    image_url: item.image_url,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
  if (itemsError) throw itemsError;

  return order;
}

export async function fetchBestSellers(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .gt('rating', 4.5)
    .order('rating', { ascending: false })
    .limit(8);
  if (error) throw error;
  return data || [];
}

export async function fetchOnSaleGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .not('original_price', 'is', null)
    .gt('original_price', 0)
    .order('created_at', { ascending: false })
    .limit(8);
  if (error) throw error;
  return data || [];
}

export async function fetchOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchAllOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createOffer(offer: OfferInput): Promise<Offer> {
  const { data, error } = await supabase.from('offers').insert(offer).select().single();
  if (error) throw error;
  return data;
}

export async function updateOffer(id: string, updates: OfferInput): Promise<void> {
  const { error } = await supabase.from('offers').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteOffer(id: string): Promise<void> {
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchOrdersByEmail(email: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('customer_email', email)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchDashboardStats(): Promise<{
  totalGames: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  lowStockGames: Game[];
  recentOrders: (Order & { order_items?: OrderItem[] })[];
}> {
  const [gamesRes, ordersRes, customersRes, lowStockRes, recentOrdersRes] = await Promise.all([
    supabase.from('games').select('id, stock', { count: 'exact', head: false }),
    supabase.from('orders').select('total, status'),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase.from('games').select('*, category:categories(*)').lt('stock', 10).order('stock', { ascending: true }).limit(5),
    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(5),
  ]);

  const totalRevenue = (ordersRes.data || [])
    .filter((o: any) => o.status === 'completed')
    .reduce((sum: number, o: any) => sum + Number(o.total), 0);

  return {
    totalGames: gamesRes.data?.length || 0,
    totalOrders: ordersRes.data?.length || 0,
    totalCustomers: customersRes.count || 0,
    totalRevenue,
    lowStockGames: lowStockRes.data || [],
    recentOrders: recentOrdersRes.data || [],
  };
}
