import { Breadcrumbs, Link as MuiLink, Typography, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";

export default function NavigationStore({ paths = [] }) {
  return (
    <Box sx={{ py: 4, px: 2, backgroundColor: "#ffffff" }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ color: "#501E14" }}
      >
        <MuiLink
          component={Link}
          underline="hover"
          color="inherit"
          to="/store"
          sx={{ display: "flex", alignItems: "center", opacity: 0.7 }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        </MuiLink>

        {paths.map((text, index) => {
          const isLast = index === paths.length - 1;

          return isLast ? (
            <Typography 
                key={text} 
                sx={{ fontWeight: 600, color: "#501E14", textTransform: "capitalize" }}
            >
              {text}
            </Typography>
          ) : (
            <MuiLink
              key={text}
              component={Link}
              underline="hover"
              color="inherit"
              to={`/store/${text.toLowerCase()}`}
              sx={{ opacity: 0.7, textTransform: "capitalize" }}
            >
              {text}
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}