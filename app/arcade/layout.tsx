import "./arcade.css";

/* Night Shift shares the site's zine type and colors; arcade.css maps them to its own roles. */
export default function ArcadeLayout({ children }: { children: React.ReactNode }) {
  return <div className="arcade">{children}</div>;
}
