import { useLocation } from 'react-router-dom'
import { useFetching } from '../../hooks/useFetching';

// Styles
import './Search.css'

// components
import RecipeList from '../../components/RecipeList'

export default function Search() {
  
  const queryUzantısı = useLocation().search;
  // aşağıdaki kodun sonucu "object" olarak gelir
  const queryParametresi = new URLSearchParams(queryUzantısı);
  const sorgu = queryParametresi.get('s');
  // yukarıdaki "s" veya ne olursa olsun aşağıdaki "q" olmak zorunda
  const urlSorgu = `http://localhost:3000/recipes?q=${sorgu}`

  const { data, yukleniyor, hata } = useFetching(urlSorgu)

  return (
    <div>
      <h2 className='page-title'>"{sorgu}" içeren sonuçlar</h2>
      {hata && <p className='error'>Hata şu şekilde: {hata}</p>}
      {yukleniyor && <p className='loading'>Yükleniyor...</p>}
      {data && <RecipeList tarifListesi={data} />}
    </div>
  )
}