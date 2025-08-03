const dummyArticles = [
  {
    id: 1,
    title: "Lim's divine spark: reinventing the Goldbergs",
    image: "/images/goldbergs.png",
    date: "2025-07-10",
    category: "music",
    blocks: [
      { type: "heading", content: "Lim's divine spark: reinventing the Goldbergs" },
      { type: "subheading", content: "A radical retelling of Bach’s variations" },
      { type: "paragraph", content: "An innovative reimagining of Bach’s iconic variations, Lim breathes new life into the familiar with precision, depth, and fearless emotion." },
      { type: "image", content: "/images/goldbergs.png" }
    ]
  },
  {
    id: 2,
    title: "Rethinking Edith Wharton",
    image: "/images/edith.png",
    date: "2025-06-25",
    category: "books",
    blocks: [
      { type: "heading", content: "Rethinking Edith Wharton" },
      { type: "subheading", content: "Power, privilege, and prose" },
      { type: "paragraph", content: "A contemporary lens on Wharton's incisive commentary reveals timeless critiques of power, privilege, and gender in high society." },
      { type: "image", content: "/images/edith.png" }
    ]
  },
  {
    id: 3,
    title: "The Immortal Black Saint",
    image: "/images/blacksaint.jpg",
    date: "2025-07-01",
    category: "music",
    blocks: [
      { type: "heading", content: "The Immortal Black Saint" },
      { type: "subheading", content: "Mingus’s masterpiece, reborn" },
      { type: "paragraph", content: "A rediscovery of Mingus’s politically-charged masterpiece and its undying relevance in the age of fractured voices and resilient hope." },
      { type: "image", content: "/images/blacksaint.jpg" }
    ]
  },
  {
    id: 4,
    title: "Cecile",
    image: "/images/cecile.jpg",
    date: "2025-06-12",
    category: "music",
    blocks: [
      { type: "heading", content: "Cécile" },
      { type: "subheading", content: "Otherworldly storytelling" },
      { type: "paragraph", content: "Cécile McLorin Salvant weaves a rich tapestry of storytelling and sonic experimentation in her latest otherworldly recording." },
      { type: "image", content: "/images/cecile.jpg" }
    ]
  },
  {
    id: 5,
    title: "WEBO",
    image: "/images/webo.jpg",
    date: "2025-06-30",
    category: "music",
    blocks: [
      { type: "heading", content: "WEBO" },
      { type: "subheading", content: "Ancestral echoes in sound" },
      { type: "paragraph", content: "Webo's layered soundscapes channel ancestral memory through pulsing rhythm, field recordings, and haunting vocal loops." },
      { type: "image", content: "/images/webo.jpg" }
    ]
  },
  {
    id: 6,
    title: "The Golden Sea Duo",
    image: "/images/golden.png",
    category: "music",
    date: "2025-07-15",
    blocks: [
      { type: "heading", content: "The Golden Sea Duo" },
      { type: "subheading", content: "Jazz, myth, and meditation" },
      { type: "paragraph", content: "A genre-defying debut blends ambient jazz, classical motifs, and maritime mythology into a meditative, luminous experience." },
      { type: "image", content: "/images/golden.png" }
    ]
  },
  {
    id: 7,
    title: "The Ghost in the Library",
    image: "/images/ghostlibrary.jpg",
    category: "books",
    date: "2025-07-20",
    blocks: [
      { type: "heading", content: "The Ghost in the Library" },
      { type: "subheading", content: "Haunted narratives in modern fiction" },
      { type: "paragraph", content: "Exploring how ghost stories have become metaphors for trauma in contemporary literature." },
      { type: "image", content: "/images/ghostlibrary.jpg" }
    ]
  },
  {
    id: 8,
    title: "Why Borges Still Matters",
    image: "/images/borges.jpg",
    category: "books",
    date: "2025-06-28",
    blocks: [
      { type: "heading", content: "Why Borges Still Matters" },
      { type: "subheading", content: "Labyrinths and metaphysics" },
      { type: "paragraph", content: "A look into Borges’ philosophical puzzles and their enduring influence on postmodern thought." },
      { type: "image", content: "/images/borges.jpg" }
    ]
  },
  {
    id: 9,
    title: "The Bookstore at the Edge of the World",
    image: "/images/bookstore.jpg",
    category: "books",
    date: "2025-07-03",
    blocks: [
      { type: "heading", content: "The Bookstore at the Edge of the World" },
      { type: "subheading", content: "Fiction that dreams of fiction" },
      { type: "paragraph", content: "A meditation on solitude, books, and what it means to find home in a story." },
      { type: "image", content: "/images/bookstore.jpg" }
    ]
  },
  {
    id: 10,
    title: "Ferrante and Female Rage",
    image: "/images/ferrante.jpg",
    category: "books",
    date: "2025-07-25",
    blocks: [
      { type: "heading", content: "Ferrante and Female Rage" },
      { type: "subheading", content: "Unmasking Neapolitan rage" },
      { type: "paragraph", content: "An examination of anger, friendship, and class in Elena Ferrante’s Neapolitan Novels." },
      { type: "image", content: "/images/ferrante.jpg" }
    ]
  },
  {
    id: 11,
    title: "The Dictionary as Novel",
    image: "/images/dictionary.jpg",
    category: "books",
    date: "2025-07-30",
    blocks: [
      { type: "heading", content: "The Dictionary as Novel" },
      { type: "subheading", content: "Words as characters" },
      { type: "paragraph", content: "What makes a book a story? From Calvino to Milorad Pavić, redefining narrative in alphabetical order." },
      { type: "image", content: "/images/dictionary.jpg" }
    ]
  },
  {
    id: 12,
    title: "Running Through Kyoto",
    image: "/images/kyoto.jpg",
    category: "blog",
    date: "2025-06-18",
    blocks: [
      { type: "heading", content: "Running Through Kyoto" },
      { type: "subheading", content: "Temples, trails, and tendonitis" },
      { type: "paragraph", content: "A runner’s perspective on navigating Japan’s cultural capital—on foot and in silence." },
      { type: "image", content: "/images/kyoto.jpg" }
    ]
  },
  {
    id: 13,
    title: "Learning the Violin at 30",
    image: "/images/violin.jpg",
    category: "blog",
    date: "2025-05-14",
    blocks: [
      { type: "heading", content: "Learning the Violin at 30" },
      { type: "subheading", content: "Discipline, doubt, and delight" },
      { type: "paragraph", content: "What it’s like to pick up a notoriously difficult instrument long after childhood." },
      { type: "image", content: "/images/violin.jpg" }
    ]
  },
  {
    id: 14,
    title: "What I Learned from Getting Lost in Norway",
    image: "/images/norway.jpg",
    category: "blog",
    date: "2025-07-08",
    blocks: [
      { type: "heading", content: "What I Learned from Getting Lost in Norway" },
      { type: "subheading", content: "Mountains, maps, and mortality" },
      { type: "paragraph", content: "A misstep into the fog becomes a meditation on navigation, both literal and emotional." },
      { type: "image", content: "/images/norway.jpg" }
    ]
  },
  {
    id: 15,
    title: "Coffee in Lisbon: A Slow Ritual",
    image: "/images/lisbon.jpg",
    category: "blog",
    date: "2025-06-05",
    blocks: [
      { type: "heading", content: "Coffee in Lisbon: A Slow Ritual" },
      { type: "subheading", content: "Pastéis, pace, and Portuguese" },
      { type: "paragraph", content: "Finding poetry in the rhythm of cafés and conversation." },
      { type: "image", content: "/images/lisbon.jpg" }
    ]
  },
  {
    id: 16,
    title: "On Losing and Relearning French",
    image: "/images/french.jpg",
    category: "blog",
    date: "2025-06-22",
    blocks: [
      { type: "heading", content: "On Losing and Relearning French" },
      { type: "subheading", content: "Language and identity" },
      { type: "paragraph", content: "The slippery terrain of language memory and rediscovery as an adult." },
      { type: "image", content: "/images/french.jpg" }
    ]
  },
  {
    id: 17,
    title: "From Sheet Music to Street Noise",
    image: "/images/streetmusic.jpg",
    category: "blog",
    date: "2025-07-11",
    blocks: [
      { type: "heading", content: "From Sheet Music to Street Noise" },
      { type: "subheading", content: "Improvisation as survival" },
      { type: "paragraph", content: "Playing music on the street taught me more about sound and connection than any conservatory." },
      { type: "image", content: "/images/streetmusic.jpg" }
    ]
  },
  {
    id: 18,
    title: "Revisiting Hamlet",
    image: "/images/hamlet.jpg",
    category: "shakespeare",
    date: "2025-06-02",
    blocks: [
      { type: "heading", content: "Revisiting Hamlet" },
      { type: "subheading", content: "The prince and our paradoxes" },
      { type: "paragraph", content: "What Hamlet reveals about our need to act—and our fear of action." },
      { type: "image", content: "/images/hamlet.jpg" }
    ]
  },
  {
    id: 19,
    title: "Othello and the Language of Jealousy",
    image: "/images/othello.jpg",
    category: "shakespeare",
    date: "2025-05-30",
    blocks: [
      { type: "heading", content: "Othello and the Language of Jealousy" },
      { type: "subheading", content: "Shakespeare’s green-eyed monster" },
      { type: "paragraph", content: "A close read on how envy corrodes from within and without." },
      { type: "image", content: "/images/othello.jpg" }
    ]
  },
  {
    id: 20,
    title: "King Lear’s Storms",
    image: "/images/lear.jpg",
    category: "shakespeare",
    date: "2025-06-10",
    blocks: [
      { type: "heading", content: "King Lear’s Storms" },
      { type: "subheading", content: "Madness, rain, and revelation" },
      { type: "paragraph", content: "How the storm scenes in Lear externalize the chaos of age and loss." },
      { type: "image", content: "/images/lear.jpg" }
    ]
  },
  {
    id: 21,
    title: "Twelfth Night: Comedy as Disguise",
    image: "/images/twelfthnight.jpg",
    category: "shakespeare",
    date: "2025-06-17",
    blocks: [
      { type: "heading", content: "Twelfth Night: Comedy as Disguise" },
      { type: "subheading", content: "Laughter and longing" },
      { type: "paragraph", content: "Examining the duality of joy and loneliness in Shakespeare’s festive world." },
      { type: "image", content: "/images/twelfthnight.jpg" }
    ]
  },
  {
    id: 22,
    title: "Macbeth and the Weight of the Crown",
    image: "/images/macbeth.jpg",
    category: "shakespeare",
    date: "2025-06-20",
    blocks: [
      { type: "heading", content: "Macbeth and the Weight of the Crown" },
      { type: "subheading", content: "Ambition’s blood price" },
      { type: "paragraph", content: "A reflection on power, guilt, and the dreams that turn to nightmares." },
      { type: "image", content: "/images/macbeth.jpg" }
    ]
  },
  
  

  {
    id: 'uuid',
    articleId: 5,
    parentId: null,
    content: 'Nice post!',
    author: 'John',
    createdAt: '...',
    likes: 0,
    dislikes: 0,
  }
];

export default dummyArticles;
