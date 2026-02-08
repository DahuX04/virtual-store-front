import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';

const adminNavItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: DashboardOutlinedIcon },
  { id: "products", label: "Productos", path: "/admin/productos", icon: Inventory2OutlinedIcon },
  { id: "brands", label: "Marcas", path: "/admin/marcas", icon: LocalOfferOutlinedIcon },
  { id: "sells", label: "Ventas", path: "/admin/ventas", icon: LocalAtmOutlinedIcon}
];

export default adminNavItems;