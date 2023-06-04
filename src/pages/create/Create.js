import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { firestoreObject } from '../../firebase/config';
// datayı aşağıdaki gibi dosyadan çekmiyoruz artık
// import { useFetching } from '../../hooks/useFetching';

// styles
import './Create.css'

export default function Create() {
  const [title, başlıkAksiyonu] = useState('');
  const [method, metodAksiyonu] = useState('');
  const [cookingTime, süreAksiyonu] = useState('');
  // yeni eklenenleri burada biriktirip, tuşa basınca aşağıdaki array'a enjekte etmeyi düşünüyoruz
  const [yeniİçerik, yeniİçerikAksiyonu] = useState('');
  const [ingredients, içeriklerAksiyonu] = useState([]);
  // içerik eklendikten sonra input field'ın aktif olması için ref kullandık. ref kullanımı için iyi bir örnek
  const içerikInputu = useRef(null);
  const geçmiş = useHistory();

  // datayı aşağıdaki gibi dosyadan çekmiyoruz artık
  // bu sayfa için POST düzeni datafetching kuruyoruz
  // const { dataPostlama, data } = useFetching('http://localhost:3000/recipes', 'POST')

  // bu fonksiyonu iş bittikten sonra kullanıcıyı ana sayfaya yönlendirmesi için async yaptık
  const onayFonksiyonu = async (aksiyon) => {
    // tuş submit'lendiğinde sayfa yenilenmesin
    aksiyon.preventDefault();
    // datayı aşağıdaki gibi yerel veri dosyasına göndermiyoruz artık
    // json'a dönüştürülecek olan veriyi object olarak gönderiyoruz. diğer tarafta JSON.stringify ile json'a dönüştürüyoruz
    // json-server bizim için sonrasında unique bir ID oluşturacaktır
    // dataPostlama({ title, method, ingredients, cookingTime: `${cookingTime} minutes` })
    
    // veri grubunu object olarak bir const içerisine atıyoruz
    const döküman = { title, method, ingredients, cookingTime: `${cookingTime} minutes` }

    // injection zamanı !!
    // dene - hata varsa işle metodunu kullandık (try-catch)
    try {
      // yönlendirme öncesi ekleme işleminin tamamlanması için await girdik
      await firestoreObject.collection('recipes').add(döküman);
      geçmiş.push('/')
    } catch (hata) {
      console.log(hata);
    }

  }

  const eklemeFonksiyonu = (aksiyon) => {
    aksiyon.preventDefault();
    // öncelikle kutuya yazılmış olan içerikteki boşlukları temizlemeliyiz
    const içerik = yeniİçerik.trim();

    // boş içerik eklemek istemiyoruz ve aynı içeriği tekrar eklemek istemiyoruz
    // eğer içerik varsa ve içerikler yeniİçerik'i içermiyorsa
    if (içerik && !ingredients.includes(içerik)) {
      // öncekilere trim'lenmiş yeni içeriği ekle (prevState metodunu kullandık)
      içeriklerAksiyonu(öncekiler => [...öncekiler, içerik])
    }
    // yeni içeriği enjekte ettiğimize göre, kabı boşaltabiliriz
    yeniİçerikAksiyonu('');
    // içerik ekledikten sonra cursor tekrar kutucukta yanıp sönsün. ref kullanarak focus'lanmak istiyoruz
    içerikInputu.current.focus();
  }

  // bu kısmı async bir fonksiyon olarak onayFonksiyonu içerisinde kullandık
  // yeni tarifi eklediğimizde = data yanıtı geldiğinde, kullanıcıyı ana ekrana yönlendirmek istiyoruz
  /*
  useEffect(() => {
    if (data) {
      geçmiş.push('/')
    }
  // geçmiş i sadece console uyarısı vermesin diye ekledik. fonksiyonellik yok
  }, [data, geçmiş])
  */

  return (
    <div className='create'>
      <h2 className='page-title'>Yeni bir tarif eklemek istemez misiniz?</h2>
      {/* form'a onSubmit ekledik, button'a tıklandığında buradan aksiyon almak için */}
      <form onSubmit={onayFonksiyonu}>

        <label>
          <span>Tarif başlığı:</span>
          <input 
            type='text'
            // aşağıda başlığı güncelliyoruz her güncellemede
            onChange={(olay) => başlıkAksiyonu(olay.target.value)}
            // aşağıdaki kod kullanıcı inputu dışındaki değişimleri de kapsayacak şekilde 2 yönlü koruma altına alıyor
            value={title}
            required
          />
        </label>

        <label>
          <span>Tarif içeriği:</span>
          <div className='ingredients'>
            <input 
              type="text"
              onChange={(olay) => yeniİçerikAksiyonu(olay.target.value)}
              value={yeniİçerik}
              // yukarıda ref tanımlaması yapmıştık null değeri ile. Burada ise ilişkilendirmeyi yaparak gerekli yere bağlamış olduk
              ref={içerikInputu}
            />
            <button onClick={eklemeFonksiyonu} className='btn'>katıvee..</button>
          </div>
        </label>
        {/* burada map metodu ile o ana kadar eklediklerimizi sıralıyoruz */}
        <p>Şimdiye kadar ekledikleriniz: {ingredients.map(x => <em key={x}>{x}, </em>)}</p>

        <label>
          <span>Tarif metodu:</span>
          <textarea
            // aşağıda başlığı güncelliyoruz her güncellemede
            onChange={(olay) => metodAksiyonu(olay.target.value)}
            // aşağıdaki kod kullanıcı inputu dışındaki değişimleri de kapsayacak şekilde 2 yönlü koruma altına alıyor
            value={method}
            required
          />
        </label>

        <label>
          <span>Tarif süresi (dakika):</span>
          <input
            type="number"
            // aşağıda başlığı güncelliyoruz her güncellemede
            onChange={(olay) => süreAksiyonu(olay.target.value)}
            // aşağıdaki kod kullanıcı inputu dışındaki değişimleri de kapsayacak şekilde 2 yönlü koruma altına alıyor
            value={cookingTime}
            required
          />
        </label>

        <button className='btn'>Gönder gitsin ..!</button>

      </form>
    </div>
  )
}
