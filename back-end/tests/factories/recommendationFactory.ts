import { faker } from "@faker-js/faker";

export const recommendations = [
  {
    id: 1,
    score: 11,
    name: faker.name.fullName(),
    youtubeLink: "https://www.youtube.com/watch?v=x9yop0nYR9g",
  },
  {
    id: 2,
    score: 5,
    name: faker.name.fullName(),
    youtubeLink: "https://www.youtube.com/watch?v=4LRJoKWgT9U",
  },
  {
    id: 3,
    score: -2,
    name: faker.name.fullName(),
    youtubeLink: "https://www.youtube.com/watch?v=V7UgPHjN9qE",
  },
  {
    id: 4,
    score: 20,
    name: faker.name.fullName(),
    youtubeLink: "https://www.youtube.com/watch?v=XqpQpt_cmhE",
  },
];
