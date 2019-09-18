import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { ArrowBack, ArrowForward, ArrowUpward, ArrowDownward, Pause, PlayArrow } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';

const buttonSize = 70;
const halfSize = buttonSize / 2;

const useStyles = makeStyles({ root: { position: "fixed", bottom: 0, right: 0, width: `${buttonSize * 3}px`, height: `${buttonSize * 3}px` } });
function Controller(props) {
    const classes = useStyles();
    const midPos = `calc(50% - ${halfSize}px)`;
    return (
        <div className={classes.root}>
            <CtrlButton Icon={<ArrowUpward />} Position={{ top: 0, left: midPos }} onClick={() => props.HandleInput(38)} />
            <CtrlButton Icon={<ArrowDownward />} Position={{ bottom: 0, left: midPos }} onClick={() => props.HandleInput(40)} />
            <CtrlButton Icon={<ArrowBack />} Position={{ left: 0, top: midPos }} onClick={() => props.HandleInput(37)} />
            <CtrlButton Icon={<ArrowForward />} Position={{ right: 0, top: midPos }} onClick={() => props.HandleInput(39)} />
            <CtrlButton Icon={props.IsPaused ? <PlayArrow /> : <Pause />} Position={{ left: midPos, top: midPos }} onClick={() => props.HandleInput(32)} />
        </div>
    );
} export default Controller;

function CtrlButton(props) {
    return (
        <Fab style={{ opacity: ".4", position: "absolute", width: `${buttonSize}px`, height: `${buttonSize}px`, ...props.Position }} onClick={props.onClick}>
            {props.Icon}
        </Fab>
    );
}