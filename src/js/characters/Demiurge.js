import Mage from './Mage.js';
import StormStaff from '../weapons/StormStaff.js';
import Knife from '../weapons/Knife.js';
import Arm from '../weapons/Arm.js';

export default class Demiurge extends Mage {
  constructor(position, name) {
    super(position, name);

    this.life = 80;
    this.magic = 120;
    this.attack = 6;
    this.luck = 12;
    this.description = 'Демиург';

    this.setWeaponSequence([StormStaff, Knife, Arm]);

    this.initLife = this.life;
    this.initMagic = this.magic;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }

    const weaponDamage = this.weapon.getDamage();
    const luckCoef = this.getLuck();

    let damage = ((this.attack + weaponDamage) * luckCoef) / distance;

    if (this.magic > 0 && luckCoef > 0.6) {
      damage *= 1.5;
    }

    return damage;
  }
}
