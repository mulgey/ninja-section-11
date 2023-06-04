// Styles
import './Home.css'

// datayı aşağıdaki gibi dosyadan çekmiyoruz artık
// import { useFetching } from '../../hooks/useFetching'
import RecipeList from '../../components/RecipeList';
import { useEffect, useState } from 'react';
import { firestoreObject } from '../../firebase/config';

export default function Home() {
  // datayı aşağıdaki gibi dosyadan çekmiyoruz artık
  // const {data, yukleniyor, hata} = useFetching("http://localhost:3000/recipes");

  // yeni data çekme metodu
  const [data, dataAksiyonu] = useState(null);
  const [yukleniyor, yuklemeAksiyonu] = useState(false);
  const [hata, hataAksiyonu] = useState(false);

  useEffect(() => {
    // öncelikle bekleme modunu açıyoruz
    yuklemeAksiyonu(true);

    // firestore içerisinde verdiğimiz ismi () içerisinde kullanıyoruz
    // bütün doc ları almak için sadece get metodunu kullanıyor(duk) 
    // real-time listener kullanmak için "get().then()" kısmını kaldırdık, onSnapshot()'ı kurduk
    // clean-up özelliğini kullanmak için const atadık. böylece operasyonun ortasında çöküp hata vermeyecek
    const takibiBırak = firestoreObject.collection('recipes').onSnapshot((snapPoz) => {
      // öncelikle veri olup olmadığını kontrol ediyoruz
      if (snapPoz.empty) {
        hataAksiyonu('Yüklenecek veri yok')
        yuklemeAksiyonu(false)
      // herşey yolundaysa
      } else {
        let dönenSonuç = [];
        // koleksiyondaki tüm dökümanları array olarak verir
        snapPoz.docs.forEach(döküman => {
          // unique ID'yi ver ve sonra mevcut veri objesine veriyi yükle
          dönenSonuç.push({ id:döküman.id, ...döküman.data() })
        })
        // verimizi ateşlemeye hazırız
        dataAksiyonu(dönenSonuç)
        yuklemeAksiyonu(false)
      }
    // snapShot için ikinci fonksiyon hata yönetimi olur  
    }, (hata) => {
      hataAksiyonu(hata.message)
      yuklemeAksiyonu(false)
    })
    
    // real-time listener varken err'lar ile bu şekilde uğraşmıyoruz
    /*
    .catch(err => {
      hataAksiyonu(err.message);
      yuklemeAksiyonu(false)
    })
    */

    // clean-up fonksiyonun çalışabilmesi için 2. ve son aşama
    return () => takibiBırak()

  }, [])

  return (
    <div className="home">
      {hata && <p className='error'>{hata}</p>}
      {yukleniyor && <p className='loading'>Yükleniyor</p>}
      {data && <RecipeList tarifListesi={data}/>}      
    </div>
  )
}
