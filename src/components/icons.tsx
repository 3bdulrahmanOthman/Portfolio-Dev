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
  Ellipsis,
  CircleDashed,
  Calendar,
  Text,
  Globe,
  Boxes,
  TriangleAlert,
  CircleCheckBigIcon,
  Trash,
  CloudUpload,
  Image,
  X,
  Edit,
  EllipsisVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize,
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
  triangleAlert: TriangleAlert,
  checkCircled: CircleCheckBigIcon,
  dashboard: LayoutDashboard,
  box: Package,
  boxes: Boxes,
  boxPlus: PackagePlus,
  inbox: Inbox,
  info: Info,
  contact: ContactRound,
  chevronsUpDown: ChevronsUpDown,
  home: House,
  settings: Cog,
  logout: LogOut,
  ellipsis: Ellipsis,
  ellipsisVertical: EllipsisVertical,
  calendar: Calendar,
  circleDashed: CircleDashed,
  text: Text,
  globe: Globe,
  trash: Trash,
  cloudUpload: CloudUpload,
  image: Image,
  close: X,
  edit: Edit,
  alignRight: AlignRight,
  alignCenter: AlignCenter,
  alignLeft: AlignLeft,
  maximize: Maximize,
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
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
};
