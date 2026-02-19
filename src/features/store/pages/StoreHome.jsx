import { Box } from "@mui/material";
import StoreHeader from "../components/StoreHeader"
import HeroSection from "../components/HeroSection"
import CategorySection from "../components/CategorySection"
import ProductsCarousel from "../components/ProductsCarousel"
import StoreFooter from "../components/StoreFooter"


export default function StoreHome() {  
    return(
        <Box sx={{ backgroundColor: "#f5f3f2", minHeight: "100vh" }}>
            <StoreHeader />
            <HeroSection />
            <CategorySection />
            <ProductsCarousel title="Productos"/>
            <StoreFooter />
        </Box>
    )

}