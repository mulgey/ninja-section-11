// Styles
import './Recipe.css'

import { useHistory, useParams } from 'react-router-dom';
// datayı aşağıdaki gibi dosyadan çekmiyoruz artık
// import { useFetching } from '../../hooks/useFetching';
import { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme'
import { firestoreObject } from '../../firebase/config';

export default function Recipe() {

  const { tarifID } = useParams();
  // datayı aşağıdaki gibi dosyadan çekmiyoruz artık 
  // const etkileştiğimizURL = `http://localhost:3000/recipes/${tarifID}`;
  // const {data: tekilTarifVerisi, yukleniyor, hata} = useFetching(etkileştiğimizURL);

  // yeni data çekme metodu
  const [tekilTarifVerisi, tekilAksiyon] = useState(null);
  const [yukleniyor, yuklemeAksiyonu] = useState(false);
  const [hata, hataAksiyonu] = useState(false);

  useEffect(() => {
    // öncelikle bekleme modunu açıyoruz
    yuklemeAksiyonu(true)

    // firestore içerisinde verdiğimiz ismi () içerisinde kullanıyoruz
    // tek dökümanı almak için öncelikle doc metodunu kullanıyoruz
    // real-time listener kullanmak için "get().then()" kısmını kaldırdık, onSnapshot()'ı kurduk
    // clean-up özelliğini kullanmak için const atadık. böylece operasyonun ortasında çöküp hata vermeyecek
    const takibiBırak = firestoreObject.collection('recipes').doc(tarifID).onSnapshot((döküman) => {
      // eğer gerçekten bir öğe varsa
      if (döküman.exists) {
        tekilAksiyon(döküman.data())
        yuklemeAksiyonu(false)
      // öğe yoksa
      } else {
        hataAksiyonu('O tarifi bulamadım')
        yuklemeAksiyonu(false)
      }
    })

    // clean-up fonksiyonun çalışabilmesi için 2. ve son aşama
    return () => takibiBırak()
    
  // tarifID zorunlu olmadığı halde bahsi geçtiği ve uyarı gelmemesi için kullanıldı
  }, [tarifID])

  const { mode } = useTheme()

  const geçmiş = useHistory();
  
  useEffect(() => {
    if (hata) {
      // redirect
      setTimeout(() => {
        geçmiş.push('/')
      }, 2000)
    }
  // "geçmiş"i sadece "kullanmadınız" uyarısı vermesin diye ekledik, fonk. yok
  }, [hata, geçmiş])

  const güncellemeFonksiyonu = () => {
    firestoreObject.collection('recipes').doc(tarifID).update({
      // bu object'in içine sadece güncellmek istediklerimizi sağlayabiliriz
      title: `Güncellenmiş yeni başlık`
    })
  }

  return (
    <div className={`recipe ${mode}`}>
      {yukleniyor && <div className="loading">Yükleniyor...</div>}
      <br></br>
      {hata && <div className='error'>{hata}</div>}
      {tekilTarifVerisi && (
        <>
          <h2 className='page-title'>{tekilTarifVerisi.title}</h2>
          <p>Tahminen {tekilTarifVerisi.cookingTime} sürer</p>
          <ul>
            {/* ul içerisinde "li"leri turlayacak map metodunu çalıştırıyoruz */}
            {tekilTarifVerisi.ingredients.map(malzeme => (
              <li key={malzeme}>{malzeme}</li>
            ))}
          </ul>
          <p className='method'>{tekilTarifVerisi.method}</p>
          <button onClick={() => güncellemeFonksiyonu()}>Güncelle beni ..!</button>
        </>
      )}
    </div>
  )
}