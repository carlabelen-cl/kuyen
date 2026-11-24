import { Ionicons } from '@expo/vector-icons';

export type Diagnostico = 'Endometriosis' | 'Adenomiosis' | 'SOMP';

export type Sintoma = { id: string; nombre: string };

export type CategoriaSintoma = {
  id: string;
  titulo: string;
  icono: keyof typeof Ionicons.glyphMap;
  afinidad?: Diagnostico[]; // si existe, la categoría se sugiere a quien tenga ese diagnóstico
  sintomas: Sintoma[];
};

export const CATEGORIAS: CategoriaSintoma[] = [
  {
    id: 'dolor',
    titulo: 'Dolor',
    icono: 'flame-outline',
    sintomas: [
      { id: 'dolor-pelvico', nombre: 'Dolor pélvico' },
      { id: 'colicos', nombre: 'Cólicos intensos' },
      { id: 'dolor-bajo-vientre', nombre: 'Dolor en el bajo vientre' },
      { id: 'dolor-lumbar', nombre: 'Dolor lumbar' },
      { id: 'dolor-ovulacion', nombre: 'Dolor en la ovulación' },
      { id: 'dolor-piernas', nombre: 'Dolor que baja a las piernas' },
      { id: 'dolor-evacuar', nombre: 'Dolor al evacuar' },
      { id: 'dolor-orinar', nombre: 'Dolor al orinar' },
      { id: 'dolor-hombro', nombre: 'Dolor en el hombro' },
      { id: 'sensibilidad-senos', nombre: 'Sensibilidad en los senos' },
      { id: 'dolor-incapacitante', nombre: 'Dolor que me impide hacer mi día' },
      { id: 'dolor-frente', nombre: 'Dolor similar a migraña' },
    ],
  },
  {
    id: 'ciclo',
    titulo: 'Ciclo y sangrado',
    icono: 'water-outline',
    sintomas: [
      { id: 'sangrado-abundante', nombre: 'Sangrado abundante' },
      { id: 'sangrado-prolongado', nombre: 'Sangrado prolongado' },
      { id: 'coagulos', nombre: 'Coágulos' },
      { id: 'manchado', nombre: 'Manchado entre reglas' },
      { id: 'ciclo-irregular', nombre: 'Ciclos irregulares' },
      { id: 'ciclo-ausente', nombre: 'Sin regla por meses' },
      { id: 'sangre-evacuar-orinar', nombre: 'Sangre al evacuar u orinar en la regla' },
      { id: 'spm-intenso', nombre: 'Síndrome premenstrual intenso' },
    ],
  },
  {
    id: 'digestivo',
    titulo: 'Digestivo y urinario',
    icono: 'restaurant-outline',
    afinidad: ['Endometriosis'],
    sintomas: [
      { id: 'hinchazon', nombre: 'Hinchazón abdominal' },
      { id: 'gases', nombre: 'Gases' },
      { id: 'nauseas', nombre: 'Náuseas' },
      { id: 'vomitos', nombre: 'Vómitos' },
      { id: 'estrenimiento', nombre: 'Estreñimiento' },
      { id: 'diarrea', nombre: 'Diarrea' },
      { id: 'reflujo', nombre: 'Acidez o reflujo' },
      { id: 'dolor-estomago', nombre: 'Dolor de estómago' },
      { id: 'saciedad-rapida', nombre: 'Me lleno muy rápido' },
      { id: 'cambios-apetito', nombre: 'Cambios de apetito' },
      { id: 'malestar-comer', nombre: 'Malestar después de comer' },
      { id: 'ganas-orinar', nombre: 'Ganas frecuentes de orinar' },
      { id: 'urgencia-urinaria', nombre: 'Urgencia urinaria' },
      { id: 'vejiga-irritada', nombre: 'Vejiga irritada o ardor' },
    ],
  },
  {
    id: 'energia',
    titulo: 'Energía y sueño',
    icono: 'moon-outline',
    sintomas: [
      { id: 'fatiga', nombre: 'Fatiga' },
      { id: 'cansancio-extremo', nombre: 'Cansancio extremo' },
      { id: 'niebla-mental', nombre: 'Niebla mental' },
      { id: 'insomnio', nombre: 'Insomnio' },
      { id: 'despertares', nombre: 'Despertares nocturnos' },
      { id: 'sueno-poco-reparador', nombre: 'Sueño poco reparador' },
      { id: 'somnolencia', nombre: 'Somnolencia durante el día' },
      { id: 'bajon-tarde', nombre: 'Bajón de energía en la tarde' },
    ],
  },
  {
    id: 'animo',
    titulo: 'Ánimo y mente',
    icono: 'happy-outline',
    sintomas: [
      { id: 'ansiedad', nombre: 'Ansiedad' },
      { id: 'irritabilidad', nombre: 'Irritabilidad' },
      { id: 'tristeza', nombre: 'Tristeza' },
      { id: 'cambios-animo', nombre: 'Cambios de ánimo' },
      { id: 'estres', nombre: 'Estrés' },
      { id: 'agobio', nombre: 'Sensación de agobio' },
      { id: 'dificultad-concentrarme', nombre: 'Dificultad para concentrarme' },
      { id: 'desmotivacion', nombre: 'Desmotivación' },
      { id: 'ganas-llorar', nombre: 'Ganas de llorar' },
    ],
  },
  {
    id: 'piel',
    titulo: 'Piel y cabello',
    icono: 'sparkles-outline',
    afinidad: ['SOMP'],
    sintomas: [
      { id: 'acne', nombre: 'Acné' },
      { id: 'piel-grasa', nombre: 'Piel grasa' },
      { id: 'piel-seca', nombre: 'Piel seca' },
      { id: 'vello', nombre: 'Vello facial o corporal' },
      { id: 'caida-pelo', nombre: 'Caída de cabello' },
      { id: 'pelo-delgado', nombre: 'Cabello más delgado' },
      { id: 'manchas-oscuras', nombre: 'Manchas oscuras en la piel' },
      { id: 'bultitos-piel', nombre: 'Pequeños bultitos de piel' },
    ],
  },
  {
    id: 'metabolismo',
    titulo: 'Metabolismo y peso',
    icono: 'nutrition-outline',
    afinidad: ['SOMP'],
    sintomas: [
      { id: 'antojos-dulce', nombre: 'Antojos de dulce' },
      { id: 'hambre-excesiva', nombre: 'Hambre excesiva' },
      { id: 'aumento-peso', nombre: 'Aumento de peso' },
      { id: 'dificultad-bajar-peso', nombre: 'Dificultad para bajar de peso' },
      { id: 'grasa-abdominal', nombre: 'Grasa abdominal' },
      { id: 'bajon-tras-comer', nombre: 'Bajón de energía tras comer' },
      { id: 'sed-aumentada', nombre: 'Sed aumentada' },
      { id: 'temblor-hambre', nombre: 'Temblor o mareo si paso hambre' },
    ],
  },
  {
    id: 'cuerpo',
    titulo: 'Cabeza y cuerpo',
    icono: 'body-outline',
    sintomas: [
      { id: 'migrana', nombre: 'Migraña' },
      { id: 'dolor-cabeza', nombre: 'Dolor de cabeza' },
      { id: 'mareos', nombre: 'Mareos' },
      { id: 'sensibilidad-luz-ruido', nombre: 'Sensibilidad a la luz o al ruido' },
      { id: 'dolor-muscular', nombre: 'Dolor muscular' },
      { id: 'dolor-articular', nombre: 'Dolor en las articulaciones' },
      { id: 'retencion-liquidos', nombre: 'Retención de líquidos' },
      { id: 'calores-sudor', nombre: 'Calores o sudoración nocturna' },
      { id: 'palpitaciones', nombre: 'Palpitaciones' },
    ],
  },
  {
    id: 'intima',
    titulo: 'Salud íntima',
    icono: 'heart-outline',
    sintomas: [
      { id: 'dolor-relaciones', nombre: 'Dolor en las relaciones sexuales' },
      { id: 'sangrado-relaciones', nombre: 'Sangrado después de relaciones' },
      { id: 'libido-baja', nombre: 'Libido baja' },
      { id: 'sequedad', nombre: 'Sequedad vaginal' },
      { id: 'flujo-alterado', nombre: 'Cambios en el flujo vaginal' },
      { id: 'picazon-irritacion', nombre: 'Picazón o irritación' },
    ],
  },
];

// Lista plana (para buscar) y tabla id → nombre (para mostrar lo elegido)
export const TODOS_LOS_SINTOMAS: Sintoma[] = CATEGORIAS.flatMap((c) => c.sintomas);

export const NOMBRE_SINTOMA: Record<string, string> = Object.fromEntries(
  TODOS_LOS_SINTOMAS.map((s) => [s.id, s.nombre])
);