import { BookFormData } from "../types/book";

export const authors = [
  { id: 1, name: "J.K. Rowling" },
  { id: 2, name: "George Orwell" },
  { id: 3, name: "James Clear" },
  { id: 4, name: "Stephen King" },
];

export const genres = [
  { id: 1, name: "Fantasy" },
  { id: 2, name: "Dystopian" },
  { id: 3, name: "Self-Improvement" },
  { id: 4, name: "Horror" },
  { id: 5, name: "Thriller" },
];

export const books: BookFormData[] = [
  {
    isbn: "9780747532699",
    title: "Harry Potter and the Philosopher's Stone",
    cover: "https://covers.openlibrary.org/b/id/7355968-M.jpg",
    publication_year: 1997,
    pages: 223,
    author_id: 1,
    genre_id: 1,
    description:
      "Harry Potter thinks he is an ordinary boy - until he is rescued by an owl, taken to Hogwarts School of Witchecraft and Wizardry, learns to play Quidditch and does battle in a deadly duel. The reason... HARRY POTTER IS A WIZARD!",
  },
  {
    isbn: "9780747538493",
    title: "Harry Potter and the Chamber of Secrets",
    cover: "https://covers.openlibrary.org/b/id/8237628-M.jpg",
    publication_year: 1998,
    pages: 251,
    author_id: 1,
    genre_id: 1,
    description:
      "Harry, Ron and Hermione have returned to Hogwarts School of Witchcraft and Qizardry for their second year. (But Harry and Ron only just made it - they missed the Hogwarts Express and had to get ther in a flying car...!) Soon the threesome are immersed in the daily round of Potions, herbology, Charms, Defence Against the Dark Arts, and Quidditch. But then horrible things start happening. Harry hears evil voices. Sinister messages appear on the wall. But nothing can prepare the three friends for what happens next...",
  },
  {
    isbn: "9780747542155",
    title: "Harry Potter and the Prisoner of Azkaban",
    cover: "https://covers.openlibrary.org/b/id/8125756-M.jpg",
    publication_year: 1999,
    pages: 322,
    author_id: 1,
    genre_id: 1,
    description:
      "For Harry Potter, it’s the start of another far-from-ordinary year at Hogwarts when the Knight Bus crashes through the darkness and comes to an abrupt halt in front of him. It turns out that Sirius Black, mass-murderer and follower of Lord Voldemort, has escaped – and they say he is coming after Harry. In his first Divination class, Professor Trelawney sees an omen of death in Harry’s tea leaves. And perhaps most frightening of all are the Dementors patrolling the school grounds with their soul-sucking kiss – in search of fresh victims.",
  },
  {
    isbn: "9780545791427",
    title: "Harry Potter and the Goblet of Fire",
    cover: "https://images.isbndb.com/covers/19044943482664.jpg",
    publication_year: 2000,
    pages: 464,
    author_id: 1,
    genre_id: 1,
    description:
      "The fourth book in the Harry Potter franchise sees Harry returning for his fourth year at Hogwarts School of Witchcraft and Wizardry, along with his friends, Ron and Hermione . There is an upcoming tournament between the three major schools of magic, with one participant selected from each school by the Goblet of Fire. When Harry's name is drawn, even though he is not eligible and is a fourth player, he must compete in the dangerous contest.",
  },
  {
    isbn: "9780747551003",
    title: "Harry Potter and the Order of the Phoenix",
    cover: "https://covers.openlibrary.org/b/id/10523466-M.jpg",
    publication_year: 2003,
    pages: 772,
    author_id: 1,
    genre_id: 1,
    description:
      "Dumbledore lowered his hands and surveyed Harry through his half-moon glasses. 'It is time,' he said, 'for me to tell you what I should have told you five years ago, Harry. Please sit down. I am going to tell you everything.' Harry Potter is due to start his fifth year at Hogwarts School of Witchcraft and Wizadry. He is desperate to get back to school and find out why his friends Ron and Hermione have been so secretive all summer. However, what Harry is about to discover in his new year at Hogwarts will turn his whole world upside down...",
  },
  {
    isbn: "9781338299199",
    title: "Harry Potter and the Half-Blood Prince",
    cover: "https://covers.openlibrary.org/b/id/8487234-M.jpg",
    publication_year: 2005,
    pages: 688,
    author_id: 1,
    genre_id: 1,
    description:
      "One summer night, when Dumbledore arrives at Privet Drive to collect Harry Potter, his wand hand is blackened and shriveled, but he will not reveal why. Rumours and suspicion spread through the wizarding world – it feels as if even Hogwarts itself might be under threat. Harry is convinced that Malfoy bears the Dark Mark: could there be a Death Eater amongst them? He will need powerful magic and true friends as, with the help of Dumbledore, he investigates Voldemort’s darkest secrets.",
  },
  {
    isbn: "9781338878981",
    title: "Harry Potter and the Deathly Hallows",
    cover: "https://covers.openlibrary.org/b/id/13264803-M.jpg",
    publication_year: 2007,
    pages: 784,
    author_id: 1,
    genre_id: 1,
    description:
      "Harry Potter is leaving Privet Drive for the last time. But as he climbs into the sidecar of Hagrid’s motorbike and they take to the skies, he knows Lord Voldemort and the Death Eaters will not be far behind. The protective charm that has kept him safe until now is broken. But the Dark Lord is breathing fear into everything he loves. And he knows he can’t keep hiding. To stop Voldemort, Harry knows he must find the remaining Horcruxes and destroy them. He will have to face his enemy in one final battle.",
  },
  {
    isbn: "9781338132311",
    title: "Fantastic Beasts and Where to Find Them",
    cover: "https://covers.openlibrary.org/b/id/8474983-M.jpg",
    publication_year: 2001,
    pages: 128,
    author_id: 1,
    genre_id: 1,
    description:
      "The book 'Fantastic Beasts and Where to Find' is a copy of Harry Potter's textbook that was written by Newt Scamander, a magizoologist and fictional character from Series. The book has the same name as previously mentioned in the first novel of Harry Potter series, Harry Potter and the Sorcerer's Stone.",
  },
  {
    isbn: "9780451524935",
    title: "1984",
    cover: "https://covers.openlibrary.org/b/id/12054527-M.jpg",
    publication_year: 1949,
    pages: 328,
    author_id: 2,
    genre_id: 2,
    description:
      "A dystopian social science fiction novel by the English novelist George Orwell (the pen name of Eric Arthur Blair). It was published on 8 June 1949 by Secker & Warburg as Orwell's ninth and final book completed in his lifetime. Thematically, Nineteen Eighty-Four centres on the consequences of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviours within society. Orwell, himself a democratic socialist, modelled the authoritarian government in the novel after Stalinist Russia. More broadly, the novel examines the role of truth and facts within politics and the ways in which they are manipulated.",
  },
  {
    isbn: "9798308648314",
    title: "Animal Farm",
    cover: "https://images.isbndb.com/covers/22395403488706.jpg",
    publication_year: 1945,
    pages: 140,
    author_id: 2,
    genre_id: 2,
    description:
      "A brilliant political satire and a powerful and affecting story of revolutions and idealism, power and corruption. 'All animals are equal. But some animals are more equal than others.' Mr Jones of Manor Farm is so lazy and drunken that one day he forgets to feed his livestock. The ensuing rebellion under the leadership of the pigs Napoleon and Snowball leads to the animals taking over the farm. Vowing to eliminate the terrible inequities of the farmyard, the renamed Animal Farm is organised to benefit all who walk on four legs. But as time passes, the ideals of the rebellion are corrupted, then forgotten. And something new and unexpected emerges...",
  },
  {
    isbn: "9780735211292",
    title: "Atomic Habits",
    cover: "https://covers.openlibrary.org/b/id/12886417-M.jpg",
    publication_year: 2018,
    pages: 320,
    author_id: 3,
    genre_id: 3,
    description:
      "Learn how to make time for new habits (even when life gets crazy); overcome a lack of motivation and willpower; design your environment to make success easier; get back on track when you fall off course; ...and much more. Atomic Habits will reshape the way you think about progress and success, and give you the tools and strategies you need to transform your habits--whether you are a team looking to win a championship, an organization hoping to redefine an industry, or simply an individual who wishes to quit smoking, lose weight, reduce stress, or achieve any other goal.",
  },
  {
    isbn: "9780340797662",
    title: "The Shining",
    cover: "https://covers.openlibrary.org/b/id/15090478-M.jpg",
    publication_year: 1977,
    pages: 447,
    author_id: 4,
    genre_id: 4,
    description:
      "The Shining centers on the life of Jack Torrance, a struggling writer and recovering alcoholic who accepts a position as the off-season caretaker of the historic Overlook Hotel in the Colorado Rockies. His family accompanies him on this job, including his young son Danny Torrance, who possesses \"the shining\", an array of psychic abilities that allow Danny to see the hotel's horrific past. Soon, after a winter storm leaves them snowbound, the supernatural forces inhabiting the hotel influence Jack's sanity, leaving his wife and son in incredible danger.",
  },
  {
    isbn: "9781501142970",
    title: "It",
    cover: "https://covers.openlibrary.org/b/id/11886314-M.jpg",
    publication_year: 1986,
    pages: 1168,
    author_id: 4,
    genre_id: 4,
    description:
      '"It" is a 1986 horror novel by American author Stephen King. "It" was his 22nd book and his 17th novel written under his own name. The story follows the experiences of seven children as they are terrorized by an evil entity that exploits the fears of its victims to disguise itself while hunting its prey. "It" primarily appears in the form of Pennywise the Dancing Clown to attract its preferred prey of young children.',
  },
  {
    isbn: "9780450417399",
    title: "Misery",
    cover: "https://covers.openlibrary.org/b/id/14655205-M.jpg",
    publication_year: 2011,
    pages: 386,
    author_id: 4,
    genre_id: 5,
    description:
      "Novelist Paul Sheldon has plans to make the difficult transition from writing historical romances featuring heroine Misery Chastain to publishing literary fiction. Annie Wilkes, Sheldon's number one fan, rescues the author from the scene of a car accident. The former nurse takes care of him in her remote house, but becomes irate when she discovers that the author has killed Misery off in his latest book. Annie keeps Sheldon prisoner while forcing him to write a book that brings Misery back to life.",
  },
];
