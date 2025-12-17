import Arm from '../weapons/Arm.js';

export default class Player {
  constructor(position, name) {
    this.life = 100;
    this.magic = 20;
    this.speed = 1;
    this.attack = 10;
    this.agility = 5;
    this.luck = 10;
    this.description = 'Игрок';
    this.weapon = new Arm();

    this.position = position;
    this.name = name;

    this.weaponIndex = 0;
    this.weaponSequence = [Arm];

    this.initLife = this.life;
    this.initMagic = this.magic;
  }

  setWeaponSequence(sequence) {
    this.weaponSequence = sequence;
    this.weaponIndex = 0;
    const FirstWeapon = sequence[0];
    this.weapon = new FirstWeapon();
  }

  getLuck() {
    const randomNumber = Math.random() * 100;
    return (randomNumber + this.luck) / 100;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }

    const weaponDamage = this.weapon.getDamage();
    return ((this.attack + weaponDamage) * this.getLuck()) / distance;
  }

  takeDamage(damage) {
    this.life -= damage;

    if (this.life < 0) {
      this.life = 0;
    }
  }

  isDead() {
    return this.life === 0;
  }

  moveLeft(distance) {
    const step = Math.min(Math.abs(distance), this.speed);
    this.position -= step;
  }

  moveRight(distance) {
    const step = Math.min(Math.abs(distance), this.speed);
    this.position += step;
  }

  move(distance) {
    if (distance < 0) {
      this.moveLeft(-distance);
      return;
    }

    this.moveRight(distance);
  }

  isAttackBlocked() {
    return this.getLuck() > (100 - this.luck) / 100;
  }

  dodged() {
    return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
  }

  takeAttack(damage) {
    if (this.isAttackBlocked()) {
      this.weapon.takeDamage(damage);
      this.checkWeapon();
      return;
    }

    if (this.dodged()) {
      return;
    }

    this.takeDamage(damage);
    this.checkWeapon();
  }

  checkWeapon() {
    if (!this.weapon.isBroken()) {
      return;
    }

    if (this.weaponIndex >= this.weaponSequence.length - 1) {
      return;
    }

    this.weaponIndex += 1;
    const NextWeapon = this.weaponSequence[this.weaponIndex];
    this.weapon = new NextWeapon();
  }

  tryAttack(enemy) {
    const samePos = this.position === enemy.position;
    let distance = Math.abs(this.position - enemy.position);

    if (distance === 0) {
      distance = 1;
    }

    if (distance > this.weapon.range) {
      return;
    }

    this.weapon.takeDamage(10 * this.getLuck());
    this.checkWeapon();

    const damage = this.getDamage(distance);

    if (samePos) {
      enemy.moveRight(1);
      enemy.takeAttack(damage * 2);
      return;
    }

    enemy.takeAttack(damage);
  }

  chooseEnemy(players) {
    const alive = players.filter((p) => !p.isDead());
    const enemies = alive.filter((p) => p !== this);

    if (enemies.length === 0) {
      return this;
    }

    return enemies.reduce((minP, cur) => (cur.life < minP.life ? cur : minP), enemies[0]);
  }

  moveToEnemy(enemy) {
    const delta = enemy.position - this.position;

    if (delta > 0) {
      this.moveRight(delta);
      return;
    }

    if (delta < 0) {
      this.moveLeft(-delta);
    }
  }

  turn(players) {
    if (this.isDead()) {
      return;
    }

    const enemy = this.chooseEnemy(players);

    if (enemy === this) {
      return;
    }

    this.moveToEnemy(enemy);
    this.tryAttack(enemy);
  }
}
