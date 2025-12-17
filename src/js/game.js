import { play as playBattle } from './battle/play.js';

import Archer from './characters/Archer.js';
import Warrior from './characters/Warrior.js';
import Mage from './characters/Mage.js';
import Dwarf from './characters/Dwarf.js';
import Crossbowman from './characters/Crossbowman.js';
import Demiurge from './characters/Demiurge.js';

export function play() {
  const app = document.getElementById('app') ?? document.body;
  app.innerHTML = '';

  const players = [
    new Warrior(0, 'Алёша'),
    new Archer(3, 'Леголас'),
    new Mage(6, 'Гендальф'),
    new Dwarf(1, 'Гимли'),
    new Crossbowman(4, 'Робин'),
    new Demiurge(8, 'Демиург')
  ];

  const winner = playBattle(players);

  const title = document.createElement('h1');
  title.textContent = 'RPG — королевская битва';

  const list = document.createElement('ul');
  players.forEach((p) => {
    const li = document.createElement('li');
    li.textContent = `${p.description} "${p.name}" — life: ${p.life}, magic: ${p.magic}, position: ${p.position}`;
    list.appendChild(li);
  });

  const result = document.createElement('p');
  result.textContent = winner
    ? `Победитель: ${winner.description} "${winner.name}"`
    : 'Победитель не определён (лимит раундов)';

  app.append(title, result, list);
}
