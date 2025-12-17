import Warrior from './Warrior.js';
import Axe from '../weapons/Axe.js';
import Knife from '../weapons/Knife.js';
import Arm from '../weapons/Arm.js';

export default class Dwarf extends Warrior {
  constructor(position, name) {
    super(position, name);

    this.life = 130;
    this.attack = 15;
    this.luck = 20;
    this.description = 'Гном';

    this.setWeaponSequence([Axe, Knife, Arm]);

    this.initLife = this.life;
    this.hitsTaken = 0;
  }

  takeDamage(damage) {
    this.hitsTaken += 1;

    const sixthHit = this.hitsTaken % 6 === 0;

    if (sixthHit && this.getLuck() > 0.5) {
      super.takeDamage(damage / 2);
      return;
    }

    super.takeDamage(damage);
  }
}
