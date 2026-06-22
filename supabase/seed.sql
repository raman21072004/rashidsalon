-- ============ UPDATE SETTINGS ============
UPDATE public.settings
SET 
  salon_name = 'Rashid Salon & Academy',
  logo_url = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80',
  phone = '+91 98765 43210',
  whatsapp = '+91 98765 43210',
  email = 'info@rashidsalon.com',
  address = '280, Model Town Rd, opposite KFC, above The Hanger, Model Town, Jalandhar, Punjab 144001',
  business_hours = '{"mon":"10:00 - 20:00","tue":"10:00 - 20:00","wed":"10:00 - 20:00","thu":"10:00 - 20:00","fri":"10:00 - 20:00","sat":"10:00 - 21:00","sun":"11:00 - 19:00"}',
  instagram = 'https://instagram.com/rashidsalon_',
  facebook = 'https://facebook.com/rashidsalon',
  google_maps = 'https://maps.google.com',
  hero_title = 'Where pigment meets practice.',
  hero_subtitle = 'A unisex salon and training academy in Model Town, Jalandhar — sit in the chair, or learn behind it.',
  hero_image_url = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
  about_title = 'Two rooms. One craft.',
  about_description = 'By day we color, cut, and care for hair. By evening the same chairs teach the next generation of stylists. Everything we do at Rashid passes through both rooms.',
  about_image_url = 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80',
  about_stat_1_value = '12+',
  about_stat_1_label = 'Years in Model Town',
  about_stat_2_value = '300+',
  about_stat_2_label = 'Graduates trained',
  about_stat_3_value = '8',
  about_stat_3_label = 'Senior stylists',
  academy_title = 'Rashid Academy',
  academy_description = 'A working-floor school. Small batches, real clients, certified by industry-experienced educators.',
  academy_image_url = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  academy_stat_1_value = '300+',
  academy_stat_1_label = 'Graduates',
  academy_stat_2_value = '85%',
  academy_stat_2_label = 'Placement rate',
  academy_stat_3_value = '6',
  academy_stat_3_label = 'Years running'
WHERE singleton = true;

-- ============ SEED STYLISTS ============
DELETE FROM public.stylists;
INSERT INTO public.stylists (name, photo_url, experience, specialization, bio, availability, instagram, facebook, sort_order) VALUES
('Rashid Khan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80', '12+ Years', 'Master Stylist & Colorist', 'Founder of Rashid Salon & Academy. Certified by Vidal Sassoon, specializing in precision cuts, balayage transformations, and academy training.', 'Mon - Sat, 11:00 AM - 7:00 PM', 'https://instagram.com/rashidsalon_', 'https://facebook.com/rashid', 1),
('Meera Sharma', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&h=600&q=80', '10 Years', 'Bridal Makeup & Hair Expert', 'Lead bridal and aesthetic director. Certified celebrity makeup artist specializing in HD bridal makeups, high-end hair extensions, and skin styling.', 'Wed - Sun, 10:00 AM - 6:00 PM', 'https://instagram.com/', 'https://facebook.com/', 2),
('Amit Verma', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=600&q=80', '8 Years', 'Creative Hair Stylist & Barbering', 'Expert in modern grooming, creative hair tattooing, chemical treatments (Keratin, Botox), and advanced hair cutting techniques.', 'Everyday except Tuesday, 10:00 AM - 8:00 PM', 'https://instagram.com/', 'https://facebook.com/', 3),
('Sonia Kapoor', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=600&q=80', '6 Years', 'Nail Art & Skin Care Specialist', 'Aesthetician specializing in advanced hydra-facials, gel extensions, custom nail designs, and skin therapies.', 'Everyday, 10:00 AM - 7:00 PM', 'https://instagram.com/', 'https://facebook.com/', 4);

-- ============ SEED SERVICES ============
DELETE FROM public.services;
INSERT INTO public.services (name, slug, category, price, duration, description, image_url, featured, sort_order) VALUES
('Classic Haircut & Blowdry', 'classic-haircut-blowdry', 'Hair', 1200.00, '45 min', 'Includes consultation, relaxing hair wash, customized haircut, and professional blow-dry styling suited for your face structure.', 'https://images.unsplash.com/photo-1620331350878-958d504505ee?auto=format&fit=crop&w=800&q=80', true, 1),
('Balayage & Hair Contouring', 'balayage-hair-contouring', 'Color', 4500.00, '180 min', 'Hand-painted custom highlighting technique to add soft, natural dimension. Includes toner, gloss, and signature wave styling.', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80', true, 2),
('Signature Keratin Treatment', 'signature-keratin-treatment', 'Hair', 3500.00, '120 min', 'Deeply infuses protein into the hair cuticles to eliminate frizz, restore moisture, and add intense shine. Lasts 3-4 months.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', true, 3),
('Celebrity HydraFacial', 'celebrity-hydrafacial', 'Skin', 2500.00, '60 min', 'Multi-step skin resurfacing treatment using patented technology to cleanse, exfoliate, extract impurities, and hydrate with rich serums.', 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80', false, 4),
('Bridal Makeup (HD/Airbrush)', 'bridal-makeup-hd-airbrush', 'Bridal', 15000.00, '150 min', 'Full premium bridal transformation by our lead stylist Meera. Includes hair styling, draping, lash extensions, and flawless long-wear airbrush makeup.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', true, 5),
('Luxury Gel Extensions & Art', 'luxury-gel-extensions-art', 'Nails', 1800.00, '90 min', 'Premium gel extensions with long-lasting strength. Includes prep, extensions, shape, and custom hand-painted nail art of your choice.', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', false, 6);

-- ============ SEED COURSES ============
DELETE FROM public.courses;
INSERT INTO public.courses (name, slug, duration, fee, description, curriculum, image_url, certification, featured, sort_order) VALUES
('Diploma in Professional Hair Styling', 'diploma-hair-styling', '3 Months', 45000.00, 'Comprehensive course from basics to advanced salon floor styling, textures, chemical formulations, and barbering. Perfect for beginners.', '[
  {"title": "Hair Science & Consultation", "description": "Understanding hair texture, scalp health, sanitization, and client communications."},
  {"title": "Precision Hair Cutting", "description": "Classic and contemporary haircuts, sectioning patterns, and scissor techniques."},
  {"title": "Chemical Processes", "description": "Keratin, smoothing, rebonding, and basic coloring principles."}
]'::jsonb, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', 'Rashid Academy Certified Stylist', true, 1),
('Masterclass in Bridal Makeup Artistry', 'bridal-makeup-masterclass', '6 Weeks', 35000.00, 'Learn HD, Airbrush, Traditional, and Editorial makeup. High hands-on practice with professional models and a premium portfolio shoot.', '[
  {"title": "Skin Prep & Base Color Theory", "description": "Understanding skin undertones, color correction, and creating the perfect flawless base."},
  {"title": "Advanced Eye Makeup", "description": "Smokey eyes, glitter cut creases, and brow sculpting techniques."},
  {"title": "Airbrush & HD Techniques", "description": "Mastering the airbrush gun, contouring, highlighting, and false lash application."}
]'::jsonb, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Advanced Professional MUA Diploma', true, 2),
('Advanced Hair Coloring & Balayage Specialization', 'hair-coloring-balayage-specialization', '4 Weeks', 25000.00, 'For working stylists. Master the art of freehand balayage, ombre, baby-lights, color correction, and custom color formulations.', '[
  {"title": "Lightening & Decoloration", "description": "Understanding lifting levels, developers, and avoiding hair damage."},
  {"title": "Freehand Painting (Balayage)", "description": "Placement strategies, root melting, and seamless blending."},
  {"title": "Color Correction & Toners", "description": "Neutralizing unwanted undertones and glossing formulations."}
]'::jsonb, 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80', 'Rashid Certified Color Specialist', true, 3);

-- ============ SEED GALLERY ============
DELETE FROM public.gallery;
INSERT INTO public.gallery (image_url, caption, category, sort_order) VALUES
('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80', 'Our Main Salon Floor', 'Salon', 1),
('https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Royal Bridal Look', 'Bridal', 2),
('https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80', 'Caramel Balayage Blend', 'Color', 3),
('https://images.unsplash.com/photo-1620331350878-958d504505ee?auto=format&fit=crop&w=800&q=80', 'Women Precision Haircut', 'Haircut', 4),
('https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', 'Luxury Chrome Nails', 'Nails', 5),
('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', 'Hands-on Student Training', 'Academy', 6);

-- ============ SEED REVIEWS ============
DELETE FROM public.reviews;
INSERT INTO public.reviews (name, rating, review) VALUES
('Rohan Sharma', 5, 'Got a haircut and balayage done by Rashid. Absolutely stellar! He explained exactly what color would match my skin tone. Best salon in Jalandhar.'),
('Priya Malhotra', 5, 'Enrolled in the 6-week bridal makeup course. Meera is an amazing teacher. The hands-on practice on real models was extremely helpful for my confidence.'),
('Karanpreet Singh', 5, 'Very professional staff and premium environment. Their hydra-facial is highly recommended. Will definitely visit again.');
