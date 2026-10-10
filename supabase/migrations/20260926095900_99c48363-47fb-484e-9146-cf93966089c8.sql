-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

-- Games
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  original_price numeric(10,2),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  platform text DEFAULT 'PC',
  rating numeric(3,1) DEFAULT 5,
  stock int NOT NULL DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  release_date date,
  publisher text,
  developer text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_games" ON games;
CREATE POLICY "anon_select_games" ON games FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_games" ON games;
CREATE POLICY "anon_insert_games" ON games FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_games" ON games;
CREATE POLICY "anon_update_games" ON games FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_games" ON games;
CREATE POLICY "anon_delete_games" ON games FOR DELETE
  TO anon, authenticated USING (true);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_customers" ON customers;
CREATE POLICY "anon_select_customers" ON customers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_customers" ON customers;
CREATE POLICY "anon_insert_customers" ON customers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_customers" ON customers;
CREATE POLICY "anon_update_customers" ON customers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_customers" ON customers;
CREATE POLICY "anon_delete_customers" ON customers FOR DELETE
  TO anon, authenticated USING (true);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  customer_address text,
  customer_city text,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_method text DEFAULT 'cod',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE SET NULL,
  game_title text NOT NULL,
  price numeric(10,2) NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  image_url text
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
CREATE POLICY "anon_update_order_items" ON order_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category_id);
CREATE INDEX IF NOT EXISTS idx_games_active ON games(is_active);
CREATE INDEX IF NOT EXISTS idx_games_featured ON games(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_game ON order_items(game_id);

-- Seed Categories
INSERT INTO categories (name, slug, icon) VALUES
  ('أكشن', 'action', 'Swords'),
  ('أدوار', 'rpg', 'Shield'),
  ('سباق', 'racing', 'Car'),
  ('رياضة', 'sports', 'Trophy'),
  ('مغامرة', 'adventure', 'Compass'),
  ('استراتيجية', 'strategy', 'Brain'),
  ('رعب', 'horror', 'Skull'),
  ('إلكتروني', 'esports', 'Gamepad2')
ON CONFLICT (slug) DO NOTHING;

-- Seed Games
DO $$
DECLARE
  v_action uuid;
  v_rpg uuid;
  v_racing uuid;
  v_sports uuid;
  v_adventure uuid;
  v_strategy uuid;
  v_horror uuid;
  v_esports uuid;
BEGIN
  SELECT id INTO v_action FROM categories WHERE slug = 'action';
  SELECT id INTO v_rpg FROM categories WHERE slug = 'rpg';
  SELECT id INTO v_racing FROM categories WHERE slug = 'racing';
  SELECT id INTO v_sports FROM categories WHERE slug = 'sports';
  SELECT id INTO v_adventure FROM categories WHERE slug = 'adventure';
  SELECT id INTO v_strategy FROM categories WHERE slug = 'strategy';
  SELECT id INTO v_horror FROM categories WHERE slug = 'horror';
  SELECT id INTO v_esports FROM categories WHERE slug = 'esports';

  INSERT INTO games (title, slug, description, price, original_price, category_id, image_url, platform, rating, stock, is_featured, is_active, release_date, publisher, developer) VALUES
  -- Action
  ('ظلال الحرب', 'shadows-of-war',
   'لعبة أكشن قتالية في عالم ما بعد نهاية العالم. قاتل أعداءك بأسلحة متطورة وقدرات خارقة في معارك ملحمية.',
   499, 699, v_action,
   'https://images.pexels.com/photos/9072343/pexels-photo-9072343.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC, PS5, Xbox', 4.8, 45, true, true, '2025-03-15', 'GameStudio Pro', 'Nova Interactive'),

  ('إطلاق النار: النخبة', 'elite-shooter',
   'تجربة قتال تكتيكي واقعية مع وضع متعدد اللاعبين. اختر سلاحك وادخل ساحة المعركة.',
   399, 549, v_action,
   'https://images.pexels.com/photos/7915226/pexels-photo-7915226.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC, PS5', 4.6, 30, true, true, '2025-01-20', 'Tactical Games', 'FrontLine Dev'),

  ('ساحة القتال', 'battlefield-arena',
   'معارك ضخمة بـ 64 لاعب في عالم مفتوح. دمر أعداءك واستخدم المركبات الحربية.',
   549, 749, v_action,
   'https://images.pexels.com/photos/7046723/pexels-photo-7046723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC, PS5, Xbox', 4.7, 25, false, true, '2024-11-10', 'WarZone Studio', 'Epic Battles'),

  -- RPG
  ('أساطير المملكة', 'kingdom-legends',
   'لعبة تقمص أدوار في عالم فانتازي ساحر. اكتشف ممالك منسية وقاتل التنانين.',
   599, 799, v_rpg,
   'https://images.pexels.com/photos/15575235/pexels-photo-15575235.png?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC, PS5', 4.9, 50, true, true, '2025-02-01', 'Fantasy Worlds', 'Mythic Studio'),

  ('نرد القدر', 'dice-of-fate',
   'لعبة تقمص أدوار استراتيجية مع نظام قتال بالأدوار. اختر مصيرك في كل خطوة.',
   349, 449, v_rpg,
   'https://images.pexels.com/photos/7150643/pexels-photo-7150643.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC', 4.5, 35, false, true, '2024-12-15', 'TableTop Games', 'DiceMasters'),

  ('بوابة الأقواس', 'arch-of-destiny',
   'مغامرة RPG ملحمية في عالم مفتوح مع قصة عميقة وشخصيات لا تُنسى.',
   529, 699, v_rpg,
   'https://images.pexels.com/photos/998038/pexels-photo-998038.png?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC, PS5, Xbox', 4.7, 40, true, true, '2025-04-01', 'OpenWorld Studio', 'Saga Games'),

  -- Racing
  ('سباق النيون', 'neon-racer',
   'سباق سيارات بسرعات جنونية في شوارع المدينة المضاءة بالنيون. خصص سيارتك وتسابق أصدقاءك.',
   379, 499, v_racing,
   'https://images.pexels.com/photos/25637489/pexels-photo-25637489.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC, PS5, Xbox', 4.6, 28, true, true, '2025-02-20', 'Speed Studio', 'Turbo Games'),

  ('ليل السباق', 'night-racing',
   'تجربة سباق ليلية واقعية مع سيارات رياضية فاخرة وأجواء مثيرة.',
   329, 429, v_racing,
   'https://images.pexels.com/photos/9545820/pexels-photo-9545820.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC, PS5', 4.4, 22, false, true, '2024-10-05', 'NightRide Studio', 'Apex Racing'),

  ('بطولة السرعة', 'speed-championship',
   'ادخل بطولة السرعة العالمية واثبت أنك أفضل سائق. سيارات مرخصة بالكامل وحلبات واقعية.',
   449, 599, v_racing,
   'https://images.pexels.com/photos/9545739/pexels-photo-9545739.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC, PS5, Xbox', 4.5, 18, false, true, '2024-09-15', 'Championship Games', 'Velocity Dev'),

  -- Adventure
  ('المغامر الأخير', 'last-adventurer',
   'مغامرة استكشافية في عالم غامر مليء بالألغاز والكنوز المخفية.',
   299, 399, v_adventure,
   'https://images.pexels.com/photos/10452449/pexels-photo-10452449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC, PS5, Switch', 4.3, 33, false, true, '2024-08-01', 'Explore Studio', 'Wander Games'),

  -- Strategy
  ('عقول القادة', 'commanders-mind',
   'لعبة استراتيجية تتطلب تخطيطاً محكماً. قُد جيشك للنصر في معارك ملحمية.',
   359, 459, v_strategy,
   'https://images.pexels.com/photos/7018123/pexels-photo-7018123.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC', 4.6, 27, false, true, '2025-01-10', 'Strategy First', 'Grand Command'),

  -- Horror
  ('الظلال المخيفة', 'frightening-shadows',
   'لعبة رعب نفسي ستبقيك مستيقظاً طوال الليل. اكتشف أسرار المنزل الملعون.',
   319, 419, v_horror,
   'https://images.pexels.com/photos/12660509/pexels-photo-12660509.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC, PS5, Xbox', 4.4, 20, true, true, '2025-03-01', 'DarkMoon Studio', 'FearWorks'),

  ('المنزل المهجور', 'abandoned-house',
   'استكشف منزلاً مهجوراً مليئاً بالأسرار المرعبة. كل غرفة تخفي قصة.',
   279, 349, v_horror,
   'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC', 4.2, 15, false, true, '2024-07-15', 'Creepy Games', 'Nightmare Dev'),

  -- Esports
  ('بطولة الأبطال', 'champions-arena',
   'العب ضد أفضل اللاعبين في العالم في بطولات إلكترونية متنوعة.',
   0, 0, v_esports,
   'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC', 4.8, 100, true, true, '2025-01-01', 'ProGaming League', 'Esports Inc'),

  ('دوري المحترفين', 'pro-league',
   'انضم لدوري المحترفين وتنافس على الجوائز الكبرى. مجاني للعب.',
   0, 0, v_esports,
   'https://images.pexels.com/photos/14189711/pexels-photo-14189711.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC', 4.7, 80, false, true, '2024-06-01', 'Pro League Gaming', 'Esports Inc'),

  -- Sports
  ('أبطال الكرة', 'football-champions',
   'لعبة كرة قدم واقعية برسومات مذهلة ولاعبين مرخصين. العب الدوري المحلي أو الدولي.',
   429, 549, v_sports,
   'https://images.pexels.com/photos/34543002/pexels-photo-34543002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'PC, PS5, Xbox, Switch', 4.5, 42, true, true, '2025-02-15', 'Sports Interactive', 'Goal Studio')

  ON CONFLICT (slug) DO NOTHING;
END $$;