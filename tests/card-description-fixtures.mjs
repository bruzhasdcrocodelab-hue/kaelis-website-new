export const victory = {
  en: {
    quickRead: "Victory, recognition, triumph; reversed — self-doubt, hollow win.",
    impact: "This project is likely to affect you by increasing confidence, visibility, and a sense of professional achievement if it is managed well.",
    recognition: "Recognition is possible through a clear concept and consistent delivery, but it should be treated as a later effect rather than the basis for the launch.",
    focus: "Keep the focus on repeatable operations and customer value so that recognition rests on a solid business foundation.",
  },
  uk: {
    quickRead: "Перемога, визнання, тріумф; перевернута — невпевненість, порожня перемога.",
    impact: "Цей проєкт може вплинути на вас, зміцнивши впевненість і відчуття професійного успіху.",
    recognition: "Визнання можливе завдяки чіткій концепції та послідовній роботі, але воно має бути наслідком, а не основою запуску.",
    focus: "Зосередьтеся на стабільних процесах і цінності для клієнта, щоб визнання спиралося на міцну основу.",
  },
  ru: {
    quickRead: "Победа, признание, триумф; перевёрнутая — неуверенность, пустая победа.",
    impact: "Этот проект может повлиять на вас, укрепив уверенность и ощущение профессионального успеха.",
    recognition: "Признание возможно благодаря ясной концепции и последовательной работе, но оно должно стать следствием, а не основой запуска.",
    focus: "Сосредоточьтесь на устойчивых процессах и ценности для клиента, чтобы признание опиралось на прочную основу.",
  },
};

export const balance = {
  quickRead: "Balance, moderation, alchemy; reversed — excess, imbalance.",
  impact: "The likely result is a measured, integrated development rather than a dramatic immediate breakthrough. A sustainable model comes from balancing quality with cost, ambition with capacity, and personal involvement with repeatable systems.",
  focus: "A phased launch, limited menu, or trial format fits this position better than overextending from day one.",
};

export const cardText = ({ quickRead, ...details }) => `${quickRead}\n\n${Object.values(details).join(" ")}`;
