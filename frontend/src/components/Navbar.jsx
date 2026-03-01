export default function Navbar() {
  return (
    <header className="w-full py-4 px-6 border-b border-white/10 sticky top-0 bg-black bg-opacity-80 backdrop-blur z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side: Logo + Nav Links */}
        <div className="flex items-center space-x-8">
        <h1 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
          mana.ai
        </h1>

          <nav className="hidden md:flex space-x-6 text-white text-sm font-medium">
            <a href="#about" className="hover:text-primary transition">About</a>
            <a href="#contact" className="hover:text-primary transition">Contact Us</a>
          </nav>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center space-x-4">
          <button className="bg-primary hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
            Chrome Extension
          </button>
        </div>
      </div>
    </header>
  );
}
