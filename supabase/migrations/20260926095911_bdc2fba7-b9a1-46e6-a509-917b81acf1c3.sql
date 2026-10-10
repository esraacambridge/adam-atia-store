CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  discount_percent int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_offers" ON offers;
CREATE POLICY "anon_select_offers" ON offers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_offers" ON offers;
CREATE POLICY "anon_insert_offers" ON offers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_offers" ON offers;
CREATE POLICY "anon_update_offers" ON offers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_offers" ON offers;
CREATE POLICY "anon_delete_offers" ON offers FOR DELETE
  TO anon, authenticated USING (true);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'is_on_sale') THEN
    ALTER TABLE games ADD COLUMN is_on_sale boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Seed a couple of offers
INSERT INTO offers (title, description, image_url, discount_percent, is_active, ends_at) VALUES
  ('عرض الجمعة البيضاء', 'خصومات تصل إلى 50% على جميع الألعاب المميزة لفترة محدودة!',
   'https://images.pexels.com/photos/5625003/pexels-photo-5625003.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   50, true, '2026-12-31 23:59:59'),
  ('عرض الإطلاق', 'احصل على خصم 30% على أول طلب لك من المتجر',
   'https://images.pexels.com/photos/7987755/pexels-photo-7987755.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   30, true, '2026-12-31 23:59:59')
ON CONFLICT DO NOTHING;

-- Mark some games as on sale
UPDATE games SET is_on_sale = true WHERE original_price IS NOT NULL AND original_price > price;