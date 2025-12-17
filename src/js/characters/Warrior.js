import Player from './Player.js';
import Sword from '../weapons/Sword.js';
import Knife from '../weapons/Knife.js';
import Arm from '../weapons/Arm.js';

export default class Warrior extends Player {
  constructor(position, name) {
    super(position, name);

    this.life = 120;
    this.speed = 2;
    this.description = 'Воин';
    this.attack = 10;

    this.setWeaponSequence([Sword, Knife, Arm]);

    this.initLife = this.life;
    this.initMagic = this.magic;
  }

  takeDamage(damage) {
    const lowHp = this.life < this.initLife / 2;
    const lucky = this.getLuck() > 0.8;

    if (lowHp && lucky && this.magic > 0) {
      const left = damage - this.magic;
      if (left > 0) {
        this.magic = 0;
        super.takeDamage(left);
      } else {
        this.magic -= damage;
      }
      return;
    }

    super.takeDamage(damage);
  }
}
