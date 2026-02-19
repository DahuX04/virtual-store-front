import { Box } from "@mui/material";
import StoreHeader from "../components/StoreHeader";
import AllSectionsGrid from "../components/AllSectionsGrid";
import StoreFooter from "../components/StoreFooter";
import NavigationStore from "../components/NavigationStore";

export default function CategoriesPage() {  
    return(
       <Box sx={{ backgroundColor: "#f5f3f2", minHeight: "100vh" }}>
            <StoreHeader />
            <NavigationStore paths={[{ name: "Categorías", path: "/store/categories" }]}/>
            <AllSectionsGrid title="Categorías" type="categories"/>
            <StoreFooter />
        </Box>
    );
}