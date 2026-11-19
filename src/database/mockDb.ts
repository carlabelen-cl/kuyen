import AsyncStorage from '@react-native-async-storage/async-storage';

export type Usuaria = {
  id: string;
  nombre: string;
  edad: number;
  nacionalidad: string;
  correo: string;
  clave: string; // SOLO MOCK: en el backend real se guarda un hash
  diagnosticos: string[];
  etapa?: string;
  antiguedad?: string;
  sintomas: string[];
  onboardingCompleto: boolean;
};

type DatosRegistro = Pick<Usuaria, 'nombre' | 'edad' | 'nacionalidad' | 'correo' | 'clave'>;

const USERS_KEY = 'kuyen:users';
const SESSION_KEY = 'kuyen:session';

async function leerUsuarias(): Promise<Usuaria[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function guardarUsuarias(lista: Usuaria[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(lista));
}

export async function registrarUsuaria(datos: DatosRegistro): Promise<Usuaria> {
  const usuarias = await leerUsuarias();
  const correo = datos.correo.trim().toLowerCase();
  if (usuarias.some((u) => u.correo === correo)) throw new Error('CORREO_EXISTE');

  const nueva: Usuaria = {
    ...datos,
    id: Date.now().toString(),
    nombre: datos.nombre.trim(),
    correo,
    diagnosticos: [],
    sintomas: [],
    onboardingCompleto: false,
  };
  await guardarUsuarias([...usuarias, nueva]);
  await AsyncStorage.setItem(SESSION_KEY, nueva.id);
  return nueva;
}

export async function iniciarSesion(correo: string, clave: string): Promise<Usuaria> {
  const usuarias = await leerUsuarias();
  const u = usuarias.find((x) => x.correo === correo.trim().toLowerCase() && x.clave === clave);
  if (!u) throw new Error('CREDENCIALES');
  await AsyncStorage.setItem(SESSION_KEY, u.id);
  return u;
}

export async function actualizarUsuaria(id: string, cambios: Partial<Usuaria>): Promise<Usuaria> {
  const usuarias = await leerUsuarias();
  const lista = usuarias.map((u) => (u.id === id ? { ...u, ...cambios } : u));
  await guardarUsuarias(lista);
  return lista.find((u) => u.id === id)!;
}

export async function obtenerSesion(): Promise<Usuaria | null> {
  const id = await AsyncStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const usuarias = await leerUsuarias();
  return usuarias.find((u) => u.id === id) ?? null;
}

export async function cerrarSesion() {
  await AsyncStorage.removeItem(SESSION_KEY);
}