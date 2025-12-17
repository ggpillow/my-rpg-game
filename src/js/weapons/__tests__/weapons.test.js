import Weapon from '../Weapon.js';
import Arm from '../Arm.js';
import Bow from '../Bow.js';
import Sword from '../Sword.js';
import Knife from '../Knife.js';
import Staff from '../Staff.js';
import LongBow from '../LongBow.js';
import Axe from '../Axe.js';
import StormStaff from '../StormStaff.js';

describe('Базовый класс Weapon', () => {
  test('Конструктор задаёт свойства и initDurability', () => {
    const w = new Weapon('Старый меч', 20, 10, 1);

    expect(w).toEqual({
      name: 'Старый меч',
      attack: 20,
      durability: 10,
      initDurability: 10,
      range: 1
    });
  });

  test('takeDamage уменьшает прочность и не опускает ниже 0', () => {
    const w = new Weapon('X', 1, 10, 1);

    w.takeDamage(5);
    expect(w.durability).toBe(5);

    w.takeDamage(50);
    expect(w.durability).toBe(0);
  });

  test('takeDamage игнорирует отрицательный урон', () => {
    const w = new Weapon('X', 1, 10, 1);
    w.takeDamage(-5);
    expect(w.durability).toBe(10);
    w.takeDamage(0);
    expect(w.durability).toBe(10);
  });

  test('getDamage возвращает полный урон при прочности >= 30%', () => {
    const w = new Weapon('X', 10, 100, 1);

    w.takeDamage(70);
    expect(w.durability).toBe(30);
    expect(w.getDamage()).toBe(10);
  });

  test('getDamage возвращает половину урона при прочности < 30% но > 0', () => {
    const w = new Weapon('X', 10, 100, 1);

    w.takeDamage(71);
    expect(w.getDamage()).toBe(5);
  });

  test('getDamage возвращает 0 при прочности 0', () => {
    const w = new Weapon('X', 10, 100, 1);

    w.takeDamage(200);
    expect(w.durability).toBe(0);
    expect(w.getDamage()).toBe(0);
  });

  test('isBroken возвращает true только при прочности 0', () => {
    const w = new Weapon('X', 10, 1, 1);

    expect(w.isBroken()).toBe(false);
    w.takeDamage(1);
    expect(w.isBroken()).toBe(true);
  });
});

describe('Классы-наследники оружия', () => {
  test('Arm: не изнашивается поэтому прочность Infinity', () => {
    const arm = new Arm();

    expect(arm.name).toBe('Рука');
    expect(arm.attack).toBe(1);
    expect(arm.durability).toBe(Infinity);
    expect(arm.initDurability).toBe(Infinity);
    expect(arm.range).toBe(1);

    arm.takeDamage(999);
    expect(arm.durability).toBe(Infinity);
  });

  test('характеристики Bow', () => {
    const bow = new Bow();
    expect(bow.name).toBe('Лук');
    expect(bow.attack).toBe(10);
    expect(bow.durability).toBe(200);
    expect(bow.initDurability).toBe(200);
    expect(bow.range).toBe(3);
  });

  test('характеристики Sword', () => {
    const sword = new Sword();
    expect(sword.name).toBe('Меч');
    expect(sword.attack).toBe(25);
    expect(sword.durability).toBe(500);
    expect(sword.range).toBe(1);
  });

  test('характеристики Knife', () => {
    const knife = new Knife();
    expect(knife.name).toBe('Нож');
    expect(knife.attack).toBe(5);
    expect(knife.durability).toBe(300);
    expect(knife.range).toBe(1);
  });

  test('характеристики Staff', () => {
    const staff = new Staff();
    expect(staff.name).toBe('Посох');
    expect(staff.attack).toBe(8);
    expect(staff.durability).toBe(300);
    expect(staff.range).toBe(2);
  });

  test('LongBow переопределяет атаку, дальность, имя, но сохраняет прочность', () => {
    const lb = new LongBow();
    expect(lb.name).toBe('Длинный лук');
    expect(lb.attack).toBe(15);
    expect(lb.range).toBe(4);
    expect(lb.durability).toBe(200);
    expect(lb.initDurability).toBe(200);
  });

  test('Axe переопределяет атаку/имя и прочность (800)', () => {
    const axe = new Axe();
    expect(axe.name).toBe('Секира');
    expect(axe.attack).toBe(27);
    expect(axe.range).toBe(1);
    expect(axe.durability).toBe(800);
    expect(axe.initDurability).toBe(800);
  });

  test('StormStaff переопределяет имя/атаку/дальность, но сохраняет прочность', () => {
    const ss = new StormStaff();
    expect(ss.name).toBe('Посох Бури');
    expect(ss.attack).toBe(10);
    expect(ss.range).toBe(3);
    expect(ss.durability).toBe(300);
    expect(ss.initDurability).toBe(300);
  });
});
