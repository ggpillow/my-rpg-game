import Player from '../Player.js';
import Warrior from '../Warrior.js';
import Archer from '../Archer.js';
import Mage from '../Mage.js';
import Dwarf from '../Dwarf.js';
import Crossbowman from '../Crossbowman.js';
import Demiurge from '../Demiurge.js';

import Knife from '../../weapons/Knife.js';
import Arm from '../../weapons/Arm.js';

describe('Базовый класс Player', () => {
  test('конструктор задаёт значения по умолчанию', () => {
    const p = new Player(10, 'Тест');

    expect(p.life).toBe(100);
    expect(p.magic).toBe(20);
    expect(p.speed).toBe(1);
    expect(p.attack).toBe(10);
    expect(p.agility).toBe(5);
    expect(p.luck).toBe(10);
    expect(p.position).toBe(10);
    expect(p.name).toBe('Тест');
  });

  test('setWeaponSequence сбрасывает индекс и выдаёт первое оружие', () => {
    const p = new Player(0, 'P');
    p.setWeaponSequence([Knife, Arm]);

    expect(p.weaponIndex).toBe(0);
    expect(p.weapon).toBeInstanceOf(Knife);
  });

  test('getDamage возвращает 0, если цель вне дальности оружия', () => {
    const p = new Player(0, 'П');
    jest.spyOn(p, 'getLuck').mockReturnValue(1);

    expect(p.getDamage(2)).toBe(0);
  });

  test('takeDamage не опускает life ниже 0 и isDead работает корректно', () => {
    const p = new Player(0, 'P');

    p.takeDamage(1000);
    expect(p.life).toBe(0);
    expect(p.isDead()).toBe(true);
  });

  test('moveLeft/moveRight ограничены значением speed', () => {
    const w = new Warrior(6, 'Алёша');

    w.moveLeft(5);
    expect(w.position).toBe(4);

    w.moveRight(10);
    expect(w.position).toBe(6);
  });

  test('move() двигает влево/вправо и учитывает speed', () => {
    const w = new Warrior(5, 'W');

    w.move(-10);
    expect(w.position).toBe(3);

    w.move(10);
    expect(w.position).toBe(5);
  });

  test('isAttackBlocked возвращает false при низкой удаче', () => {
    const p = new Player(0, 'P');
    jest.spyOn(p, 'getLuck').mockReturnValue(0);

    expect(p.isAttackBlocked()).toBe(false);
  });

  test('dodged возвращает false при низкой удаче', () => {
    const p = new Player(0, 'P');
    jest.spyOn(p, 'getLuck').mockReturnValue(0);

    expect(p.dodged()).toBe(false);
  });

  test('takeAttack: при блоке урон идёт по оружию и вызывается checkWeapon', () => {
    const w = new Warrior(0, 'Def');
    const lifeBefore = w.life;
    const durabilityBefore = w.weapon.durability;

    jest.spyOn(w, 'getLuck').mockReturnValue(0.95);

    w.takeAttack(10);

    expect(w.life).toBe(lifeBefore);
    expect(w.weapon.durability).toBe(durabilityBefore - 10);
  });

  test('takeAttack: при уклонении урона нет', () => {
    const p = new Player(0, 'P');

    p.luck = 0;
    p.agility = 90;
    jest.spyOn(p, 'getLuck').mockReturnValue(0.6);

    const before = p.life;
    p.takeAttack(50);
    expect(p.life).toBe(before);
  });

  test('takeAttack: обычный урон проходит, если нет блока и уклонения', () => {
    const p = new Player(0, 'P');
    jest.spyOn(p, 'isAttackBlocked').mockReturnValue(false);
    jest.spyOn(p, 'dodged').mockReturnValue(false);

    p.takeAttack(15);
    expect(p.life).toBe(85);
  });

  test('checkWeapon: если оружие не сломано — ничего не меняется', () => {
    const w = new Warrior(0, 'W');
    const current = w.weapon;

    w.checkWeapon();
    expect(w.weapon).toBe(current);
  });

  test('checkWeapon: если последовательность закончилась — дальше не деградирует', () => {
    const p = new Player(0, 'P');
    p.weapon.durability = 0;

    p.checkWeapon();
    expect(p.weapon).toBeInstanceOf(Arm);
    expect(p.weaponIndex).toBe(0);
  });

  test('checkWeapon: у Warrior оружие падает Sword -> Knife -> Arm', () => {
    const w = new Warrior(0, 'W');

    w.weapon.durability = 0;
    w.checkWeapon();
    expect(w.weapon).toBeInstanceOf(Knife);

    w.weapon.durability = 0;
    w.checkWeapon();
    expect(w.weapon).toBeInstanceOf(Arm);
  });

  test('tryAttack: если далеко — атака не проходит', () => {
    const a = new Player(0, 'A');
    const e = new Player(10, 'E');

    const spy = jest.spyOn(e, 'takeAttack');
    a.tryAttack(e);

    expect(spy).not.toHaveBeenCalled();
  });

  test('tryAttack: обычная атака (не в одной клетке) наносит урон', () => {
    const attacker = new Warrior(0, 'A');
    const enemy = new Player(1, 'E');

    jest.spyOn(attacker, 'getLuck').mockReturnValue(1);
    jest.spyOn(enemy, 'isAttackBlocked').mockReturnValue(false);
    jest.spyOn(enemy, 'dodged').mockReturnValue(false);

    attacker.tryAttack(enemy);

    expect(enemy.position).toBe(1);
    expect(enemy.life).toBe(65);
  });

  test('tryAttack: если в одной клетке — отбрасывание и двойной урон', () => {
    const attacker = new Warrior(0, 'A');
    const enemy = new Player(0, 'E');

    jest.spyOn(attacker, 'getLuck').mockReturnValue(1);
    jest.spyOn(enemy, 'isAttackBlocked').mockReturnValue(false);
    jest.spyOn(enemy, 'dodged').mockReturnValue(false);

    attacker.tryAttack(enemy);

    expect(enemy.position).toBe(1);
    expect(enemy.life).toBe(30);
  });

  test('chooseEnemy выбирает живого врага с минимальным life', () => {
    const me = new Player(0, 'Me');
    const p1 = new Player(1, 'P1');
    const p2 = new Player(2, 'P2');
    const p3 = new Player(3, 'P3');

    p1.life = 90;
    p2.life = 10;
    p3.life = 0;

    const chosen = me.chooseEnemy([me, p1, p2, p3]);
    expect(chosen).toBe(p2);
  });

  test('chooseEnemy возвращает самого себя, если врагов нет', () => {
    const me = new Player(0, 'Me');
    const chosen = me.chooseEnemy([me]);

    expect(chosen).toBe(me);
  });

  test('turn ничего не делает, если игрок мёртв', () => {
    const me = new Player(0, 'Me');
    me.life = 0;

    const spyMove = jest.spyOn(me, 'moveToEnemy');
    const spyAttack = jest.spyOn(me, 'tryAttack');

    me.turn([me]);

    expect(spyMove).not.toHaveBeenCalled();
    expect(spyAttack).not.toHaveBeenCalled();
  });

  test('turn ничего не делает, если на поле нет врагов', () => {
    const me = new Player(0, 'Me');

    const spyMove = jest.spyOn(me, 'moveToEnemy');
    const spyAttack = jest.spyOn(me, 'tryAttack');

    me.turn([me]);

    expect(spyMove).not.toHaveBeenCalled();
    expect(spyAttack).not.toHaveBeenCalled();
  });
});

describe('Классы: базовые проверки', () => {
  test('Archer: базовые характеристики соответствуют ожиданиям', () => {
    const a = new Archer(0, 'Лучник');

    expect(a.life).toBe(80);
    expect(a.magic).toBe(35);
    expect(a.attack).toBe(5);
    expect(a.agility).toBe(10);
    expect(a.description).toBe('Лучник');
  });

  test('Crossbowman: базовые характеристики соответствуют ожиданиям', () => {
    const c = new Crossbowman(0, 'Арбалетчик');

    expect(c.life).toBe(85);
    expect(c.description).toBe('Арбалетчик');
  });
});

describe('Механики классов', () => {
  test('Warrior: при low hp и luck>0.8 урон сначала уходит в magic', () => {
    const w = new Warrior(0, 'Воин');
    w.life = 50;
    w.magic = 20;

    jest.spyOn(w, 'getLuck').mockReturnValue(0.9);

    w.takeDamage(5);
    expect(w.life).toBe(50);
    expect(w.magic).toBe(15);
  });

  test('Warrior: если урон больше magic — остаток уходит в life', () => {
    const w = new Warrior(0, 'W');
    w.life = 50;
    w.magic = 10;

    jest.spyOn(w, 'getLuck').mockReturnValue(0.9);

    w.takeDamage(20);
    expect(w.magic).toBe(0);
    expect(w.life).toBe(40);
  });

  test('Mage: при высокой мане получает половину урона и теряет 12 маны', () => {
    const m = new Mage(0, 'Маг');
    jest.spyOn(m, 'getLuck').mockReturnValue(0.1);

    m.takeDamage(20);
    expect(m.life).toBe(60);
    expect(m.magic).toBe(88);
  });

  test('Mage: мана не уходит ниже 0 (срабатывает ограничитель)', () => {
    const m = new Mage(0, 'M');
    m.initMagic = 10;
    m.magic = 6;

    m.takeDamage(10);

    expect(m.magic).toBe(0);
    expect(m.life).toBe(65);
  });

  test('Mage: при низкой мане получает полный урон и мана не уменьшается на 12', () => {
    const m = new Mage(0, 'M');
    m.magic = 40;

    m.takeDamage(20);

    expect(m.life).toBe(50);
    expect(m.magic).toBe(40);
  });

  test('Archer: getDamage возвращает 0 вне дальности оружия', () => {
    const a = new Archer(0, 'A');
    expect(a.getDamage(999)).toBe(0);
  });

  test('Archer: формула урона учитывает distance и weaponRange', () => {
    const a = new Archer(0, 'A');
    jest.spyOn(a, 'getLuck').mockReturnValue(1);
    expect(a.getDamage(2)).toBeCloseTo(10, 5);
  });

  test('Dwarf: каждый 6-й удар может быть в 2 раза слабее при luck>0.5', () => {
    const d = new Dwarf(0, 'Гном');
    jest.spyOn(d, 'getLuck').mockReturnValue(0.6);

    for (let i = 0; i < 5; i += 1) {
      d.takeDamage(10);
    }

    d.takeDamage(10);
    expect(d.life).toBe(130 - 55);
  });

  test('Demiurge: урон x1.5 при mana>0 и luck>0.6', () => {
    const de = new Demiurge(0, 'Демиург');
    jest.spyOn(de, 'getLuck').mockReturnValue(0.7);

    const dmg = de.getDamage(1);
    expect(dmg).toBeCloseTo(16.8, 5);
  });

  test('Demiurge: если magic = 0, множитель 1.5 не применяется', () => {
    const de = new Demiurge(0, 'D');
    de.magic = 0;

    jest.spyOn(de, 'getLuck').mockReturnValue(0.7);
    expect(de.getDamage(1)).toBeCloseTo(11.2, 5);
  });

  test('Demiurge: getDamage возвращает 0 вне дальности оружия', () => {
    const de = new Demiurge(0, 'D');
    expect(de.getDamage(999)).toBe(0);
  });
});
