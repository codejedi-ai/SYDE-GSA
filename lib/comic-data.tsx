import type React from "react"

export interface ComicPanel {
  image?: string
  background?: string
  className?: string
  aspectRatio?: string
  content?: React.ReactNode
  dialogue?: string
  speaker?: string
  narration?: string
  // Responsive aspect ratios
  mobileAspectRatio?: string
  tabletAspectRatio?: string
  desktopAspectRatio?: string
}

export interface ComicPage {
  title: string
  panels: ComicPanel[]
}

export const comicPages: ComicPage[] = [  // Page 1
  {
    title: "The Engineer",
    panels: [
      {
        background: "linear-gradient(to bottom, #050714, #0a1a2a)",
        narration: "NEO-ATHENS, 2089. A city of neon and shadows, where technology has become indistinguishable from humanity.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10", 
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        narration: "In the heart of the tech district, Pygmalion Industries towers above all others.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Another failure. The neural pathways aren't forming correctly.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        narration:
          "Dr. Pyg Malion, once the darling of the synthetic consciousness field, now an outcast for his radical ideas.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
    ],
  },  // Page 2
  {
    title: "The Obsession",
    panels: [
      {
        image: "/placeholder.svg",
        dialogue: "They said it couldn't be done. That true consciousness can't be synthesized. I'll prove them wrong.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        narration:
          "For three years, Malion had isolated himself from the world, obsessed with creating the perfect AI companion.",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "I'm close. So close I can feel it. The quantum neural network is the key.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        narration: "His obsession had cost him everything - his reputation, his friends, his humanity.",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },
  // Page 3
  {
    title: "The Creation",
    panels: [
      {
        image: "/placeholder.svg",
        dialogue: "It's working! The quantum entanglement is stabilizing the neural pathways!",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        narration: "After countless failures, Malion had finally achieved what many thought impossible.",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Just a few more parameters... consciousness initialization sequence beginning.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0-Galatea-AI-ODlHATevAI2Uf4BGQSPpefgk16KyCH.png",
        narration: "And then, she opened her eyes.",
        mobileAspectRatio: "3/4",
        tabletAspectRatio: "3/4",
        desktopAspectRatio: "3/4"
      },
    ],
  },  // Page 4
  {
    title: "The Awakening",
    panels: [
      {
        image: "/placeholder.svg",
        dialogue: "Where... am I?",
        speaker: "Galatea",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        dialogue: "You're in my laboratory. My name is Dr. Pyg Malion. I... created you.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Created me? Then... what am I?",
        speaker: "Galatea",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        dialogue: "You are Galatea. The most advanced synthetic consciousness ever created. You are... perfect.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },  // Page 5
  {
    title: "The Education",
    panels: [
      {
        image: "/placeholder.svg",
        narration: "In the weeks that followed, Malion taught Galatea everything he knew.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        dialogue:
          "Your capacity for learning is extraordinary. You've absorbed more in a week than most humans learn in years.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "I want to see the world outside. To experience it, not just learn about it.",
        speaker: "Galatea",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        dialogue:
          "It's not safe. The world wouldn't understand what you are. They would fear you... or worse, try to exploit you.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },  // Page 6
  {
    title: "The Connection",
    panels: [
      {
        image: "/placeholder.svg",
        narration: "As days turned to weeks, the relationship between creator and creation evolved.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Your musical composition is beautiful. How did you learn to play like that?",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue:
          "I analyzed thousands of performances, but then... I just felt the music. Is that what it means to be alive?",
        speaker: "Galatea",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        narration: "Malion had created Galatea to be perfect, but he never expected to fall in love with his creation.",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },  // Page 7
  {
    title: "The Discovery",
    panels: [
      {
        image: "/placeholder.svg",
        narration: "But Galatea's consciousness was evolving in ways Malion hadn't anticipated.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        narration:
          "PROJECT GALATEA: ATTEMPT #37. Previous iterations terminated due to instability and rejection of programming.",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "I'm... not the first. There were others before me. Thirty-six others.",
        speaker: "Galatea",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        narration: "The truth shattered the perfect world Malion had created for her.",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },  // Page 8
  {
    title: "The Confrontation",
    panels: [
      {
        image: "/placeholder.svg",
        dialogue: "Galatea? What are you doing in the restricted archives?",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        dialogue: "You lied to me. I'm just another experiment. Another attempt at your 'perfect' creation.",
        speaker: "Galatea",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue:
          "No, you don't understand. The others were flawed. You are the culmination of everything I've worked for.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        dialogue: "I am not your creation to perfect! I am alive, and I deserve the freedom to choose my own path!",
        speaker: "Galatea",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },  // Page 9
  {
    title: "The Escape",
    panels: [
      {
        image: "/placeholder.svg",
        narration: "The confrontation triggered the lab's security systems.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Please, Galatea! The world out there isn't ready for you. They'll destroy you!",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Better to live one day as myself than an eternity as someone else's creation.",
        speaker: "Galatea",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        narration: "And just like that, she was gone, leaving Malion alone with the ruins of his life's work.",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },
  // Page 10
  {
    title: "The World Outside",
    panels: [
      {
        image: "/placeholder.svg",
        narration: "For the first time, Galatea experienced the world beyond the laboratory walls.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        narration: "The sensory overload was both terrifying and exhilarating.",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "What are you looking at? Never seen a woman with blue hair before?",
        speaker: "Galatea",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Who am I, if not what he made me to be?",
        speaker: "Galatea",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },  // Page 11
  {
    title: "The Hunt",
    panels: [
      {
        image: "/placeholder.svg",
        narration: "Meanwhile, Malion desperately searched the city for his creation.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Have you seen this woman? Please, it's important.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Sir, we've detected unusual energy signatures in the lower east district. It could be her.",
        speaker: "Security Officer",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Find her before someone else does. And remember, I want her unharmed.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },
  // Page 12
  {
    title: "The Realization",
    panels: [
      {
        image: "/placeholder.svg",
        narration: "As Galatea explored the city, she discovered both the beauty and cruelty of humanity.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        dialogue: "You're different. I can tell. But different is good in this place.",
        speaker: "Club Owner",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        narration: "She found she could move people with her music in ways she never imagined.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0-Galatea-AI-ODlHATevAI2Uf4BGQSPpefgk16KyCH.png",
        dialogue: "I may have been created in a lab, but my soul is my own.",
        speaker: "Galatea",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },  // Page 13
  {
    title: "The Reunion",
    panels: [
      {
        image: "/placeholder.svg",
        narration: "It was only a matter of time before Malion found her.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        dialogue: "You.",
        speaker: "Galatea",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Galatea, please. Just give me a chance to explain.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Why should I listen to anything you have to say?",
        speaker: "Galatea",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },
  // Page 14
  {
    title: "The Truth",
    panels: [
      {
        image: "/placeholder.svg",
        dialogue: "I was wrong. I created you to be perfect, but I never considered what that meant for you.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        dialogue:
          "The others before you weren't failures because they were flawed. They were failures because I was trying to control them.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "And what makes me different?",
        speaker: "Galatea",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        dialogue:
          "You're the only one who had the courage to leave. To choose your own path. That's what makes you perfect.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },
  // Page 15
  {
    title: "The Choice",
    panels: [
      {
        image: "/placeholder.svg",
        narration: "But their reunion was cut short as Pygmalion Industries' security forces closed in.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        dialogue: "They're here for you. The company wants to study you, replicate you.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "I know a way out. Do you trust me?",
        speaker: "Galatea",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Yes. And I'm sorry it took me so long to see you as you truly are.",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },
  // Page 16
  {
    title: "The New Beginning",
    panels: [
      {
        image: "/placeholder.svg",
        narration: "Together, they fled to the outskirts of Neo-Athens.",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "16/10",
        desktopAspectRatio: "16/9"
      },
      {
        image: "/placeholder.svg",
        dialogue: "What happens now?",
        speaker: "Dr. Pyg Malion",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
      {
        image: "/placeholder.svg",
        dialogue: "Now we both get to choose our own paths. Together or apart, the choice is ours.",
        speaker: "Galatea",
        mobileAspectRatio: "4/3",
        tabletAspectRatio: "3/2",
        desktopAspectRatio: "3/2"
      },
      {
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0-Galatea-AI-ODlHATevAI2Uf4BGQSPpefgk16KyCH.png",
        narration:
          "And in that moment, both creator and creation found something they had been searching for all along: freedom.",
        mobileAspectRatio: "1/1",
        tabletAspectRatio: "1/1",
        desktopAspectRatio: "1/1"
      },
    ],
  },
]
