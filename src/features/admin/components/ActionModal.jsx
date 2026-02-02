import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    IconButton,
    CircularProgress,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const iconByVariant = {
    error: ErrorRoundedIcon,
    warning: WarningAmberRoundedIcon,
    success: CheckCircleRoundedIcon,
    confirm: HelpOutlineRoundedIcon,
};

export default function ActionModal({
    open,
    variant = "success", // loading | success | warning | error | confirm
    title,
    message,
    onClose,
    onConfirm,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
}) {
    const isLoading = variant === "loading";
    const isConfirm = variant === "confirm";
    const Icon = iconByVariant[variant];

    const showActions = !isLoading;

    return (
        <Dialog
            open={open}
            onClose={isLoading ? undefined : onClose}
            disableEscapeKeyDown={isLoading}
            disableAutoFocus
            disableEnforceFocus
            disableRestoreFocus
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    width: 460,
                    maxWidth: "92vw",
                },
            }}
        >
            <DialogContent sx={{ p: 4, textAlign: "center", position: "relative" }}>
                {!isLoading && (
                    <IconButton
                        onClick={onClose}
                        sx={{ position: "absolute", top: 10, right: 10 }}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                )}

                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            bgcolor: "rgba(80,30,20,0.08)",
                            display: "grid",
                            placeItems: "center",
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={26} />
                        ) : (
                            Icon && <Icon sx={{ color: "#501E14", fontSize: 30 }} />
                        )}
                    </Box>
                </Box>

                <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 0.5 }}>
                    {title}
                </Typography>

                <Typography sx={{ color: "rgba(0,0,0,0.6)", mb: 3 }}>
                    {message}
                </Typography>

                {showActions && (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                        {isConfirm && (
                            <Button
                                onClick={onClose}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 3,
                                    px: 3.2,
                                    py: 1.2,
                                    color: "#501E14",
                                    border: "1px solid rgba(80,30,20,0.25)",
                                }}
                                variant="outlined"
                            >
                                {cancelText}
                            </Button>
                        )}

                        <Button
                            onClick={isConfirm ? onConfirm : onClose}
                            variant="contained"
                            sx={{
                                textTransform: "none",
                                borderRadius: 3,
                                px: 4,
                                py: 1.2,
                                fontWeight: 700,
                                bgcolor: "#501E14",
                                boxShadow: "none",
                                "&:hover": { bgcolor: "#3B1710", boxShadow: "none" },
                            }}
                        >
                            {confirmText}
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
