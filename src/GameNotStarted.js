import React from 'react';
import GameModels from './Game/GameModels';
import GameObjectContext from './Context';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/styles';

import Draggable from 'react-draggable';

function PaperComponent(props) {
    return <Draggable cancel={'[class*="MuiDialogContent-root"]'}><Paper {...props} /></Draggable>;
}

const useStyles = makeStyles({ root: { cursor: "move" } });
function GameNotStarted() {
    const classes = useStyles();
    return (
        <GameObjectContext.Consumer>
            {({ gameEngine, gameState }) => (
                <Dialog open={!gameState || !gameState.IsPlaying} PaperComponent={PaperComponent}>
                    <DialogTitle className={classes.root}>Escolha uma dificuldade para iniciar o jogo!</DialogTitle>
                    <List>
                        {Object.keys(GameModels).map(level => (
                            <ListItem key={level} button onClick={() => gameEngine.Start(GameModels[level])}>
                                <ListItemText primary={level} />
                            </ListItem>
                        ))}
                    </List>
                </Dialog>
            )}
        </GameObjectContext.Consumer>
    );
} export default GameNotStarted;