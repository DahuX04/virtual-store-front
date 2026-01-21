import { TextField } from "@mui/material";

const defaultFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    paddingRight: "6px",
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "transparent" },
    "&.Mui-focused fieldset": { borderColor: "transparent" },
  },
  "& .MuiOutlinedInput-input": {
    padding: "16px 18px",
  },
  "& .MuiFormHelperText-root": {
    marginLeft: "10px",
    color: "rgba(255,255,255,0.85)",
  },
};

export default function AppTextField({
  label,
  helperText = " ",
  sx,
  containerClassName = "",
  labelClassName = "text-white/100 font-extralight",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label ? <div className={labelClassName}>{label}</div> : null}

      <TextField
        fullWidth
        helperText={helperText}
        sx={{ ...defaultFieldSx, ...(sx || {}) }}
        {...props}
      />
    </div>
  );
}