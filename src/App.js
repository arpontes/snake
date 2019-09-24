import React, { useState, useEffect } from 'react';
import GameEngine from './Game/GameEngine';

import GameObjectContext from './Context';
import Game from './Game';
import GameNotStarted from './GameNotStarted';
import Controller from './Controller';

const boardSizePx = Math.min(window.innerWidth - 20, 500);
function App() {
    const [gameState, setGameState] = useState(null);
    const [gameEngine, setGameEngine] = useState(null);
    const [showController, setShowController] = useState(false);

    useEffect(() => setGameEngine(new GameEngine(data => setGameState(data))), []);

    const isPlaying = gameState && gameState.IsPlaying;
    useEffect(() => {
        if (gameState && gameState.IsPlaying && !showController) {
            const handleInput = ev => gameEngine.HandleInput(ev.keyCode) && ev.preventDefault();
            window.addEventListener("keydown", handleInput);
            return () => window.removeEventListener("keydown", handleInput);
        }
    }, [isPlaying, showController]);

    return gameEngine &&
        <GameObjectContext.Provider value={{ gameEngine, gameState }}>
            <GameNotStarted ShowController={showController} OnSetShowController={show => setShowController(show)} />
            {gameState && <Game BoardSize={boardSizePx} />}
            {showController && isPlaying && <Controller IsPaused={gameState.IsPaused} />}
        </GameObjectContext.Provider>;
}
export default App;