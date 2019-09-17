import React from 'react';
import GameObjectContext from './Context';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/styles';

import imgApple from './images/apple.png';
import imgSnakeHead from './images/head.png';

const blockStyles = {
    wallBlock: { borderRadius: "0", backgroundColor: "gray" },
    apple: { borderColor: "transparent", backgroundImage: `url(${imgApple})`, backgroundRepeat: "no-repeat", backgroundSize: "contain" },
    snakeBody: { borderColor: "#34560f", backgroundColor: "#89b929", transform: "scale(.9)" }
};
const snakeHead = {
    ...blockStyles.snakeBody,
    borderColor: "transparent",
    backgroundColor: "transparent",
    backgroundImage: `url(${imgSnakeHead})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "4px center"
};
const Direction = {
    "Top": { ...snakeHead, transform: "scale(1.8) rotate(-90deg)" },
    "Bottom": { ...snakeHead, transform: "scale(1.8) rotate(90deg)" },
    "Left": { ...snakeHead, transform: "scale(1.8) rotate(-180deg)" },
    "Right": { ...snakeHead, transform: "scale(1.8)" }
};

const useGameStyles = makeStyles({ root: { position: "relative", border: "1px solid lightgray" } });
export default function Game(props) {
    const classes = useGameStyles();

    return (
        <GameObjectContext.Consumer>
            {({ gameState }) => {
                const cfg = gameState.GameConfig;
                const size = props.BoardSize / cfg.GetSize();

                const buildSnakeClassObject = isHead => isHead ? gameState.Direction : "snakeBody";
                return (
                    <>
                        <StateBar gameState={gameState} />
                        <div className={classes.root} style={{ width: `${props.BoardSize}px`, height: `${props.BoardSize}px` }}>
                            {cfg.GetWalls().map((point, idx) => <Block key={idx} size={size} point={point} className="wallBlock" />)}
                            {gameState.Snake.map((point, idx) => <Block key={idx} size={size} point={point} className={buildSnakeClassObject(idx === 0)} />)}
                            {gameState.Apple && <Block size={size} point={gameState.Apple} className="apple" />}
                        </div>
                    </>
                );
            }}
        </GameObjectContext.Consumer>
    );
}


const useBlockStyles = makeStyles({
    root: { position: "absolute", borderWidth: "1px", borderStyle: "solid", borderRadius: "50%" },
    ...blockStyles,
    ...Direction
});
function Block(props) {
    const size = `${props.size}px`;
    const rect = { width: size, height: size, left: `${props.point.x * props.size}px`, top: `${props.point.y * props.size}px` };
    const classes = useBlockStyles();

    return <div className={`${classes.root} ${classes[props.className]}`} style={rect} />;
}


const useStateBarStyles = makeStyles({ root: { display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" } });
function StateBar(props) {
    const gameState = props.gameState;
    const points = Math.floor(gameState.TotalFrames * gameState.GameConfig.GetSpeed());
    const classes = useStateBarStyles();

    return (
        <div className={classes.root}>
            <Typography variant="subtitle2">Pontos: {points}</Typography>
            {gameState.HasCollision && <Typography variant="h6">Você perdeu!</Typography>}
            {(gameState.IsPaused || gameState.IsPlaying) && <Typography variant="subtitle2">{gameState.IsPaused ? "Pausado" : "Jogando"}</Typography>}
        </div>
    );
}