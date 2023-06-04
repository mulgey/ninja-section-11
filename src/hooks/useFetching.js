// GET veya POST için işin gerçekleşme sırası numaralandırılarak gösterilmiştir

import { useEffect, useState } from "react"

// metod olarak default olan GET'i belirtiyoruz. Eğer options değişikliği yapmaz isek istek GET olarak işleyecek
// biz istersek POST'a çevirebiliriz
// (1)-(GET) istek geldiğinde 2. kısımda birşey belirtilmediği için default olarak GET gönderilir
// (1)-(POST) yine bu kısımdan başlarız GET gibi, URL standart eklenir fakat metod olarak POST'u belirtiriz
export const useFetching = (url, method = "GET") => {
  const [data, dataAksiyonu] = useState(null);
  const [yukleniyor, yukleniyorAksiyonu] = useState(false);
  const [hata, hataAksiyonu] = useState(null);
  const [options, optionsAksiyonu] = useState(null);

  // bu kısmın sadece POST aksiyonunda çalışmasını istiyoruz
  // (4)-(POST) create.js dosyasındaki onSubmit'e bağlı onayFonksiyonu fonk. içerisinde data-postlama çalış(mışt)ır
  // (4)-(POST) create.js içerisinde yüklenmiş olan 4 parametre bu fonksiyonda postlanacakVeri olarak yüklenip çalışmaya başlar
  // (4)-(POST) bu işlem sonucunda options değişir
  const dataPostlama = (postlanacakVeri) => {
    optionsAksiyonu({
      // metodu POST olarak ayarladık
      method: "POST",
      // JSON verisi göndereceğimizi belirtmiş oluyoruz
      headers: {
        "Content-Type": "application/json"
      },
      // javascript object'i json string'ine dönüştüren müdehaleyi yapıp body'e depoluyoruz
      body: JSON.stringify(postlanacakVeri)
    })
  }

  // useEffect içerisinde async funct. kullanamayız. await'ler ile ilerliyoruz
  // (2)-(GET) önce burası ateşlenir
  // (2)-(POST) yine buradan ateşlenerek devam eder
  useEffect(() => {
    // fetch iptal edilirse cleanUp devreye girsin bölümü
    const kontrolcü = new AbortController();
     
    // bu kısımda async funct. kullanabiliriz
    // aşağıda eğer metod varsa ve options mevcutsa, bu options'ı bu kısımda parantez içine aktarırız
    // aktardığımız tercihleri altındaki fetch parantezinin içine serperiz
    // (4)-(GET) bu kısımda fetchTercihleri için bir değer yoktur bu yüzden aşağıdaki "...fetchTercihleri" kısmı boş geçer
    // (7)-(POST) bir önceki basamakta geçtiğimiz options içeriğini bu fonksiyonda fetchTercihleri olarak kabul edip işleme alırız
    const dataFetchleme = async (fetchTercihleri) => {
      yukleniyorAksiyonu(true)

      try {
        // fetch fonksiyonu için opsiyonel object olarak cleanUp mekanizmasını yerleştirdik
        // POST request yapabilmek için fetch içerisindeki 2.argüman olan object içerisinde gerekli değişikliği yaparız
        // headers property içerisinde, GET or POST. ve BODY içerisinde gönderdiğimiz DATA
        // bunu fetchTercihleri olarak 2.argüman object'inin içine serptik
        // (8)-(POST) fetch fonk. içinde request ile göndermek istediğimiz verileri method, headers ve body olarak create.js'den enjekte ettik
        const yanıt = await fetch(url, { ...fetchTercihleri, signal: kontrolcü.signal} );
        if (!yanıt.ok) {
          throw new Error("URL hatalı muhtemelen");
        // normalde else kısmı yoktu eğitimde, ben ekledim. hata varsa direkt sistemden çıkması için
        } else {
          const jsonVerisi = await yanıt.json();

          // (5)-(GET) son olarak bu kısım çalışır ve data mız hazır olur
          // (9)-(POST) ve işi bitirdik
          yukleniyorAksiyonu(false)
          dataAksiyonu(jsonVerisi)
          // önceki deneme hatalı ise, hata olmayan sonraki denemede hata durumunu kaldırmak gerekir
          hataAksiyonu(null)
        }
        
      } catch (fail) {
        // hata varsa yükleniyor durumu oluşturmayız
        yukleniyorAksiyonu(false)
        console.log(fail);
        // fetch iptal --> cleanUp ise ilk süreç, yoksa else çalışsın
        if (fail.name === "AbortError") {
          console.log('Süreç iptal edildi');
        } else {
          hataAksiyonu("I couldn't fetch any data")
          console.log(fail.message);
        }
      }            
    }

    // yukarıda fonksiyonu kurduk, aşağıda da ateşliyoruz

    // eğer standart operasyon ise, (GET) normal şekilde çalışsın
    // (3)-(GET) bu kod çalışır. fetch options olmadan dataFetchleme gerçekleşir
    if (method === "GET") {
      dataFetchleme();
    }

    // eğer POST'lamaya niyetimiz varsa ve options hazır ise aşağıdaki bölümü çalıştırabiliriz
    // options, yukarıda async kısmındaki parantez içine aktarılır
    // (3)-(POST) bu sefer bu bloğa takılır fakat options tanımlanmadığı ve null kaldığı için işlem yapmadan geçer
    // (6)-(POST) bu kısım tekrar çalışır bu sefer options olduğu için işlem devam eder
    if (method === "POST" && options) {
      dataFetchleme(options);
    }

    // yine fetch iptal edilirse cleanUp devreye girsin bölümü
    return () => {
      kontrolcü.abort();
    }
  // url'nin yanına POST metodu için options ve method'u da ekledik değişim izleme için
  // (5)-(POST) options değiştiği için dependency olarak useEffect tekrar çalışır
  }, [url, options, method])

  // return sonrası array de olabilir ama biz object tercih ediyoruz
  // { data: data } = { data }
  return { data, yukleniyor, hata, dataPostlama }
}