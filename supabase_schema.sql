-- 
-- Supabase Schema & Seed Data for Saree Website
-- Copy and run this script in your Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- 

-- 1. Create tables
CREATE TABLE IF NOT EXISTS products (
    id integer PRIMARY KEY,
    name text NOT NULL,
    material text NOT NULL,
    price integer NOT NULL,
    original_price integer,
    image text NOT NULL,
    tag text,
    rating numeric(3,2) DEFAULT 5.00,
    reviews integer DEFAULT 0,
    category text NOT NULL,
    description text,
    in_stock boolean DEFAULT true,
    featured boolean DEFAULT false,
    coming_soon boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS offers (
    id text PRIMARY KEY,
    title text NOT NULL,
    subtitle text,
    "desc" text,
    image text NOT NULL,
    cta text,
    discount text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    product_id integer REFERENCES products(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE (email, product_id)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_notifications ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Products: Everyone can read, only authenticated can write (Supabase Dashboard / admin)
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Offers: Everyone can read, only authenticated can write
CREATE POLICY "Allow public read access on offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on offers" ON offers FOR ALL USING (auth.role() = 'authenticated');

-- Newsletter Subscriptions: Anyone can insert, only authenticated can view/delete
CREATE POLICY "Allow public insert on newsletter" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read/write on newsletter" ON newsletter_subscriptions FOR ALL USING (auth.role() = 'authenticated');

-- Product Notifications: Anyone can insert, only authenticated can view/delete
CREATE POLICY "Allow public insert on notifications" ON product_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read/write on notifications" ON product_notifications FOR ALL USING (auth.role() = 'authenticated');

-- 4. Seed Data (Clear existing before insertion to avoid conflicts)
TRUNCATE products CASCADE;
TRUNCATE offers CASCADE;

INSERT INTO products (id, name, material, price, original_price, image, tag, rating, reviews, category, description, in_stock, featured, coming_soon) VALUES
(101, 'Kanchipuram Divine Lotus', 'Pure Kanchipuram Silk', 48500, 62000, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM005.jpg', 'Bestseller', 4.8, 124, 'Kanjeevaram', 'Handwoven with intricate lotus motifs and a contrasting zari border. This Kanchipuram silk saree embodies divine grace and is a perfect choice for weddings and festive occasions.', true, true, false),
(102, 'Banarasi Royal Velvet', 'Katan Silk with Zari', 52900, 68000, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM050.jpg', 'New', 4.9, 89, 'Banarasi', 'Luxurious Katan silk handwoven in Varanasi with intricate gold zari patterns. The rich velvet texture and Mughal-inspired motifs make this a regal addition to any trousseau.', true, true, false),
(103, 'Organza Floral Dream', 'Pure Organza Silk', 38500, NULL, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM100.jpg', 'Limited', 4.7, 56, 'Organza', 'An airy, translucent organza saree adorned with hand-painted floral motifs. Lightweight yet striking, it is ideal for daytime celebrations and intimate gatherings.', true, true, false),
(104, 'Patola Heritage Weave', 'Patola Silk, Double Ikat', 72500, 92000, 'images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1020.jpg', 'Premium', 5.0, 42, 'Patola', 'A masterwork of double ikat weaving from Gujarat. Each thread is resist-dyed before weaving, creating mirror-perfect patterns on both sides. A true collector heirloom.', true, true, false),
(105, 'Mysore Crepe Gold', 'Pure Mysore Silk', 32000, NULL, 'images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1050.jpg', 'Sale', 4.6, 198, 'Mysore', 'A lightweight crepe silk saree from Mysore with delicate gold zari stripes. Its subtle sheen and drape make it perfect for everyday elegance and office wear.', true, true, false),
(106, 'Kanjeevaram Temple Rich', 'Kanjeevaram Silk, Korvai', 89500, 115000, 'images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1100.jpg', 'Exclusive', 4.9, 73, 'Kanjeevaram', 'A grand Kanjeevaram woven with the Korvai technique — contrasting body and border joined seamlessly. Temple-inspired checks and a wide gold border define this masterpiece.', true, true, false),
(107, 'Banarasi Tissue Gold', 'Pure Tissue Silk', 62500, 78000, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM010.jpg', 'Bestseller', 4.8, 115, 'Banarasi', 'A shimmering tissue silk saree with all-over gold zari weave. Lightweight and opulent, it is a favorite for receptions and milestone celebrations.', true, false, false),
(108, 'Chanderi Handloom Classic', 'Chanderi Cotton-Silk', 18500, 24000, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM020.jpg', 'Sale', 4.5, 237, 'Chanderi', 'A classic Chanderi weave blending fine cotton with silk. The fabric is known for its transparency, lightweight feel, and elegant golden coin motifs.', true, false, false),
(109, 'Paithani Peacock Glory', 'Paithani Pure Silk', 78500, NULL, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM030.jpg', 'Premium', 4.9, 64, 'Paithani', 'Inspired by the Ajanta caves, this Paithani saree features an exquisite peacock motif pallu woven with real zari. Each saree takes over 45 days to complete.', true, false, false),
(110, 'Tussar Silk Tribal', 'Pure Tussar Silk', 26500, 33000, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM045.jpg', 'Limited', 4.4, 89, 'Tussar', 'Earthy and textured, this Tussar silk saree features tribal-inspired geometric patterns in natural dyes. A celebration of India tribal weaving heritage.', false, false, true),
(111, 'Kota Doria Breeze', 'Kota Doria Cotton', 14500, 18000, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM060.jpg', 'Bestseller', 4.3, 312, 'Kota', 'The signature checkered weave of Kota Doria makes this saree a summer staple. Light, airy, and elegantly simple with a delicate zari border.', true, false, false),
(112, 'Kanjeevaram Green Paradise', 'Kanjeevaram Silk', 69500, 88000, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM075.jpg', 'Exclusive', 4.8, 48, 'Kanjeevaram', 'A striking emerald green Kanjeevaram with temple border and rudraksha-motif buttis. The deep zari work catches light with every movement.', true, false, false),
(113, 'Banarasi Brocade Rose', 'Katan Brocade Silk', 56800, NULL, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM090.jpg', 'New', 4.7, 93, 'Banarasi', 'A rose-tinted Banarasi brocade with intricate floral jaal patterns woven in gold and silver zari. An heirloom piece for generations.', true, false, false),
(114, 'Gadwal Silk Temple', 'Gadwal Pure Silk', 42000, 55000, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM110.jpg', 'Sale', 4.6, 77, 'Gadwal', 'A Telangana speciality where the body is cotton and the border is pure silk. This Gadwal saree features intricate temple motifs on a rich maroon base.', true, false, false),
(115, 'Maheshwari Floral Trail', 'Maheshwari Silk', 22500, NULL, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM130.jpg', 'Bestseller', 4.5, 156, 'Maheshwari', 'A graceful Maheshwari silk saree with striped body and floral motif pallu. Known for its reversible border, it is both versatile and elegant.', true, false, false),
(116, 'Sambalpuri Ikat Magic', 'Sambalpuri Silk', 29500, 38000, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM145.jpg', 'Limited', 4.4, 68, 'Sambalpuri', 'A traditional Odisha weave where the yarn is tie-dyed before weaving. The intricate ikat patterns are a testament to the weaver mastery.', false, false, true),
(117, 'Kanjeevaram Ruby Silk', 'Kanjeevaram Silk', 95000, 125000, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM160.jpg', 'Premium', 4.9, 35, 'Kanjeevaram', 'A deep ruby-red Kanjeevaram with a grand gold border featuring mythological motifs. This is bridal luxury at its finest.', true, false, false),
(118, 'Banarasi Organza Silk', 'Organza with Zari', 45000, 58000, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM180.jpg', 'New', 4.7, 84, 'Banarasi', 'A modern take on Banarasi weaving — fine organza base with minimal gold zari work and abstract floral patterns. Perfect for contemporary brides.', true, false, false),
(119, 'Kasavu Kerala Gold', 'Kerala Kasavu Cotton', 12500, NULL, 'images/herosection/ChatGPT Image Jun 14, 2026, 02_54_17 PM200.jpg', 'Classic', 4.2, 420, 'Kasavu', 'The iconic Kerala Kasavu saree — cream cotton with a gold zari border. Timeless, elegant, and worn for every auspicious occasion in South India.', true, false, false),
(120, 'Kanjeevaram Twilight Blue', 'Kanjeevaram Silk', 82500, NULL, 'images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1030.jpg', 'Exclusive', 4.8, 52, 'Kanjeevaram', 'A twilight blue Kanjeevaram with contrasting peacock-inspired pallu. The intricate temple border and heavy zari make it a statement piece.', true, false, false),
(121, 'Ilkal Feather Touch', 'Ilkal Silk', 19800, 25000, 'images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1070.jpg', 'Sale', 4.3, 145, 'Ilkal', 'A Karnataka speciality woven with a unique joining technique. The Ilkal saree features geometric patterns on the pallu and a distinctive border.', true, false, false),
(122, 'Bhagalpuri Silk Grace', 'Bhagalpuri Tussar', 16500, NULL, 'images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1090.jpg', 'Bestseller', 4.4, 198, 'Tussar', 'Handwoven in Bihar, this Bhagalpuri tussar silk saree has a natural golden sheen. Simple yet sophisticated, it is perfect for festive office wear.', false, false, true),
(123, 'Baluchari Narrative', 'Baluchari Silk', 68000, 86000, 'images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1110.jpg', 'Premium', 4.9, 38, 'Baluchari', 'A Baluchari saree tells a story — each panel on the pallu depicts scenes from the Ramayana. Woven in fine silk with gold zari, it is wearable art.', true, false, false),
(124, 'Muga Silk Heritage', 'Assam Pure Muga', 55000, NULL, 'images/bridalsaree/Woman_walking_with_lotus_flower_202606150000_1130.jpg', 'Exclusive', 4.8, 29, 'Muga', 'Assam prized Muga silk has a natural golden sheen that never fades. This saree features traditional Assamese motifs woven with care by master artisans.', true, false, false);

INSERT INTO offers (id, title, subtitle, "desc", image, cta, discount) VALUES
('o1', 'Monsoon Muse Sale', 'Up to 40% Off', 'Lightweight silks & organzas for the rainy season', 'images/banners/ChatGPT%20Image%20Jun%2015,%202026,%2011_20_27%20AM.png', 'Shop Monsoon Edit', '40%'),
('o2', 'Bridal Edit', 'The Grand Wedding Collection', 'Kanjeevarams & Banarasis for your special day', 'images/banners/ChatGPT%20Image%20Jun%2015,%202026,%2011_21_13%20AM.png', 'Explore Bridal', NULL),
('o3', 'First Purchase', 'Welcome Offer', 'Flat 15% off on your first order. Use code ZARI15', 'images/banners/ChatGPT%20Image%20Jun%2015,%202026,%2011_22_13%20AM.png', 'Claim Offer', '15%'),
('o4', 'Golden Hour Collection', 'Zari Masterpieces', 'Handwoven with real gold & silver zari threads', 'images/banners/ChatGPT%20Image%20Jun%2015,%202026,%2011_25_33%20AM.png', 'Discover Gold', NULL),
('o5', 'Temple Weave Festival', 'Sacred Threads', 'Temple border sarees starting at ₹18,500', 'images/banners/ChatGPT%20Image%20Jun%2015,%202026,%2011_27_09%20AM.png', 'View Collection', '25%'),
('o6', 'Silk Anniversary Edit', '25 Years of Craft', 'Limited edition heirloom pieces with certificate', 'images/banners/ChatGPT%20Image%20Jun%2015,%202026,%2011_28_18%20AM.png', 'Shop Anniversary', NULL),
('o7', 'Heritage Revival', 'Rare Weaves', 'Patola, Baluchari & Muga — back in stock', 'images/banners/ChatGPT%20Image%20Jun%2015,%202026,%2011_35_21%20AM.png', 'Explore Heritage', '30%'),
('o8', 'Zari Luxe Drop', 'Pure Zari Border Edit', 'Heavy zari work sarees at exclusive prices', 'images/banners/ChatGPT%20Image%20Jun%2015,%202026,%2011_20_27%20AM.png', 'Shop Luxe', '20%');
