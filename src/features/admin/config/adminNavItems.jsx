import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

const adminNavItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: DashboardOutlinedIcon },
  { id: "products", label: "Productos", path: "/admin/productos", icon: Inventory2OutlinedIcon },
  { id: "brands", label: "Marcas", path: "/admin/marcas", icon: LocalOfferOutlinedIcon },
];

export default adminNavItems;