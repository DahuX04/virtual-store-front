import { Box } from "@mui/material";
import StoreHeader from "../components/StoreHeader";
import NavigationStore from "../components/NavigationStore";
import StoreFooter from "../components/StoreFooter";
import AllSectionsGrid from "../components/AllSectionsGrid";

export default function ProductsPage() {
    return (
        <Box sx={{ backgroundColor: "#f5f3f2", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <StoreHeader />
            <NavigationStore paths={[{ name: "Productos", path: "/store/products" } ]} />
            <AllSectionsGrid title="Productos" type="products"/>
            <StoreFooter />
        </Box>
    );
}