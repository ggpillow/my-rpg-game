const characters = [
    {name: 'мечник', helath: 10},
    {name: 'маг', helath: 100},
    {name: 'маг', helath: 0},
    {name: 'лучник', helath: 0},
];

const alive = characters.filter(item => item.helth > 0);