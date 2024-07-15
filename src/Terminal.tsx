import { useEffect, useRef } from 'react';
import './Terminal.css';

type TerminalXY = { x: number, y: number };

type TerminalProps = {
    terminalContent: string[],
    bottomBar: string,
    cursorPos: TerminalXY,
    visualHighlight?: { start: TerminalXY, endInclusive: TerminalXY },
    onKeyDown: React.KeyboardEventHandler,
};

function computeCharacterDimensions(ctx: CanvasRenderingContext2D) {
    let charDims = ctx.measureText("T");
    return ({
        lineHeight: charDims.fontBoundingBoxAscent + charDims.fontBoundingBoxDescent,
        charWidth: charDims.actualBoundingBoxLeft + charDims.actualBoundingBoxRight,
        descent: charDims.fontBoundingBoxDescent,
    });
}

function drawCursor(ctx: CanvasRenderingContext2D, x: number, y: number, charWidth: number, lineHeight: number, descent: number) {
    ctx.fillStyle = "#090";
    ctx.fillRect(x * charWidth, y * lineHeight + descent, charWidth, lineHeight);
}

function drawTerminal(canvas: HTMLCanvasElement, lines: string[], fontSize: number, cursorPos: TerminalXY) {
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
        return;
    }

    const charDims = computeCharacterDimensions(ctx);
    let lineBaseline = charDims.lineHeight;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawCursor(ctx, cursorPos.x, cursorPos.y, charDims.charWidth, charDims.lineHeight, charDims.descent);

    ctx.font = fontSize + "px monospace";
    lines.forEach(line => {
        ctx.fillStyle = "#999";
        ctx.fillText(line, 0, lineBaseline);

        lineBaseline += charDims.lineHeight;
    });
}

function Terminal(props: TerminalProps) {
    const canvasRef = useRef(null as HTMLCanvasElement | null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) {
            return;
        }

        const draw = () => {
            drawTerminal(canvas, props.terminalContent, 32, props.cursorPos);
            window.requestAnimationFrame(draw);
        };
        window.requestAnimationFrame(draw);
    }, [canvasRef, props.terminalContent, props.cursorPos]);


    return (
        <canvas
            ref={canvasRef}
            className="Terminal"
            height={720}
            width={1280}
            tabIndex={0} // so the section can have focus and produce keyboard events
            onKeyDown={props.onKeyDown}>
        </canvas>
    );
}

export default Terminal;
