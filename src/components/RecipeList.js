// styles
import './RecipeList.css'

import çöpKutusu from '../assets/delete.svg'

import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { firestoreObject } from '../firebase/config';

export default function RecipeList( { tarifListesi } ) {
  const { mode } = useTheme();

  // eğer sonuç yoksa, ekrana şunu sunalım
  if (tarifListesi.length === 0) {
    return <div className='error'>Herhangi bir tarif mevcut değil...</div>
  }

  // icon üzerindeki silme fonksiyonu burada çalışır
  const silmeFonksiyonu = (id) => {
    // tekil öğeler ile etkileşime girdiğimiz collection().doc() metodunu kullanıyoruz
    firestoreObject.collection('recipes').doc(id).delete()
  }

  return (
    <div className='recipe-list'>
      {tarifListesi.map((tekilTarif) => (
        <div key={tekilTarif.id} className={`card ${mode}`}>
          <h3>{tekilTarif.title}</h3>
          <p>Tamamlaması {tekilTarif.cookingTime} sürer</p>
          {/* aşağıda her tarifin metodunu yansıtmak istiyoruz ama ilk 100 karakter yeterli */}
          <div>{tekilTarif.method.substring(0, 100)}...</div>
          <Link to={`/recipes/${tekilTarif.id}`}>Pişir Onu ..!</Link>
          <img
            className='delete'
            src={çöpKutusu}
            onClick={() => silmeFonksiyonu(tekilTarif.id)}
          />
        </div>
      ))}
    </div>
  )
}
