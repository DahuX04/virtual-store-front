import { Box, Button, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useMemo, useRef, useState } from "react";

export default function ImageDropzone({
    files = [],
    onAddFiles,
    onRemoveFile,
    maxFiles = 5,
    accept = "image/*",
    helperText = "Arrastra una imagen para cargarla",
    buttonText = "Subir imagen",
    previews = [],
    onTogglePreview,

    // ✅ NUEVO
    readOnly = false,
}) {
    const inputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const activePreviewCount = useMemo(() => previews.filter((p) => !p.removed).length, [previews]);

    const used = files.length + activePreviewCount;
    const remaining = Math.max(0, maxFiles - used);

    const pickFiles = () => inputRef.current?.click();

    const normalizeAndAdd = (fileList) => {
        if (!fileList?.length) return;

        const incoming = Array.from(fileList);
        const onlyImages = incoming.filter((f) => f.type?.startsWith("image/"));
        const toTake = onlyImages.slice(0, remaining);

        if (toTake.length) onAddFiles?.(toTake);
    };

    const onInputChange = (e) => {
        normalizeAndAdd(e.target.files);
        e.target.value = "";
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        normalizeAndAdd(e.dataTransfer.files);
    };

    return (
        <Box>
            {/* ✅ Drop area SOLO si NO es vista */}
            {!readOnly && (
                <Box
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={onDrop}
                    sx={{
                        border: "1.5px dashed",
                        borderColor: isDragOver ? "#B85A47" : "rgba(0,0,0,0.18)",
                        borderRadius: 3,
                        bgcolor: isDragOver ? "rgba(184,90,71,0.06)" : "rgba(255,255,255,0.50)",
                        px: 2,
                        py: 2.2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 1,
                        textAlign: "center",
                    }}
                >
                    <CloudUploadOutlinedIcon sx={{ color: "rgba(0,0,0,0.35)" }} />

                    <Typography sx={{ fontSize: 12.5, color: "rgba(0,0,0,0.45)" }}>
                        {helperText}
                    </Typography>

                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        multiple
                        hidden
                        onChange={onInputChange}
                    />

                    <Button
                        onClick={pickFiles}
                        variant="outlined"
                        size="small"
                        disabled={remaining === 0}
                        sx={{
                            textTransform: "none",
                            borderRadius: 999,
                            px: 2,
                            borderColor: "rgba(0,0,0,0.20)",
                            color: "rgba(0,0,0,0.55)",
                            "&:hover": { borderColor: "rgba(0,0,0,0.35)" },
                        }}
                    >
                        {buttonText}
                    </Button>

                    <Typography sx={{ fontSize: 11.5, color: "rgba(0,0,0,0.35)" }}>
                        {used}/{maxFiles} imágenes
                    </Typography>
                </Box>
            )}

            {/* ✅ Previews */}
            {(previews.length > 0 || files.length > 0) && (
                <Box sx={{ mt: readOnly ? 0 : 2, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    {previews.map((p) => (
                        <RemoteThumb
                            key={`remote-${p.id}`}
                            url={p.url}
                            name={p.name}
                            removed={!!p.removed}
                            readOnly={readOnly}
                            onToggle={() => onTogglePreview?.(p.id)}
                        />
                    ))}

                    {files.map((f, idx) => (
                        <ImageThumb
                            key={`${f.name}-${f.size}-${idx}`}
                            file={f}
                            readOnly={readOnly}
                            onRemove={() => onRemoveFile?.(idx)}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}

function ImageThumb({ file, onRemove, readOnly }) {
    const url = URL.createObjectURL(file);

    return (
        <ThumbShell>
            <ThumbImage src={url} alt={file.name} onLoad={() => URL.revokeObjectURL(url)} />
            {!readOnly && <ThumbAction onClick={onRemove}>×</ThumbAction>}
        </ThumbShell>
    );
}

function RemoteThumb({ url, name, removed, onToggle, readOnly }) {
    return (
        <ThumbShell removed={removed}>
            <ThumbImage src={url} alt={name || "image"} />
            {!readOnly && <ThumbAction onClick={onToggle}>{removed ? "↺" : "×"}</ThumbAction>}
        </ThumbShell>
    );
}

function ThumbShell({ children, removed }) {
    return (
        <Box sx={{ width: 120, height: 120, position: "relative", overflow: "visible", opacity: removed ? 0.35 : 1 }}>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.10)",
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

function ThumbImage(props) {
    return (
        <Box component="img" sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} {...props} />
    );
}

function ThumbAction({ children, onClick }) {
    return (
        <Box
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
            role="button"
            aria-label="Acción imagen"
            sx={{
                position: "absolute",
                top: -10,
                right: -10,
                width: 27,
                height: 27,
                borderRadius: "999px",
                bgcolor: "#3B1A13",
                color: "#fff",
                fontSize: 18,
                fontWeight: "200",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                userSelect: "none",
                boxShadow: "0 10px 18px rgba(0,0,0,0.18)",
                zIndex: 2,
                "&:hover": { transform: "scale(1.05)" },
            }}
        >
            {children}
        </Box>
    );
}
