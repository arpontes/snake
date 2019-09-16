export default function GameConfig(boardSize, speed, initialSnake, walls) {
    this.GetSize = () => boardSize;
    this.GetSpeed = () => speed;
    this.GetInitialSnake = () => initialSnake;
    this.GetWalls = () => walls;
}