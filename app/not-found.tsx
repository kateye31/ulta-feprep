import Link from "next/link";
import { Pip } from "@/components/characters";

export default function NotFound() {
  return (
    <div className="wrap center" style={{ padding: "80px 0" }}>
      <Pip size={140} className="bob" />
      <h1>404: this pastry isn&apos;t on the menu 🥐</h1>
      <p className="muted">Pip looked everywhere (even under the counter). Let&apos;s head back.</p>
      <div className="controls" style={{ justifyContent: "center" }}>
        <Link href="/" className="btn">☕ Home</Link>
        <Link href="/menu" className="btn secondary">📜 Menu</Link>
      </div>
    </div>
  );
}
