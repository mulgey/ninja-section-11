import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"


export const useTheme = () => {
  // createContext'i useContext takip eder. aynı ismi kullanırız
  const içerik = useContext(ThemeContext);

  // eğer context kapsadığı alanda kullanılmaya çalışılır ise hata vermelidir
  // hook kullanmanın ekstra bir başka avantajı olarak değerlendirilebilir
  if (içerik === undefined) {
    throw new Error("useTheme(), ThemeProvider'ın kapsamı içerisinde kullanılmalıdır")
  }

  return içerik
}