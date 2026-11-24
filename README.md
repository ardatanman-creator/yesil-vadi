# Yeşil Vadi — Sonsuz Koşu

Yandan görünümlü, 2B sonsuz koşu oyunu. Şapkalı çiftçi vadide otomatik olarak
koşar; engellerden zıplayarak kaç, altınları topla ve mümkün olduğunca uzağa git.

## Çalıştırma

`index.html` dosyasını tarayıcıda açman yeterli. Sunucu veya kurulum gerekmez.
Rekor, tarayıcının `localStorage` alanında (`yesil-vadi-best`) saklanır.

## Kontroller

| Girdi | İşlev |
| --- | --- |
| `Boşluk` / `↑` / `W` / `Enter` | Zıpla, koşuyu başlat, yeniden başlat |
| Tıklama / dokunma | Zıpla, koşuyu başlat, yeniden başlat |

Aynı tuş hem başlatma hem zıplama için kullanılır. Oyun bittiğinde kısa bir
bekleme süresinden sonra tekrar başlatılabilir.

## Puanlama

- **Mesafe:** Kat edilen her 20 birim 1 puan.
- **Altın:** Her altın +25 puan.
- **Rekor:** En yüksek skor otomatik kaydedilir.

Koşu sırasında hız zamanla artar; mesafe uzadıkça engeller sıklaşır ve daha
yakın ikili engel grupları çıkabilir.

## Dosya yapısı

| Dosya | İçerik |
| --- | --- |
| `index.html` | Sayfa, HUD ve başlangıç/oyun sonu kaplaması |
| `style.css` | HUD, kart ve mobil düzen stilleri |
| `js/config.js` | Sabitler, oyun durumu, oyuncu, engel türleri, DOM referansları |
| `js/utils.js` | Matematik ve Canvas çizim yardımcıları |
| `js/draw-bg.js` | Gökyüzü, bulutlar, kuşlar, tepeler, ağaç hattı ve kayan zemin |
| `js/draw-entities.js` | Engeller, altınlar ve parçacıklar |
| `js/draw-runner.js` | Yandan koşan karakter ve pozları |
| `js/game.js` | Girdi, fizik, engel üretimi, çarpışma, skor ve oyun döngüsü |

## Özellikler

- Otomatik koşu, sabit yükseklikte zıplama ve adil çarpışma kutuları
- Kaya, kütük, çit, tomruk ve çalı olmak üzere beş engel türü
- Engel üstünde altın yayları ve toplanabilir altınlar
- Paralaks gökyüzü, tepeler ve ağaç hattı; kayan toprak zemin
- Koşma, zıplama, düşme ve bekleme pozları; toz, iniş esnemesi ve ekran sarsıntısı
- Başlangıç ve oyun sonu kartları, canlı skor/altın/rekor göstergesi
- Masaüstü ve mobil için duyarlı HUD, dokunmatik kontrol

## Sonraki adım fikirleri

- Zıplama ve altın ses efektleri, arka plan müziği
- Farklı karakterler ve kostümler
- Güçlendirmeler (kalkan, mıknatıs, çift zıplama)
- Gündüz-gece döngüsü ve hava durumu
- Günlük görevler ve lider tablosu
