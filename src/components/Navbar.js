// styles
import './Navbar.css'
import { Link } from 'react-router-dom'

// components
import SearchBar from './SearchBar'
import { useTheme } from '../hooks/useTheme'
// import { useContext } from 'react'
// import { ThemeContext } from '../context/ThemeContext'

export default function Navbar() {
  // hook olarak kullanmadan önce tercih ettiğimiz yol
  // createContext'i useContext takip eder. aynı ismi kullanırız
  // const içindeki kısım value olarak tanımladığımız "{color: "blue"}" kısmıdır
  // istediğimiz anahtarı yazarak o anahtarın sahip olduğu değer "destructure"layabiliriz.
  // const { color } = useContext(ThemeContext)

  // yukarıdaki blok yerine hook kullanarak aşağıdaki kodda aynı sonuca vardık
  // (6)-(REDUCER) color dependency değiştiği için bu kısım tekrar çalışır
  const { color, renkGüncelle } = useTheme();

  return (
    // inline style ın içinde kullanabildik, color değerini
    // (7)-(REDUCER) pink, color içindeki yerini bulur ve renk değişir
    <div className='navbar' style={{ background: color}}>
      {/* (2)-(REDUCER) navbar'a tıklandığında renkGüncelle fonksiyonu pink değerini alarak çalışır (devamı ThemeContext.js'te) */}
      <nav onClick={() => renkGüncelle('pink')}>
        <Link className='brand' to="/">
          <h1>Cooking Ninja</h1>
        </Link>
        <SearchBar/>
        <Link to="/create">
          {/* alttaki CSS'i ben haricen ekledim */}
          <h1 style={{fontSize: "smaller"}}>Create Recipe</h1>
        </Link>
      </nav>
    </div>
  )
}