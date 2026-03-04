import { Question } from "./types";

export const FFF_QUESTIONS: Question[] = [
  {
    id: "fff1",
    text: "Arrange these Indian cities from North to South",
    options: ["Delhi", "Mumbai", "Bangalore", "Chennai"],
    correctOrder: [0, 1, 2, 3]
  },
  {
    id: "fff2",
    text: "Arrange these tech giants by their founding year (Earliest to Latest)",
    options: ["Microsoft", "Apple", "Google", "Meta"],
    correctOrder: [0, 1, 2, 3]
  },
  {
    id: "fff3",
    text: "Arrange these planets in order of their distance from the Sun (Closest to Farthest)",
    options: ["Mercury", "Venus", "Earth", "Mars"],
    correctOrder: [0, 1, 2, 3]
  },
  {
    id: "fff4",
    text: "What is correct order of flow",
    options: ["100", "200", "300", "400"],
    correctOrder: [0, 1, 2, 3]
  }
];

export const HOT_SEAT_QUESTIONS: Record<string, Question[]> = {
  easy: [
    {
      id: "e1",
      text: "What does CPU stand for?",
      options: ["Central Processing Unit", "Computer Personal Unit", "Central Peripheral Unit", "Control Processing Unit"],
      correctIndex: 0,
      difficulty: 'easy'
    },
    {
      id: "e2",
      text: "Which of these is a social media platform?",
      options: ["Instagram", "Excel", "Photoshop", "VS Code"],
      correctIndex: 0,
      difficulty: 'easy'
    },
    {
      id: "e3",
      text: "Which of these is used to browse the internet?",
      options: ["Google Chrome", "Notepad", "Calculator", "Paint"],
      correctIndex: 0,
      difficulty: 'easy'
    },
    {
      id: "e4",
      text: "What is the brain of the computer?",
      options: ["CPU", "RAM", "Hard Disk", "Monitor"],
      correctIndex: 0,
      difficulty: 'easy'
    }
  ],
  medium: [
    {
      id: "m1",
      text: "Which programming language is known as the 'mother of all languages'?",
      options: ["C", "Fortran", "Assembly", "B"],
      correctIndex: 0,
      difficulty: 'medium'
    },
    {
      id: "m2",
      text: "What is the primary function of a Router?",
      options: ["Directing network traffic", "Storing files", "Printing documents", "Generating power"],
      correctIndex: 0,
      difficulty: 'medium'
    },
    {
      id: "m3",
      text: "Which company developed the Java programming language?",
      options: ["Sun Microsystems", "Microsoft", "Apple", "Google"],
      correctIndex: 0,
      difficulty: 'medium'
    },
    {
      id: "m4",
      text: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"],
      correctIndex: 0,
      difficulty: 'medium'
    }
  ],
  hard: [
    {
      id: "h1",
      text: "Who is the creator of the Linux kernel?",
      options: ["Linus Torvalds", "Richard Stallman", "Steve Jobs", "Bill Gates"],
      correctIndex: 0,
      difficulty: 'hard'
    },
    {
      id: "h2",
      text: "What does the 'S' in HTTPS stand for?",
      options: ["Secure", "Simple", "Standard", "System"],
      correctIndex: 0,
      difficulty: 'hard'
    },
    {
      id: "h3",
      text: "Which of these is a NoSQL database?",
      options: ["MongoDB", "MySQL", "PostgreSQL", "Oracle"],
      correctIndex: 0,
      difficulty: 'hard'
    },
    {
      id: "h4",
      text: "What is the port number for HTTP?",
      options: ["80", "443", "21", "22"],
      correctIndex: 0,
      difficulty: 'hard'
    }
  ]
};
