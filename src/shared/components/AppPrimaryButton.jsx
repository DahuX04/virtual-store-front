import { Button } from "@mui/material";

export default function AppPrimaryButton({
  children,
  sx,
  ...props
}) {
  return (
    <Button
      variant="contained"
      sx={{
        borderRadius: "9999px",
        paddingY: "14px",
        fontWeight: 800,
        textTransform: "none",
        backgroundColor: "#F3E7E6",
        color: "#2A1A18",
        boxShadow: "none",
        "&:hover": { backgroundColor: "#EAD9D8", boxShadow: "none" },
        "&.Mui-disabled": {
          backgroundColor: "rgba(243,231,230,0.45)",
          color: "rgba(42,26,24,0.55)",
        },
        ...(sx || {}),
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
