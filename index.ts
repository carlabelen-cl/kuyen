import { registerRootComponent } from 'expo';
// este es el "mesero", es quién conecta a la app con el sistema operativo del celular

import App from './App';
// le muestro al "mesero" cuál es la app que debe levantar, en este caso es App.tsx 
// entonces ahí se genera la conexión entre el sistema operativo del celular y la app que levanté, en este caso App.tsx

registerRootComponent(App);
