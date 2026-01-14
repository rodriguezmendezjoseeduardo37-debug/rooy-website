import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-black">
      <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link
          href="/"
          className="text-xl font-bold tracking-[0.3em]"
        >
          ROOY
        </Link>

        {/* MENU */}
        <div className="flex gap-10 text-sm uppercase tracking-widest">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          <Link href="/catalogo" className="hover:underline">
            Catálogo
          </Link>
          <Link href="/contacto" className="hover:underline">
            Contacto
          </Link>
          <Link href="/catalogo">Catálogo</Link>
        </div>
      </nav>
    </header>
  );
}
