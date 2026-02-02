import { Dialog, DialogContent, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AppModal({
    open,
    onClose,
    title,
    titleIcon: TitleIcon,
    maxWidth = "sm",
    children,
    headerSx,
    contentSx,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={maxWidth}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 30px 90px rgba(0,0,0,0.25)",
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 3,
                    pt: 2.5,
                    pb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    ...headerSx,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    {TitleIcon ? <TitleIcon sx={{ color: "#501E14" }} /> : null}
                    <Typography sx={{ fontSize: 22, fontWeight: 600, color: "#501E14" }}>
                        {title}
                    </Typography>
                </Box>

                <IconButton onClick={onClose} sx={{ color: "#B0ABAA" }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ px: 3, pb: 3, ...contentSx }}>
                {children}
            </DialogContent>
        </Dialog>
    );
}
