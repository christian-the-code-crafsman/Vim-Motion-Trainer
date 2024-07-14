import { useCallback, useState } from 'react';
import Terminal from './Terminal';

type XYPos = { x: number, y: number };
type VimMode = "normal" | "insert";

type VimState = {
    cursorPos: XYPos;
    vimMode: VimMode;
    bufferContent: string[];
    furthestX: number;
};

const CONTENTS = [
    "What am I doing here?",
    "I'm kinda getting more and more bored",
    "But I'm getting work done and that's also fulfilling",
    "Lorem Ipsum",
    "Ladidah",
];

function createKeydownHandler(vimState: VimState, setVimState: React.Dispatch<React.SetStateAction<VimState>>) {

    function moveCursorHorizontal(x: number) {
        x = Math.min(Math.max(x, 1), vimState.bufferContent[vimState.cursorPos.y - 1].length);

        setVimState((vimState: VimState) => ({
            ...vimState,
            cursorPos: { x: x, y: vimState.cursorPos.y },
            furthestX: x,
        } as VimState));
    }

    function moveCursorVertical(y: number) {
        y = Math.min(Math.max(y, 1), vimState.bufferContent.length);
        let x = Math.min(vimState.furthestX, vimState.bufferContent[y - 1].length);
        let furthestX = Math.max(vimState.furthestX, x);

        setVimState((vimState: VimState) => ({
            ...vimState,
            cursorPos: { x: x, y: y },
            furthestX: furthestX,
        } as VimState));

    }

    return (e: React.KeyboardEvent) => {
        e.preventDefault();
        switch (e.key) {
            case "h":
                moveCursorHorizontal(vimState.cursorPos.x - 1);
                break;
            case "j":
                moveCursorVertical(vimState.cursorPos.y + 1);
                break;
            case "k":
                moveCursorVertical(vimState.cursorPos.y - 1);
                break;
            case "l":
                moveCursorHorizontal(vimState.cursorPos.x + 1);
                break;
        }
    };
}

function VimTerminal() {
    const [vimState, setVimState] = useState({
        cursorPos: { x: 1, y: 1 },
        furthestX: 1,
        vimMode: "normal",
        bufferContent: CONTENTS,
    } as VimState);

    const keydownHandler = useCallback(createKeydownHandler(vimState, setVimState), [vimState]);

    return (
        <Terminal
            terminalContent={vimState.bufferContent}
            cursorPos={{ x: vimState.cursorPos.x - 1, y: vimState.cursorPos.y - 1 }}
            onKeyDown={keydownHandler} />
    );
}

export default VimTerminal;
