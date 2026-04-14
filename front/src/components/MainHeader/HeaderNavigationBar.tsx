// UI //
import { LogInIcon, FileCheckIcon, User, ScatterChartIcon } from "lucide-react";
import { Button } from "../ui/Button";

import { Link, useLocation } from "react-router-dom";

interface HeaderNavBarProps {
  onNavClick?: () => void;
}

const HeaderNavigationBar = ({ onNavClick }: HeaderNavBarProps) => {
  const { pathname } = useLocation();

  return (
    <nav className="flex items-center gap-2">
      <Link to="/inscription">
        <Button
          variant="ghost"
          size="lg"
          className={
            pathname === "/inscription"
              ? " text-gray-500 tracking-wide font-semibold text-[16px] hover:cursor-default"
              : "text-gray-400"
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
              : "text-gray-400"
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
              : "text-gray-400"
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
              : "text-gray-400"
          }
          onClick={onNavClick}
        >
          <ScatterChartIcon />
          Sandbox
        </Button>
      </Link>
    </nav>
  );
};

export default HeaderNavigationBar;
