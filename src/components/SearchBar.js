import { useState } from 'react'
import { useHistory } from 'react-router-dom';

// styles
import './SearchBar.css'

export default function SearchBar() {
  const [terim, terimAksiyonu] = useState('');
  const geçmiş = useHistory();

  const gönderFonksyionu = (aksiyon) => {
    aksiyon.preventDefault();
    // arama bittikten sonra terim kutucukta kalmasın diye benim harici eklediğim bölüm
    terimAksiyonu('');
    // ?'nden sonraki harf opsiyonel. ben search'ün s'sini atadım
    geçmiş.push(`/search?s=${terim}`);
  }

  return (
    <div className='searchbar'>
      <form onSubmit={gönderFonksyionu}>
        <label htmlFor='search'>Search:</label>
        {/* htmlFor ve id'ye aynı ismi vererek birbirine bağladık */}
        <input
          type='text'
          id='search'
          onChange={(x) => {terimAksiyonu(x.target.value)}}
          required
          value={terim}
        />
        {/* üstteki value yu ben ekledim, double binding alışkanlığı, öncekilerden */}
      </form>
    </div>
  )
}
