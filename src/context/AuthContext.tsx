import { createContext, useContext, useEffect, useState, ReactNode } from 'react'; // create context: Crea un contexto compartido entre componente, useContext: Permite acceder al contexto desde cualquier componente, useEffect: Permite ejecutar código cuando el componente se monta o actualiza, useState: Permite manejar el estado del componente, ReactNode: Tipo de dato que representa cualquier elemento de React (componentes, texto, etc.)
import {
  Usuaria, registrarUsuaria, iniciarSesion, actualizarUsuaria, obtenerSesion, cerrarSesion,
} from '../database/mockDb'; // importa las funciones y tipos necesarios para manejar la autenticación de usuarias desde la base de datos simulada (mockDb)
// un useState guarda información c: 
// create context y use context permiten compartir información entre componentes sin tener que pasarla como props, es como un "almacén" de información que todos los componentes pueden usar
type AuthValue = { // que información estará disponible mediante el contexto 
  usuaria: Usuaria | null;
  cargando: boolean;
  registrar: (datos: Pick<Usuaria, 'nombre' | 'edad' | 'nacionalidad' | 'correo' | 'clave'>) => Promise<void>;
  ingresar: (correo: string, clave: string) => Promise<void>;
  actualizarPerfil: (cambios: Partial<Usuaria>) => Promise<void>;
  salir: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuaria, setUsuaria] = useState<Usuaria | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerSesion().then(setUsuaria).finally(() => setCargando(false));
  }, []);

  const value: AuthValue = {
    usuaria,
    cargando,
    registrar: async (datos) => setUsuaria(await registrarUsuaria(datos)),
    ingresar: async (correo, clave) => setUsuaria(await iniciarSesion(correo, clave)),
    actualizarPerfil: async (cambios) => {
      if (!usuaria) return;
      setUsuaria(await actualizarUsuaria(usuaria.id, cambios));
    },
    salir: async () => {
      await cerrarSesion();
      setUsuaria(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}