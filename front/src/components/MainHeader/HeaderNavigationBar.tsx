// UI //
import {
  LogInIcon,
  FileCheckIcon,
  User,
  ScatterChartIcon,
  Bell,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/Button";

import { Link, useLocation } from "react-router-dom";

interface HeaderNavBarProps {
  onNavClick?: () => void;
}

const HeaderNavigationBar = ({ onNavClick }: HeaderNavBarProps) => {
  const { pathname } = useLocation();

  return (
    <div className="flex items-center gap-2">
      <nav className="flex items-center gap-2">
        <Link to="/inscription">
          <Button
            variant="ghost"
            size="lg"
            className={
              pathname === "/inscription"
                ? " text-gray-500 tracking-wide font-semibold text-[16px] hover:cursor-default"
                : "text-gray-400 hover:bg-lumenjuris-background"
            }
            onClick={onNavClick}
          >
            <LogInIcon />
            Se connecter
          </Button>
        </Link>
        <Link to="/analyzer">
          <Button
            variant="ghost"
            size="lg"
            data-slot="icon"
            className={
              pathname === "/analyzer"
                ? " text-gray-500 tracking-wide font-semibold text-[16px] hover:cursor-default"
                : "text-gray-400 hover:bg-lumenjuris-background"
            }
          >
            <FileCheckIcon />
            Analyse
          </Button>
        </Link>
        <Link to="/mon-compte">
          <Button
            variant="ghost"
            size="lg"
            className={
              pathname === "/mon-compte"
                ? " text-gray-500 tracking-wide font-semibold text-[16px] hover:cursor-default"
                : "text-gray-400 hover:bg-lumenjuris-background"
            }
            onClick={onNavClick}
          >
            <User />
            Mon compte
          </Button>
        </Link>
        <Link to="/sandbox">
          <Button
            variant="ghost"
            size="lg"
            className={
              pathname === "/sandbox"
                ? " text-gray-500 tracking-wide font-semibold text-[16px] hover:cursor-default"
                : "text-gray-400 hover:bg-lumenjuris-background"
            }
            onClick={onNavClick}
          >
            <ScatterChartIcon />
            Sandbox
          </Button>
        </Link>
      </nav>
      <section className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-400" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-green-500" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="h-8 w-8 rounded-full bg-lumenjuris flex items-center justify-center text-white text-xs font-medium">
            ML
          </div>
          <div className="hidden md:flex items-center gap-1 cursor-pointer">
            <span className="text-sm font-medium text-gray-800">Marie L.</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeaderNavigationBar;
