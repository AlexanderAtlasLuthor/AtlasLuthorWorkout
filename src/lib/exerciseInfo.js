// Static form cues for common exercises. Text-only so it works fully offline.
// Keyed by a normalized exercise name; getExerciseInfo also does a loose
// contains-match so routine variations still resolve to useful cues.

const INFO = {
  "bench press": {
    en: ["Plant feet, squeeze shoulder blades down and back.", "Lower the bar to mid-chest with control.", "Drive up without flaring elbows past 75°.", "Keep wrists stacked over elbows."],
    es: ["Planta los pies y junta los omóplatos abajo y atrás.", "Baja la barra al centro del pecho con control.", "Empuja sin abrir los codos más de 75°.", "Mantén las muñecas alineadas sobre los codos."],
  },
  "incline bench press": {
    en: ["Set the bench around 30°, no steeper.", "Lower to the upper chest, just below the collarbone.", "Keep the bar path slightly back toward the eyes.", "Drive elbows in, not flared."],
    es: ["Coloca el banco a unos 30°, no más.", "Baja al pecho alto, bajo la clavícula.", "Lleva la barra ligeramente atrás hacia los ojos.", "Mantén los codos recogidos, no abiertos."],
  },
  "shoulder press": {
    en: ["Brace your core, ribs down.", "Press straight overhead, finishing biceps near ears.", "Don't lean back excessively.", "Lower under control to chin height."],
    es: ["Activa el core, costillas hacia abajo.", "Empuja recto arriba, bíceps cerca de las orejas.", "No te inclines demasiado atrás.", "Baja con control hasta la barbilla."],
  },
  "lateral raise": {
    en: ["Lead with the elbows, not the hands.", "Raise to shoulder height, no higher.", "Keep a slight bend in the elbows.", "Lower slowly — resist the weight down."],
    es: ["Guía con los codos, no con las manos.", "Sube hasta la altura del hombro, no más.", "Mantén un ligero doblez en los codos.", "Baja lento — resiste el peso."],
  },
  "front raise": {
    en: ["Raise to eye level with control.", "Keep the torso still — no swinging.", "Slight elbow bend throughout.", "Lower for a 2-count."],
    es: ["Sube hasta la altura de los ojos con control.", "Mantén el torso firme — sin balanceo.", "Ligero doblez de codo todo el tiempo.", "Baja en 2 tiempos."],
  },
  "upright row": {
    en: ["Pull the bar up the body, leading with elbows.", "Stop at chest height to protect the shoulders.", "Use a grip slightly wider than shoulders.", "Lower with control."],
    es: ["Jala la barra pegada al cuerpo, guía con los codos.", "Detente a la altura del pecho para cuidar el hombro.", "Agarre un poco más ancho que los hombros.", "Baja con control."],
  },
  "deadlift": {
    en: ["Bar over mid-foot, shins close.", "Brace hard, flatten the back before the pull.", "Push the floor away, hips and chest rise together.", "Lock out by squeezing glutes — don't lean back."],
    es: ["Barra sobre el medio del pie, espinillas cerca.", "Aprieta el core y aplana la espalda antes de jalar.", "Empuja el piso, cadera y pecho suben juntos.", "Bloquea apretando glúteos — no te inclines atrás."],
  },
  "barbell squat": {
    en: ["Bar on upper traps, brace your core.", "Break at hips and knees together.", "Descend until thighs are at least parallel.", "Drive through mid-foot, knees tracking over toes."],
    es: ["Barra sobre los trapecios, activa el core.", "Rompe cadera y rodillas a la vez.", "Baja hasta que los muslos estén al menos paralelos.", "Empuja con el medio del pie, rodillas sobre los dedos."],
  },
  "hack squat": {
    en: ["Back flat against the pad.", "Feet shoulder-width, mid-platform.", "Descend to parallel, control the negative.", "Don't let knees cave inward."],
    es: ["Espalda plana contra el respaldo.", "Pies al ancho de hombros, centro de la plataforma.", "Baja hasta paralelo, controla la negativa.", "No dejes que las rodillas se hundan hacia adentro."],
  },
  "leg press": {
    en: ["Feet shoulder-width on the platform.", "Lower until knees reach ~90°.", "Don't let the lower back round off the seat.", "Press without locking the knees hard."],
    es: ["Pies al ancho de hombros en la plataforma.", "Baja hasta que las rodillas lleguen a ~90°.", "No dejes que la zona lumbar se despegue del asiento.", "Empuja sin bloquear las rodillas con fuerza."],
  },
  "walking lunge": {
    en: ["Step out far enough for a vertical front shin.", "Drop the back knee toward the floor.", "Keep the torso tall.", "Push through the front heel to stand."],
    es: ["Da un paso largo para que la espinilla quede vertical.", "Baja la rodilla trasera hacia el piso.", "Mantén el torso erguido.", "Empuja con el talón delantero para subir."],
  },
  "lat pull down": {
    en: ["Grip slightly wider than shoulders.", "Pull the bar to the upper chest.", "Drive elbows down and back.", "Control the bar all the way up."],
    es: ["Agarre un poco más ancho que los hombros.", "Jala la barra hacia el pecho alto.", "Lleva los codos abajo y atrás.", "Controla la barra todo el camino arriba."],
  },
  "pull up": {
    en: ["Start from a full dead hang.", "Pull the chest toward the bar, not the chin.", "Drive elbows down and back.", "Lower under control — no kipping."],
    es: ["Empieza colgado por completo.", "Lleva el pecho hacia la barra, no la barbilla.", "Lleva los codos abajo y atrás.", "Baja con control — sin impulso."],
  },
  "seated cable row": {
    en: ["Sit tall, slight knee bend.", "Pull to the lower ribs, elbows close.", "Squeeze the shoulder blades together.", "Don't round the back on the return."],
    es: ["Siéntate erguido, ligera flexión de rodilla.", "Jala hacia las costillas bajas, codos cerca.", "Aprieta los omóplatos.", "No redondees la espalda al volver."],
  },
  "row barbell": {
    en: ["Hinge to ~45°, flat back, braced core.", "Pull the bar to the lower chest / upper abs.", "Lead with the elbows.", "Lower under control, keep the back angle."],
    es: ["Inclínate a ~45°, espalda plana, core activo.", "Jala la barra al pecho bajo / abdomen alto.", "Guía con los codos.", "Baja con control, mantén el ángulo."],
  },
  "dumbbell curls": {
    en: ["Keep elbows pinned at your sides.", "Curl without swinging the torso.", "Squeeze hard at the top.", "Lower for a 2-3 count."],
    es: ["Mantén los codos pegados a los costados.", "Curl sin balancear el torso.", "Aprieta fuerte arriba.", "Baja en 2-3 tiempos."],
  },
  "hammer curl": {
    en: ["Neutral grip, palms facing in.", "Elbows stay fixed at the sides.", "Curl with control, no momentum.", "Lower slowly to a full stretch."],
    es: ["Agarre neutro, palmas hacia adentro.", "Codos fijos a los costados.", "Curl con control, sin impulso.", "Baja lento hasta el estiramiento completo."],
  },
  "tricep pushdown": {
    en: ["Elbows tucked tight to the body.", "Extend fully, squeeze the triceps.", "Only the forearms move.", "Control the weight back up."],
    es: ["Codos pegados al cuerpo.", "Extiende por completo, aprieta el tríceps.", "Solo se mueven los antebrazos.", "Controla el peso al subir."],
  },
  "overhead db extension": {
    en: ["Keep elbows pointed up and close.", "Lower the weight behind the head.", "Extend without flaring the elbows.", "Control the stretch at the bottom."],
    es: ["Mantén los codos apuntando arriba y cerca.", "Baja el peso detrás de la cabeza.", "Extiende sin abrir los codos.", "Controla el estiramiento abajo."],
  },
  "push up": {
    en: ["Hands under shoulders, body in a straight line.", "Lower until the chest nearly touches.", "Keep elbows ~45° from the torso.", "Brace the core the whole set."],
    es: ["Manos bajo los hombros, cuerpo en línea recta.", "Baja hasta casi tocar con el pecho.", "Codos a ~45° del torso.", "Mantén el core activo toda la serie."],
  },
  "romanian deadlift": {
    en: ["Soft knees, push the hips back.", "Slide the bar down the thighs.", "Feel the hamstring stretch, flat back.", "Drive hips forward to stand tall."],
    es: ["Rodillas suaves, lleva la cadera atrás.", "Desliza la barra por los muslos.", "Siente el estiramiento del femoral, espalda plana.", "Empuja la cadera al frente para subir."],
  },
  "plank": {
    en: ["Forearms under shoulders.", "Body in one straight line, hips level.", "Squeeze glutes and brace the abs.", "Breathe steadily — don't sag."],
    es: ["Antebrazos bajo los hombros.", "Cuerpo en línea recta, cadera nivelada.", "Aprieta glúteos y abdomen.", "Respira de forma estable — no te hundas."],
  },
  "calf raise": {
    en: ["Rise onto the balls of the feet fully.", "Pause at the top.", "Lower for a deep stretch.", "Avoid bouncing the reps."],
    es: ["Sube por completo sobre la punta de los pies.", "Haz pausa arriba.", "Baja hasta un estiramiento profundo.", "Evita rebotar las repeticiones."],
  },
  "hip thrust": {
    en: ["Upper back on the bench, chin tucked.", "Drive through the heels.", "Lock out by squeezing the glutes.", "Don't hyperextend the lower back."],
    es: ["Espalda alta en el banco, barbilla recogida.", "Empuja con los talones.", "Bloquea apretando los glúteos.", "No hiperextiendas la zona lumbar."],
  },
  "olympic lift": {
    en: ["Start with the bar over mid-foot.", "Explode through the hips — full extension.", "Keep the bar close to the body.", "Receive in a stable, braced position."],
    es: ["Empieza con la barra sobre el medio del pie.", "Explota con la cadera — extensión completa.", "Mantén la barra cerca del cuerpo.", "Recibe en una posición estable y firme."],
  },
};

// Loose synonyms so routine names map onto a base entry.
const ALIASES = [
  ["db bench press", "bench press"],
  ["chest db press", "bench press"],
  ["supine press", "bench press"],
  ["chest machine", "bench press"],
  ["incline db press", "incline bench press"],
  ["incline press", "incline bench press"],
  ["chest db incline", "incline bench press"],
  ["db shoulder press", "shoulder press"],
  ["arnold press", "shoulder press"],
  ["machine shoulder press", "shoulder press"],
  ["cable lateral raise", "lateral raise"],
  ["rear delt", "lateral raise"],
  ["chin up", "pull up"],
  ["pull up biceps", "pull up"],
  ["row dumbbell", "row barbell"],
  ["t-bar row", "row barbell"],
  ["rack pull", "deadlift"],
  ["squats", "barbell squat"],
  ["squat", "barbell squat"],
  ["leg extension", "leg press"],
  ["reverse lunge", "walking lunge"],
  ["bulgarian split squat", "walking lunge"],
  ["barbell curls", "dumbbell curls"],
  ["preacher curl", "dumbbell curls"],
  ["cable curl", "dumbbell curls"],
  ["concentration curl", "dumbbell curls"],
  ["ez bar curl", "dumbbell curls"],
  ["one arm curl", "dumbbell curls"],
  ["cable rope triceps", "tricep pushdown"],
  ["triceps press", "tricep pushdown"],
  ["close grip bench", "tricep pushdown"],
  ["skull crusher", "overhead db extension"],
  ["barbell overhead triceps", "overhead db extension"],
  ["glute bridge", "hip thrust"],
  ["face pull", "seated cable row"],
  ["shrugs", "upright row"],
  ["power clean", "olympic lift"],
  ["hang clean", "olympic lift"],
  ["clean and jerk", "olympic lift"],
  ["snatch", "olympic lift"],
  ["push press", "shoulder press"],
];

export function getExerciseInfo(name) {
  if (!name) return null;
  const key = String(name).toLowerCase().trim();
  if (INFO[key]) return INFO[key];

  for (const baseKey of Object.keys(INFO)) {
    if (key.includes(baseKey)) return INFO[baseKey];
  }
  for (const [alias, baseKey] of ALIASES) {
    if (key.includes(alias)) return INFO[baseKey];
  }
  return null;
}

export function getExerciseCues(name, language) {
  const info = getExerciseInfo(name);
  if (!info) return [];
  return (language === "es" ? info.es : info.en) || [];
}
