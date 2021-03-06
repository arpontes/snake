﻿import React, { useContext } from 'react';
import GameObjectContext from './Context';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/styles';

import imgApple from './images/apple.png';
import imgSnakeHead from './images/head.png';

const useGameStyles = makeStyles({
    root: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    board: { position: "relative", border: "1px solid lightgray" }
});
export default function Game(props) {
    const classes = useGameStyles();
    const { gameState } = useContext(GameObjectContext);

    const cfg = gameState.GameConfig;
    const size = props.BoardSize / cfg.GetSize();

    return (
        <div className={classes.root} style={{ width: `${props.BoardSize}px` }}>
            <StateBar />
            <div className={classes.board} style={{ width: `${props.BoardSize}px`, height: `${props.BoardSize}px` }}>
                {cfg.GetWalls().map((point, idx) => <Block key={idx} size={size} point={point} classNames={["wallBlock"]} />)}
                {gameState.Snake.map((point, idx) => <Block key={idx} size={size} point={point}
                    classNames={["snakeBody"].concat(idx === 0 ? ["snakeHead", gameState.Direction] : [])} />)}
                {gameState.Apple && <Block size={size} point={gameState.Apple} classNames={["apple"]} />}
            </div>
        </div>
    );
}


const useBlockStyles = makeStyles({
    root: { position: "absolute", borderWidth: "1px", borderStyle: "solid", borderRadius: "50%" },
    wallBlock: { borderRadius: "0", backgroundColor: "gray" },
    apple: { borderColor: "transparent", backgroundImage: `url(${imgApple})`, backgroundRepeat: "no-repeat", backgroundSize: "contain" },
    snakeBody: { borderColor: "#34560f", backgroundColor: "#89b929", transform: "scale(.9)" },
    snakeHead: {
        borderColor: "transparent",
        backgroundColor: "transparent",
        backgroundImage: `url(${imgSnakeHead})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "4px center"
    },
    Top: { transform: "scale(1.8) rotate(-90deg)" },
    Bottom: { transform: "scale(1.8) rotate(90deg)" },
    Left: { transform: "scale(1.8) rotate(-180deg)" },
    Right: { transform: "scale(1.8)" }
});
function Block(props) {
    const size = `${props.size}px`;
    const rect = { width: size, height: size, left: `${props.point.x * props.size}px`, top: `${props.point.y * props.size}px` };
    const classes = useBlockStyles();

    return <div className={`${classes.root} ${props.classNames.map(x => classes[x]).join(" ")}`} style={rect} />;
}


const useStateBarStyles = makeStyles({ root: { display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" } });
function StateBar() {
    const { gameEngine, gameState } = useContext(GameObjectContext);
    const points = Math.floor(gameState.TotalFrames * gameState.GameConfig.GetSpeed());
    const classes = useStateBarStyles();

    return (
        <div className={classes.root}>
            <Typography variant="subtitle2">Pontos: {points}</Typography>
            {gameState.GameOver && <Typography variant="h6">Você perdeu!</Typography>}
            {!gameState.GameOver && gameState.IsPlaying && <Button color="secondary" onClick={() => gameEngine.Stop()}>Desistir</Button>}
            {(gameState.IsPaused || gameState.IsPlaying) && <Typography variant="subtitle2">{gameState.IsPaused ? "Pausado" : "Jogando"}</Typography>}
        </div>
    );
}