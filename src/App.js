import React, { useState, useEffect } from 'react';
import GameEngine from './Game/GameEngine';

import GameObjectContext from './Context';
import Game from './Game';
import GameNotStarted from './GameNotStarted';
import Controller from './Controller';

import { makeStyles } from '@material-ui/styles';

const boardSizePx = Math.min(window.innerWidth, 500);
const useStyles = makeStyles({ root: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" } });
function App() {
    const [gameState, setGameState] = useState(null);
    const [gameEngine, setGameEngine] = useState(null);

    useEffect(() => setGameEngine(new GameEngine(data => setGameState(data))), []);

    const isPlaying = gameState && gameState.IsPlaying;
    useEffect(() => {
        if (gameState && gameState.IsPlaying) {
            const handleInput = ev => gameEngine.HandleInput(ev.keyCode) && ev.preventDefault();
            window.addEventListener("keydown", handleInput);
            return () => window.removeEventListener("keydown", handleInput);
        }
    }, [isPlaying]);

    const classes = useStyles();

    return gameEngine &&
        <GameObjectContext.Provider value={{ gameEngine, gameState }}>
            <div className={classes.root} style={{ width: `${boardSizePx}px` }}>
                <GameNotStarted />
            {gameState && <Game BoardSize={boardSizePx} />}
            {isPlaying && <Controller IsPaused={gameState.IsPaused} HandleInput={gameEngine.HandleInput} />}
            </div>
        </GameObjectContext.Provider>;
}
export default App;