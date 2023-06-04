import { createContext, useReducer } from "react";

// Öncelikle burada ThemeContext object imizi oluşturduk
// diğer sayfalarda useContext ile kullanırken burada verdiğimiz ismi kullanırız
export const ThemeContext = createContext();

// fonksiyon içersinde olmak ve her seferinde tekrar değerlendirilmek zorunda değil
// 2 argüman: (1) mevcut güncellenmiş "state" ve (2) dispatch içindeki objecti içerecek olan "action"
// (5)-(REDUCER) burası çalıştığında state olarak baştaki bloğu (color: 'blue"yu) ve action olarak dispatch'i alır. Devamı Navbar.js'te
const temaReducer = (state, action) => {
  // type ı kontrol etmek için switch kullandık
  switch (action.type) {
    // eğer "CHANGE_COLOR" ise
    case 'CHANGE_COLOR':
      // önce mevcut state'i sereriz (birden fazla state varsa değiştirmediklerimiz mevcudiyetini sürdürsün diye)
      // override yapmak istediğimiz diğer özellikleri yazarız. color'ı payload içerisindeki değer ile güncellemek istedik
      return { ...state, color: action.payload }
    case 'CHANGE_MODE':
      return { ...state, mode: action.payload }
    // case lerin hiçbiri eşleşmez ise önceki state'i olduğu gibi geri yansıt
    default:
      return state
  }
}

// burada ise custom bir react componenti oluşturduk
// (1)-(REDUCER) Öncelikle bu kısımda rengi color: 'blue' olarak belirtiriz (devamı Navbar.js'te)
export function TemaSağlayıcı ( { children } ) {
  // state = ilk belirttiğimiz durum. dispatch = yukarıdaki fonksiyona state değişikliğini tetikleyen kısım
  // ilk fonksiyon (temaReducer) state update için kullanılan fonksiyonu tanıtır, ikinci kısım {} ise başlangıçtaki state durumunu belirtir
  // (4)-(REDUCER) dispatch ile ilişkili olan "temaReducer" fonksiyonunu bulur ve çalıştırır
  const [state, dispatch] = useReducer(temaReducer, {
    color: '#58249c',
    mode: 'light'
  })

  // değiştirmek istediğimiz "color" argümanını taşır
  // (3)-(REDUCER) bu fonksiyon çalışarak pink'i gönderir ve dispatch ler
  const renkGüncelle = (color) => {
    // değişim objesi 2 özellik taşır: durum değişikliğinin tipini (capitalised_string) ve değişimi temellendireceğimiz veri
    dispatch({type: 'CHANGE_COLOR', payload: color})
  }
  const modGüncelle = (mod) => {
    dispatch({type: 'CHANGE_MODE', payload: mod})
  }
  
  // aşağıdaki kurulum sayesinde "custom logic = flexibility" kazanırız
  return (
    // değişebilecek state object'i ve değişim fonksiyonunu value içerisinde sunduk
    <ThemeContext.Provider value={{...state, renkGüncelle, modGüncelle}}>
      {/* tüm children componentleri üstteki object değerlerine erişebilecektir */}
      {children}
    </ThemeContext.Provider>
  )
}