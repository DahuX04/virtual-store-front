import { Breadcrumbs, Link as MuiLink, Typography, Box, Container } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";

export default function NavigationStore({ paths = [] }) {
  return (
    <Box sx={{ backgroundColor: "#ffffff" }}> 
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ color: "#501E14" }}
          >
            {/* Inicio siempre va a /store */}
            <MuiLink
              component={Link}
              underline="hover"
              color="inherit"
              to="/store"
              sx={{ display: "flex", alignItems: "center", opacity: 0.7 }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            </MuiLink>

            {paths.map((item, index) => {
              const isLast = index === paths.length - 1;

              return isLast ? (
                // El último elemento no es un link
                <Typography 
                  key={index} 
                  sx={{ fontWeight: 600, color: "#501E14" }}
                >
                  {item.name}
                </Typography>
              ) : (
                // Elementos intermedios usan la propiedad path definida
                <MuiLink
                  key={index}
                  component={Link}
                  underline="hover"
                  color="inherit"
                  to={item.path} 
                  sx={{ opacity: 0.7 }}
                >
                  {item.name}
                </MuiLink>
              );
            })}
          </Breadcrumbs>
        </Box>
      </Container>
    </Box>
  );
}