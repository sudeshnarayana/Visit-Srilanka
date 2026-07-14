import { SiteChrome } from "@/components/layout/SiteChrome";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
