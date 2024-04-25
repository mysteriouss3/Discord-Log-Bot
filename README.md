# Discord-Log-Bot
Basic Düzeyde Role Ses Ve Mesaj Logu Tutar.

# Discord Botu - Ses ve Mesaj Loglama

Bu Discord botu, belirli bir sunucuda ses ve mesajları loglamak için tasarlanmıştır. Bot, belirli olayları izler ve loglama kanalına ilgili bilgileri gönderir.

## Özellikler

- Ses kanalına giriş ve çıkışları loglama
- Metin kanalındaki mesajları loglama
- Role güncellediğinde bilgileri loglama
- Sunucuda yetkisi üst birine sunucu düzeyinde mute atıldıgında bot geri muteyi açar ( Yetkisi Yüksek Birine Atarsa Eğer)

## Kurulum

1. Bu depoyu klonlayın veya ZIP olarak indirin.
2. Botunuzu Discord Geliştirici Portalı'nda oluşturun ve botunuzun token'ını alın.
3. `index.js` dosyasını açın ve `token` alanına botunuzun token'ını ekleyin.
5. Terminal veya komut istemcisinde `npm install` komutunu çalıştırarak gerekli bağımlılıkları yükleyin.
6. Botu başlatmak için terminalde `node index.js` komutunu çalıştırın.

## Kullanım

- Botu çalıştırdıktan sonra belirlediğiniz ses ve mesaj loglama kanalına ilgili olaylar loglanacaktır.

## Yapılandırma

`index.js` dosyası, botun davranışını yapılandırmak için kullanılır. Aşağıdaki alanlar yapılandırılabilir:

- `token`: Discord botunuzun token'i.
- `RoleChannelID`: Role loglarının gönderileceği kanalın ID'si.
- `MesajChannelID`: Mesaj loglarının gönderileceği kanalın ID'si.
- `SesChannelID`: Ses loglarının gönderileceği kanalın ID'si

## Katkıda Bulunma

1. Bu deposu çatallayın (fork) ve bilgisayarınıza klonlayın (`git clone https://github.com/mysteriouss3/Discord-Log-Bot.git`).
2. Yeni özellikler veya düzeltmeler ekleyin.
3. Değişikliklerinizi açıklayan açıklamalar ekleyin (`git commit -am 'Yeni özellik: ...'`).
4. Kendi deposunuza (fork) itin (`git push origin ana_dal`).
5. Bir Pull Request oluşturun.

## Resimler



## Lisans

Bu proje GNU Genel Kamu Lisansı sürüm 3 (GPL-3.0) altında lisanslanmıştır. Daha fazla bilgi için [LICENSE](LICENSE) dosyasına bakın.

