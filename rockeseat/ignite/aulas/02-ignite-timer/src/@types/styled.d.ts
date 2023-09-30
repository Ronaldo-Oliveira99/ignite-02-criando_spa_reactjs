import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

// para mostrar as propriedades do tema utilizado em ThemeProvider
// fazer uma integração do styled com o typescript
type ThemeType = typeof defaultTheme

// sobrescrever um modulo styled-components
declare module 'styled-components' {
  /* exportar uma interface do styled componets DefaultTheme
    para que ela estenda o ThemeType */
  export interface DefaultTheme extends ThemeType {}
}
