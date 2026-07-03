import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-20 pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-emerald text-primary-foreground">
                <span className="font-display font-bold">A</span>
              </div>
              <div className="font-display text-lg font-bold">
                Ad<span className="text-primary">Hub</span>{" "}
                <span className="text-xs font-semibold tracking-widest text-muted-foreground">
                  KENYA
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm font-semibold text-muted-foreground">
              Buy. Sell. Discover.
            </p>
          </div>

          {[
            {
              title: "Marketplace",
              links: [
                { name: "All categories", path: "/browse" },
                { name: "Featured ads", path: "/browse?featured=true" },
                { name: "Verified sellers", path: "/browse?verified=true" },
                { name: "Post an ad", path: "/post-ad" }
              ],
            },
            {
              title: "Support",
              links: [
                { name: "Help centre", path: "/help" },
                { name: "Safety tips", path: "/safety" },
                { name: "Contact us", path: "/contact" },
                { name: "Report a listing", path: "/report" }
              ],
            },
            {
              title: "Company",
              links: [
                { name: "About AdHub", path: "/about" },
                { name: "Careers", path: "/careers" },
                { name: "Terms of service", path: "/terms" },
                { name: "Privacy", path: "/privacy" }
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link to={l.path} className="text-muted-foreground hover:text-primary transition-colors">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} AdHub Kenya. Made in Nairobi.</div>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
