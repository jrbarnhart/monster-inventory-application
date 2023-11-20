#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Monster = require("./models/monster");
const Family = require("./models/family");
const Skill = require("./models/skill");
const MonsterInstance = require("./models/monsterinstance");

const skills = [];
const families = [];
const monsters = [];
const monsterinstances = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createSkills();
  await createFamilies();
  await createMonsters();
  await createMonsterInstances();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function skillCreate(index, name, info, magic_cost) {
  const skill = new Skill({ name: name, info: info, magic_cost: magic_cost });
  await skill.save();
  skills[index] = skill;
  console.log(`Added skill: ${name}`);
}

async function familyCreate(index, name, info) {
  const family = new Family({ name: name, info: info });
  await family.save();
  families[index] = family;
  console.log(`Added family: ${name}`);
}

async function monsterCreate(index, name, family, info, innate_skills, stock) {
  const monster = new Monster({
    name: name,
    family: family,
    info: info,
    innate_skills: innate_skills,
    stock: stock,
  });
  await monster.save();
  monsters[index] = monster;
  console.log(`Added monster: ${name}`);
}

async function monsterInstanceCreate(
  index,
  monster,
  nickname,
  level,
  health,
  magic,
  attack,
  defense,
  agility,
  intelligence,
  gender,
  skills
) {
  const monsterinstance = new MonsterInstance({
    monster: monster,
    nickname: nickname,
    level: level,
    health: health,
    magic: magic,
    attack: attack,
    defense: defense,
    agility: agility,
    intelligence: intelligence,
    gender: gender,
    skills: skills,
  });
  await monsterinstance.save();
  monsterinstances[index] = monsterinstance;
  console.log(`Added monsterinstance: ${nickname}`);
}

async function createSkills() {
  console.log("Adding skills");
  await Promise.all([
    skillCreate(0, "Fireball", "Fire damage to all foes", 4),
    skillCreate(1, "Radiant", "Decrease physical hit chance of all foes", 2),
    skillCreate(2, "MegaMagic", "Highest Damage spell to all foes", 99),
    skillCreate(3, "FireAir", "Fire damage to all foes", 2),
    skillCreate(
      4,
      "FireSlash",
      "Normal attack based on Fire resistance of the foe",
      3
    ),
    skillCreate(
      5,
      "SuckAll",
      "Sucks in all attacks targeted at one ally for one turn",
      2
    ),
  ]);
}

async function createFamilies() {
  console.log("Adding families");
  await Promise.all([
    familyCreate(
      0,
      "Slime",
      "Slimes grow in an average way and tend to resist status effects"
    ),
    familyCreate(
      1,
      "Dragon",
      "Dragons grow in a slow manner and can resistant to fire"
    ),
  ]);
}

async function createMonsters() {
  console.log("Adding Monsters");
  await Promise.all([
    monsterCreate(
      0,
      "Slime",
      families[0],
      "The most abundant of this popular specie",
      [skills[0], skills[1], skills[2]],
      3
    ),
    monsterCreate(
      1,
      "Dragon",
      families[1],
      "The oldest living species of dragon",
      [skills[3], skills[4], skills[5]],
      2
    ),
  ]);
}

async function createMonsterInstances() {
  console.log("Adding authors");
  await Promise.all([
    monsterInstanceCreate(
      0,
      monsters[0],
      "Slib",
      4,
      19,
      24,
      17,
      20,
      31,
      27,
      "Male",
      [skills[0]]
    ),
    monsterInstanceCreate(
      1,
      monsters[1],
      "Dran",
      12,
      45,
      39,
      35,
      32,
      31,
      30,
      "Male",
      [skills[3], skills[4]]
    ),
  ]);
}
