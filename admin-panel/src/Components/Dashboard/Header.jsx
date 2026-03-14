export default function Header({ title, onLogout }) {
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <button
        onClick={onLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </header>
  );
}
