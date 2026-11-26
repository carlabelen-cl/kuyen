
# Base de datos NoSQL de Kuyén

## 1. Elección del motor de base de datos

Para el desarrollo de Kuyén se seleccionó **MongoDB Atlas** como sistema de gestión de base de datos NoSQL orientado a documentos.

La elección se basa en la estructura de la información que maneja la aplicación. Kuyén permite registrar síntomas, niveles de dolor, sangrado, actividades físicas, emociones, horas de sueño, medicamentos y notas personales. Estos datos presentan una estructura variable, por lo que resulta conveniente almacenarlos mediante documentos BSON con objetos anidados y arreglos.

MongoDB permite representar esta información de manera flexible, agrupando en un mismo documento los datos que pertenecen a un registro diario. Además, ofrece consultas mediante filtros, operaciones CRUD y un sistema de agregación que permite analizar los registros y relacionarlos entre colecciones.

Se utilizó **MongoDB Atlas** para alojar la base de datos en la nube, mientras que **Mongoose** se incorporó en el backend de Node.js para definir los modelos, establecer reglas de validación y facilitar la interacción con las colecciones.

### 1.1. Comparación con otras alternativas

| Criterio | MongoDB Atlas | Base de datos relacional | Firebase Firestore |
|---|---|---|---|
| Modelo de datos | Documentos BSON | Tablas y relaciones | Documentos y colecciones |
| Estructura | Flexible y anidada | Esquema estructurado | Flexible |
| Relaciones | Referencias y agregaciones | Claves primarias y foráneas | Referencias y consultas entre colecciones |
| Consultas | Filtros y pipeline de agregación | SQL y JOIN | Consultas por campos e índices |
| Validación | Mediante esquemas y validadores | Mediante restricciones | Mediante reglas y validaciones en la aplicación |
| Sincronización en tiempo real | Requiere implementar mecanismos adicionales | Requiere implementar mecanismos adicionales | Compatibilidad integrada con listeners |
| Funcionamiento sin conexión | No es una característica nativa de Atlas | Depende de la arquitectura implementada | Soporte de persistencia local en clientes compatibles |

### 1.2. Justificación de la elección

Una base de datos relacional permitiría organizar la información de Kuyén mediante tablas, por ejemplo, usuarias, síntomas y registros diarios. Sin embargo, los registros contienen estructuras anidadas y listas de datos que pertenecen a una misma jornada. En un modelo relacional, parte de esta información podría requerir tablas adicionales y operaciones JOIN para reconstruir cada registro.

Firebase Firestore también constituye una alternativa NoSQL válida, especialmente por sus capacidades de sincronización en tiempo real y persistencia sin conexión en clientes compatibles. No obstante, para este proyecto se priorizó MongoDB por su flexibilidad documental, el uso de Mongoose para validar los datos y las posibilidades de consulta y análisis que ofrece su pipeline de agregación.

Por estas razones, MongoDB Atlas se considera adecuado para las necesidades actuales de Kuyén, ya que permite almacenar registros diarios con estructuras anidadas, mantener relaciones entre las usuarias y sus registros, y realizar consultas para obtener información relevante de la aplicación.

## 2. Modelo de datos

La base de datos de Kuyén está organizada en cuatro colecciones (por el momento):

- **users:** almacena la información de las usuarias y sus perfiles clínicos.
- **dailyrecords:** almacena los registros diarios de síntomas y experiencias personales.
- **symptoms:** contiene el catálogo de síntomas disponibles en la aplicación.
- **symptomcategories:** contiene las categorías utilizadas para organizar los síntomas.

Las colecciones `users`, `dailyrecords` y `symptoms` corresponden a las principales entidades de información del sistema. `symptomcategories` cumple una función auxiliar para clasificar los síntomas.

### 2.1. Colección users

Almacena los datos de las usuarias, sus credenciales de acceso y su perfil clínico.

Ejemplo de documento:

\```json
{
  "_id": "ObjectId",
  "nombre": "Usuaria de ejemplo",
  "edad": 25,
  "correo": "ejemplo@correo.com",
  "passwordHash": "hash_de_contrasena",
  "perfilClinico": {
    "diagnosticos": ["Endometriosis"],
    "etapa": null,
    "antiguedad": null,
    "sintomas": ["dolor-pelvico"],
    "onboardingCompleto": true
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
\```

**Tipos de datos principales:**

- `_id`: ObjectId.
- `nombre`: String.
- `edad`: Number.
- `correo`: String, único.
- `passwordHash`: String.
- `perfilClinico`: objeto anidado.
- `diagnosticos` y `sintomas`: arreglos de String.
- `onboardingCompleto`: Boolean.
- `createdAt` y `updatedAt`: Date.

La contraseña no se almacena directamente, sino mediante su hash.

### 2.2. Colección dailyrecords

Almacena los registros diarios de cada usuaria. Cada documento corresponde a una usuaria y una fecha determinada.

Ejemplo de documento:

\```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "fecha": "2026-11-26T00:00:00.000Z",
  "registroSintomas": {
    "ingredientes": [],
    "dolores": [
      {
        "sintomaId": "dolor-pelvico",
        "intensidad": 5
      }
    ],
    "nivelSangrado": "leve",
    "sintomas": ["dolor-pelvico"],
    "sintomasMetabolicoHormonales": [],
    "actividadesFisicas": [],
    "emociones": [],
    "sueno": {
      "horas": 8,
      "sensacionDespues": "descansada"
    }
  },
  "diario": {
    "estaMenstruando": true,
    "medicamentos": [],
    "notas": "Registro de ejemplo."
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
\```

**Tipos de datos principales:**

- `_id` y `userId`: ObjectId.
- `fecha`: Date.
- `registroSintomas` y `diario`: objetos anidados.
- `dolores`: arreglo de objetos con `sintomaId` String e `intensidad` Number.
- `nivelSangrado`: String con valores permitidos.
- `sintomas`, `emociones` y otros campos de selección: arreglos de String.
- `estaMenstruando`: Boolean.
- `sueno.horas`: Number.
- `createdAt` y `updatedAt`: Date.

El modelo utiliza subdocumentos para agrupar los datos relacionados con cada registro diario.

### 2.3. Colección symptoms

Contiene el catálogo de síntomas que pueden seleccionarse y asociarse a los registros de las usuarias.

Ejemplo de documento:

\```json
{
  "_id": "ObjectId",
  "id": "dolor-pelvico",
  "nombre": "Dolor pélvico",
  "categoriaId": "dolor",
  "activo": true,
  "createdAt": "Date",
  "updatedAt": "Date"
}
\```

**Tipos de datos principales:**

- `_id`: ObjectId.
- `id`: String, único.
- `nombre`: String.
- `categoriaId`: String.
- `activo`: Boolean.
- `createdAt` y `updatedAt`: Date.

El campo `categoriaId` permite identificar a qué categoría pertenece cada síntoma, mientras que `activo` permite controlar si se encuentra disponible para su selección.

### 2.4. Colección symptomcategories

Almacena las categorías que permiten organizar el catálogo de síntomas.

Ejemplo de documento:

\```json
{
  "_id": "ObjectId",
  "id": "dolor",
  "titulo": "Dolor",
  "icono": "heart",
  "afinidad": ["Endometriosis", "Adenomiosis"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
\```

**Tipos de datos principales:**

- `_id`: ObjectId.
- `id`: String, único.
- `titulo`: String.
- `icono`: String.
- `afinidad`: arreglo de String.
- `createdAt` y `updatedAt`: Date.

El campo `afinidad` permite asociar una categoría con uno o más diagnósticos contemplados por la aplicación.

{
  registroSintomas: {
    dolores: [
      {
        sintomaId: 'dolor-pelvico',
        intensidad: 5
      }
    ],
    nivelSangrado: 'leve',
    emociones: [],
    sueno: {
      horas: 8,
      sensacionDespues: 'descansada'
    }
  },
  diario: {
    estaMenstruando: true,
    medicamentos: [],
    notas: 'Registro de ejemplo.'
  }
}


## 4. Consultas por pantalla

En esta sección se describen las consultas y operaciones que permiten recuperar, crear, actualizar y eliminar información en las distintas funcionalidades de Kuyén.

Las operaciones se ejecutan desde el backend desarrollado con Node.js, Express y Mongoose, que actúa como intermediario entre el frontend y MongoDB Atlas.

### 4.1. Registro e inicio de sesión

**Colección utilizada:** `users`.

Esta funcionalidad permite registrar nuevas usuarias y validar sus credenciales al iniciar sesión.

Las principales operaciones son:

- **Registro:** creación de un documento mediante `User.create()`.
- **Inicio de sesión:** búsqueda de la usuaria mediante su correo electrónico con `User.findOne()` y posterior verificación de la contraseña utilizando su hash almacenado.

Ejemplo de consulta:

\```javascript
const usuaria = await User.findOne({
  correo: correo.toLowerCase()
});
\```

Esta consulta permite localizar a la usuaria mediante su correo electrónico, que se encuentra definido como único en el modelo.

### 4.2. Perfil clínico y datos de la usuaria

**Colección utilizada:** `users`.

Esta funcionalidad permite consultar y actualizar la información personal y clínica de la usuaria.

Las operaciones principales son:

- **Consultar perfil:** búsqueda mediante `User.findById()`.
- **Actualizar perfil:** modificación de los campos correspondientes mediante `User.findByIdAndUpdate()`.

Ejemplo de consulta:

\```javascript
const usuaria = await User.findById(usuarioId);
\```

Ejemplo de actualización:

\```javascript
const perfilActualizado = await User.findByIdAndUpdate(
  usuarioId,
  {
    $set: {
      perfilClinico: nuevoPerfil
    }
  },
  {
    returnDocument: 'after',
    runValidators: true
  }
);
\```

Estas consultas permiten mantener actualizada la información clínica sin necesidad de crear un documento independiente por cada modificación del perfil.

### 4.3. Catálogo y selección de síntomas

**Colecciones utilizadas:** `symptoms` y `symptomcategories`.

Esta funcionalidad permite mostrar las categorías disponibles y consultar los síntomas asociados a cada una.

Primero se consultan las categorías:

\```javascript
const categorias = await SymptomCategory.find();
\```

Posteriormente, se filtran los síntomas de acuerdo con la categoría seleccionada y su estado de disponibilidad:

\```javascript
const sintomas = await Symptom.find({
  categoriaId: 'dolor',
  activo: true
});
\```

La consulta utiliza dos criterios:

- `categoriaId`: identifica la categoría seleccionada.
- `activo`: permite mostrar únicamente los síntomas disponibles.

Esta búsqueda aprovecha el índice compuesto `{ categoriaId: 1, activo: 1 }`, definido en el modelo `Symptom`.

### 4.4. Registro diario de síntomas y experiencias

**Colección utilizada:** `dailyrecords`.

Esta funcionalidad permite crear, consultar, modificar y eliminar los registros diarios de cada usuaria.

Las operaciones implementadas corresponden al CRUD:

| Operación | Método de Mongoose | Descripción |
|---|---|---|
| Create | `DailyRecord.create()` | Crea un registro diario. |
| Read | `DailyRecord.find()` | Consulta los registros de una usuaria. |
| Read | `DailyRecord.findOne()` | Busca un registro específico. |
| Update | `DailyRecord.findOneAndUpdate()` | Modifica información del registro. |
| Delete | `DailyRecord.findOneAndDelete()` | Elimina un registro. |

Ejemplo de creación:

\```javascript
const nuevoRegistro = await DailyRecord.create({
  userId: usuarioId,
  fecha: new Date(),
  registroSintomas: {},
  diario: {}
});
\```

Ejemplo de consulta de registros:

\```javascript
const registros = await DailyRecord.find({
  userId: usuarioId
}).sort({ fecha: -1 });
\```

La consulta filtra los registros por la usuaria autenticada y los ordena desde la fecha más reciente hasta la más antigua.

También se permite consultar registros mediante filtros de fecha, facilitando la recuperación de información de jornadas específicas.

Para las operaciones de consulta, actualización y eliminación, se utiliza el identificador de la usuaria junto con el identificador del registro. Esto permite comprobar que el documento solicitado pertenece a la usuaria autenticada.

### 4.5. Historial de registros y análisis de síntomas

**Colecciones utilizadas:** `dailyrecords` y `users`.

Además de las consultas individuales, se implementaron operaciones de agregación para relacionar información y obtener estadísticas.

#### A. Relacionar registros con sus usuarias mediante `$lookup`

Se utiliza una agregación para combinar los documentos de `dailyrecords` con los documentos correspondientes de `users`.

La operación emplea:

- `$lookup`: relaciona ambas colecciones mediante `userId` y `_id`.
- `$unwind`: permite trabajar con la información de la usuaria relacionada.
- `$project`: selecciona los campos que se desean mostrar.
- `$sort`: ordena los resultados por fecha.

Esta consulta permite obtener información de los registros diarios junto con los datos de sus respectivas usuarias.

#### B. Obtener estadísticas de síntomas mediante `$group`

También se implementó una agregación para analizar la frecuencia de los síntomas registrados.

El proceso utiliza:

- `$match`: selecciona los registros que contienen síntomas.
- `$unwind`: separa los elementos del arreglo de síntomas.
- `$group`: agrupa los documentos por síntoma y calcula su frecuencia.
- `$project`: organiza los resultados y calcula la cantidad de usuarias asociadas a cada síntoma.
- `$sort`: ordena los resultados según su frecuencia.

Esta operación permite identificar cuáles son los síntomas que aparecen con mayor frecuencia en los registros de prueba.

### 4.6. Resumen de consultas por funcionalidad

| Funcionalidad | Colecciones | Operaciones principales |
|---|---|---|
| Registro e inicio de sesión | `users` | `create()`, `findOne()` |
| Perfil clínico | `users` | `findById()`, `findByIdAndUpdate()` |
| Categorías de síntomas | `symptomcategories` | `find()` |
| Selección de síntomas | `symptoms` | `find()` con filtros |
| Registro diario | `dailyrecords` | CRUD completo |
| Historial de registros | `dailyrecords` | `find()`, filtros y `sort()` |
| Relación entre usuarias y registros | `dailyrecords`, `users` | `$lookup`, `$unwind`, `$project` |
| Estadísticas de síntomas | `dailyrecords` | `$match`, `$unwind`, `$group`, `$sort` |

Las consultas descritas corresponden a las operaciones implementadas y probadas en el backend y en los scripts de consulta de la base de datos. Las agregaciones de análisis se utilizan como consultas de procesamiento de información y no representan necesariamente pantallas independientes del frontend.


## 5. Índices y optimización de consultas

Los índices en MongoDB permiten optimizar las consultas al facilitar la localización de documentos sin necesidad de recorrer toda una colección.

En Kuyén se definieron índices únicos y compuestos para mejorar la búsqueda de información, evitar registros duplicados y optimizar las consultas más frecuentes.

### 5.1. Índices implementados

#### A. Índice único en users

La colección `users` utiliza un índice único sobre el campo `correo`.

Este índice evita que dos usuarias puedan registrarse utilizando la misma dirección de correo electrónico.

```javascript
correo: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true
}
```

**Justificación:** permite localizar a las usuarias mediante su correo electrónico y garantiza su unicidad dentro de la colección.

#### B. Índice compuesto en symptoms

En la colección `symptoms` se definió el siguiente índice compuesto:

```javascript
symptomSchema.index({ categoriaId: 1, activo: 1 });
```

Este índice considera dos campos:

- `categoriaId`: identifica la categoría del síntoma.
- `activo`: indica si el síntoma está disponible.

**Justificación:** permite optimizar las consultas que filtran los síntomas por categoría y estado de disponibilidad, como ocurre al mostrar el catálogo de síntomas en Kuyén.

#### C. Índice compuesto único en dailyrecords

En la colección `dailyrecords` se definió el siguiente índice:

```javascript
dailyRecordSchema.index(
  { userId: 1, fecha: 1 },
  { unique: true }
);
```

Este índice utiliza los campos `userId` y `fecha`.

**Justificación:** permite optimizar las búsquedas de registros por usuaria y fecha, además de impedir que una misma usuaria tenga más de un registro para el mismo día.

#### D. Índices únicos en los identificadores del catálogo

Las colecciones `symptoms` y `symptomcategories` también utilizan índices únicos sobre el campo `id`.

Estos índices permiten mantener identificadores propios sin duplicados dentro de cada colección.

### 5.2. Justificación general de los índices

Los índices fueron definidos considerando las consultas que realiza Kuyén:

| Colección | Índice | Tipo | Justificación |
|---|---|---|---|
| `users` | `{ correo: 1 }` | Único | Evitar correos duplicados y facilitar búsquedas por correo. |
| `symptoms` | `{ id: 1 }` | Único | Evitar identificadores de síntomas duplicados. |
| `symptoms` | `{ categoriaId: 1, activo: 1 }` | Compuesto | Optimizar filtros por categoría y disponibilidad. |
| `symptomcategories` | `{ id: 1 }` | Único | Evitar identificadores de categorías duplicados. |
| `dailyrecords` | `{ userId: 1, fecha: 1 }` | Compuesto único | Evitar registros duplicados por usuaria y fecha. |

### 5.3. Comparación de consultas mediante explain()

Para comprobar el funcionamiento del índice compuesto de la colección `symptoms`, se realizó una comparación utilizando `explain('executionStats')`.

Se ejecutó la misma consulta en dos escenarios:

**Consulta utilizando el índice:**

```javascript
db.symptoms.find({
  categoriaId: 'dolor',
  activo: true
}).explain('executionStats');
```

**Consulta forzando un recorrido completo de la colección:**

```javascript
db.symptoms.find({
  categoriaId: 'dolor',
  activo: true
}).hint({ $natural: 1 }).explain('executionStats');
```

El método `hint({ $natural: 1 })` fuerza a MongoDB a recorrer la colección siguiendo su orden natural, sin utilizar el índice compuesto.

### 5.4. Resultados obtenidos

La colección `symptoms` contenía 81 documentos al momento de realizar la prueba. Ambas consultas devolvieron los mismos 12 documentos correspondientes a los síntomas activos de la categoría `dolor`.

| Métrica | Con índice | Sin índice |
|---|---:|---:|
| Etapa de ejecución | IXSCAN | COLLSCAN |
| Índice utilizado | `categoriaId_1_activo_1` | Ninguno |
| Documentos devueltos | 12 | 12 |
| Claves examinadas | 12 | 0 |
| Documentos examinados | 12 | 81 |
| Tiempo de ejecución | 0 ms | 0 ms |

Los resultados demuestran que:

- **IXSCAN:** MongoDB utilizó el índice compuesto para localizar los documentos correspondientes.
- **COLLSCAN:** MongoDB recorrió los 81 documentos de la colección para encontrar los mismos 12 resultados.

En esta prueba, la consulta con índice examinó 12 documentos, mientras que la consulta sin índice examinó los 81 documentos existentes.

Ambas consultas registraron un tiempo de ejecución de 0 milisegundos. Debido al tamaño reducido de la colección, no es posible demostrar una diferencia de tiempo significativa. Sin embargo, la cantidad de documentos examinados permite comprobar el beneficio del índice en este escenario.

### 5.5. Conclusión

La implementación de índices en Kuyén permite mejorar la organización y recuperación de información, evitar duplicidad de datos y optimizar las consultas frecuentes.

La comparación mediante `explain('executionStats')` permitió verificar experimentalmente el uso del índice compuesto en la colección `symptoms`, demostrando una reducción en la cantidad de documentos examinados frente a un recorrido completo de la colección.

## 6. Instrucciones de ejecución

### 6.1. Requisitos previos

Para ejecutar el proyecto y sus operaciones de base de datos se requiere:

- Node.js y npm instalados.
- Acceso a una instancia de MongoDB Atlas.
- Las dependencias del backend instaladas.
- Acceso al repositorio del proyecto.

### 6.2. Configuración del entorno

Primero, se debe clonar el repositorio y acceder a la carpeta del proyecto:

```bash
git clone <URL_DEL_REPOSITORIO>
cd Kuyén
```

Dentro de la carpeta `backend`, se deben instalar las dependencias:

```bash
cd backend
npm install
```

Luego, se debe crear un archivo `.env` dentro de `backend`, tomando como referencia el archivo `.env.example`.

Este archivo debe contener las variables de entorno necesarias:

```env
PORT=3000
MONGODB_URI=<URI_DE_CONEXION>
JWT_SECRET=<CLAVE_SECRETA>
```

Los valores deben reemplazarse por las credenciales correspondientes. El archivo `.env` no debe compartirse ni subirse al repositorio, ya que contiene información sensible.

### 6.3. Ejecución del backend

Desde la carpeta `backend`, se inicia el servidor mediante:

```bash
npm run dev
```

El servidor establece la conexión con MongoDB Atlas antes de comenzar a recibir solicitudes.

### 6.4. Inicialización de datos de prueba

Desde la carpeta raíz del proyecto, se pueden ejecutar los scripts de inicialización:

```bash
node database/seed/sintomasSeed.js
node database/seed/datosPruebaSeed.js
```

El primer script carga las categorías y los síntomas del catálogo. El segundo genera usuarias y registros diarios de prueba.

Ambos utilizan operaciones de actualización o inserción (*upsert*), por lo que pueden ejecutarse nuevamente sin duplicar los datos existentes.

### 6.5. Ejecución de consultas y pruebas

Los siguientes comandos se ejecutan desde la carpeta raíz del proyecto:

**Relación entre registros y usuarias mediante `$lookup`:**

```bash
node database/queries/relacionarRegistrosUsuarios.js
```

**Estadísticas de síntomas mediante agregaciones:**

```bash
node database/queries/estadisticasSintomas.js
```

**Operaciones CRUD sobre registros diarios:**

```bash
node database/queries/operacionesCRUD.js
```

**Comparación del uso de índices:**

```bash
node database/queries/compararIndices.js
```

**Prueba de validación de documentos:**

```bash
node database/schema/pruebaValidacion.js
```

Estos scripts permiten comprobar las relaciones entre colecciones, las operaciones de lectura y escritura, las agregaciones, el comportamiento de los índices y las reglas de validación definidas mediante Mongoose.


## 7. Uso de inteligencia artificial

Durante el desarrollo de la base de datos de Kuyén se utilizó ChatGPT como herramienta de apoyo para resolver dudas técnicas, analizar alternativas de implementación y comprender distintos conceptos relacionados con MongoDB y Mongoose.

La herramienta se utilizó principalmente para:

- Analizar la estructura de documentos y decidir cuándo utilizar documentos embebidos o referencias entre colecciones.
- Revisar la definición de esquemas y validaciones mediante Mongoose.
- Comprender e implementar operaciones CRUD.
- Desarrollar consultas de agregación utilizando etapas como `$lookup`, `$unwind`, `$group` y `$project`.
- Definir índices y analizar su funcionamiento mediante `explain("executionStats")`.
- Identificar errores durante la ejecución de scripts y corregirlos.
- Organizar la documentación técnica y las instrucciones de ejecución.

### 7.1. Revisión y validación de las sugerencias

Las respuestas generadas por inteligencia artificial se utilizaron como orientación y no se incorporaron automáticamente al proyecto.

Cada propuesta fue revisada y adaptada de acuerdo con los requerimientos de Kuyén y la estructura real de la aplicación.

La implementación se comprobó mediante:

- Ejecución de los scripts de inicialización de datos.
- Pruebas de operaciones CRUD.
- Verificación de consultas de agregación.
- Pruebas de validación de documentos.
- Comparación de consultas con y sin índices.
- Comprobación de las respuestas de los endpoints del backend.

Las decisiones finales de diseño e implementación fueron revisadas durante el desarrollo del proyecto, considerando su funcionamiento y los requerimientos establecidos.

### 7.2. Ejemplos de prompts utilizados

Los siguientes son ejemplos representativos de las consultas realizadas durante el desarrollo de Kuyén. Fueron reconstruidos a partir del proceso de trabajo y no corresponden necesariamente a transcripciones textuales.

**1. Rubrica del profesor**

> holaaa, necesito que me ayudes con la base de datos de kuyén, te voy a adjuntar la rubrica del profesor para que veamos que tenemos que hacer y como podemos cumplir con todo lo que pide. quiero que avancemos de a poquito pq hay varias cosas que no entiendo mucho todavía muejeje

**2. Explicación de Kuyén**

> antes de empezar te quiero explicar bien de que se trata kuyén y como funciona la aplicacion, pq necesito que entiendas la idea. tenemos varias pantallas, una es para el registro de las usuarias y otra es para los diarios, donde pueden ir anotando sus sintomas y otras cosas, te paso el figma pa q puedas revisarlo c:

**3. Pruebas de Kuyén**

> yaaa continuemos con las pruebas de kuyén te voy a mostrar lo que hice y lo que me aparece en la terminal pq no se si esta todo bien. me salio un warning cuando ejecute el script y no entiendo muy bien que significa, podemos revisarlo y despues seguimos con lo que falta? :c

**4. Estadisticas de sintomas**

> mira existe una matriz de correlación que te adjunte en el figma, acontece q la base de datos debe alimentar esa matriz y esa información la recibiremos de registrar mi día, o de mi diario en el caso de si estas menstruando o not, así que igual debe responder a la parte matemática de alguna u otra forma :D

**5. Funcionalidad**

> PORRRRR FINNNN FUNCIONAAAAAAA se conecto mongoDB, el problemita era el tema de la IP habia registrada otra, por el wifi puede ser :D 