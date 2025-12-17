import Player from './Player.js';
import Bow from '../weapons/Bow.js';
import Knife from '../weapons/Knife.js';
import Arm from '../weapons/Arm.js';

export default class Archer extends Player {
  constructor(position, name) {
    super(position, name);

    this.life = 80;
    this.magic = 35;
    this.attack = 5;
    this.agility = 10;
    this.description = 'Лучник';

    this.setWeaponSequence([Bow, Knife, Arm]);

    this.initLife = this.life;
    this.initMagic = this.magic;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }

    const weaponDamage = this.weapon.getDamage();
    const weaponRange = this.weapon.range;

    return ((this.attack + weaponDamage) * this.getLuck() * distance) / weaponRange;
  }
}
