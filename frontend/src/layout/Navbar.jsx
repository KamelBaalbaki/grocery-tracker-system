import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const navLinks = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Sign Up" },
];

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 py-5 z-50">
      <nav className="container mx-auto px-6 flex items-center justify-between">

        <Link
          to="/"
          className="flex items-center gap-2 text-primary text-2xl font-bold tracking-tight hover:text-foreground/90 duration-500 transition"
        >
          <Leaf />
          Grocery Tracker
        </Link>

        <div className="flex items-center gap-2">
          {navLinks.map((link, index) => (
            <Link
              to={link.href}
              key={index}
              className="px-4 py-2 text-lg font-bold text-primary rounded-full hover:text-foreground/90 duration-500 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

      </nav>
    </header>
  );
};

export default Navbar;