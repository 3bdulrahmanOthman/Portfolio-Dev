import {
  AlertTriangle,
  LogOut,
  Eye,
  EyeOff,
  LucideIcon,
  SunMedium,
  Moon,
  LoaderCircle,
  ShieldAlert,
  LayoutDashboard,
  Package,
  Inbox,
  PackagePlus,
  Info,
  ContactRound,
  Laptop,
  ChevronsUpDown,
  LucideProps,
  House,
  Cog,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  warning: AlertTriangle,
  eye: Eye,
  eyeOff: EyeOff,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  spinner: LoaderCircle,
  shieldAlert: ShieldAlert,
  dashboard: LayoutDashboard,
  box: Package,
  boxPlus: PackagePlus,
  inbox: Inbox,
  info: Info,
  contact: ContactRound,
  chevronsUpDown: ChevronsUpDown,
  home: House,
  settings: Cog,
  logout: LogOut,
  logo: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35 34"
      width="100%"
      height="100%"
      role="img"
      aria-label="Logo"
      {...props}
    >
      <path
        d="M13.8 0q4.4 0 8.7 0c2.5 8 5 16 7.4 24.1q1.5 4.4 2.8 8.9c-3 0.1-6.1 0.1-9.2 0-3.2-11-6.6-22-9.7-33z"
        fill="currentColor"
      />
      <path
        d="M6.3 24c1.5-0.1 3 0.8 4 2 1.2 2 0.9 4.9-1 6.4-1.7 1.4-4.4 1.3-5.9-0.4-1.7-1.6-1.9-4.6-0.3-6.4 0.8-0.9 1.9-1.5 3.2-1.6z"
        fill="currentColor"
      />
    </svg>
  ),
};
