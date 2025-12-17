import Player from './Player.js';
import Staff from '../weapons/Staff.js';
import Knife from '../weapons/Knife.js';
import Arm from '../weapons/Arm.js';

export default class Mage extends Player {
  constructor(position, name) {
    super(position, name);

    this.life = 70;
    this.magic = 100;
    this.attack = 5;
    this.agility = 8;
    this.description = 'Маг';

    this.setWeaponSequence([Staff, Knife, Arm]);

    this.initLife = this.life;
    this.initMagic = this.magic;
  }

  takeDamage(damage) {
    const highMana = this.magic > this.initMagic / 2;

    if (highMana) {
      super.takeDamage(damage / 2);
      this.magic -= 12;
      if (this.magic < 0) {
        this.magic = 0;
      }
      return;
    }

    super.takeDamage(damage);
  }
}
