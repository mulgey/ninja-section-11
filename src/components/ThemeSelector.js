// içerisindeki renkGüncelle fonk. kullanmak istiyoruz
import { useTheme } from '../hooks/useTheme'

import modeIcon from '../assets/dark_mode.svg'

// styles
import './ThemeSelector.css'

const themeRenkleri = ['#58249c', '#249c6b', '#b70233']

export default function ThemeSelector() {
  // Navbar.js dosyasında const object'i içerisinde "color" u da kullanmıştık, ilk rengi kullanıp atadığımız için
  const { renkGüncelle, modGüncelle, mode } = useTheme();

  const modeDeğiştir = () => {
    // değerlendir doğruysa ilkine değiştir, yanlış ise ikincisine değiştir
    modGüncelle(mode === 'dark' ? 'light' : 'dark');
  }

  return (
    <div className='theme-selector'>
      <div className='mode-toggle'>
        <img 
          src={modeIcon}
          onClick={modeDeğiştir}
          alt='dark and light toggle icon'
          // mode dark ise tam invert'le, değilse %20
          style={{ filter: mode === 'dark' ? 'invert(100%)' : 'invert(20%)'}}
        />
      </div>
      <div className='theme-buttons'>
        {themeRenkleri.map(herBirRenk => (
          <div
            key={herBirRenk}
            onClick={() => renkGüncelle(herBirRenk)}
            style={{ background: herBirRenk }}
          />
        ))}
      </div>
    </div>
  )
}
