insert into public.companies(name,normalized_name,industry,entrepreneurial_core,business_flywheel) values
('Costco 好市多','costco好市多','會員制零售','用有限品項、低加價率換取長期信任','低價 → 續會 → 規模採購 → 更低成本'),
('任天堂','任天堂','互動娛樂','以玩法創新優先於規格競賽','獨特硬體 → 第一方內容 → 玩家規模 → 開發者投入') on conflict do nothing;
insert into public.leaders(name,normalized_name,regime,era_context,core_dilemma) values
('唐太宗李世民','唐太宗李世民','唐朝','貞觀初年','由軍事勝利轉成穩定治理'),
('漢高祖劉邦','漢高祖劉邦','漢朝','秦末漢初','資源與軍事能力弱於項羽') on conflict do nothing;
insert into public.ips(name,normalized_name,ip_type,core_narrative) values
('航海王 ONE PIECE','航海王onepiece','漫畫／動畫 IP','追尋自由與大秘寶的長程冒險'),
('寶可夢','寶可夢','遊戲 IP','蒐集、培育、交換與對戰') on conflict do nothing;
insert into public.stratagems(title,source,interpretation) values
('上下同欲者勝','《孫子兵法．謀攻篇》','共同承諾必須落在利益、制度與行為的一致。'),
('避實擊虛','《孫子兵法．虛實篇》','在未被滿足的使用情境建立優勢。') on conflict do nothing;
