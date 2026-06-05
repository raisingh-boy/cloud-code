import { SomaticNode, SomaticLink, AudioItem, AgendaQuestion, ActivityNotification } from '../types';

export const INITIAL_NODES: SomaticNode[] = [
  // --- ATLAS: BODY/SOMATICS ---
  {
    id: 'soma-hanna',
    nameRu: 'Соматика (Томас Ханна)',
    nameEn: 'Somatics (Thomas Hanna)',
    domain: 'body',
    world: 'atlas',
    status: 'atlas',
    resonances: 340,
    authorRu: 'Томас Ханна',
    authorEn: 'Thomas Hanna',
    epochRu: '1970-е',
    epochEn: '1970s',
    descriptionRu: 'Направление работы с телом, сфокусированное на внутреннем ощущении движения («соме»), в отличие от взгляда со стороны на тело как на объект. Ханна ввёл понятие сенсомоторной амнезии — потери способности контролировать мышцы из-за стресса и травм.',
    descriptionEn: 'The field of mind-body integration focusing on the first-person experience of the body ("soma") as opposed to looking at it from the third-person as an object. Hanna introduced "sensory-motor amnesia" — the habituated state of muscle tension caused by stress or trauma.',
    stories: [
      {
        id: 'story-hanna-1',
        author: 'SomaticPhilosopher',
        textRu: 'Томас Ханна и Грегори Бейтсон никогда не цитировали друг друга напрямую. Но оба в 1960-х годах пришли к одной фундаментальной мысли: граница тела человека — это граница его восприятия.',
        textEn: 'Thomas Hanna and Gregory Bateson never cited each other directly. However, both concluded in the 1960s that the physical boundary of the body is inherently the boundary of our sensory perception.',
        rating: 45
      }
    ]
  },
  {
    id: 'kinesthesia',
    nameRu: 'Кинестезия',
    nameEn: 'Kinesthesia',
    domain: 'body',
    world: 'atlas',
    status: 'atlas',
    resonances: 210,
    authorRu: 'Аристотель / Ч. Шеррингтон',
    authorEn: 'Aristotle / C. Sherrington',
    epochRu: '1906',
    epochEn: '1906',
    descriptionRu: 'Ощущение положения, усилия и движения частей тела относительно друг друга. Это «шестое чувство», позволяющее нам совершать точные грациозные движения с закрытыми глазами и уступать внешней силе.',
    descriptionEn: 'The awareness of the position, effort, and movement of body parts relative to each other. It is our "sixth sense" that allows us to perform precise, graceful actions with closed eyes and yield to external forces.',
    stories: []
  },
  {
    id: 'proprioception',
    nameRu: 'Проприоцепция',
    nameEn: 'Proprioception',
    domain: 'body',
    world: 'atlas',
    status: 'atlas',
    resonances: 285,
    authorRu: 'Чарльз Шеррингтон',
    authorEn: 'Charles Sherrington',
    epochRu: '1906',
    epochEn: '1906',
    descriptionRu: 'Сигнализация от рецепторов сухожилий, мышц и суставных капсул в нервную систему. Физиологический фундамент любой соматической интеграции и телесной автономии.',
    descriptionEn: 'The nervous system feedback from receptors in muscles, tendons, and joint capsules. It is the physiological foundation of any somatic integration and body autonomy.',
    stories: []
  },
  {
    id: 'body-memory',
    nameRu: 'Телесная память',
    nameEn: 'Body Memory',
    domain: 'body',
    world: 'atlas',
    status: 'atlas',
    resonances: 195,
    authorRu: 'Эдвард Кейси',
    authorEn: 'Edward Casey',
    epochRu: '1980-е',
    epochEn: '1980s',
    descriptionRu: 'Феномен хранения эмоционального опыта, паттернов реакций и травм в мышечно-фасциальной структуре. Тело помнит то, что разум предпочёл вытеснить или изолировать.',
    descriptionEn: 'The phenomenon of psychological and physical experiences, traumas, and movement habits storing themselves in the fascial and muscular structures of the body. The body remembers what the intellect prefers to suppress.',
    stories: []
  },

  // --- ATLAS: PHILOSOPHY/MIND ---
  {
    id: 'pattern-bateson',
    nameRu: 'Паттерн (Грегори Бейтсон)',
    nameEn: 'Pattern (Gregory Bateson)',
    domain: 'philosophy',
    world: 'atlas',
    status: 'atlas',
    resonances: 390,
    authorRu: 'Грегори Бейтсон',
    authorEn: 'Gregory Bateson',
    epochRu: '1972',
    epochEn: '1972',
    descriptionRu: '«Паттерн — это то, что связывает». Бейтсон рассматривал разум не внутри головы, а как экологическую систему связей и отношений между существами, средой и обратной связью.',
    descriptionEn: '"The pattern is the thing that connects." Bateson argued that mind is not contained inside the skull, but is an ecological system of connections and flows between beings, constraints, and environments.',
    stories: [
      {
        id: 'story-bateson-1',
        author: 'AestheticMinds',
        textRu: 'Бейтсон любил задавать вопрос своим студентам: «Каков паттерн, объединяющий краба с орхидеей, а орхидею с примулой, а примулу со мной?» Он искал эстетическое единство мира там, где обычные люди видят лишь разные био-виды.',
        textEn: 'Bateson famously asked: "What is the pattern which connects the crab to the orchid and the orchid to the primrose and all four of them to me?" He sought the aesthetic unity of the world where others saw only disjoint categories.',
        rating: 52
      }
    ]
  },
  {
    id: 'phenomenology-body',
    nameRu: 'Феноменология тела',
    nameEn: 'Phenomenology of the Body',
    domain: 'philosophy',
    world: 'atlas',
    status: 'atlas',
    resonances: 310,
    authorRu: 'Морис Мерло-Понти',
    authorEn: 'Maurice Merlo-Ponty',
    epochRu: '1945',
    epochEn: '1945',
    descriptionRu: 'Философская концепция, согласно которой наше тело — не объект в пространстве, а сама призма, через которую мы вообще способны воспринимать и понимать этот мир (взаимоотношение "Le Corps propre").',
    descriptionEn: "Philosophical concept stating that the body is not just an object in space, but the very lens through which we interact, experience, and inhabit reality ('Le Corps propre').",
    stories: [
      {
        id: 'story-merlo-1',
        author: 'PhenomenonGuy',
        textRu: 'Моше Фельденкрайз разрабатывал свои практические упражнения параллельно с философскими эссе Мерло-Понти в 1940-х годах. Удивительно, но они так и не встретились при жизни, хотя говорили об абсолютно одинаковом ощущении тела в мире.',
        textEn: 'Moshe Feldenkrais formulated functional movement lessons in parallel with Merlo-Ponty writing text on perception in the 1940s. Astonishingly, they never met, yet they spoke computed equivalents of embodiment.',
        rating: 38
      }
    ]
  },
  {
    id: 'enactivism',
    nameRu: 'Энактивизм',
    nameEn: 'Enactivism',
    domain: 'philosophy',
    world: 'atlas',
    status: 'atlas',
    resonances: 245,
    authorRu: 'Франсиско Варела',
    authorEn: 'Francisco Varela',
    epochRu: '1991',
    epochEn: '1991',
    descriptionRu: 'Теория познания, в которой сознание порождается в процессе непрерывного моторного и сенсорного взаимодействия системы со своей средой. Познание — это действие, а не пассивное отражение.',
    descriptionEn: 'The cognitive science theory asserting that cognition is not a representation of a pre-given world, but an active bringing-forth of a world through structural coupling and actions.',
    stories: []
  },

  // --- ATLAS: MOVEMENT/PRACTICE ---
  {
    id: 'contact-improvisation',
    nameRu: 'Контактная импровизация',
    nameEn: 'Contact Improvisation',
    domain: 'movement',
    world: 'atlas',
    status: 'atlas',
    resonances: 320,
    authorRu: 'Стив Пэкстон',
    authorEn: 'Steve Paxton',
    epochRu: '1972',
    epochEn: '1972',
    descriptionRu: 'Танцевальная форма, основанная на поиске путей движения вокруг общего центра масс двух людей. Внимание направлено на непрерывное деление веса, скольжение, перекаты и контактную точку в пространстве.',
    descriptionEn: 'A dance form focused on finding paths of cooperative movement around a moving center of gravity of two practitioners. It emphasizes sharing weight, rolling points of contact, and physical listening.',
    stories: []
  },
  {
    id: 'floorwork',
    nameRu: 'Флорворк',
    nameEn: 'Floorwork',
    domain: 'movement',
    world: 'atlas',
    status: 'atlas',
    resonances: 180,
    authorRu: 'Современный танец',
    authorEn: 'Modern Dance',
    epochRu: 'XX век',
    epochEn: '20th Century',
    descriptionRu: 'Техника движения на полу, находящаяся на стыке танца, акробатики и соматики. Основана на эффективном распределении веса и использовании силы земного притяжения и инерции для плавных переходов.',
    descriptionEn: 'Movement techniques using the floor, blurring the lines between dance, acrobatics, and somatics. It emphasizes distributing weight and using gravity and momentum over muscular friction.',
    stories: []
  },
  {
    id: 'yield-somatic',
    nameRu: 'Yield (Уступание опоре)',
    nameEn: 'Yield (yielding)',
    domain: 'movement',
    world: 'atlas',
    status: 'atlas',
    resonances: 230,
    authorRu: 'Бонни Бейнбридж Коэн',
    authorEn: 'Bonnie Bainbridge Cohen',
    epochRu: '1980-е',
    epochEn: '1980s',
    descriptionRu: 'Базовое соматическое действие: уступание веса опорной поверхности. Это не пассивное обмякание (collapse) и не преодоление (push), а активное доверие весу и принятие поддержки почвы.',
    descriptionEn: 'A fundamental somatic developmental movement: giving weight to a supportive structure. It is neither passive collapsing nor muscular pushing, but active relationship with support and gravity.',
    stories: []
  },

  // --- ATLAS: SCIENCE/PHYSICS ---
  {
    id: 'center-of-mass',
    nameRu: 'Центр масс',
    nameEn: 'Center of Mass',
    domain: 'science',
    world: 'atlas',
    status: 'atlas',
    resonances: 260,
    authorRu: 'И. Ньютон / Архимед',
    authorEn: 'I. Newton / Archimedes',
    epochRu: 'Античность',
    epochEn: 'Antiquity',
    descriptionRu: 'Уникальная геометрическая точка системы, движение которой характеризует перемещение всей этой системы как целого. В танце и боевых искусствах — ключевой регулятор равновесия и вращений.',
    descriptionEn: 'The unique geometric point of a system where its total distributed mass is balanced. In dance and martial arts, it is the master dial of equilibrium, rotation, and falling vectors.',
    stories: []
  },
  {
    id: 'resonance-physics',
    nameRu: 'Резонанс',
    nameEn: 'Resonance',
    domain: 'science',
    world: 'atlas',
    status: 'atlas',
    resonances: 295,
    authorRu: 'Г. Галилей',
    authorEn: 'G. Galilei',
    epochRu: '1602',
    epochEn: '1602',
    descriptionRu: 'Явление резкого возрастания амплитуды колебаний системы при совпадении внешней частоты с внутренней гармоникой. В Seamless Universe это метафора глубокого созвучия идей.',
    descriptionEn: 'The physical state where a system vibrates with maximum amplitude at specific natural frequencies. Used metaphorically to represent the immediate intellectual/intuitive connection between ideas.',
    stories: []
  },

  // --- ATLAS: LANGUAGE/COGNITION ---
  {
    id: 'embodied-metaphor',
    nameRu: 'Телесная метафора',
    nameEn: 'Embodied Metaphor',
    domain: 'cognition',
    world: 'atlas',
    status: 'atlas',
    resonances: 275,
    authorRu: 'Джордж Лакофф',
    authorEn: 'George Lakoff',
    epochRu: '1980',
    epochEn: '1980',
    descriptionRu: 'Теория, доказывающая, что абстрактные языковые концепты строятся на базе нашей физической соматики. Например, «тёплое отношение» (соматика тепла) или «высокий статус» (опора по вертикали).',
    descriptionEn: 'Cognitive linguistic theory revealing that conceptual metaphors are built directly on our physical somatic experiences (e.g., "warm relationship" based on bodily warmth, "climbing high" based on somatic verticality).',
    stories: []
  },

  // --- FIELD (ПОЛЕ) NODES: LIVE EVOLVING ONES ---
  {
    id: 'field-gaze',
    nameRu: 'Периферийное внимание взгляда',
    nameEn: 'Peripheral Gaze / Attention',
    domain: 'philosophy',
    world: 'field',
    status: 'rooted', // 100+ resonances
    resonances: 112,
    addedBy: 'ElenaD',
    descriptionRu: 'Состояние распределённого зрительного внимания, когда мы воспринимаем не отдельные сфокусированные детали, а контекст и паттерн движения среды. Снижает уровень кортизола и расширяет осознание.',
    descriptionEn: 'The state of distributed visual attention focus where we track environmental movement and global rhythm instead of high-detail items. Lower stress triggers and opens somatic spaciousness.',
    stories: []
  },
  {
    id: 'field-support',
    nameRu: 'Поддержка как диалог',
    nameEn: 'Support as Dialogue',
    domain: 'movement',
    world: 'field',
    status: 'alive', // 50-99 resonances
    resonances: 78,
    addedBy: 'DancerA',
    descriptionRu: 'Поддержка — это не просто выдерживание веса другого, а постоянная уступчивость, калибровка жесткости мышц и тонуса. Двусторонний канал передачи соматической информации.',
    descriptionEn: 'Physical support in duets is not dead stiffness or raw carrying, but active compliance, continuous tension tuning, and feedback looping. A reciprocal somatic transmission channel.',
    stories: []
  },
  {
    id: 'field-somatic-city',
    nameRu: 'Соматический урбанизм',
    nameEn: 'Somatic Urbanism',
    domain: 'philosophy',
    world: 'field',
    status: 'sprout', // 10-49 resonances
    resonances: 34,
    addedBy: 'Sasha_K',
    descriptionRu: 'Изучение города не по картам дорог, а по мышечному напряжению жителей. То, как архитектура заставляет нас сжиматься на тротуаре или расправлять плечи перед простором.',
    descriptionEn: 'The study of cities through metropolitan muscular tension rather than asphalt roadmaps. Exploring how hard spatial geometry commands our bodies to contract or widen.',
    stories: []
  },
  {
    id: 'field-gravity-trust',
    nameRu: 'Доверие гравитации',
    nameEn: 'Gravity Trust Loop',
    domain: 'body',
    world: 'field',
    status: 'seed', // 1-9 resonances
    resonances: 6,
    addedBy: 'PavelMove',
    descriptionRu: 'Психологическое отпускание контроля в движении через осознавание того, что гравитация — это единственная постоянная сила, которая никогда тебя не покинет и никуда не исчезнет.',
    descriptionEn: 'The psychological relief of muscular resistance by realizing gravity is the single permanent force that is absolutely continuous, reliable, and unconditional.',
    stories: []
  },
  {
    id: 'field-empty-center',
    nameRu: 'Пустота в центре масс',
    nameEn: 'Void in the Center of Mass',
    domain: 'science',
    world: 'field',
    status: 'alive',
    resonances: 58,
    addedBy: 'ZenMechanics',
    descriptionRu: 'Перемещение центра равновесия за пределы очертания физического тела во время изгибов спины или прыжков. Область, где физическая устойчивость вращается вокруг пустого воздуха.',
    descriptionEn: 'Moving the center of gravity far outside the solid physical bones during arching backs or dynamic slides. The zone where system balance pivots around open air.',
    stories: []
  },
  {
    id: 'field-rhythm-bio',
    nameRu: 'Биолюминесцентный биоритм',
    nameEn: 'Bioluminescent Biorhythm',
    domain: 'science',
    world: 'field',
    status: 'seed',
    resonances: 8,
    addedBy: 'CoralWatcher',
    descriptionRu: 'Исследование ритма синхронного мерцания организмов как соматического проявления коллективного бессознательного ощущения времени.',
    descriptionEn: 'Exploration of synchronous biological flashing in aquatic nodes as a manifestation of collective subconscious somatic perception of temporal flows.',
    stories: []
  },
  {
    id: 'field-breath-space',
    nameRu: 'Многомерное дыхание легких',
    nameEn: 'Multidimensional Breath Space',
    domain: 'body',
    world: 'field',
    status: 'sprout',
    resonances: 42,
    addedBy: 'PranaFlow',
    descriptionRu: 'Направление дыхания не только в живот, а в 3D объем спины, лопаток и тазового дна. Создаёт новые динамические рычаги внутри костей.',
    descriptionEn: 'Directing the respiratory waves not only to the belly, but into the deep 3D volume of the back, ribs, and pelvic floor. Creating support levers inside the skeleton.',
    stories: []
  }
];

export const INITIAL_LINKS: SomaticLink[] = [
  // Atlas connections
  { id: 'lnk1', source: 'soma-hanna', target: 'kinesthesia', resonanceWeight: 4, activity: 5 },
  { id: 'lnk2', source: 'kinesthesia', target: 'proprioception', resonanceWeight: 5, activity: 8 },
  { id: 'lnk3', source: 'soma-hanna', target: 'body-memory', resonanceWeight: 3, activity: 4 },
  { id: 'lnk4', source: 'phenomenology-body', target: 'soma-hanna', resonanceWeight: 5, activity: 6 },
  { id: 'lnk5', source: 'pattern-bateson', target: 'phenomenology-body', resonanceWeight: 4, activity: 7 },
  { id: 'lnk6', source: 'enactivism', target: 'pattern-bateson', resonanceWeight: 3, activity: 3 },
  { id: 'lnk7', source: 'enactivism', target: 'phenomenology-body', resonanceWeight: 5, activity: 5 },
  { id: 'lnk8', source: 'contact-improvisation', target: 'center-of-mass', resonanceWeight: 5, activity: 9 },
  { id: 'lnk9', source: 'contact-improvisation', target: 'yield-somatic', resonanceWeight: 4, activity: 4 },
  { id: 'lnk10', source: 'proprioception', target: 'yield-somatic', resonanceWeight: 3, activity: 2 },
  { id: 'lnk11', source: 'contact-improvisation', target: 'floorwork', resonanceWeight: 4, activity: 6 },
  { id: 'lnk12', source: 'floorwork', target: 'center-of-mass', resonanceWeight: 3, activity: 4 },
  { id: 'lnk13', source: 'embodied-metaphor', target: 'phenomenology-body', resonanceWeight: 4, activity: 3 },
  { id: 'lnk14', source: 'embodied-metaphor', target: 'body-memory', resonanceWeight: 3, activity: 2 },

  // Field connections linking field to atlas
  { id: 'lnk15', source: 'field-gaze', target: 'pattern-bateson', resonanceWeight: 4, activity: 7 },
  { id: 'lnk16', source: 'field-support', target: 'contact-improvisation', resonanceWeight: 5, activity: 8 },
  { id: 'lnk17', source: 'field-support', target: 'yield-somatic', resonanceWeight: 3, activity: 3 },
  { id: 'lnk18', source: 'field-somatic-city', target: 'embodied-metaphor', resonanceWeight: 4, activity: 5 },
  { id: 'lnk19', source: 'field-somatic-city', target: 'body-memory', resonanceWeight: 3, activity: 2 },
  { id: 'lnk20', source: 'field-gravity-trust', target: 'yield-somatic', resonanceWeight: 5, activity: 4 },
  { id: 'lnk21', source: 'field-empty-center', target: 'center-of-mass', resonanceWeight: 4, activity: 6 },
  { id: 'lnk22', source: 'field-empty-center', target: 'floorwork', resonanceWeight: 3, activity: 3 },
  { id: 'lnk23', source: 'field-breath-space', target: 'proprioception', resonanceWeight: 4, activity: 5 }
];

export const SAMPLE_AUDIO: AudioItem[] = [
  {
    id: 'aud1',
    titleRu: 'Телесный Паттерн и Экология Разума',
    titleEn: 'Somatic Pattern and the Ecology of Mind',
    authorRu: 'Лекция: Профессор Михаил Левин',
    authorEn: 'Lecture: Prof. Michael Levin',
    sourceRu: 'Святошинские чтения',
    sourceEn: 'Svyatoshyn Readings',
    year: 2025,
    duration: 180, // 3 mins for demo
    domain: 'philosophy',
    timelineNodes: [
      { timeMs: 5000, nodeId: 'pattern-bateson', captionRu: 'Грегори Бейтсон и его формулировка связывающего паттерна.', captionEn: 'Gregory Bateson and his theory of the pattern that connects.' },
      { timeMs: 25000, nodeId: 'soma-hanna', captionRu: 'Интеграция концептов сомы и экологии разума.', captionEn: 'Integration of Soma and the Ecology of Mind views.' },
      { timeMs: 60000, nodeId: 'phenomenology-body', captionRu: 'Касание Мерло-Понти: Тело встречает окружающую геометрию.', captionEn: 'Merlo-Ponty contact: Body meets surrounding geometry.' },
      { timeMs: 110000, nodeId: 'kinesthesia', captionRu: 'Кинестезия как непрерывная перцептивная экология обратной связи.', captionEn: 'Kinesthesia as sensory eco-feedback loop.' }
    ]
  },
  {
    id: 'aud2',
    titleRu: 'Стив Пэкстон: Физика Падения и Радость Опоры',
    titleEn: 'Steve Paxton: Physics of Falling and the Joy of Support',
    authorRu: 'Юрий Кузнецов',
    authorEn: 'Yuri Kuznetsov',
    sourceRu: 'Диалоги о Движении',
    sourceEn: 'Dialogues on Movement',
    year: 2024,
    duration: 240,
    domain: 'movement',
    timelineNodes: [
      { timeMs: 10000, nodeId: 'contact-improvisation', captionRu: 'Запуск CI в колледже Оберлин в 1972 году.', captionEn: 'Launching CI at Oberlin College in 1972.' },
      { timeMs: 45000, nodeId: 'center-of-mass', captionRu: 'Физика баллистического качения вокруг общего центра тяжести двух тел.', captionEn: 'Sensing fluid motion around dual shifting center of mass.' },
      { timeMs: 90000, nodeId: 'yield-somatic', captionRu: 'Сдача веса опоре и уступание как форма гравитационного мышления.', captionEn: 'Giving weight to supportive floor as gravitational thinking.' },
      { timeMs: 160000, nodeId: 'field-support', captionRu: 'Диалогический обмен тонусом и передача веса в паре.', captionEn: 'Dialogic support and muscle tone exchange in partners.' }
    ]
  },
  {
    id: 'aud3',
    titleRu: 'Воплощенное познание вне черепного коробка',
    titleEn: 'Embodied Cognition Outside the Skull',
    authorRu: 'Анна Маслова',
    authorEn: 'Anna Maslova',
    sourceRu: 'Когнитивные Встречи',
    sourceEn: 'Cognitive Encounters',
    year: 2026,
    duration: 155,
    domain: 'cognition',
    timelineNodes: [
      { timeMs: 10000, nodeId: 'embodied-metaphor', captionRu: 'Джордж Лакофф и глубинная телесная природа метафор.', captionEn: 'George Lakoff and the deep somatic origins of metaphor.' },
      { timeMs: 50000, nodeId: 'enactivism', captionRu: 'Энактивизм Франсиско Варелы: познание рождается из моторных петель.', captionEn: 'Enactivism by Varela: mind bringing forth the world.' },
      { timeMs: 110000, nodeId: 'field-gaze', captionRu: 'Периферийное зрительное сканирование как медиум энактивации.', captionEn: 'Peripheral gaze scanning as a medium for worldly enaction.' }
    ]
  }
];

export const SAMPLE_AGENDA: AgendaQuestion[] = [
  {
    id: 'q1',
    questionRu: 'Где в движении живёт политическое?',
    questionEn: 'Where in movement does the political live?',
    domains: ['movement', 'philosophy', 'body'],
    contributorsCount: 8,
    contributors: [
      { name: 'Maya', avatar: 'M' },
      { name: 'Arjun', avatar: 'A' },
      { name: 'Sasha', avatar: 'S' },
      { name: 'Elena', avatar: 'E' }
    ],
    answers: [
      {
        id: 'ans1',
        author: 'Maya',
        textRu: 'Я вижу это через [Точку опоры] — любой контроль и иерархия всегда про узурпацию права на опору и наклон веса.',
        textEn: 'I see this through the [Fulcrum] — any hierarchy is about controlling access to support and deciding weight vectors.',
        linkedNodeId: 'proprioception',
        linkedNodeNameRu: 'Проприоцепция / Точка опоры',
        linkedNodeNameEn: 'Proprioception / Fulcrum'
      },
      {
        id: 'ans2',
        author: 'Arjun',
        textRu: 'Через [Периферийное внимание] — политика контроля сужает зрачок до одной цели, а политическое сопротивление освобождает взгляд в периферию.',
        textEn: 'Through [Peripheral Gaze] — authoritarian architectures narrow our focus to a single coordinate, whereas somatic resistance widens to the periphery.',
        linkedNodeId: 'field-gaze',
        linkedNodeNameRu: 'Периферийное внимание взгляда',
        linkedNodeNameEn: 'Peripheral Gaze / Attention'
      }
    ]
  },
  {
    id: 'q2',
    questionRu: 'Может ли виртуальная реальность передать proprioception?',
    questionEn: 'Can virtual reality convey biological proprioception?',
    domains: ['science', 'cognition', 'body'],
    contributorsCount: 6,
    contributors: [
      { name: 'DevG', avatar: 'D' },
      { name: 'NeuroS', avatar: 'N' },
      { name: 'SomaticsCat', avatar: 'C' }
    ],
    answers: [
      {
        id: 'ans3',
        author: 'NeuroS',
        textRu: 'Пока в VR нет силовой обратной связи на фасциальный тонус, proprioception подменяется визуальной обратной связью (энактивизм). Но мозг умеет достраивать нехватку чувств.',
        textEn: 'Until VR exerts tactile forces on fascia tensility, proprioception is partially faked with visual optical flows. But the enactive mind easily fills in the blanks.'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: ActivityNotification[] = [
  {
    id: 'not1',
    timestamp: '10:12:45',
    textRu: 'Maya добавила новое клиническое наблюдение к [Периферийное внимание взгляда]',
    textEn: 'Maya added a new clinical observation to [Peripheral Gaze / Attention]'
  },
  {
    id: 'not2',
    timestamp: '09:41:20',
    textRu: 'Нода [Поддержка как диалог] достигла порога 75 резонансов и активировала золотое свечение',
    textEn: 'Node [Support as Dialogue] reached 75 resonances, triggering golden biocell glow'
  },
  {
    id: 'not3',
    timestamp: '08:05:12',
    textRu: 'Интегрировано новое пересечение в систему: [Центр масс] ↔ [Телесная память] от DancerX',
    textEn: 'Somatic link registered: [Center of Mass] ↔ [Body Memory] established by DancerX'
  },
  {
    id: 'not4',
    timestamp: 'Вчера',
    textRu: 'Нода [Доверие гравитации] плавно развернулась как семя в Поле смыслов',
    textEn: 'Node [Gravity Trust Loop] unfurled from seed state in the Field of Meaning'
  }
];
