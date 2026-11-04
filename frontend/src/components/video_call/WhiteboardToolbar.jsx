const WhiteboardToolbar=({
    tool,
    setTool,
    color,
    setColor,
    brushsize,
    setBrushsize,
    onUndo,
    onRedo,
    onClear,
    canUndo,
    canRedo,
})=>{
    const colors=[
        "#111827",
        "#EF4444",
        "#2563EB",
        "#16A34A",
        "#EAB308",
        "#9333EA",
        "#EC4899",
    ]
    return (
        <div className="whiteboard-toolbar">

            <div className="whiteboard-tool-group">
                <button
                    type="button"
                    className={tool === "pen" ? "active" : ""}
                    onClick={() => setTool("pen")}
                    title="Pen"
                >
                    <i className="fas fa-pen" />
                    <span>Pen</span>
                </button>

                <button
                    type="button"
                    className={tool === "eraser" ? "active" : ""}
                    onClick={() => setTool("eraser")}
                    title="Eraser"
                >
                    <i className="fas fa-eraser" />
                    <span>Eraser</span>
                </button>
            </div>

            <div className="whiteboard-tool-group whiteboard-colors">
                {colors.map((item) => (
                    <button
                        key={item}
                        type="button"
                        className={`whiteboard-color ${color === item ? "selected" : ""}`}
                        style={{ backgroundColor: item }}
                        onClick={() => {
                            setColor(item);
                            setTool("pen");
                        }}
                        title={`Select ${item}`}
                    />
                ))}
            </div>

            <div className="whiteboard-brush-size">
                <label htmlFor="whiteboard-brush-size">
                    Brush size
                </label>

                <input
                    id="whiteboard-brush-size"
                    type="range"
                    min="2"
                    max="24"
                    value={brushSize}
                    onChange={(event) =>
                        setBrushSize(Number(event.target.value))
                    }
                />

                <span>{brushSize}px</span>
            </div>

            <div className="whiteboard-tool-group">
                <button
                    type="button"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo"
                >
                    <i className="fas fa-undo" />
                    <span>Undo</span>
                </button>

                <button
                    type="button"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo"
                >
                    <i className="fas fa-redo" />
                    <span>Redo</span>
                </button>

                <button
                    type="button"
                    className="whiteboard-clear-button"
                    onClick={onClear}
                    title="Clear board"
                >
                    <i className="fas fa-trash" />
                    <span>Clear</span>
                </button>
            </div>
        </div>
    )
}

export default WhiteboardToolbar