import './Terminal.css';

type TerminalXY = { x: number, y: number };

type TerminalProps = {
    terminalContent: string[],
    cursorPos: TerminalXY,
    visualHighlight?: { start: TerminalXY, endInclusive: TerminalXY },
    onKeyDown: React.KeyboardEventHandler,
};

function Terminal(props: TerminalProps) {
    return (
        <section
            className="Terminal"
            tabIndex={0} // so the section can have focus and produce keyboard events
            onKeyDown={props.onKeyDown}>
            {
                props.terminalContent.map((line, i) => {
                    if (i === props.cursorPos.y) {
                        const prefix = line.substring(0, props.cursorPos.x);
                        const infix = line.charAt(props.cursorPos.x);
                        const suffix = line.substring(props.cursorPos.x + 1, line.length);
                        return <p>{prefix}<span className="Terminal-Cursor">{infix}</span>{suffix}</p>;
                    }
                    return <p>{line}</p>;
                })
            }
        </section>
    );
}

export default Terminal;
