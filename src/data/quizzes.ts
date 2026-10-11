import { Quiz } from '../types';

export const QUIZZES: Quiz[] = [
  {
    id: 'python-basics',
    title: 'Python Core & Data Science Foundations',
    category: 'python',
    difficulty: 'Easy',
    timeLimitSeconds: 180,
    questions: [
      {
        id: 'py-q1',
        question: 'Which of the following data types in Python is IMMUTABLE?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correctAnswerIndex: 2,
        explanation: 'Tuples in Python are immutable, meaning once created, their elements cannot be changed, added, or removed. Lists, Dictionaries, and Sets are mutable.'
      },
      {
        id: 'py-q2',
        question: 'What is the output of print(2 ** 3 ** 2) in Python?',
        options: ['64', '512', '256', '81'],
        correctAnswerIndex: 1,
        explanation: 'The power operator (**) is right-associative in Python. Therefore, 2 ** 3 ** 2 is evaluated as 2 ** (3 ** 2) which is 2 ** 9 = 512.'
      },
      {
        id: 'py-q3',
        question: 'What is the correct syntax to slice a list "lst" backwards?',
        options: ['lst[::-1]', 'lst[0:-1:-1]', 'lst[-1:0]', 'lst.reverse()'],
        correctAnswerIndex: 0,
        explanation: 'Using the slice notation [start:stop:step], a step of -1 tells Python to step backward, starting from the end of the list and concluding at the beginning, thus returning a reversed shallow copy.'
      }
    ]
  },
  {
    id: 'gate-cs-mock',
    title: 'GATE CS Mock: Data Structures & Algorithms',
    category: 'gate',
    difficulty: 'Hard',
    timeLimitSeconds: 300,
    questions: [
      {
        id: 'gate-q1',
        question: 'What is the worst-case time complexity of insertion in a Hash Table with Chaining using a linked list?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswerIndex: 2,
        explanation: 'In the worst case, all n elements hash to the same slot, creating a single chain of length n. Inserting a new element at the tail of the list (or checking for duplicates) takes O(n) time.'
      },
      {
        id: 'gate-q2',
        question: 'Which design paradigm does Floyd-Warshall all-pairs shortest path algorithm utilize?',
        options: ['Greedy Method', 'Divide and Conquer', 'Dynamic Programming', 'Backtracking'],
        correctAnswerIndex: 2,
        explanation: 'Floyd-Warshall solves subproblems iteratively based on the intermediate vertex set, building upon previously optimized subproblem values. This is a classic application of Dynamic Programming.'
      },
      {
        id: 'gate-q3',
        question: 'What is the maximum number of nodes in a binary tree of height h (where a root-only tree has height 1)?',
        options: ['2^h', '2^h - 1', '2^(h-1)', '2^(h+1) - 1'],
        correctAnswerIndex: 1,
        explanation: 'A fully saturated binary tree of height h has exactly 2^h - 1 nodes. For example, height 1 has 2^1 - 1 = 1 node; height 2 has 2^2 - 1 = 3 nodes.'
      }
    ]
  },
  {
    id: 'cyber-sec-pro',
    title: 'Cyber Security: Cryptography & Network Defense',
    category: 'cyber-security',
    difficulty: 'Medium',
    timeLimitSeconds: 240,
    questions: [
      {
        id: 'sec-q1',
        question: 'Which encryption standard is asymmetric and relies on the difficulty of factoring large prime integers?',
        options: ['AES', 'DES', 'RSA', 'Blowfish'],
        correctAnswerIndex: 2,
        explanation: 'RSA (Rivest-Shamir-Adleman) is an asymmetric public-key cryptosystem that derives its security from the extreme computational difficulty of factoring semiprime integers.'
      },
      {
        id: 'sec-q2',
        question: 'What does mutual TLS (mTLS) guard against that standard TLS does not?',
        options: ['SQL Injection', 'Client Impersonation', 'Eavesdropping', 'Denial of Service'],
        correctAnswerIndex: 1,
        explanation: 'Standard TLS only requires the server to authenticate itself to the client. mTLS forces BOTH the client and server to authenticate using certificates, preventing client impersonation entirely.'
      },
      {
        id: 'sec-q3',
        question: 'In web security, what is the primary countermeasure against Cross-Site Request Forgery (CSRF)?',
        options: ['SQL Prepared Statements', 'Anti-CSRF Tokens', 'HTTPS Encryption', 'Content Security Policy (CSP)'],
        correctAnswerIndex: 1,
        explanation: 'Anti-CSRF Tokens are cryptographically random values bound to a session. Form actions require this token to be submitted, validating that the request was initiated by the authorized user.'
      }
    ]
  },
  {
    id: 'aptitude-logic',
    title: 'General Aptitude: Quantitative & Logical Reasoning',
    category: 'aptitude-reasoning',
    difficulty: 'Medium',
    timeLimitSeconds: 180,
    questions: [
      {
        id: 'apt-q1',
        question: 'A train 150 meters long passes a telegraph post in 12 seconds. Find the speed of the train in km/h.',
        options: ['45 km/h', '50 km/h', '36 km/h', '54 km/h'],
        correctAnswerIndex: 0,
        explanation: 'Speed = Distance / Time = 150m / 12s = 12.5 m/s. To convert to km/h, multiply by 18/5: 12.5 * 18/5 = 45 km/h.'
      },
      {
        id: 'apt-q2',
        question: 'If all Glims are Glams, and some Glams are Glums, which statement is CERTAINLY true?',
        options: ['Some Glims are Glums', 'All Glums are Glims', 'Some Glams are Glims', 'No Glim is a Glum'],
        correctAnswerIndex: 2,
        explanation: 'Since "all Glims are Glams", any Glim is automatically a Glam. This implies there is a subset of Glams that contains Glims, meaning "Some Glams are Glims" must be logically true.'
      }
    ]
  }
];
