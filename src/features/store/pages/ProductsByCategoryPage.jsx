import { Box } from "@mui/material";
import StoreHeader from "../components/StoreHeader";
import NavigationStore from "../components/NavigationStore";
import StoreFooter from "../components/StoreFooter";
import AllSectionsGrid from "../components/AllSectionsGrid";

export default function ProductsByCategoryPage() {
    return (
        <Box sx={{ backgroundColor: "#f5f3f2", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <StoreHeader />
            <NavigationStore paths={[{ name: "Categorías", path: "/store/categories" }, { name: "Productos", path: "/store/categories/1/products" } ]} />
            <AllSectionsGrid title="Productos" type="products"/>
            <StoreFooter />
        </Box>
    );
}