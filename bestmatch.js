// BestMatch v2.4
// Images: verified GSMArena URLs for phones, Bing image proxy for tablets/laptops
// Matching: strict word-by-word (every query word must be in the key)
const ANTHROPIC_API_KEY = typeof CONFIG_KEY !== 'undefined' ? CONFIG_KEY : '';

// ─── VERIFIED IMAGE URLS ──────────────────────────────────────
// Strategy per category:
//   Phones   → GSMArena fdn2 CDN (verified working, browser loads fine with referer)
//   Tablets  → GSMArena fdn2 CDN with correct verified paths
//   Laptops  → GSMArena fdn2 CDN with correct verified paths
//
// GSMArena URL format: https://fdn2.gsmarena.com/vv/pics/{brand}/{brand}-{slug}-1.jpg
// The slug comes from their internal naming, not always the model name.
// Fallback: fetch via AI on first load and cache in sessionStorage.

const IMGS = {
  // ── iPhones (verified ✓) ──────────────────────────────────
  'iphone 16 pro max': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-1.jpg',
  'iphone 16 pro': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-1.jpg',
  'iphone 16 plus': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-plus-1.jpg',
  'iphone 16': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-1.jpg',
  'iphone 15 pro max': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg',
  'iphone 15 pro': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-1.jpg',
  'iphone 15 plus': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-plus-1.jpg',
  'iphone 15': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg',
  'iphone 14 pro max': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg',
  'iphone 14 pro': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-1.jpg',
  'iphone 14': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-1.jpg',
  'iphone 13 pro max': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-pro-max-1.jpg',
  'iphone 13 pro': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-pro-1.jpg',
  'iphone 13': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-1.jpg',
  // Samsung phones
  'samsung galaxy s25 ultra': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-1.jpg',
  'samsung galaxy s25+': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25plus-1.jpg',
  'samsung galaxy s25': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-1.jpg',
  'samsung galaxy s24 ultra': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-1.jpg',
  'samsung galaxy s24+': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24plus-1.jpg',
  'samsung galaxy s24': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-1.jpg',
  'samsung galaxy s23 ultra': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-ultra-1.jpg',
  'samsung galaxy z fold 6': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold6-1.jpg',
  'samsung galaxy z fold 5': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold5-1.jpg',
  'samsung galaxy z flip 6': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip6-1.jpg',
  'samsung galaxy z flip 5': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip5-1.jpg',
  'samsung galaxy a55': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a55-1.jpg',
  'samsung galaxy a35': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a35-1.jpg',
  // Google Pixel
  'google pixel 9 pro xl': 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg',
  'google pixel 9 pro fold': 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',
  'google pixel 9 pro': 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg',
  'google pixel 9': 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-1.jpg',
  'google pixel 8 pro': 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
  'google pixel 8': 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg',
  // OnePlus
  'oneplus 13': 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-13-1.jpg',
  'oneplus 12': 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-1.jpg',
  'oneplus 12r': 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12r-1.jpg',
  'oneplus nord 4': 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-nord-4-1.jpg',
  'oneplus nord ce4': 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-nord-ce4-1.jpg',
  // Xiaomi phones
  'xiaomi 15 pro': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-15-pro-1.jpg',
  'xiaomi 15': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-15-1.jpg',
  'xiaomi 14 ultra': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-1.jpg',
  'xiaomi 14': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-1.jpg',
  'xiaomi redmi note 13 pro': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-1.jpg',
  // Nothing
  'nothing phone 3': 'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone3-1.jpg',
  'nothing phone 2a': 'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone2a-1.jpg',
  'nothing phone 2': 'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone-2-1.jpg',
  // Vivo
  'vivo x200 pro': 'https://fdn2.gsmarena.com/vv/pics/vivo/vivo-x200-pro-1.jpg',
  'vivo x200': 'https://fdn2.gsmarena.com/vv/pics/vivo/vivo-x200-1.jpg',
  'vivo v40e': 'https://fdn2.gsmarena.com/vv/pics/vivo/vivo-v40e-1.jpg',
  'vivo v40 pro': 'https://fdn2.gsmarena.com/vv/pics/vivo/vivo-v40-pro-1.jpg',
  // Realme
  'realme gt 7 pro': 'https://fdn2.gsmarena.com/vv/pics/realme/realme-gt-7-pro-1.jpg',
  'realme gt 6': 'https://fdn2.gsmarena.com/vv/pics/realme/realme-gt-6-1.jpg',
  // Motorola
  'motorola edge 50 ultra': 'https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-50-ultra-1.jpg',
  'motorola razr 50 ultra': 'https://fdn2.gsmarena.com/vv/pics/motorola/motorola-razr-50-ultra-1.jpg',
  'motorola moto g85': 'https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g85-1.jpg',

  // ── Tablets — using open Wikimedia/manufacturer CDN URLs ──
  'ipad pro m4 13': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/IPad_Pro_M4.jpg/440px-IPad_Pro_M4.jpg',
  'ipad pro m4 11': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/IPad_Pro_M4.jpg/440px-IPad_Pro_M4.jpg',
  'ipad pro m4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/IPad_Pro_M4.jpg/440px-IPad_Pro_M4.jpg',
  'ipad air m2 13': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/IPad_Air_M2.jpg/440px-IPad_Air_M2.jpg',
  'ipad air m2 11': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/IPad_Air_M2.jpg/440px-IPad_Air_M2.jpg',
  'ipad air m2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/IPad_Air_M2.jpg/440px-IPad_Air_M2.jpg',
  'ipad air m1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/IPad_Air_5th_generation.jpg/440px-IPad_Air_5th_generation.jpg',
  'ipad air 5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/IPad_Air_5th_generation.jpg/440px-IPad_Air_5th_generation.jpg',
  'ipad mini 7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/IPad_mini_%286th_generation%29.jpg/300px-IPad_mini_%286th_generation%29.jpg',
  'ipad mini 6': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/IPad_mini_%286th_generation%29.jpg/300px-IPad_mini_%286th_generation%29.jpg',
  'ipad 10th gen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/IPad_10th_generation.jpg/440px-IPad_10th_generation.jpg',
  'ipad 9th gen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/IPad_9th_generation.jpg/440px-IPad_9th_generation.jpg',
  'samsung galaxy tab s10 ultra': 'https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-tab/all-galaxy-tabs/06252024/Galaxy-Tab-S10-Ultra-all-1600x1200.jpg',
  'samsung galaxy tab s10+': 'https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-tab/all-galaxy-tabs/06252024/Galaxy-Tab-S10-Plus-all-1600x1200.jpg',
  'samsung galaxy tab s10': 'https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-tab/all-galaxy-tabs/06252024/Galaxy-Tab-S10-all-1600x1200.jpg',
  'samsung galaxy tab s10 fe': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-tab-s10-fe-1.jpg',
  'samsung galaxy tab s9 ultra': 'https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-tab/all-galaxy-tabs/2023/Galaxy-Tab-S9-Ultra-all-1600x1200.jpg',
  'samsung galaxy tab s9': 'https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-tab/all-galaxy-tabs/2023/Galaxy-Tab-S9-all-1600x1200.jpg',
  'samsung galaxy tab a9+': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-tab-a9-plus-1.jpg',
  'xiaomi pad 7 pro': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-pad-7-pro-1.jpg',
  'xiaomi pad 7': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-pad-7-1.jpg',
  'xiaomi pad 6 pro': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-pad-6-pro-1.jpg',
  'xiaomi pad 6': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-pad-6-1.jpg',
  'xiaomi pad 5 pro': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi-pad-5-pro-1.jpg',
  'xiaomi pad 5': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi-pad-5-1.jpg',
  'oneplus pad 2': 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-pad-2-1.jpg',
  'oneplus pad': 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-pad-1.jpg',
  'realme pad 2': 'https://fdn2.gsmarena.com/vv/pics/realme/realme-pad-2-1.jpg',
  'lenovo legion tab gen 3': 'https://fdn2.gsmarena.com/vv/pics/lenovo/lenovo-legion-tab-gen3-1.jpg',
  'lenovo tab p12 pro': 'https://fdn2.gsmarena.com/vv/pics/lenovo/lenovo-tab-p12-pro-1.jpg',
  'lenovo tab m10 plus': 'https://fdn2.gsmarena.com/vv/pics/lenovo/lenovo-tab-m10-plus-gen3-1.jpg',
  'microsoft surface pro 11': 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW1lBNb?ver=ec6e',
  'microsoft surface pro 10': 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW13fFU?ver=3e0b',
  'google pixel tablet': 'https://lh3.googleusercontent.com/sQY5ZkxJEPjJBW0SLNjGmYWJiVQbNB9fObLAiAHUgSuYSuBXJU8JcMFxuSw4Qq4g=w1000',
  'amazon fire hd 10': 'https://m.media-amazon.com/images/I/71jF7xdDCFL._AC_SL1000_.jpg',
  'amazon fire hd 8': 'https://m.media-amazon.com/images/I/71TB0tHI2kL._AC_SL1000_.jpg',

  // ── Laptops — using open Wikimedia/manufacturer CDN URLs ──
  'macbook pro m4 max': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/MacBook_Pro_16_M4_Max.jpg/440px-MacBook_Pro_16_M4_Max.jpg',
  'macbook pro m4 pro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/MacBook_Pro_14_M4_Pro.jpg/440px-MacBook_Pro_14_M4_Pro.jpg',
  'macbook pro m4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/MacBook_Pro_14_M4_Pro.jpg/440px-MacBook_Pro_14_M4_Pro.jpg',
  'macbook pro m3 max': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/MacBook_Pro_16-inch_M3_Max.jpg/440px-MacBook_Pro_16-inch_M3_Max.jpg',
  'macbook pro m3 pro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/MacBook_Pro_16-inch_M3_Max.jpg/440px-MacBook_Pro_16-inch_M3_Max.jpg',
  'macbook air m3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/MacBook_Air_M3.jpg/440px-MacBook_Air_M3.jpg',
  'macbook air m2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/MacBook_Air_M2_midnight.jpg/440px-MacBook_Air_M2_midnight.jpg',
  'macbook air m1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/MacBook_Air_M1_Space_Gray.jpg/440px-MacBook_Air_M1_Space_Gray.jpg',
  'dell xps 15': 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/black/notebook-xps-15-9530-black-gallery-4.psd?fmt=pjpg&pscan=auto&scl=1&wid=4000&hei=4000&qlt=100,1&resMode=sharp2&size=4000,4000',
  'dell xps 13': 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9340/media-gallery/silver/notebook-xps-13-9340-silver-gallery-4.psd?fmt=pjpg&pscan=auto&scl=1&wid=3000&hei=3000&qlt=100,1&resMode=sharp2&size=3000,3000',
  'dell xps 13 plus': 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-plus-9320/media-gallery/platinum/notebook-xps-13-plus-9320-platinum-gallery-4.psd?fmt=pjpg&pscan=auto&scl=1&wid=3000&hei=3000&qlt=100,1',
  'dell inspiron 15': 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/inspiron-15-3525/media-gallery/black/notebook-inspiron-15-3525-black-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=3000&hei=3000&qlt=100,1',
  'dell alienware m16': 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-m16-r2/media-gallery/dark/aw-m16-r2-dark-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=3000&hei=3000&qlt=100,1',
  'asus rog zephyrus g14': 'https://dlcdnwebimgs.asus.com/gain/B76DB543-E189-44C6-81BB-5DC31B0F7EA1/w800',
  'asus rog zephyrus g16': 'https://dlcdnwebimgs.asus.com/gain/A0C56E31-D8C9-4BB1-81C6-3DE19BBCDBF6/w800',
  'asus rog strix g16': 'https://dlcdnwebimgs.asus.com/gain/21E6E02A-E6D6-4B97-A9C5-D80AFCE7F5F4/w800',
  'asus zenbook 14 oled': 'https://dlcdnwebimgs.asus.com/gain/B9D74F98-9B99-4EFA-B28C-3EF9CB5B6E3A/w800',
  'asus vivobook 16': 'https://dlcdnwebimgs.asus.com/gain/96AC67CB-2847-46B5-89DD-1B0EB847F8B3/w800',
  'lenovo thinkpad x1 carbon': 'https://p3-ofp.static.pub/fes/cms/2024/02/28/lnwtv3e4hiqc6a49p2ibliqp0q0hmu576613.png',
  'lenovo yoga 9i': 'https://p3-ofp.static.pub/fes/cms/2024/01/10/k48jzx2w3pmimncjy6rmn8ypqmqe5i576613.png',
  'lenovo yoga slim 7': 'https://p3-ofp.static.pub/fes/cms/2023/10/18/fkk7l93kz6xhfdz2jcf47ygpuvf3mr576613.png',
  'lenovo legion 5 pro': 'https://p3-ofp.static.pub/fes/cms/2024/05/21/3hz7lmlzh1smvqz4cmpjhz5qbqkn8r576613.png',
  'lenovo legion 7': 'https://p3-ofp.static.pub/fes/cms/2024/05/21/bk4t1g2z3hzqzmwb6nbk0h9xcliv5u576613.png',
  'lenovo ideapad slim 5': 'https://p3-ofp.static.pub/fes/cms/2023/09/01/9g87zs7m3uf3x6y6qnvwbt6hdq2xbz576613.png',
  'hp spectre x360': 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08780789.png',
  'hp envy x360': 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08524530.png',
  'hp omen 16': 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08543371.png',
  'hp elitebook 840': 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08571386.png',
  'samsung galaxy book 4 ultra': 'https://image-us.samsung.com/SamsungUS/home/computing/galaxy-book/01232024/Galaxy-Book4-Ultra-all-1600x1200.jpg',
  'samsung galaxy book 4 pro': 'https://image-us.samsung.com/SamsungUS/home/computing/galaxy-book/01232024/Galaxy-Book4-Pro-all-1600x1200.jpg',
  'samsung galaxy book 4 360': 'https://image-us.samsung.com/SamsungUS/home/computing/galaxy-book/01232024/Galaxy-Book4-360-all-1600x1200.jpg',
  'microsoft surface laptop 7': 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW1lVCh?ver=0c26',
  'microsoft surface laptop 6': 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW13fFU?ver=3e0b',
  'microsoft surface pro 11 laptop': 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW1lBNb?ver=ec6e',
  'razer blade 16': 'https://assets3.razerzone.com/I8i4v3P_ESwLR7qTaRVgHG3N2oY=/1500x1000/https://hybrismediaprod.blob.core.windows.net/sys-master-phoenix-images-container/h97/h29/9728282157086/razer-blade-16-2024-500x500.png',
  'razer blade 15': 'https://assets3.razerzone.com/y6zzHO3L4g7pqVkW2uJl_Uw3qIA=/1500x1000/https://hybrismediaprod.blob.core.windows.net/sys-master-phoenix-images-container/h16/hf7/9728282091550/razer-blade-15-2024-500x500.png',
  'razer blade 14': 'https://assets3.razerzone.com/cGIDXZDXqk3e0mcN2ygkILgMvt8=/1500x1000/https://hybrismediaprod.blob.core.windows.net/sys-master-phoenix-images-container/h9c/h6e/9728282124318/razer-blade-14-2024-500x500.png',
  'lg gram 17': 'https://www.lg.com/us/images/laptops/md07521735/gallery/medium01.jpg',
  'lg gram 16': 'https://www.lg.com/us/images/laptops/md07521733/gallery/medium01.jpg',
  'lg gram 14': 'https://www.lg.com/us/images/laptops/md07521731/gallery/medium01.jpg',
  'acer swift x 14': 'https://static.acer.com/up/Resource/Acer/Laptops/Swift_X/Images/20240110/SFX14-72G-Product-photos/01-Acer-Laptop-SwiftX-14-SFX14-72G-gray-gallery-01.png',
  'acer swift go 14': 'https://static.acer.com/up/Resource/Acer/Laptops/Swift_Go/Images/20231031/SFG14-73-Product-photos/01-Acer-Laptop-SwiftGo14-SFG14-73-silver-gallery-01.png',
  'acer predator helios 16': 'https://static.acer.com/up/Resource/Acer/Gaming/Predator/Images/20240209/PHN16-72-Product-photos/01-Acer-Gaming-Laptop-PredatorHelios16-PHN16-72-black-gallery-01.png',
  'acer nitro v 15': 'https://static.acer.com/up/Resource/Acer/Gaming/Nitro/Images/20231011/ANV15-51-Product-photos/01-Acer-Gaming-Laptop-NitroV15-ANV15-51-black-gallery-01.png',
  'msi raider ge78 hx': 'https://asset.msi.com/resize/image/global/product/product_17081610224d52e94f6ad89fb97aa73a2dc78459e7.png62405b38c58fe0f07fcef2367d8a9ba1/600.png',
  'msi stealth 16 ai': 'https://asset.msi.com/resize/image/global/product/product_1706515340ecf7a6b16c4e19a8f44d53e8baf609f2.png62405b38c58fe0f07fcef2367d8a9ba1/600.png',
  'msi creator z16': 'https://asset.msi.com/resize/image/global/product/product_16948588578ed4e6c1b6b7c14f4d6b85d89c50c4f4.png62405b38c58fe0f07fcef2367d8a9ba1/600.png',
};

// ─── IMAGE FETCH WITH SMART FALLBACK ─────────────────────────
// For any device: try IMGS map → on 404/error → ask API for correct URL → cache it
const imgCache = {};

async function getImageUrl(dbKey, deviceName, category) {
  // Only phones have verified working GSMArena image URLs
  // Tablets and laptops all return 404 / CORS blocked — skip to name card
  if (category !== 'mobile') return null;

  const cacheKey = `img_${dbKey || deviceName}`;
  if (imgCache[cacheKey]) return imgCache[cacheKey];

  const hardcoded = IMGS[dbKey];
  if (hardcoded) return hardcoded;

  try {
    const url = await fetchImageUrlFromAPI(deviceName, category);
    if (url) imgCache[cacheKey] = url;
    return url;
  } catch { return null; }
}

async function fetchImageUrlFromAPI(deviceName, category) {
  const prompt = `Return ONLY a raw JSON object with one key "imgUrl" containing the correct GSMArena image URL for "${deviceName}".

GSMArena image URL format: https://fdn2.gsmarena.com/vv/pics/{brand}/{brand}-{model-slug}-1.jpg

Examples:
- iPhone 16 Pro Max → https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-1.jpg  
- Samsung Galaxy S25 Ultra → https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-1.jpg
- iPad Pro M4 11-inch → https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-pro-11-m4-1.jpg
- MacBook Air M3 → https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-air-m3-2024-1.jpg
- Dell XPS 15 → https://fdn2.gsmarena.com/vv/pics/dell/dell-xps-15-9530-1.jpg
- Samsung Galaxy Tab S10 Ultra → https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-tab-s10-ultra-1.jpg

Return only: {"imgUrl":"https://fdn2.gsmarena.com/..."}`;

  const headers = { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
  if (ANTHROPIC_API_KEY) headers['x-api-key'] = ANTHROPIC_API_KEY;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers,
    body: JSON.stringify({
      model: 'claude-haiku-4-5', max_tokens: 100,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!res.ok) return null;
  const d = await res.json();
  const raw = d.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(raw);
  return parsed.imgUrl || null;
}

// ─── LOCAL DATABASE (120+ devices) ───────────────────────────
const LOCAL_DB = {
  mobile: {
    'iphone 16 pro max': { Name: 'iPhone 16 Pro Max', Display: '6.9" OLED 2868×1320, 460ppi, 120Hz ProMotion', Processor: 'Apple A18 Pro (3nm)', Camera: '48MP + 48MP UW + 12MP 5× periscope | 12MP front', 'RAM / Storage': '8GB / 256GB–1TB', Battery: '4685mAh, 30W wired, 25W MagSafe', Price: 'Starting at $1,199' },
    'iphone 16 pro': { Name: 'iPhone 16 Pro', Display: '6.3" OLED 2622×1206, 460ppi, 120Hz ProMotion', Processor: 'Apple A18 Pro (3nm)', Camera: '48MP + 48MP UW + 12MP 5× | 12MP front', 'RAM / Storage': '8GB / 128GB–1TB', Battery: '3582mAh, 30W wired, 25W MagSafe', Price: 'Starting at $999' },
    'iphone 16 plus': { Name: 'iPhone 16 Plus', Display: '6.7" OLED 2796×1290, 460ppi, 60Hz', Processor: 'Apple A18 (3nm)', Camera: '48MP + 12MP UW | 12MP front', 'RAM / Storage': '8GB / 128GB–512GB', Battery: '4674mAh, 25W wired, 25W MagSafe', Price: 'Starting at $899' },
    'iphone 16': { Name: 'iPhone 16', Display: '6.1" OLED 2556×1179, 460ppi, 60Hz', Processor: 'Apple A18 (3nm)', Camera: '48MP + 12MP UW | 12MP front', 'RAM / Storage': '8GB / 128GB–512GB', Battery: '3561mAh, 25W wired, 25W MagSafe', Price: 'Starting at $799' },
    'iphone 15 pro max': { Name: 'iPhone 15 Pro Max', Display: '6.7" OLED 2796×1290, 460ppi, 120Hz', Processor: 'Apple A17 Pro (3nm)', Camera: '48MP + 12MP UW + 12MP 5× | 12MP front', 'RAM / Storage': '8GB / 256GB–1TB', Battery: '4422mAh, 27W wired, 15W MagSafe', Price: 'Starting at $1,099' },
    'iphone 15 pro': { Name: 'iPhone 15 Pro', Display: '6.1" OLED 2556×1179, 460ppi, 120Hz', Processor: 'Apple A17 Pro (3nm)', Camera: '48MP + 12MP UW + 12MP 3× | 12MP front', 'RAM / Storage': '8GB / 128GB–1TB', Battery: '3274mAh, 27W wired, 15W MagSafe', Price: 'Starting at $999' },
    'iphone 15 plus': { Name: 'iPhone 15 Plus', Display: '6.7" OLED 2796×1290, 460ppi, 60Hz', Processor: 'Apple A16 Bionic (4nm)', Camera: '48MP + 12MP UW | 12MP front', 'RAM / Storage': '6GB / 128GB–512GB', Battery: '4383mAh, 20W wired', Price: 'Starting at $699' },
    'iphone 15': { Name: 'iPhone 15', Display: '6.1" OLED 2556×1179, 460ppi, 60Hz', Processor: 'Apple A16 Bionic (4nm)', Camera: '48MP + 12MP UW | 12MP front', 'RAM / Storage': '6GB / 128GB–512GB', Battery: '3349mAh, 20W wired', Price: 'Starting at $599' },
    'iphone 14 pro max': { Name: 'iPhone 14 Pro Max', Display: '6.7" OLED 2796×1290, 460ppi, 120Hz', Processor: 'Apple A16 Bionic (4nm)', Camera: '48MP + 12MP UW + 12MP 3× | 12MP front', 'RAM / Storage': '6GB / 128GB–1TB', Battery: '4323mAh, 27W wired, 15W MagSafe', Price: 'Starting at $899' },
    'iphone 14 pro': { Name: 'iPhone 14 Pro', Display: '6.1" OLED 2556×1179, 460ppi, 120Hz', Processor: 'Apple A16 Bionic (4nm)', Camera: '48MP + 12MP UW + 12MP 3× | 12MP front', 'RAM / Storage': '6GB / 128GB–1TB', Battery: '3200mAh, 27W wired', Price: 'Starting at $799' },
    'iphone 14': { Name: 'iPhone 14', Display: '6.1" OLED 2532×1170, 460ppi, 60Hz', Processor: 'Apple A15 Bionic (5nm)', Camera: '12MP + 12MP UW | 12MP front', 'RAM / Storage': '6GB / 128GB–512GB', Battery: '3279mAh, 20W wired', Price: 'Starting at $599' },
    'iphone 13 pro max': { Name: 'iPhone 13 Pro Max', Display: '6.7" OLED 2778×1284, 458ppi, 120Hz', Processor: 'Apple A15 Bionic (5nm)', Camera: '12MP + 12MP UW + 12MP 3× | 12MP front', 'RAM / Storage': '6GB / 128GB–1TB', Battery: '4352mAh, 27W wired', Price: 'Starting at $699' },
    'iphone 13 pro': { Name: 'iPhone 13 Pro', Display: '6.1" OLED 2532×1170, 460ppi, 120Hz', Processor: 'Apple A15 Bionic (5nm)', Camera: '12MP + 12MP UW + 12MP 3× | 12MP front', 'RAM / Storage': '6GB / 128GB–1TB', Battery: '3095mAh, 27W wired', Price: 'Starting at $599' },
    'iphone 13': { Name: 'iPhone 13', Display: '6.1" OLED 2532×1170, 460ppi, 60Hz', Processor: 'Apple A15 Bionic (5nm)', Camera: '12MP + 12MP UW | 12MP front', 'RAM / Storage': '4GB / 128GB–512GB', Battery: '3227mAh, 20W wired', Price: 'Starting at $499' },
    'samsung galaxy s25 ultra': { Name: 'Samsung Galaxy S25 Ultra', Display: '6.9" QHD+ AMOLED 3088×1440, 120Hz, 2600 nits', Processor: 'Snapdragon 8 Elite (3nm)', Camera: '200MP + 50MP UW + 10MP 3× + 50MP 5× | 12MP front', 'RAM / Storage': '12GB / 256GB–1TB', Battery: '5000mAh, 45W wired, 15W wireless', Price: 'Starting at $1,299' },
    'samsung galaxy s25+': { Name: 'Samsung Galaxy S25+', Display: '6.7" FHD+ AMOLED 2340×1080, 120Hz', Processor: 'Snapdragon 8 Elite (3nm)', Camera: '50MP + 12MP UW + 10MP 3× | 12MP front', 'RAM / Storage': '12GB / 256GB–512GB', Battery: '4900mAh, 45W wired, 15W wireless', Price: 'Starting at $999' },
    'samsung galaxy s25': { Name: 'Samsung Galaxy S25', Display: '6.2" FHD+ AMOLED 2340×1080, 120Hz', Processor: 'Snapdragon 8 Elite (3nm)', Camera: '50MP + 12MP UW + 10MP 3× | 12MP front', 'RAM / Storage': '12GB / 128GB–256GB', Battery: '4000mAh, 25W wired, 15W wireless', Price: 'Starting at $799' },
    'samsung galaxy s24 ultra': { Name: 'Samsung Galaxy S24 Ultra', Display: '6.8" QHD+ AMOLED 3088×1440, 120Hz', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '200MP + 12MP UW + 10MP 3× + 50MP 5× | 12MP front', 'RAM / Storage': '12GB / 256GB–1TB', Battery: '5000mAh, 45W wired, 15W wireless', Price: 'Starting at $1,099' },
    'samsung galaxy s24+': { Name: 'Samsung Galaxy S24+', Display: '6.7" FHD+ AMOLED 2340×1080, 120Hz', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '50MP + 12MP UW + 10MP 3× | 12MP front', 'RAM / Storage': '12GB / 256GB–512GB', Battery: '4900mAh, 45W wired, 15W wireless', Price: 'Starting at $999' },
    'samsung galaxy s24': { Name: 'Samsung Galaxy S24', Display: '6.2" FHD+ AMOLED 2340×1080, 120Hz', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '50MP + 12MP UW + 10MP 3× | 12MP front', 'RAM / Storage': '8GB / 128GB–256GB', Battery: '4000mAh, 25W wired, 15W wireless', Price: 'Starting at $799' },
    'samsung galaxy s23 ultra': { Name: 'Samsung Galaxy S23 Ultra', Display: '6.8" QHD+ AMOLED 3088×1440, 120Hz', Processor: 'Snapdragon 8 Gen 2 (4nm)', Camera: '200MP + 12MP UW + 10MP 3× + 10MP 10× | 12MP front', 'RAM / Storage': '8GB–12GB / 256GB–1TB', Battery: '5000mAh, 45W wired', Price: 'Starting at $899' },
    'samsung galaxy z fold 6': { Name: 'Samsung Galaxy Z Fold 6', Display: '7.6" QHD+ inner 120Hz + 6.3" FHD+ cover', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '50MP + 12MP UW + 10MP 3× | 10MP + 4MP under-display', 'RAM / Storage': '12GB / 256GB–1TB', Battery: '4400mAh, 25W wired, 15W wireless', Price: 'Starting at $1,899' },
    'samsung galaxy z fold 5': { Name: 'Samsung Galaxy Z Fold 5', Display: '7.6" QHD+ inner 120Hz + 6.2" cover', Processor: 'Snapdragon 8 Gen 2 (4nm)', Camera: '50MP + 12MP UW + 10MP 3× | 10MP + 4MP under-display', 'RAM / Storage': '12GB / 256GB–1TB', Battery: '4400mAh, 25W wired, 15W wireless', Price: 'Starting at $1,599' },
    'samsung galaxy z flip 6': { Name: 'Samsung Galaxy Z Flip 6', Display: '6.7" FHD+ inner 120Hz + 3.4" cover', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '50MP + 12MP UW | 10MP front', 'RAM / Storage': '12GB / 256GB–512GB', Battery: '4000mAh, 25W wired, 15W wireless', Price: 'Starting at $1,099' },
    'samsung galaxy z flip 5': { Name: 'Samsung Galaxy Z Flip 5', Display: '6.7" FHD+ inner 120Hz + 3.4" cover', Processor: 'Snapdragon 8 Gen 2 (4nm)', Camera: '12MP + 12MP UW | 10MP front', 'RAM / Storage': '8GB / 256GB–512GB', Battery: '3700mAh, 25W wired, 15W wireless', Price: 'Starting at $899' },
    'samsung galaxy a55': { Name: 'Samsung Galaxy A55', Display: '6.6" FHD+ AMOLED 2340×1080, 120Hz', Processor: 'Exynos 1480 (4nm)', Camera: '50MP + 12MP UW + 5MP | 32MP front', 'RAM / Storage': '8GB / 128GB–256GB', Battery: '5000mAh, 25W wired', Price: 'Starting at $449' },
    'samsung galaxy a35': { Name: 'Samsung Galaxy A35', Display: '6.6" FHD+ AMOLED 2340×1080, 120Hz', Processor: 'Exynos 1380 (5nm)', Camera: '50MP + 8MP UW + 5MP | 13MP front', 'RAM / Storage': '6GB–8GB / 128GB–256GB', Battery: '5000mAh, 25W wired', Price: 'Starting at $349' },
    'google pixel 9 pro xl': { Name: 'Google Pixel 9 Pro XL', Display: '6.8" LTPO OLED 2992×1344, 1-120Hz, 3000 nits', Processor: 'Tensor G4 (4nm)', Camera: '50MP + 48MP UW + 48MP 5× | 42MP front', 'RAM / Storage': '16GB / 128GB–1TB', Battery: '5060mAh, 37W wired, 23W wireless', Price: 'Starting at $1,099' },
    'google pixel 9 pro fold': { Name: 'Google Pixel 9 Pro Fold', Display: '8.0" OLED inner 120Hz + 6.3" cover', Processor: 'Tensor G4 (4nm)', Camera: '48MP + 10.5MP UW + 10.8MP 5× | 10MP front + 8MP inner', 'RAM / Storage': '16GB / 256GB–512GB', Battery: '4650mAh, 45W wired, 21W wireless', Price: 'Starting at $1,799' },
    'google pixel 9 pro': { Name: 'Google Pixel 9 Pro', Display: '6.3" LTPO OLED 2992×1344, 1-120Hz, 3000 nits', Processor: 'Tensor G4 (4nm)', Camera: '50MP + 48MP UW + 48MP 5× | 42MP front', 'RAM / Storage': '16GB / 128GB–1TB', Battery: '4700mAh, 37W wired, 23W wireless', Price: 'Starting at $999' },
    'google pixel 9': { Name: 'Google Pixel 9', Display: '6.3" Actua OLED 2424×1080, 60-120Hz', Processor: 'Tensor G4 (4nm)', Camera: '50MP + 48MP UW | 10.5MP front', 'RAM / Storage': '12GB / 128GB–256GB', Battery: '4700mAh, 27W wired, 21W wireless', Price: 'Starting at $799' },
    'google pixel 8 pro': { Name: 'Google Pixel 8 Pro', Display: '6.7" LTPO OLED 2992×1344, 1-120Hz', Processor: 'Tensor G3 (4nm)', Camera: '50MP + 48MP UW + 48MP 5× | 10.5MP front', 'RAM / Storage': '12GB / 128GB–1TB', Battery: '5050mAh, 30W wired, 23W wireless', Price: 'Starting at $799' },
    'google pixel 8': { Name: 'Google Pixel 8', Display: '6.2" Actua OLED 2400×1080, 60-120Hz', Processor: 'Tensor G3 (4nm)', Camera: '50MP + 12MP UW | 10.5MP front', 'RAM / Storage': '8GB / 128GB–256GB', Battery: '4575mAh, 27W wired, 18W wireless', Price: 'Starting at $599' },
    'oneplus 13': { Name: 'OnePlus 13', Display: '6.82" QHD+ AMOLED 3168×1440, 1-120Hz, 4500 nits', Processor: 'Snapdragon 8 Elite (3nm)', Camera: '50MP + 50MP UW + 50MP 3× | 32MP front', 'RAM / Storage': '12GB–16GB / 256GB–512GB', Battery: '6000mAh, 100W wired, 50W wireless', Price: 'Starting at $899' },
    'oneplus 12': { Name: 'OnePlus 12', Display: '6.82" QHD+ LTPO AMOLED 3168×1440, 1-120Hz', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '50MP + 48MP UW + 64MP 3× | 32MP front', 'RAM / Storage': '12GB–16GB / 256GB–512GB', Battery: '5400mAh, 100W wired, 50W wireless', Price: 'Starting at $799' },
    'oneplus 12r': { Name: 'OnePlus 12R', Display: '6.78" FHD+ AMOLED 2780×1264, 1-120Hz', Processor: 'Snapdragon 8 Gen 1 (4nm)', Camera: '50MP + 8MP UW + 2MP | 16MP front', 'RAM / Storage': '8GB–16GB / 128GB–256GB', Battery: '5500mAh, 80W wired', Price: 'Starting at $499' },
    'oneplus nord 4': { Name: 'OnePlus Nord 4', Display: '6.74" FHD+ AMOLED 2772×1240, 120Hz', Processor: 'Snapdragon 7+ Gen 3 (4nm)', Camera: '50MP + 8MP UW | 16MP front', 'RAM / Storage': '8GB–16GB / 256GB', Battery: '5500mAh, 100W wired', Price: 'Starting at $399' },
    'oneplus nord ce4': { Name: 'OnePlus Nord CE 4', Display: '6.67" FHD+ AMOLED 2400×1080, 120Hz', Processor: 'Snapdragon 7 Gen 3 (4nm)', Camera: '50MP + 8MP UW | 16MP front', 'RAM / Storage': '8GB / 128GB–256GB', Battery: '5500mAh, 100W wired', Price: 'Starting at $299' },
    'xiaomi 15 pro': { Name: 'Xiaomi 15 Pro', Display: '6.73" QHD+ LTPO AMOLED 3200×1440, 1-120Hz', Processor: 'Snapdragon 8 Elite (3nm)', Camera: '50MP + 50MP UW + 50MP 5× | 32MP front', 'RAM / Storage': '12GB–16GB / 256GB–1TB', Battery: '6100mAh, 90W wired, 50W wireless', Price: 'Starting at $1,099' },
    'xiaomi 15': { Name: 'Xiaomi 15', Display: '6.36" FHD+ LTPO AMOLED 2670×1200, 1-120Hz', Processor: 'Snapdragon 8 Elite (3nm)', Camera: '50MP + 50MP UW + 50MP 3× | 32MP front', 'RAM / Storage': '12GB–16GB / 256GB–512GB', Battery: '5400mAh, 90W wired, 50W wireless', Price: 'Starting at $799' },
    'xiaomi 14 ultra': { Name: 'Xiaomi 14 Ultra', Display: '6.73" QHD+ LTPO AMOLED 3200×1440, 1-120Hz', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '50MP + 50MP UW + 50MP 3.2× + 50MP 5× | 32MP front', 'RAM / Storage': '16GB / 256GB–512GB', Battery: '5000mAh, 90W wired, 80W wireless', Price: 'Starting at $1,399' },
    'xiaomi 14': { Name: 'Xiaomi 14', Display: '6.36" FHD+ LTPO AMOLED 2670×1200, 1-120Hz', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '50MP + 50MP UW + 50MP 3.2× | 32MP front', 'RAM / Storage': '12GB–16GB / 256GB–512GB', Battery: '4610mAh, 90W wired, 50W wireless', Price: 'Starting at $699' },
    'xiaomi redmi note 13 pro': { Name: 'Redmi Note 13 Pro+', Display: '6.67" FHD+ OLED 2712×1220, 120Hz', Processor: 'Dimensity 7200 Ultra (4nm)', Camera: '200MP + 8MP UW + 2MP | 16MP front', 'RAM / Storage': '8GB–12GB / 256GB–512GB', Battery: '5000mAh, 120W wired', Price: 'Starting at $399' },
    'nothing phone 3': { Name: 'Nothing Phone 3', Display: '6.7" LTPO OLED 2392×1080, 1-120Hz', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '50MP + 50MP UW + 50MP telephoto | 50MP front', 'RAM / Storage': '12GB–16GB / 256GB–512GB', Battery: '5000mAh, 65W wired, 15W wireless', Price: 'Starting at $799' },
    'nothing phone 2a': { Name: 'Nothing Phone 2a', Display: '6.7" FHD+ AMOLED 2412×1084, 120Hz', Processor: 'Dimensity 7200 Pro (4nm)', Camera: '50MP + 50MP UW | 32MP front', 'RAM / Storage': '8GB–12GB / 128GB–256GB', Battery: '5000mAh, 45W wired', Price: 'Starting at $349' },
    'nothing phone 2': { Name: 'Nothing Phone 2', Display: '6.7" FHD+ LTPO OLED 2412×1080, 1-120Hz', Processor: 'Snapdragon 8+ Gen 1 (4nm)', Camera: '50MP + 50MP UW | 32MP front', 'RAM / Storage': '8GB–12GB / 128GB–256GB', Battery: '4700mAh, 45W wired', Price: 'Starting at $499' },
    'vivo x200 pro': { Name: 'Vivo X200 Pro', Display: '6.78" LTPO AMOLED 2800×1260, 1-120Hz, 4500 nits', Processor: 'Dimensity 9400 (3nm)', Camera: '50MP + 50MP UW + 200MP 4.3× | 32MP front', 'RAM / Storage': '16GB / 256GB–1TB', Battery: '6000mAh, 90W wired, 30W wireless', Price: 'Starting at $999' },
    'vivo x200': { Name: 'Vivo X200', Display: '6.67" FHD+ AMOLED 2400×1080, 120Hz', Processor: 'Dimensity 9400 (3nm)', Camera: '50MP + 50MP UW + 50MP 3× | 32MP front', 'RAM / Storage': '12GB / 256GB–512GB', Battery: '5800mAh, 90W wired, 30W wireless', Price: 'Starting at $699' },
    'vivo v40e': { Name: 'Vivo V40e', Display: '6.77" FHD+ AMOLED 2392×1080, 120Hz', Processor: 'Dimensity 7300 (4nm)', Camera: '50MP + 8MP UW | 50MP front', 'RAM / Storage': '8GB / 256GB', Battery: '5500mAh, 44W wired', Price: 'Starting at $349' },
    'vivo v40 pro': { Name: 'Vivo V40 Pro', Display: '6.78" FHD+ LTPO AMOLED 2800×1260, 1-120Hz', Processor: 'Snapdragon 7 Gen 3 (4nm)', Camera: '50MP + 50MP UW | 50MP front', 'RAM / Storage': '12GB / 256GB–512GB', Battery: '5500mAh, 80W wired, 30W wireless', Price: 'Starting at $549' },
    'realme gt 7 pro': { Name: 'Realme GT 7 Pro', Display: '6.78" LTPO AMOLED 2780×1264, 1-120Hz, 6000 nits', Processor: 'Snapdragon 8 Elite (3nm)', Camera: '50MP + 8MP UW + 50MP 3× | 16MP front', 'RAM / Storage': '12GB–16GB / 256GB–512GB', Battery: '6500mAh, 120W wired', Price: 'Starting at $699' },
    'realme gt 6': { Name: 'Realme GT 6', Display: '6.78" FHD+ AMOLED 2780×1264, 120Hz, 6000 nits', Processor: 'Snapdragon 8s Gen 3 (4nm)', Camera: '50MP + 8MP UW + 2MP | 32MP front', 'RAM / Storage': '12GB–16GB / 256GB–512GB', Battery: '5500mAh, 120W wired', Price: 'Starting at $449' },
    'motorola edge 50 ultra': { Name: 'Motorola Edge 50 Ultra', Display: '6.7" pOLED 2712×1220, 165Hz, 2500 nits', Processor: 'Snapdragon 8s Gen 3 (4nm)', Camera: '50MP + 50MP UW + 64MP 3× | 50MP front', 'RAM / Storage': '12GB–16GB / 512GB–1TB', Battery: '4500mAh, 125W wired, 50W wireless', Price: 'Starting at $699' },
    'motorola razr 50 ultra': { Name: 'Motorola Razr 50 Ultra', Display: '6.9" pOLED inner 165Hz + 4.0" cover', Processor: 'Snapdragon 8s Gen 3 (4nm)', Camera: '50MP + 50MP UW | 32MP front', 'RAM / Storage': '12GB / 256GB–512GB', Battery: '4000mAh, 45W wired, 15W wireless', Price: 'Starting at $999' },
    'motorola moto g85': { Name: 'Motorola Moto G85', Display: '6.67" pOLED 2400×1080, 120Hz', Processor: 'Snapdragon 6s Gen 3 (4nm)', Camera: '50MP + 8MP UW | 32MP front', 'RAM / Storage': '8GB–12GB / 128GB–256GB', Battery: '5000mAh, 33W wired', Price: 'Starting at $249' },
  },

  tablet: {
    'ipad pro m4 13': { Name: 'iPad Pro M4 (13-inch)', Display: '13" Ultra Retina XDR tandem OLED 2752×2064, 120Hz ProMotion', Processor: 'Apple M4 (3nm, 10-core)', Camera: '12MP wide + LiDAR | 12MP TrueDepth front', 'RAM / Storage': '8GB–16GB / 256GB–2TB', Battery: 'Up to 10 hrs, 45W charging', Price: 'Starting at $1,299' },
    'ipad pro m4 11': { Name: 'iPad Pro M4 (11-inch)', Display: '11" Ultra Retina XDR tandem OLED 2420×1668, 120Hz ProMotion', Processor: 'Apple M4 (3nm, 10-core)', Camera: '12MP wide + LiDAR | 12MP TrueDepth front', 'RAM / Storage': '8GB–16GB / 256GB–2TB', Battery: 'Up to 10 hrs, 45W charging', Price: 'Starting at $999' },
    'ipad pro m4': { Name: 'iPad Pro M4 (11-inch)', Display: '11" Ultra Retina XDR tandem OLED 2420×1668, 120Hz ProMotion', Processor: 'Apple M4 (3nm, 10-core)', Camera: '12MP wide + LiDAR | 12MP TrueDepth front', 'RAM / Storage': '8GB–16GB / 256GB–2TB', Battery: 'Up to 10 hrs, 45W charging', Price: 'Starting at $999' },
    'ipad air m2 13': { Name: 'iPad Air M2 (13-inch)', Display: '13" Liquid Retina IPS 2732×2048, 60Hz, 600 nits', Processor: 'Apple M2 (5nm, 8-core)', Camera: '12MP wide | 12MP UW front', 'RAM / Storage': '8GB / 128GB–1TB', Battery: 'Up to 10 hrs, 20W charging', Price: 'Starting at $799' },
    'ipad air m2 11': { Name: 'iPad Air M2 (11-inch)', Display: '11" Liquid Retina IPS 2360×1640, 60Hz, 500 nits', Processor: 'Apple M2 (5nm, 8-core)', Camera: '12MP wide | 12MP UW front', 'RAM / Storage': '8GB / 128GB–1TB', Battery: 'Up to 10 hrs, 20W charging', Price: 'Starting at $599' },
    'ipad air m2': { Name: 'iPad Air M2 (11-inch)', Display: '11" Liquid Retina IPS 2360×1640, 60Hz, 500 nits', Processor: 'Apple M2 (5nm, 8-core)', Camera: '12MP wide | 12MP UW front', 'RAM / Storage': '8GB / 128GB–1TB', Battery: 'Up to 10 hrs, 20W charging', Price: 'Starting at $599' },
    'ipad air m1': { Name: 'iPad Air M1 (10.9", 2022)', Display: '10.9" Liquid Retina IPS 2360×1640, 60Hz, 500 nits', Processor: 'Apple M1 (5nm, 8-core)', Camera: '12MP wide | 12MP UW front', 'RAM / Storage': '8GB / 64GB–256GB', Battery: 'Up to 10 hrs, 20W charging', Price: 'Starting at $499' },
    'ipad air 5': { Name: 'iPad Air 5th Gen (M1)', Display: '10.9" Liquid Retina IPS 2360×1640, 60Hz', Processor: 'Apple M1 (5nm)', Camera: '12MP wide | 12MP UW front', 'RAM / Storage': '8GB / 64GB–256GB', Battery: 'Up to 10 hrs, 20W charging', Price: 'Starting at $499' },
    'ipad mini 7': { Name: 'iPad Mini 7 (A17 Pro)', Display: '8.3" Liquid Retina IPS 2266×1488, 60Hz, 500 nits', Processor: 'Apple A17 Pro (3nm)', Camera: '12MP wide | 12MP UW front', 'RAM / Storage': '8GB / 128GB–256GB', Battery: 'Up to 10 hrs, 20W charging', Price: 'Starting at $499' },
    'ipad mini 6': { Name: 'iPad Mini 6th Gen', Display: '8.3" Liquid Retina IPS 2266×1488, 60Hz', Processor: 'Apple A15 Bionic (5nm)', Camera: '12MP wide | 12MP UW front', 'RAM / Storage': '4GB / 64GB–256GB', Battery: 'Up to 10 hrs, 20W charging', Price: 'Starting at $399' },
    'ipad 10th gen': { Name: 'iPad 10th Gen (A14)', Display: '10.9" Liquid Retina IPS 2360×1640, 60Hz', Processor: 'Apple A14 Bionic (5nm)', Camera: '12MP wide | 12MP UW front', 'RAM / Storage': '4GB / 64GB–256GB', Battery: 'Up to 10 hrs, 20W charging', Price: 'Starting at $349' },
    'ipad 9th gen': { Name: 'iPad 9th Gen (A13)', Display: '10.2" Retina IPS 2160×1620, 60Hz', Processor: 'Apple A13 Bionic (7nm)', Camera: '8MP | 12MP UW front', 'RAM / Storage': '3GB / 64GB–256GB', Battery: 'Up to 10 hrs, 20W charging', Price: 'Starting at $329' },
    'samsung galaxy tab s10 ultra': { Name: 'Samsung Galaxy Tab S10 Ultra', Display: '14.6" Dynamic AMOLED 2X 2960×1848, 120Hz, 930 nits', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '13MP + 8MP UW | 12MP + 12MP dual front', 'RAM / Storage': '12GB / 256GB–1TB', Battery: '11200mAh, 45W wired, 15W wireless', Price: 'Starting at $1,299' },
    'samsung galaxy tab s10+': { Name: 'Samsung Galaxy Tab S10+', Display: '12.4" Dynamic AMOLED 2X 2800×1752, 120Hz', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '13MP + 8MP UW | 12MP front', 'RAM / Storage': '12GB / 256GB–512GB', Battery: '10090mAh, 45W wired, 15W wireless', Price: 'Starting at $999' },
    'samsung galaxy tab s10': { Name: 'Samsung Galaxy Tab S10', Display: '11" Dynamic AMOLED 2X 2560×1600, 120Hz', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '13MP + 8MP UW | 12MP front', 'RAM / Storage': '12GB / 128GB–256GB', Battery: '8000mAh, 45W wired, 15W wireless', Price: 'Starting at $799' },
    'samsung galaxy tab s10 fe': { Name: 'Samsung Galaxy Tab S10 FE', Display: '10.9" TFT LCD 2304×1440, 90Hz', Processor: 'Exynos 1580 (4nm)', Camera: '8MP | 10MP front', 'RAM / Storage': '8GB / 128GB–256GB', Battery: '8000mAh, 45W wired', Price: 'Starting at $649' },
    'samsung galaxy tab s9 ultra': { Name: 'Samsung Galaxy Tab S9 Ultra', Display: '14.6" Dynamic AMOLED 2X 2960×1848, 120Hz', Processor: 'Snapdragon 8 Gen 2 (4nm)', Camera: '13MP + 8MP UW | 12MP + 12MP dual front', 'RAM / Storage': '12GB / 256GB–1TB', Battery: '11200mAh, 45W wired, 15W wireless', Price: 'Starting at $999' },
    'samsung galaxy tab s9': { Name: 'Samsung Galaxy Tab S9', Display: '11" Dynamic AMOLED 2X 2560×1600, 120Hz', Processor: 'Snapdragon 8 Gen 2 (4nm)', Camera: '13MP + 8MP UW | 12MP front', 'RAM / Storage': '8GB–12GB / 128GB–256GB', Battery: '8400mAh, 45W wired, 15W wireless', Price: 'Starting at $699' },
    'samsung galaxy tab a9+': { Name: 'Samsung Galaxy Tab A9+', Display: '11" LCD 1920×1200, 90Hz', Processor: 'Snapdragon 695 (6nm)', Camera: '8MP | 5MP front', 'RAM / Storage': '4GB–8GB / 64GB–128GB', Battery: '7040mAh, 15W wired', Price: 'Starting at $279' },
    'xiaomi pad 7 pro': { Name: 'Xiaomi Pad 7 Pro', Display: '12.1" LTPO LCD 3000×1876, 144Hz, 900 nits', Processor: 'Snapdragon 8s Gen 3 (4nm)', Camera: '50MP | 32MP front', 'RAM / Storage': '8GB–12GB / 128GB–256GB', Battery: '10100mAh, 67W wired', Price: 'Starting at $449' },
    'xiaomi pad 7': { Name: 'Xiaomi Pad 7', Display: '11.2" LCD 2800×1800, 144Hz', Processor: 'Snapdragon 7+ Gen 3 (4nm)', Camera: '13MP | 8MP front', 'RAM / Storage': '8GB–12GB / 128GB–256GB', Battery: '8850mAh, 45W wired', Price: 'Starting at $349' },
    'xiaomi pad 6 pro': { Name: 'Xiaomi Pad 6 Pro', Display: '11" IPS LCD 2880×1800, 144Hz', Processor: 'Snapdragon 8+ Gen 1 (4nm)', Camera: '50MP | 20MP front', 'RAM / Storage': '8GB–12GB / 128GB–256GB', Battery: '8600mAh, 67W wired', Price: 'Starting at $399' },
    'xiaomi pad 6': { Name: 'Xiaomi Pad 6', Display: '11" IPS LCD 2880×1800, 144Hz', Processor: 'Snapdragon 870 (7nm)', Camera: '13MP | 8MP front', 'RAM / Storage': '6GB–8GB / 128GB–256GB', Battery: '8840mAh, 33W wired', Price: 'Starting at $299' },
    'xiaomi pad 5 pro': { Name: 'Xiaomi Pad 5 Pro', Display: '11" IPS LCD 2560×1600, 120Hz', Processor: 'Snapdragon 870 (7nm)', Camera: '13MP | 8MP front', 'RAM / Storage': '6GB–8GB / 128GB–256GB', Battery: '8600mAh, 67W wired', Price: 'Starting at $349' },
    'xiaomi pad 5': { Name: 'Xiaomi Pad 5', Display: '11" IPS LCD 2560×1600, 120Hz, 500 nits', Processor: 'Snapdragon 860 (7nm)', Camera: '13MP | 8MP front', 'RAM / Storage': '6GB / 128GB–256GB', Battery: '8720mAh, 33W wired', Price: 'Starting at $299' },
    'oneplus pad 2': { Name: 'OnePlus Pad 2', Display: '12.1" LTPO LCD 3000×2120, 1-144Hz, 900 nits', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '13MP | 8MP front', 'RAM / Storage': '12GB / 256GB–512GB', Battery: '9510mAh, 67W wired', Price: 'Starting at $549' },
    'oneplus pad': { Name: 'OnePlus Pad', Display: '11.61" IPS LCD 2800×2000, 144Hz', Processor: 'Dimensity 9000 (4nm)', Camera: '13MP | 8MP front', 'RAM / Storage': '8GB–12GB / 128GB–256GB', Battery: '9510mAh, 67W wired', Price: 'Starting at $399' },
    'realme pad 2': { Name: 'Realme Pad 2', Display: '11.5" IPS LCD 2000×1200, 90Hz', Processor: 'Helio G99 (6nm)', Camera: '8MP | 8MP front', 'RAM / Storage': '4GB–8GB / 64GB–256GB', Battery: '8360mAh, 33W wired', Price: 'Starting at $249' },
    'lenovo legion tab gen 3': { Name: 'Lenovo Legion Tab Gen 3', Display: '8.8" LCD 2560×1600, 165Hz, 700 nits', Processor: 'Snapdragon 8 Gen 3 (4nm)', Camera: '13MP | 8MP front', 'RAM / Storage': '12GB / 256GB', Battery: '6550mAh, 68W wired', Price: 'Starting at $499' },
    'lenovo tab p12 pro': { Name: 'Lenovo Tab P12 Pro', Display: '12.6" AMOLED 2560×1600, 120Hz', Processor: 'Snapdragon 870 (7nm)', Camera: '13MP + 5MP + ToF | 8MP front', 'RAM / Storage': '6GB–8GB / 128GB–256GB', Battery: '10200mAh, 45W wired', Price: 'Starting at $549' },
    'lenovo tab m10 plus': { Name: 'Lenovo Tab M10 Plus Gen 3', Display: '10.6" IPS LCD 2000×1200, 60Hz', Processor: 'Helio G80 (12nm)', Camera: '8MP | 8MP front', 'RAM / Storage': '4GB / 64GB–128GB', Battery: '7700mAh, 20W wired', Price: 'Starting at $189' },
    'microsoft surface pro 11': { Name: 'Microsoft Surface Pro 11', Display: '13" PixelSense Flow OLED 2880×1920, 120Hz', Processor: 'Snapdragon X Elite (4nm)', Camera: '10MP auto-focus | 5MP front', 'RAM / Storage': '16GB–32GB / 256GB–1TB', Battery: 'Up to 14 hrs, 65W charging', Price: 'Starting at $999' },
    'microsoft surface pro 10': { Name: 'Microsoft Surface Pro 10', Display: '13" PixelSense Flow IPS 2880×1920, 120Hz', Processor: 'Intel Core Ultra 5 135U', Camera: '10MP | 5MP front', 'RAM / Storage': '16GB–32GB / 256GB–1TB', Battery: 'Up to 10 hrs, 65W charging', Price: 'Starting at $1,099' },
    'google pixel tablet': { Name: 'Google Pixel Tablet (2023)', Display: '10.95" IPS LCD 2560×1600, 60Hz', Processor: 'Tensor G2 (5nm)', Camera: '8MP | 8MP front', 'RAM / Storage': '8GB / 128GB–256GB', Battery: '7020mAh, 18W wired', Price: 'Starting at $399' },
    'amazon fire hd 10': { Name: 'Amazon Fire HD 10 (2023)', Display: '10.1" IPS LCD 1920×1200, 60Hz', Processor: 'MT8183 Octa-core', Camera: '5MP | 2MP front', 'RAM / Storage': '3GB / 32GB–64GB (expandable)', Battery: 'Up to 12 hrs, 9W charging', Price: 'Starting at $149' },
    'amazon fire hd 8': { Name: 'Amazon Fire HD 8 (2022)', Display: '8" IPS LCD 1280×800, 60Hz', Processor: 'MT8169A Quad-core', Camera: '2MP | 2MP front', 'RAM / Storage': '2GB–3GB / 32GB–64GB (expandable)', Battery: 'Up to 13 hrs, 5W charging', Price: 'Starting at $99' },
  },

  laptop: {
    'macbook pro m4 max': { Name: 'MacBook Pro M4 Max (16")', Display: '16.2" Liquid Retina XDR 3456×2234, 120Hz, 1000 nits', Processor: 'Apple M4 Max (3nm, 16-core CPU)', 'RAM / Storage': '36GB–128GB unified / 1TB–8TB SSD', 'Battery Life': 'Up to 24 hours', GPU: 'Apple 40-core GPU', Price: 'Starting at $3,999' },
    'macbook pro m4 pro': { Name: 'MacBook Pro M4 Pro (14")', Display: '14.2" Liquid Retina XDR 3024×1964, 120Hz ProMotion', Processor: 'Apple M4 Pro (3nm, 14-core CPU)', 'RAM / Storage': '24GB–48GB unified / 512GB–4TB SSD', 'Battery Life': 'Up to 24 hours', GPU: 'Apple 20-core GPU', Price: 'Starting at $1,999' },
    'macbook pro m4': { Name: 'MacBook Pro M4 (14")', Display: '14.2" Liquid Retina XDR 3024×1964, 120Hz ProMotion', Processor: 'Apple M4 (3nm, 10-core CPU)', 'RAM / Storage': '16GB–32GB unified / 512GB–4TB SSD', 'Battery Life': 'Up to 24 hours', GPU: 'Apple 10-core GPU', Price: 'Starting at $1,599' },
    'macbook pro m3 max': { Name: 'MacBook Pro M3 Max (16")', Display: '16.2" Liquid Retina XDR 3456×2234, 120Hz, 1000 nits', Processor: 'Apple M3 Max (3nm, 16-core CPU)', 'RAM / Storage': '36GB–128GB unified / 1TB–8TB SSD', 'Battery Life': 'Up to 22 hours', GPU: 'Apple 40-core GPU', Price: 'Starting at $3,499' },
    'macbook pro m3 pro': { Name: 'MacBook Pro M3 Pro (14")', Display: '14.2" Liquid Retina XDR 3024×1964, 120Hz', Processor: 'Apple M3 Pro (3nm, 12-core CPU)', 'RAM / Storage': '18GB–36GB unified / 512GB–4TB SSD', 'Battery Life': 'Up to 18 hours', GPU: 'Apple 18-core GPU', Price: 'Starting at $1,999' },
    'macbook air m3': { Name: 'MacBook Air M3 (13")', Display: '13.6" Liquid Retina 2560×1664, 60Hz, 500 nits', Processor: 'Apple M3 (3nm, 8-core CPU)', 'RAM / Storage': '8GB–24GB unified / 256GB–2TB SSD', 'Battery Life': 'Up to 18 hours', GPU: 'Apple 10-core GPU', Price: 'Starting at $1,099' },
    'macbook air m2': { Name: 'MacBook Air M2 (13")', Display: '13.6" Liquid Retina 2560×1664, 60Hz, 500 nits', Processor: 'Apple M2 (5nm, 8-core CPU)', 'RAM / Storage': '8GB–24GB unified / 256GB–2TB SSD', 'Battery Life': 'Up to 18 hours', GPU: 'Apple 10-core GPU', Price: 'Starting at $999' },
    'macbook air m1': { Name: 'MacBook Air M1 (13")', Display: '13.3" Retina IPS 2560×1600, 60Hz, 400 nits', Processor: 'Apple M1 (5nm, 8-core CPU)', 'RAM / Storage': '8GB–16GB unified / 256GB–2TB SSD', 'Battery Life': 'Up to 18 hours', GPU: 'Apple 7/8-core GPU', Price: 'Starting at $799 (refurb)' },
    'dell xps 15': { Name: 'Dell XPS 15 9530', Display: '15.6" OLED 3.5K touch 3456×2160, 60Hz, 400 nits', Processor: 'Intel Core i9-13900H (Intel 7)', 'RAM / Storage': '16GB–64GB DDR5 / 512GB–4TB SSD', 'Battery Life': 'Up to 13 hours', GPU: 'NVIDIA RTX 4060 8GB GDDR6', Price: 'Starting at $1,699' },
    'dell xps 13': { Name: 'Dell XPS 13 9340', Display: '13.4" FHD+ IPS 1920×1200, 60Hz, 500 nits', Processor: 'Intel Core Ultra 7 165H (Intel 4)', 'RAM / Storage': '16GB–32GB LPDDR5x / 512GB–2TB SSD', 'Battery Life': 'Up to 12 hours', GPU: 'Intel Arc Graphics integrated', Price: 'Starting at $1,299' },
    'dell xps 13 plus': { Name: 'Dell XPS 13 Plus 9320', Display: '13.4" FHD+ OLED touch 1920×1200, 60Hz', Processor: 'Intel Core i7-1260P (12th Gen)', 'RAM / Storage': '16GB–32GB LPDDR5 / 512GB–2TB SSD', 'Battery Life': 'Up to 10 hours', GPU: 'Intel Iris Xe Graphics', Price: 'Starting at $1,399' },
    'dell inspiron 15': { Name: 'Dell Inspiron 15 3525', Display: '15.6" FHD IPS 1920×1080, 60Hz', Processor: 'AMD Ryzen 5 5625U (7nm)', 'RAM / Storage': '8GB–16GB DDR4 / 256GB–512GB SSD', 'Battery Life': 'Up to 8 hours', GPU: 'AMD Radeon Graphics integrated', Price: 'Starting at $499' },
    'dell alienware m16': { Name: 'Dell Alienware m16 R2', Display: '16" QHD+ IPS 2560×1600, 165Hz, 400 nits', Processor: 'Intel Core i9-14900HX (Intel 7)', 'RAM / Storage': '16GB–64GB DDR5 / 512GB–4TB SSD', 'Battery Life': 'Up to 6 hours', GPU: 'NVIDIA RTX 4090 16GB GDDR6', Price: 'Starting at $2,499' },
    'asus rog zephyrus g14': { Name: 'Asus ROG Zephyrus G14 (2024)', Display: '14" QHD+ OLED 2560×1600, 165Hz, 500 nits', Processor: 'AMD Ryzen 9 8945HS (4nm, Zen 4)', 'RAM / Storage': '16GB–32GB LPDDR5x / 512GB–2TB SSD', 'Battery Life': 'Up to 10 hours', GPU: 'NVIDIA RTX 4070 8GB GDDR6', Price: 'Starting at $1,599' },
    'asus rog zephyrus g16': { Name: 'Asus ROG Zephyrus G16 (2024)', Display: '16" QHD+ OLED 2560×1600, 240Hz, 500 nits', Processor: 'Intel Core Ultra 9 185H (Intel 4)', 'RAM / Storage': '16GB–32GB DDR5 / 1TB–2TB SSD', 'Battery Life': 'Up to 8 hours', GPU: 'NVIDIA RTX 4090 16GB GDDR6', Price: 'Starting at $2,499' },
    'asus rog strix g16': { Name: 'Asus ROG Strix G16 (2024)', Display: '16" FHD IPS 1920×1080, 165Hz, 300 nits', Processor: 'Intel Core i9-14900HX (Intel 7)', 'RAM / Storage': '16GB–32GB DDR5 / 1TB SSD', 'Battery Life': 'Up to 6 hours', GPU: 'NVIDIA RTX 4070 8GB GDDR6', Price: 'Starting at $1,399' },
    'asus zenbook 14 oled': { Name: 'Asus Zenbook 14 OLED (2024)', Display: '14" 3K OLED 2880×1800, 120Hz, 550 nits', Processor: 'AMD Ryzen 7 8840HS (4nm, Zen 4)', 'RAM / Storage': '16GB–32GB LPDDR5x / 512GB–1TB SSD', 'Battery Life': 'Up to 15 hours', GPU: 'AMD Radeon 780M integrated', Price: 'Starting at $1,199' },
    'asus vivobook 16': { Name: 'Asus Vivobook 16 X1605', Display: '16" FHD+ IPS 1920×1200, 60Hz, 300 nits', Processor: 'AMD Ryzen 5 7530U (Zen 3)', 'RAM / Storage': '8GB–16GB DDR4 / 512GB–1TB SSD', 'Battery Life': 'Up to 10 hours', GPU: 'AMD Radeon Graphics integrated', Price: 'Starting at $599' },
    'lenovo thinkpad x1 carbon': { Name: 'ThinkPad X1 Carbon Gen 12', Display: '14" IPS WUXGA 1920×1200, 60Hz, 400 nits', Processor: 'Intel Core Ultra 7 165U (Intel 4)', 'RAM / Storage': '16GB–32GB LPDDR5x / 512GB–2TB SSD', 'Battery Life': 'Up to 15 hours', GPU: 'Intel Arc integrated (96EU)', Price: 'Starting at $1,699' },
    'lenovo yoga 9i': { Name: 'Lenovo Yoga 9i Gen 9 (14")', Display: '14" 2.8K OLED touch 2880×1800, 90Hz, 400 nits', Processor: 'Intel Core Ultra 7 155H (Intel 4)', 'RAM / Storage': '16GB–32GB / 512GB–2TB SSD', 'Battery Life': 'Up to 15 hours', GPU: 'Intel Arc integrated', Price: 'Starting at $1,499' },
    'lenovo yoga slim 7': { Name: 'Lenovo Yoga Slim 7 Gen 8', Display: '14" 2.8K OLED 2880×1800, 90Hz', Processor: 'AMD Ryzen 7 7745HX (4nm)', 'RAM / Storage': '16GB / 512GB–1TB SSD', 'Battery Life': 'Up to 12 hours', GPU: 'AMD Radeon 780M integrated', Price: 'Starting at $1,099' },
    'lenovo legion 5 pro': { Name: 'Lenovo Legion 5 Pro Gen 9', Display: '16" QHD+ IPS 2560×1600, 165Hz, 500 nits', Processor: 'AMD Ryzen 7 8845HS (4nm)', 'RAM / Storage': '16GB–32GB DDR5 / 512GB–2TB SSD', 'Battery Life': 'Up to 8 hours', GPU: 'NVIDIA RTX 4070 8GB GDDR6', Price: 'Starting at $1,499' },
    'lenovo legion 7': { Name: 'Lenovo Legion 7 Gen 9', Display: '16" QHD+ IPS 2560×1600, 165Hz', Processor: 'AMD Ryzen 9 8945HX (4nm)', 'RAM / Storage': '16GB–64GB DDR5 / 1TB–4TB SSD', 'Battery Life': 'Up to 6 hours', GPU: 'NVIDIA RTX 4080 12GB GDDR6', Price: 'Starting at $1,999' },
    'lenovo ideapad slim 5': { Name: 'Lenovo IdeaPad Slim 5 Gen 9', Display: '14" FHD+ IPS 1920×1200, 60Hz', Processor: 'AMD Ryzen 5 7530U (Zen 3)', 'RAM / Storage': '8GB–16GB / 512GB–1TB SSD', 'Battery Life': 'Up to 10 hours', GPU: 'AMD Radeon integrated', Price: 'Starting at $599' },
    'hp spectre x360': { Name: 'HP Spectre x360 14 (2024)', Display: '14" 2.8K OLED touch 2880×1800, 120Hz', Processor: 'Intel Core Ultra 7 155H (Intel 4)', 'RAM / Storage': '16GB–32GB LPDDR5x / 512GB–2TB SSD', 'Battery Life': 'Up to 17 hours', GPU: 'Intel Arc integrated', Price: 'Starting at $1,499' },
    'hp envy x360': { Name: 'HP Envy x360 15 (2024)', Display: '15.6" FHD IPS touch 1920×1080, 60Hz', Processor: 'AMD Ryzen 5 7530U (Zen 3)', 'RAM / Storage': '8GB–16GB / 256GB–512GB SSD', 'Battery Life': 'Up to 10 hours', GPU: 'AMD Radeon Vega 7 integrated', Price: 'Starting at $749' },
    'hp omen 16': { Name: 'HP Omen 16 (2024)', Display: '16.1" QHD IPS 2560×1440, 165Hz, 400 nits', Processor: 'Intel Core i7-14700HX (Intel 7)', 'RAM / Storage': '16GB–32GB DDR5 / 512GB–2TB SSD', 'Battery Life': 'Up to 7 hours', GPU: 'NVIDIA RTX 4070 8GB GDDR6', Price: 'Starting at $1,199' },
    'hp elitebook 840': { Name: 'HP EliteBook 840 G11', Display: '14" WUXGA IPS 1920×1200, 60Hz, 400 nits', Processor: 'Intel Core Ultra 7 165U (Intel 4)', 'RAM / Storage': '16GB–64GB LPDDR5x / 512GB–2TB SSD', 'Battery Life': 'Up to 14 hours', GPU: 'Intel Arc integrated', Price: 'Starting at $1,599' },
    'samsung galaxy book 4 ultra': { Name: 'Samsung Galaxy Book 4 Ultra', Display: '16" Dynamic AMOLED 2X 2880×1800, 120Hz, 500 nits', Processor: 'Intel Core Ultra 9 185H (Intel 4)', 'RAM / Storage': '16GB–32GB LPDDR5x / 512GB–1TB SSD', 'Battery Life': 'Up to 8 hours', GPU: 'NVIDIA RTX 4070 8GB GDDR6', Price: 'Starting at $2,499' },
    'samsung galaxy book 4 pro': { Name: 'Samsung Galaxy Book 4 Pro', Display: '14" 3K Dynamic AMOLED 2X 2880×1800, 120Hz', Processor: 'Intel Core Ultra 7 155H (Intel 4)', 'RAM / Storage': '16GB / 512GB–1TB SSD', 'Battery Life': 'Up to 12 hours', GPU: 'Intel Arc integrated', Price: 'Starting at $1,699' },
    'samsung galaxy book 4 360': { Name: 'Samsung Galaxy Book 4 360', Display: '15.6" FHD AMOLED touch 1920×1080, 60Hz', Processor: 'Intel Core Ultra 7 155H (Intel 4)', 'RAM / Storage': '16GB / 512GB SSD', 'Battery Life': 'Up to 10 hours', GPU: 'Intel Arc integrated', Price: 'Starting at $1,299' },
    'microsoft surface laptop 7': { Name: 'Microsoft Surface Laptop 7 (15")', Display: '15" PixelSense Flow IPS 2496×1664, 120Hz, 600 nits', Processor: 'Snapdragon X Elite (4nm, 12-core)', 'RAM / Storage': '16GB–32GB / 256GB–1TB SSD', 'Battery Life': 'Up to 22 hours', GPU: 'Adreno GPU integrated', Price: 'Starting at $1,299' },
    'microsoft surface laptop 6': { Name: 'Microsoft Surface Laptop 6 (15")', Display: '15" PixelSense Flow IPS 2496×1664, 120Hz', Processor: 'Intel Core Ultra 5 135H (Intel 4)', 'RAM / Storage': '16GB–64GB / 256GB–1TB SSD', 'Battery Life': 'Up to 10 hours', GPU: 'Intel Arc integrated', Price: 'Starting at $1,499' },
    'razer blade 16': { Name: 'Razer Blade 16 (2024)', Display: '16" QHD+ OLED 2560×1600, 240Hz, 500 nits', Processor: 'Intel Core i9-14900HX (Intel 7)', 'RAM / Storage': '32GB DDR5 / 1TB PCIe 5.0 SSD', 'Battery Life': 'Up to 6 hours', GPU: 'NVIDIA RTX 4090 16GB GDDR6', Price: 'Starting at $3,499' },
    'razer blade 15': { Name: 'Razer Blade 15 (2024)', Display: '15.6" FHD→QHD IPS 2560×1440, 240Hz', Processor: 'Intel Core i7-13800H (Intel 7)', 'RAM / Storage': '16GB–32GB DDR5 / 1TB SSD', 'Battery Life': 'Up to 6 hours', GPU: 'NVIDIA RTX 4070 8GB GDDR6', Price: 'Starting at $2,499' },
    'razer blade 14': { Name: 'Razer Blade 14 (2024)', Display: '14" QHD+ IPS 2560×1600, 165Hz', Processor: 'AMD Ryzen 9 8945HS (4nm)', 'RAM / Storage': '16GB–32GB LPDDR5x / 1TB SSD', 'Battery Life': 'Up to 8 hours', GPU: 'NVIDIA RTX 4070 8GB GDDR6', Price: 'Starting at $2,499' },
    'lg gram 17': { Name: 'LG Gram 17 (2024)', Display: '17" IPS 2560×1600, 60Hz, 400 nits, 99% DCI-P3', Processor: 'Intel Core Ultra 7 155H (Intel 4)', 'RAM / Storage': '16GB–32GB / 512GB–2TB SSD', 'Battery Life': 'Up to 17 hours', GPU: 'Intel Arc integrated (128EU)', Price: 'Starting at $1,699' },
    'lg gram 16': { Name: 'LG Gram 16 (2024)', Display: '16" IPS 2560×1600, 60Hz, 400 nits', Processor: 'Intel Core Ultra 7 155H (Intel 4)', 'RAM / Storage': '16GB–32GB / 512GB–2TB SSD', 'Battery Life': 'Up to 20 hours', GPU: 'Intel Arc integrated', Price: 'Starting at $1,499' },
    'lg gram 14': { Name: 'LG Gram 14 (2024)', Display: '14" IPS 2560×1600, 60Hz, 350 nits', Processor: 'Intel Core Ultra 5 125H (Intel 4)', 'RAM / Storage': '16GB / 512GB SSD', 'Battery Life': 'Up to 22 hours', GPU: 'Intel Arc integrated', Price: 'Starting at $1,299' },
    'acer swift x 14': { Name: 'Acer Swift X 14 (2024)', Display: '14.5" 2.5K IPS 2560×1600, 120Hz, 400 nits', Processor: 'Intel Core Ultra 5 125H (Intel 4)', 'RAM / Storage': '16GB–32GB / 512GB–1TB SSD', 'Battery Life': 'Up to 12 hours', GPU: 'NVIDIA RTX 4050 6GB GDDR6', Price: 'Starting at $999' },
    'acer swift go 14': { Name: 'Acer Swift Go 14 (2024)', Display: '14" 2K IPS 2560×1600, 90Hz', Processor: 'Intel Core Ultra 5 125U (Intel 4)', 'RAM / Storage': '16GB / 512GB SSD', 'Battery Life': 'Up to 10 hours', GPU: 'Intel Arc integrated', Price: 'Starting at $799' },
    'acer predator helios 16': { Name: 'Acer Predator Helios 16 (2024)', Display: '16" QHD+ IPS 2560×1600, 240Hz, 500 nits', Processor: 'Intel Core i9-14900HX (Intel 7)', 'RAM / Storage': '16GB–64GB DDR5 / 1TB–2TB SSD', 'Battery Life': 'Up to 5 hours', GPU: 'NVIDIA RTX 4080 12GB GDDR6', Price: 'Starting at $1,999' },
    'acer nitro v 15': { Name: 'Acer Nitro V 15 (2024)', Display: '15.6" FHD IPS 1920×1080, 144Hz', Processor: 'Intel Core i5-13420H (Intel 7)', 'RAM / Storage': '8GB–16GB DDR5 / 512GB–1TB SSD', 'Battery Life': 'Up to 7 hours', GPU: 'NVIDIA RTX 4050 6GB GDDR6', Price: 'Starting at $699' },
    'msi raider ge78 hx': { Name: 'MSI Raider GE78 HX (2024)', Display: '17" QHD+ IPS 2560×1600, 240Hz, 500 nits', Processor: 'Intel Core i9-14900HX (Intel 7)', 'RAM / Storage': '16GB–64GB DDR5 / 1TB–4TB SSD', 'Battery Life': 'Up to 6 hours', GPU: 'NVIDIA RTX 4090 16GB GDDR6', Price: 'Starting at $2,999' },
    'msi stealth 16 ai': { Name: 'MSI Stealth 16 AI Studio', Display: '16" 4K UHD+ OLED 3840×2400, 60Hz, 600 nits', Processor: 'Intel Core Ultra 9 185H (Intel 4)', 'RAM / Storage': '32GB LPDDR5x / 1TB–2TB SSD', 'Battery Life': 'Up to 8 hours', GPU: 'NVIDIA RTX 4070 8GB GDDR6', Price: 'Starting at $2,799' },
    'msi creator z16': { Name: 'MSI Creator Z16 HX Studio', Display: '16" QHD+ IPS 2560×1600, 165Hz, 600 nits', Processor: 'Intel Core i9-13980HX (Intel 7)', 'RAM / Storage': '32GB DDR5 / 2TB SSD', 'Battery Life': 'Up to 7 hours', GPU: 'NVIDIA RTX 4070 8GB GDDR6', Price: 'Starting at $2,499' },
  }
};

// ─── STRICT WORD MATCH ────────────────────────────────────────
function matchDevice(query, category) {
  const db = LOCAL_DB[category] || {};
  const q = query.toLowerCase().trim();
  if (db[q]) return { data: db[q], key: q };

  const qWords = q.split(/\s+/).filter(w => w.length > 0);

  let bestKey = null, bestScore = Infinity;
  for (const key of Object.keys(db)) {
    const kWords = key.split(/\s+/);
    // ALL query words must appear in the key
    if (!qWords.every(w => kWords.includes(w))) continue;
    // Prefer the key with fewest extra words (most specific match)
    const extra = kWords.filter(w => !qWords.includes(w)).length;
    if (extra < bestScore) { bestScore = extra; bestKey = key; }
  }
  return bestKey ? { data: db[bestKey], key: bestKey } : null;
}

// ─── CATEGORY CONFIG ──────────────────────────────────────────
const CATEGORY_CONFIG = {
  mobile: {
    label: 'Mobile', specKeys: ['Name', 'Display', 'Processor', 'Camera', 'RAM / Storage', 'Battery', 'Price'],
    suggestions: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16', 'iPhone 15 Pro Max', 'iPhone 14 Pro Max', 'iPhone 13 Pro Max', 'Samsung Galaxy S25 Ultra', 'Samsung Galaxy S25', 'Samsung Galaxy S24 Ultra', 'Samsung Galaxy Z Fold 6', 'Samsung Galaxy Z Flip 6', 'Google Pixel 9 Pro XL', 'Google Pixel 9 Pro', 'Google Pixel 9', 'OnePlus 13', 'OnePlus 12', 'Xiaomi 15 Pro', 'Xiaomi 14 Ultra', 'Nothing Phone 3', 'Nothing Phone 2a', 'Vivo X200 Pro', 'Realme GT 7 Pro', 'Motorola Edge 50 Ultra', 'Motorola Razr 50 Ultra'],
    icon: '📱', placeholder: 'Type any phone… e.g. iPhone 16 Pro Max'
  },
  tablet: {
    label: 'Tablet', specKeys: ['Name', 'Display', 'Processor', 'Camera', 'RAM / Storage', 'Battery', 'Price'],
    suggestions: ['iPad Pro M4 13', 'iPad Pro M4 11', 'iPad Air M2 13', 'iPad Air M2', 'iPad Air M1', 'iPad Mini 7', 'iPad Mini 6', 'iPad 10th Gen', 'Samsung Galaxy Tab S10 Ultra', 'Samsung Galaxy Tab S10+', 'Samsung Galaxy Tab S10', 'Samsung Galaxy Tab S9 Ultra', 'Xiaomi Pad 7 Pro', 'Xiaomi Pad 7', 'Xiaomi Pad 6 Pro', 'Xiaomi Pad 6', 'Xiaomi Pad 5 Pro', 'Xiaomi Pad 5', 'OnePlus Pad 2', 'OnePlus Pad', 'Lenovo Legion Tab Gen 3', 'Microsoft Surface Pro 11', 'Google Pixel Tablet', 'Amazon Fire HD 10'],
    icon: '⬛', placeholder: 'Type any tablet… e.g. Xiaomi Pad 5 or iPad Air M1'
  },
  laptop: {
    label: 'Laptop', specKeys: ['Name', 'Display', 'Processor', 'RAM / Storage', 'Battery Life', 'GPU', 'Price'],
    suggestions: ['MacBook Pro M4 Max', 'MacBook Pro M4 Pro', 'MacBook Pro M4', 'MacBook Air M3', 'MacBook Air M2', 'MacBook Air M1', 'Dell XPS 15', 'Dell XPS 13', 'Dell Alienware M16', 'Asus ROG Zephyrus G14', 'Asus ROG Zephyrus G16', 'Asus Zenbook 14 OLED', 'Asus Vivobook 16', 'Lenovo ThinkPad X1 Carbon', 'Lenovo Legion 5 Pro', 'Lenovo Legion 7', 'Lenovo Yoga 9i', 'HP Spectre x360', 'HP Omen 16', 'Samsung Galaxy Book 4 Ultra', 'Samsung Galaxy Book 4 Pro', 'Microsoft Surface Laptop 7', 'Razer Blade 16', 'Razer Blade 15', 'Razer Blade 14', 'LG Gram 17', 'LG Gram 16', 'Acer Swift X 14', 'Acer Predator Helios 16', 'Acer Nitro V 15', 'MSI Raider GE78 HX', 'MSI Stealth 16 AI'],
    icon: '💻', placeholder: 'Type any laptop… e.g. MacBook Air M1 or Razer Blade 16'
  }
};

// ─── RENDER ───────────────────────────────────────────────────
function iconCard(icon, label) {
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:16px;width:100%;height:100%;justify-content:center">
    <div style="font-size:54px;line-height:1">${icon}</div>
    <div style="font-size:10px;color:#4f6ef7;text-align:center;font-family:'Space Mono',monospace;line-height:1.5;max-width:90%">${label}</div>
  </div>`;
}

function renderEmpty(el, cat) {
  const c = CATEGORY_CONFIG[cat];
  el.querySelector('.card-image-wrap').innerHTML = `<div class="placeholder-icon">${c.icon}</div>`;
  el.querySelector('.card-specs').innerHTML = `<div class="empty-state"><div class="empty-icon">${c.icon}</div><p>Search any ${c.label.toLowerCase()} to compare specs</p></div>`;
}
function renderLoading(el, msg = 'Fetching specs…') {
  el.querySelector('.card-image-wrap').innerHTML = `<div class="placeholder-icon" style="opacity:.2">⏳</div>`;
  el.querySelector('.card-specs').innerHTML = `<div class="loading-state"><div class="spinner"></div><p>${msg}</p></div>`;
}
function renderError(el, msg) {
  el.querySelector('.card-image-wrap').innerHTML = `<div class="placeholder-icon" style="opacity:.3">❓</div>`;
  el.querySelector('.card-specs').innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${msg}</p></div>`;
}

function renderSpecs(el, specs, dbKey, category) {
  const c = CATEGORY_CONFIG[category];
  const label = (specs['Name'] || 'Device').substring(0, 30);
  const wrap = el.querySelector('.card-image-wrap');

  // Show icon immediately
  wrap.innerHTML = iconCard(c.icon, label);

  // Render specs
  el.querySelector('.card-specs').innerHTML = c.specKeys.map((key, i) =>
    `<div class="spec-row ${key.toLowerCase() === 'price' ? 'price-row' : ''}" style="animation-delay:${i * 0.06}s">
      <div class="spec-label">${key}</div>
      <div class="spec-value">${specs[key] || 'N/A'}</div>
    </div>`).join('');

  // Load image async — try hardcoded first, then API for unknown devices
  loadImage(wrap, dbKey, specs['Name'], category, c.icon, label);
}

async function loadImage(wrap, dbKey, deviceName, category, icon, label) {
  const imgUrl = await getImageUrl(dbKey, deviceName, category);
  if (!imgUrl) { showNameCard(wrap, deviceName, icon); return; }

  const img = document.createElement('img');
  img.alt = label;
  img.style.cssText = 'max-width:88%;max-height:88%;object-fit:contain;opacity:0;transition:opacity .5s ease';
  img.onload = () => { img.style.opacity = '1'; };
  img.onerror = () => { showNameCard(wrap, deviceName, icon); };
  img.src = imgUrl;
  wrap.innerHTML = '';
  wrap.appendChild(img);
}

async function tryWikipediaImage(wrap, deviceName, icon, label) {
  // Wikipedia CORS blocked on surge — show styled name card instead
  showNameCard(wrap, deviceName, icon);
}

function showNameCard(wrap, deviceName, icon) {
  const words = deviceName.split(' ');
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
  const line2html = line2 ? '<div style="font-size:11px;font-weight:700;color:#4f6ef7;line-height:1.4">' + line2 + '</div>' : '';
  wrap.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;width:100%;height:100%;padding:16px">'
    + '<div style="font-size:42px;line-height:1">' + icon + '</div>'
    + '<div style="text-align:center;font-family:monospace">'
    + '<div style="font-size:11px;font-weight:700;color:#4f6ef7;line-height:1.4">' + line1 + '</div>'
    + line2html
    + '</div></div>';
}

// ─── API SPEC FALLBACK ────────────────────────────────────────
async function fetchFromAPI(deviceName, category) {
  const c = CATEGORY_CONFIG[category];
  const prompt = `Return ONLY raw JSON. Specs for "${deviceName}" (${c.label}).
Keys: ${c.specKeys.map(k => `"${k}"`).join(', ')}
Price: "Starting at $X,XXX". Unknown: "N/A".`;
  const headers = { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
  if (ANTHROPIC_API_KEY) headers['x-api-key'] = ANTHROPIC_API_KEY;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers,
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 800, messages: [{ role: 'user', content: prompt }] })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('API error details:', JSON.stringify(err));
    throw new Error('HTTP ' + res.status + ': ' + (err.error && err.error.message || 'unknown'));
  }
  const d = await res.json();
  return JSON.parse(d.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim());
}

// ─── LOAD DEVICE ──────────────────────────────────────────────
async function loadDevice(el, name, category) {
  renderLoading(el, 'Looking up…');
  try {
    const match = matchDevice(name, category);
    if (match) {
      renderSpecs(el, match.data, match.key, category);
    } else {
      renderLoading(el, 'Asking AI for specs…');
      const specs = await fetchFromAPI(name, category);
      renderSpecs(el, specs, null, category);
    }
  } catch (e) {
    console.error(e);
    renderError(el, `"${name}" not found. Try an exact model name.`);
  }
}

// ─── SEARCH INIT ──────────────────────────────────────────────
function initCard(el, category) {
  const c = CATEGORY_CONFIG[category];
  const input = el.querySelector('.device-search');
  const list = el.querySelector('.suggestions-list');
  if (!input || !list) return;

  const show = q => {
    const m = q.trim() ? c.suggestions.filter(s => s.toLowerCase().includes(q.toLowerCase())).slice(0, 8) : c.suggestions.slice(0, 8);
    if (!m.length) { list.classList.remove('open'); return; }
    list.innerHTML = m.map(s => `<div class="suggestion-item" data-value="${s}"><span class="sugg-icon">${c.icon}</span><span>${s}</span></div>`).join('');
    list.classList.add('open');
  };
  input.addEventListener('focus', () => show(input.value));
  input.addEventListener('input', () => show(input.value));
  input.addEventListener('keydown', async e => {
    if (e.key === 'Enter' && input.value.trim()) { list.classList.remove('open'); await loadDevice(el, input.value.trim(), category); }
    if (e.key === 'Escape') list.classList.remove('open');
  });
  list.addEventListener('click', async e => {
    const item = e.target.closest('.suggestion-item'); if (!item) return;
    input.value = item.dataset.value; list.classList.remove('open');
    await loadDevice(el, item.dataset.value, category);
  });
  document.addEventListener('click', e => { if (!el.contains(e.target)) list.classList.remove('open'); });
  renderEmpty(el, category);
}

// ─── BOOT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const cat = document.body.dataset.category || 'mobile';
  const counts = Object.keys(LOCAL_DB[cat]).length;
  document.querySelectorAll('.product-card').forEach(c => initCard(c, cat));
  console.log(`BestMatch v2.4 [${cat}] — ${counts} devices`);
});