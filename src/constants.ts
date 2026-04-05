import { Question, FFFQuestionSet } from "./types";

export const FFF_QUESTION_SETS: FFFQuestionSet[] = [
  {
    main: {
      id: "fff1",
      text: "Place these devices in order of screen size, starting with the largest.",
      options: ["Desktop computer", "Laptop", "Tablet", "Smartphone"],
      correctOrder: [0, 1, 2, 3]
    },
    alternate: {
      id: "fff1_alt",
      text: "Put the following stages of human life in chronological order from youngest to oldest.",
      options: ["Adult", "Child", "Infant", "Teenager"],
      correctOrder: [2, 1, 3, 0]
    }
  },
  {
    main: {
      id: "fff2",
      text: "Order the following data storage units from the smallest capacity to the largest.",
      options: ["Gigabyte(GB)", "Kilobyte(KB)", "Terabyte(TB)", "Megabyte(MB)"],
      correctOrder: [1, 3, 0, 2]
    },
    alternate: {
      id: "fff2_alt",
      text: "Rank the following file types based on the storage space they typically require, starting with the least.",
      options: ["Movie", "Image", "Song", "Text File"],
      correctOrder: [3, 1, 2, 0]
    }
  },
  {
    main: {
      id: "fff3",
      text: "Place these programming steps in the correct sequence for compiling and executing a program.",
      options: ["Run Program", "Compile Code", "Write Code", "See Output"],
      correctOrder: [2, 1, 0, 3]
    },
    alternate: {
      id: "fff3_alt",
      text: "Identify the proper sequence of stages in a typical software development process.",
      options: ["Testing", "Design", "Deployment", "Coding"],
      correctOrder: [1, 3, 0, 2]
    }
  },
  {
    main: {
      id: "fff4",
      text: "Select the correct order of actions required to log into a website.",
      options: ["Enter password", "Enter username", "Click login button", "Access dashboard"],
      correctOrder: [1, 0, 2, 3]
    },
    alternate: {
      id: "fff4_alt",
      text: "Determine the correct sequence for sending a message in a messaging application.",
      options: ["Type message", "Open chat", "Press send", "Message delivered"],
      correctOrder: [1, 0, 2, 3]
    }
  },
  {
    main: {
      id: "fff5",
      text: "Put these web development technologies in the order beginners usually learn them.",
      options: ["CSS", "HTML", "JavaScript", "React"],
      correctOrder: [1, 0, 2, 3]
    },
    alternate: {
      id: "fff5_alt",
      text: "Arrange these keyboard letters according to their position from left to right on a standard keyboard row.",
      options: ["S", "D", "F", "A"],
      correctOrder: [3, 0, 1, 2]
    }
  },
  {
    main: {
      id: "fff6",
      text: "Choose the correct workflow of Git commands used before sending changes to a remote repository.",
      options: ["add", "commit", "push", "pull"],
      correctOrder: [3, 0, 1, 2]
    },
    alternate: {
      id: "fff6_alt",
      text: "Order these numbers based on their cube values, beginning with the smallest.",
      options: ["Cube of 5", "Cube of 2", "Cube of 4", "Cube of 3"],
      correctOrder: [1, 3, 2, 0]
    }
  },
  {
    main: {
      id: "fff7",
      text: "Identify the correct order of these numbers as they appear on the number line from smallest to largest.",
      options: ["-7", "3", "-2", "5"],
      correctOrder: [0, 2, 1, 3]
    },
    alternate: {
      id: "fff7_alt",
      text: "Arrange these powers of 2 from the smallest value to the largest.",
      options: ["2⁵", "2³", "2⁷", "2⁴"],
      correctOrder: [1, 3, 0, 2]
    }
  },
  {
    main: {
      id: "fff8",
      text: "Rank these common internet file types by their typical file size, starting with the smallest.",
      options: ["Text file (.txt)", "Image file (.jpg)", "Video file (.mp4)", "Audio file (.mp3)"],
      correctOrder: [0, 1, 3, 2]
    },
    alternate: {
      id: "fff8_alt",
      text: "Determine the usual sequence of components in a basic program structure.",
      options: ["End Program", "Processing", "Output", "Input"],
      correctOrder: [3, 1, 2, 0]
    }
  },
  {
    main: {
      id: "fff9",
      text: "Place the following steps in the correct order for browsing a website.",
      options: ["Page loads", "Open browser", "Enter website URL", "Website displays"],
      correctOrder: [1, 2, 0, 3]
    },
    alternate: {
      id: "fff9_alt",
      text: "Choose the correct sequence involved in installing a mobile app from an app store.",
      options: ["Open app", "Click install", "Search for the app", "Installation completes"],
      correctOrder: [2, 1, 3, 0]
    }
  },
  {
    main: {
      id: "fff10",
      text: "Arrange these units of time in increasing order.",
      options: ["Hour", "Second", "Minute", "Day"],
      correctOrder: [1, 2, 0, 3]
    },
    alternate: {
      id: "fff10_alt",
      text: "Select the correct precedence order for these mathematical operations.",
      options: ["Addition", "Multiplication", "Division", "Subtraction"],
      correctOrder: [0, 3, 1, 2]
    }
  }
];

export const HOT_SEAT_QUESTIONS: Record<string, Question[]> = {
  easy: [
    // Cycle 1
    { id: "e1_1", text: "Which company developed Windows OS?", options: ["Apple", "Microsoft", "Google", "IBM"], correctIndex: 1, difficulty: 'easy' },
    { id: "e1_2", text: "What does PDF stand for?", options: ["Portable Document Format", "Personal Data File", "Print Data File", "Program Document File"], correctIndex: 0, difficulty: 'easy' },
    { id: "e1_3", text: "Which operating system is used in most smartphones?", options: ["Linux", "Android", "DOS", "UNIX"], correctIndex: 1, difficulty: 'easy' },
    // Cycle 2
    { id: "e2_1", text: "What does USB stand for?", options: ["Universal Serial Bus", "Unified Storage Bus", "Universal System Bus", "User Serial Base"], correctIndex: 0, difficulty: 'easy' },
    { id: "e2_2", text: "Which of these is NOT a web browser?", options: ["Chrome", "Firefox", "Windows", "Edge"], correctIndex: 2, difficulty: 'easy' },
    { id: "e2_3", text: "What is the brain of the computer?", options: ["RAM", "CPU", "Hard Disk", "Motherboard"], correctIndex: 1, difficulty: 'easy' },
    // Cycle 3
    { id: "e3_1", text: "Which storage device uses laser technology to read data?", options: ["CD", "RAM", "SSD", "CPU"], correctIndex: 0, difficulty: 'easy' },
    { id: "e3_2", text: "Which key refreshes a webpage in most browsers?", options: ["F2", "F5", "F8", "F12"], correctIndex: 1, difficulty: 'easy' },
    { id: "e3_3", text: "Which file format is commonly used for images?", options: ["JPG", "MP3", "TXT", "DOC"], correctIndex: 0, difficulty: 'easy' },
    // Cycle 4
    { id: "e4_1", text: "What does the \"C\" in CPU stand for?", options: ["Computer", "Central", "Control", "Circuit"], correctIndex: 1, difficulty: 'easy' },
    { id: "e4_2", text: "Which shortcut copies selected text in most systems?", options: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + Z"], correctIndex: 0, difficulty: 'easy' },
    { id: "e4_3", text: "Which company developed the Chrome browser?", options: ["Google", "Apple", "Microsoft", "Amazon"], correctIndex: 0, difficulty: 'easy' },
    // Cycle 5
    { id: "e5_1", text: "Which programming language is mainly used for web page structure?", options: ["CSS", "HTML", "Python", "Java"], correctIndex: 1, difficulty: 'easy' },
    { id: "e5_2", text: "Which device is used to input text into a computer?", options: ["Monitor", "Keyboard", "Printer", "Speaker"], correctIndex: 1, difficulty: 'easy' },
    { id: "e5_3", text: "Which of the following is an output device?", options: ["Mouse", "Monitor", "Keyboard", "Scanner"], correctIndex: 1, difficulty: 'easy' },
    // Cycle 6
    { id: "e6_1", text: "What does the \"E\" in Email stand for?", options: ["Electronic", "Electric", "Express", "External"], correctIndex: 0, difficulty: 'easy' },
    { id: "e6_2", text: "Which device prints documents on paper?", options: ["Monitor", "Printer", "Speaker", "Scanner"], correctIndex: 1, difficulty: 'easy' },
    { id: "e6_3", text: "Which key is used to delete text to the left of the cursor?", options: ["Enter", "Backspace", "Shift", "Delete"], correctIndex: 1, difficulty: 'easy' },
    // Cycle 7
    { id: "e7_1", text: "Which symbol is used for comments in Python?", options: ["//", "#", "/* */", "--"], correctIndex: 1, difficulty: 'easy' },
    { id: "e7_2", text: "Which language is used for styling web pages?", options: ["HTML", "CSS", "C++", "SQL"], correctIndex: 1, difficulty: 'easy' },
    { id: "e7_3", text: "Which device moves the cursor on screen?", options: ["Keyboard", "Mouse", "Scanner", "Printer"], correctIndex: 1, difficulty: 'easy' },
    // Cycle 8
    { id: "e8_1", text: "Which storage device is portable?", options: ["Hard Disk", "Pen Drive", "CPU", "RAM"], correctIndex: 1, difficulty: 'easy' },
    { id: "e8_2", text: "Which device is used to listen to sound from a computer?", options: ["Printer", "Speaker", "Scanner", "Keyboard"], correctIndex: 1, difficulty: 'easy' },
    { id: "e8_3", text: "Which company makes the iPhone?", options: ["Samsung", "Apple", "Google", "Microsoft"], correctIndex: 1, difficulty: 'easy' },
    // Cycle 9
    { id: "e9_1", text: "What does RAM stand for?", options: ["Random Access Memory", "Rapid Access Machine", "Read Access Memory", "Runtime Access Module"], correctIndex: 0, difficulty: 'easy' },
    { id: "e9_2", text: "Which key is used to start a new line while typing?", options: ["Enter", "Shift", "Tab", "Ctrl"], correctIndex: 0, difficulty: 'easy' },
    { id: "e9_3", text: "Which of these is a search engine?", options: ["YouTube", "Google", "WhatsApp", "Instagram"], correctIndex: 1, difficulty: 'easy' },
    // Cycle 10
    { id: "e10_1", text: "Which storage is temporary?", options: ["Hard Disk", "RAM", "SSD", "CD"], correctIndex: 1, difficulty: 'easy' },
    { id: "e10_2", text: "Which company developed the Java programming language?", options: ["Sun Microsystems", "Microsoft", "Apple", "Google"], correctIndex: 0, difficulty: 'easy' },
    { id: "e10_3", text: "Which device scans documents into a computer?", options: ["Scanner", "Printer", "Monitor", "Speaker"], correctIndex: 0, difficulty: 'easy' }
  ],
  medium: [
    // Cycle 1
    { id: "m1_1", text: "Which HTTP method is used to retrieve data?", options: ["POST", "GET", "PUT", "DELETE"], correctIndex: 1, difficulty: 'medium' },
    { id: "m1_2", text: "Which network topology connects all devices to a central hub?", options: ["Ring", "Star", "Bus", "Mesh"], correctIndex: 1, difficulty: 'medium' },
    { id: "m1_3", text: "What does SQL stand for?", options: ["Structured Query Language", "Sequential Query Language", "System Query Language", "Structural Query Language"], correctIndex: 0, difficulty: 'medium' },
    // Cycle 2
    { id: "m2_1", text: "Which device connects different networks together?", options: ["Switch", "Router", "Hub", "Repeater"], correctIndex: 1, difficulty: 'medium' },
    { id: "m2_2", text: "What will be the output? print(10/3)", options: ["3", "3.33", "3.3333333333", "Error"], correctIndex: 2, difficulty: 'medium' },
    { id: "m2_3", text: "Which symbol is used for pointer in C?", options: ["&", "*", "#", "%"], correctIndex: 1, difficulty: 'medium' },
    // Cycle 3
    { id: "m3_1", text: "What will be the output? print(\"5\" + \"5\")", options: ["10", "55", "Error", "5+5"], correctIndex: 1, difficulty: 'medium' },
    { id: "m3_2", text: "Which layer of OSI model handles routing?", options: ["Transport", "Network", "Session", "Presentation"], correctIndex: 1, difficulty: 'medium' },
    { id: "m3_3", text: "Which of the following is NOT a programming language?", options: ["Python", "Java", "HTML", "C++"], correctIndex: 2, difficulty: 'medium' },
    // Cycle 4
    { id: "m4_1", text: "What is the default port for HTTPS?", options: ["80", "443", "21", "8080"], correctIndex: 1, difficulty: 'medium' },
    { id: "m4_2", text: "Which symbol represents logical AND in many languages?", options: ["&&", "||", "==", "!="], correctIndex: 0, difficulty: 'medium' },
    { id: "m4_3", text: "Which programming language is strongly typed and runs on JVM?", options: ["Python", "Java", "JavaScript", "PHP"], correctIndex: 1, difficulty: 'medium' },
    // Cycle 5
    { id: "m5_1", text: "Which database command removes all records but keeps the table?", options: ["DELETE", "TRUNCATE", "DROP", "REMOVE"], correctIndex: 1, difficulty: 'medium' },
    { id: "m5_2", text: "Which protocol is used to transfer web pages?", options: ["FTP", "HTTP", "SMTP", "SNMP"], correctIndex: 1, difficulty: 'medium' },
    { id: "m5_3", text: "Which algorithm technique divides a problem into subproblems?", options: ["Greedy", "Divide and Conquer", "Dynamic Allocation", "Recursion Tree"], correctIndex: 1, difficulty: 'medium' },
    // Cycle 6
    { id: "m6_1", text: "Which company developed Android OS?", options: ["Microsoft", "Google", "IBM", "Intel"], correctIndex: 1, difficulty: 'medium' },
    { id: "m6_2", text: "Which number will be printed? int x = 5; printf(\"%d\", x++);", options: ["6", "5", "Compilation Error", "Nothing prints"], correctIndex: 1, difficulty: 'medium' },
    { id: "m6_3", text: "Which language runs in a web browser?", options: ["Python", "JavaScript", "C++", "Java"], correctIndex: 1, difficulty: 'medium' },
    // Cycle 7
    { id: "m7_1", text: "Which port is used for HTTP?", options: ["80", "21", "25", "110"], correctIndex: 0, difficulty: 'medium' },
    { id: "m7_2", text: "Which company created the JavaScript language?", options: ["Netscape", "Google", "Microsoft", "IBM"], correctIndex: 0, difficulty: 'medium' },
    { id: "m7_3", text: "Which data structure stores key-value pairs?", options: ["Array", "Hash Table", "Stack", "Queue"], correctIndex: 1, difficulty: 'medium' },
    // Cycle 8
    { id: "m8_1", text: "Which company created the Windows operating system?", options: ["Apple", "Microsoft", "IBM", "Intel"], correctIndex: 1, difficulty: 'medium' },
    { id: "m8_2", text: "Which HTML tag displays the largest heading?", options: ["<h6>", "<h1>", "<header>", "<title>"], correctIndex: 1, difficulty: 'medium' },
    { id: "m8_3", text: "Which command updates existing data in SQL?", options: ["UPDATE", "INSERT", "SELECT", "DROP"], correctIndex: 0, difficulty: 'medium' },
    // Cycle 9
    { id: "m9_1", text: "Which programming concept allows code reuse through classes?", options: ["Encapsulation", "Inheritance", "Abstraction", "Compilation"], correctIndex: 1, difficulty: 'medium' },
    { id: "m9_2", text: "Which command is used to create a table in SQL?", options: ["INSERT", "CREATE", "UPDATE", "MODIFY"], correctIndex: 1, difficulty: 'medium' },
    { id: "m9_3", text: "Which layer of OSI model ensures reliable transmission?", options: ["Transport Layer", "Network Layer", "Data Link Layer", "Physical Layer"], correctIndex: 0, difficulty: 'medium' },
    // Cycle 10
    { id: "m10_1", text: "Which database is NoSQL?", options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], correctIndex: 2, difficulty: 'medium' },
    { id: "m10_2", text: "Which data structure works on FIFO principle?", options: ["Stack", "Queue", "Tree", "Graph"], correctIndex: 1, difficulty: 'medium' },
    { id: "m10_3", text: "Which of the following is a programming language AND a coffee type?", options: ["Java", "Python", "C++", "Kotlin"], correctIndex: 0, difficulty: 'medium' }
  ],
  hard: [
    // Cycle 1
    { id: "h1_1", text: "Which sorting algorithm has the best average time complexity?", options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Insertion Sort"], correctIndex: 1, difficulty: 'hard' },
    { id: "h1_2", text: "Which protocol is used to send email?", options: ["SMTP", "FTP", "HTTP", "TCP"], correctIndex: 0, difficulty: 'hard' },
    { id: "h1_3", text: "Which data structure is used in recursion?", options: ["Queue", "Stack", "Graph", "Tree"], correctIndex: 1, difficulty: 'hard' },
    // Cycle 2
    { id: "h2_1", text: "Which programming language is widely used for Android apps?", options: ["Swift", "Kotlin", "Ruby", "PHP"], correctIndex: 1, difficulty: 'hard' },
    { id: "h2_2", text: "Which structure stores hierarchical data?", options: ["Array", "Tree", "Stack", "Queue"], correctIndex: 1, difficulty: 'hard' },
    { id: "h2_3", text: "Which algorithm is used in RSA encryption?", options: ["Symmetric Key", "Public Key", "Hashing", "Compression"], correctIndex: 1, difficulty: 'hard' },
    // Cycle 3
    { id: "h3_1", text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctIndex: 1, difficulty: 'hard' },
    { id: "h3_2", text: "Which algorithm technique stores results of subproblems?", options: ["Greedy", "Dynamic Programming", "Backtracking", "Brute Force"], correctIndex: 1, difficulty: 'hard' },
    { id: "h3_3", text: "Which structure is used to implement priority queues?", options: ["Linked List", "Heap", "Array", "Stack"], correctIndex: 1, difficulty: 'hard' },
    // Cycle 4
    { id: "h4_1", text: "Which company developed the C programming language?", options: ["Microsoft", "Bell Labs", "IBM", "Apple"], correctIndex: 1, difficulty: 'hard' },
    { id: "h4_2", text: "Which memory is fastest in a computer?", options: ["RAM", "Cache", "Hard Disk", "SSD"], correctIndex: 1, difficulty: 'hard' },
    { id: "h4_3", text: "Which process allows programs to run simultaneously?", options: ["Compilation", "Multitasking", "Debugging", "Encoding"], correctIndex: 1, difficulty: 'hard' },
    // Cycle 5
    { id: "h5_1", text: "Which company created the Linux kernel?", options: ["IBM", "Linus Torvalds", "Google", "Oracle"], correctIndex: 1, difficulty: 'hard' },
    { id: "h5_2", text: "Which language is mainly used for machine learning?", options: ["C", "Python", "HTML", "CSS"], correctIndex: 1, difficulty: 'hard' },
    { id: "h5_3", text: "Which sorting algorithm is stable?", options: ["Quick Sort", "Merge Sort", "Heap Sort", "Selection Sort"], correctIndex: 1, difficulty: 'hard' },
    // Cycle 6
    { id: "h6_1", text: "Which database normalization form removes transitive dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], correctIndex: 2, difficulty: 'hard' },
    { id: "h6_2", text: "Which data structure is used in Breadth First Search?", options: ["Stack", "Queue", "Tree", "Heap"], correctIndex: 1, difficulty: 'hard' },
    { id: "h6_3", text: "Which programming paradigm does Haskell follow?", options: ["Object Oriented", "Functional Programming", "Procedural", "Logic Programming"], correctIndex: 1, difficulty: 'hard' },
    // Cycle 7
    { id: "h7_1", text: "Which algorithm finds shortest path in graphs?", options: ["Dijkstra", "Kruskal", "Prim", "DFS"], correctIndex: 0, difficulty: 'hard' },
    { id: "h7_2", text: "Which protocol transfers files between computers?", options: ["FTP", "SMTP", "POP3", "SNMP"], correctIndex: 0, difficulty: 'hard' },
    { id: "h7_3", text: "Which concept allows multiple functions with same name?", options: ["Encapsulation", "Polymorphism", "Inheritance", "Abstraction"], correctIndex: 1, difficulty: 'hard' },
    // Cycle 8
    { id: "h8_1", text: "Which scheduling algorithm gives minimum average waiting time?", options: ["FCFS", "Shortest Job First", "Round Robin", "Priority Scheduling"], correctIndex: 1, difficulty: 'hard' },
    { id: "h8_2", text: "Which layer handles encryption in OSI model?", options: ["Application", "Presentation", "Transport", "Network"], correctIndex: 1, difficulty: 'hard' },
    { id: "h8_3", text: "Which algorithm is used to find Minimum Spanning Tree?", options: ["Dijkstra", "Kruskal", "Binary Search", "Floyd Warshall"], correctIndex: 1, difficulty: 'hard' },
    // Cycle 9
    { id: "h9_1", text: "Which complexity represents constant time?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correctIndex: 2, difficulty: 'hard' },
    { id: "h9_2", text: "Which protocol secures web communication?", options: ["HTTP", "HTTPS", "FTP", "Telnet"], correctIndex: 1, difficulty: 'hard' },
    { id: "h9_3", text: "Which algorithm finds strongly connected components?", options: ["Kosaraju", "Prim", "Kruskal", "Dijkstra"], correctIndex: 0, difficulty: 'hard' },
    // Cycle 10
    { id: "h10_1", text: "What does IDE stand for?", options: ["Integrated Development Environment", "Internet Development Engine", "Internal Data Editor", "Integrated Data Executor"], correctIndex: 0, difficulty: 'hard' },
    { id: "h10_2", text: "Which database type stores data in documents?", options: ["Relational Database", "Document Database", "Graph Database", "Key Value Store"], correctIndex: 1, difficulty: 'hard' },
    { id: "h10_3", text: "Which algorithm detects cycles in graphs using colors?", options: ["DFS", "BFS", "Binary Search", "Quick Sort"], correctIndex: 0, difficulty: 'hard' }
  ]
};
