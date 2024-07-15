import { useCallback, useState } from 'react';
import Terminal from './Terminal';
import { PrefixTree } from './PrefixTree';

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

type VimMotion = "up" | "down" | "left" | "right" | "beginning of line" | "end of line" | "insert before" | "insert after" | "insert at first nonblank" | "insert at end of line";
const MOTION_BINDINGS = new Map<string, VimMotion>(Object.entries({
    "h": "left",
    "j": "down",
    "k": "up",
    "l": "right",
    "i": "insert before",
    "a": "insert after",
    "I": "insert at first nonblank",
    "A": "insert at end of line",
}));

class Buffer {
    bufferContent: string[];

    constructor(bufferContent: string[]) {
        this.bufferContent = bufferContent;
    }

    getLine(y: number) {
        return this.bufferContent[y];
    }

    getLineLength(y: number) {
        return this.bufferContent[y].length;
    }

    getIndexOfFirstNonblankInLine(y: number) {
        let index = 0;
        for (let i = 0; i < this.getLineLength(y); i++) {
            if (this.getLine(y).charAt(i) !== " ") {
                return index;
            }
        }
        return null;
    }
}

function createKeydownHandler(vimState: VimState, setVimState: React.Dispatch<React.SetStateAction<VimState>>) {

    function moveCursorHorizontal(x: number, ignoreBounds: boolean) {
        if (!ignoreBounds) {
            x = Math.min(Math.max(x, 1), vimState.bufferContent[vimState.cursorPos.y - 1].length);
        }

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

        setVimState(vimState => ({
            ...vimState,
            cursorPos: { x: x, y: y },
            furthestX: furthestX,
        }));
    }

    function setVimMode(mode: VimMode) {
        setVimState(vimState => ({
            ...vimState,
            vimMode: mode,
        }));
    }

    const motionPrefixTree = new PrefixTree<VimMotion>();
    MOTION_BINDINGS.forEach((motion, binding) => {
        motionPrefixTree.insert(binding, motion);
    });

    const buffer = new Buffer(vimState.bufferContent);

    return (e: React.KeyboardEvent) => {
        e.preventDefault();
        console.log(e.key);
        if (e.key === "Escape") {
            moveCursorHorizontal(vimState.cursorPos.x - 1, false);
            setVimMode("normal");
            return;
        }

        let motion = motionPrefixTree.get(e.key);
        switch (motion) {
            case "left":
                moveCursorHorizontal(vimState.cursorPos.x - 1, false);
                break;
            case "down":
                moveCursorVertical(vimState.cursorPos.y + 1);
                break;
            case "up":
                moveCursorVertical(vimState.cursorPos.y - 1);
                break;
            case "right":
                moveCursorHorizontal(vimState.cursorPos.x + 1, false);
                break;
            case "insert before":
                setVimMode("insert");
                break;
            case "insert after":
                moveCursorHorizontal(vimState.cursorPos.x + 1, true);
                setVimMode("insert");
                break;
            case "insert at first nonblank":
                let index = buffer.getIndexOfFirstNonblankInLine(vimState.cursorPos.y);
                if (index != null) {
                    moveCursorHorizontal(index, true);
                }
                setVimMode("insert");
                break;
            case "insert at end of line":
                moveCursorHorizontal(buffer.getLineLength(vimState.cursorPos.y), true);
                setVimMode("insert");
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
    console.log("pos: ");
    console.log(vimState.cursorPos);

    return (
        <Terminal
            terminalContent={vimState.bufferContent}
            bottomBar={"--" + vimState.vimMode + "--"}
            cursorPos={{ x: vimState.cursorPos.x - 1, y: vimState.cursorPos.y - 1 }}
            onKeyDown={keydownHandler} />
    );
}

export default VimTerminal;
