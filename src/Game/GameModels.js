import GameConfig from './GameConfig';

var medHardInitialSnake = [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }];
var allRange = [...Array(20).keys()];
var medWalls = allRange.map(i => ({ x: 0, y: i }))
    .concat(allRange.map(i => ({ x: i, y: 0 })))
    .concat(allRange.map(i => ({ x: 19, y: i })))
    .concat(allRange.map(i => ({ x: i, y: 19 })))
    .concat(allRange.filter(x => x > 5 && x < 15).map(i => ({ x: 9, y: i })))
    .filter((value, index, self) => self.indexOf(value) === index);

var hardWalls = allRange.filter(x => x < 8 || x > 12).map(i => ({ x: 0, y: i }))
    .concat(allRange.map(i => ({ x: i, y: 0 })))
    .concat(allRange.filter(x => x < 8 || x > 12).map(i => ({ x: 19, y: i })))
    .concat(allRange.map(i => ({ x: i, y: 19 })))
    .concat(allRange.filter(x => x > 8 && x < 16).map(i => ({ x: 5, y: i })))
    .concat(allRange.filter(x => x > 4 && x < 12).map(i => ({ x: 15, y: i })));

function getUniqueData(arr) {
    var arrFirstAppearanceItem = arr.map(x => `${x.x}-${x.y}`).map((value, idx, self) => self.indexOf(value) === idx);
    return arr.filter((_, idx) => arrFirstAppearanceItem[idx]);
}

const GameModels = {
    "Fácil": new GameConfig(20, .15, [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }], []),
    "Médio": new GameConfig(20, .1, [...medHardInitialSnake], getUniqueData(medWalls)),
    "Difícil": new GameConfig(20, .08, [...medHardInitialSnake], getUniqueData(hardWalls))
};

export default GameModels;