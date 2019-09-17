function GameConfig(boardSize, speed, initialSnake, walls) {
    this.GetSize = () => boardSize;
    this.GetSpeed = () => speed;
    this.GetInitialSnake = () => initialSnake;
    this.GetWalls = () => walls;
}

const Direction = { Bottom: "Bottom", Top: "Top", Left: "Left", Right: "Right" };
function GameEngine(fnDraw) {
    var cfg, snake, apple, movements, hasCollision, isPlaying, isPaused, totalFrames;
    var tmr, startDateTime, lastTriedMovement = null;
    this.HandleInput = function (key) {
        if (!isPlaying) return;
        if (isPaused && key !== 32)
            return false;

        switch (key) {
            case 32: pauseContinue(!isPaused); return true;
            case 38: lastTriedMovement = Direction.Top; return true;
            case 40: lastTriedMovement = Direction.Bottom; return true;
            case 37: lastTriedMovement = Direction.Left; return true;
            case 39: lastTriedMovement = Direction.Right; return true;
            default: return false;
        }
    };
    this.Start = function (gameCfg) {
        totalFrames = -1;
        cfg = gameCfg;
        snake = [...gameCfg.GetInitialSnake()];
        apple = null;
        movements = [Direction.Right];
        hasCollision = false;
        isPlaying = true;
        isPaused = false;

        startDateTime = new Date();
        update();
    };

    function pauseContinue(pause) {
        if (!isPlaying)
            return;

        isPaused = pause;
        if (!isPaused)
            update();
        else {
            window.clearTimeout(tmr);
            fnDraw(getGameData());
        }
    }

    function getLastMovement() {
        var lastCommitedMovement = movements[movements.length - 1];

        if (lastTriedMovement == null)
            return lastCommitedMovement;

        if ((lastTriedMovement === Direction.Top || lastTriedMovement === Direction.Bottom) && lastCommitedMovement !== Direction.Bottom && lastCommitedMovement !== Direction.Top)
            movements.push(lastTriedMovement);
        else if ((lastTriedMovement === Direction.Left || lastTriedMovement === Direction.Right) && lastCommitedMovement !== Direction.Left && lastCommitedMovement !== Direction.Right)
            movements.push(lastTriedMovement);
        lastTriedMovement = null;

        return movements[movements.length - 1];
    }

    function update() {
        totalFrames++;
        if (totalFrames > 0) {
            var head = { ...snake[0] };
            var tail = snake[snake.length - 1];
            var walls = cfg.GetWalls();
            var size = cfg.GetSize();

            var lastMovement = getLastMovement();
            if (lastMovement === Direction.Left)
                head.x--;
            else if (lastMovement === Direction.Right)
                head.x++;
            else if (lastMovement === Direction.Top)
                head.y--;
            else if (lastMovement === Direction.Bottom)
                head.y++;

            if (head.x < 0) head.x = size - 1;
            else if (head.x === size) head.x = 0;

            if (head.y < 0) head.y = size - 1;
            else if (head.y === size) head.y = 0;

            for (var i = snake.length - 1; i > 0; i--)
                snake[i] = snake[i - 1];

            hasCollision = detectCollision(head, snake.concat(walls));

            snake[0] = head;

            if (hasCollision)
                isPlaying = false;
            else {
                if (apple != null && head.x === apple.x && head.y === apple.y) {
                    snake.push(tail);
                    apple = null;
                }

                if (apple == null && Math.floor(new Date().getSeconds()) % 4 === 0) {
                    var newApple = createRandomApple(size, snake.concat(walls));
                    if (newApple)
                        apple = newApple;
                }
            }
        }

        fnDraw(getGameData());

        if (isPlaying) {
            var timeout = cfg.GetSpeed() * 1000;
            //A cada 30 segundos, aumenta em 10% a velocidade inicial.
            var speedFactor = (Math.floor(new Date().getTime() - startDateTime.getTime()) / 30000 * .1);
            timeout = timeout - (timeout * speedFactor);
            tmr = window.setTimeout(update, timeout);
        }
    }
    function getGameData() {
        return { GameConfig: cfg, Direction: getLastMovement(), Snake: snake, Apple: apple, HasCollision: hasCollision, IsPlaying: isPlaying, IsPaused: isPaused, TotalFrames: totalFrames };
    }
    function createRandomApple(size, invalidPoints) {
        for (var i = 0; i < 5; i++) {
            var newApplePos = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) };
            if (!detectCollision(newApplePos, invalidPoints))
                return newApplePos;
        }
        return false;
    }
    function detectCollision(el, invalidPoints) {
        for (var i = 0; i < invalidPoints.length; i++)
            if (invalidPoints[i].x === el.x && invalidPoints[i].y === el.y)
                return true;
        return false;
    }
}


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
