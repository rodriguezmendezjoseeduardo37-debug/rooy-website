export default function LoginPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center">
      <div className="border p-10 w-full max-w-md">
        <h1 className="text-2xl uppercase tracking-widest mb-8">
          Iniciar sesión
        </h1>

        <input
          type="email"
          placeholder="Correo"
          className="w-full border px-4 py-3 mb-4 bg-transparent"
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border px-4 py-3 mb-6 bg-transparent"
        />

        <button className="w-full bg-black text-white py-3 uppercase tracking-widest hover:opacity-80">
          Entrar
        </button>
      </div>
    </main>
  );
}
