import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";

interface PageHeadingProps {
  title: string;
  description: string;
  icon: IconName;
  eyebrow?: string;
}

export function PageHeading({ title, description, icon, eyebrow = "Network tools" }: PageHeadingProps) {
  return (
    <div className="page-heading">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
      <div className="page-heading-main">
        <span className="heading-icon"><Icon name={icon} size={26} /></span>
        <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>
      </div>
    </div>
  );
}
