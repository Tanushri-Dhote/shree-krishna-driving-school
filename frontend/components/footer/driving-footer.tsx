import Link from "next/link";
import Image from "next/image";

export function DrivingFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/70">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-11.png"
                alt="Driving School Logo"
                width={160}
                height={160}
                className="h-24 w-auto object-contain"
              />
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Quality training for new drivers. Book a test, track your
              progress, and get support from experienced instructors.
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="text-sm font-semibold">Company</div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link className="hover:text-foreground" href="#">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-foreground" href="#">
                      Courses
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-foreground" href="#">
                      Reviews
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-foreground" href="#">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <div className="text-sm font-semibold">Get started</div>
                <div className="mt-3 space-y-3">
                  <Link
                    href="#"
                    className="block rounded-lg border border-border/60 bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Book a Test
                  </Link>
                  <Link
                    href="#"
                    className="block rounded-lg border border-border/60 bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Get a Call Back
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Driving School. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <Link className="text-muted-foreground hover:text-foreground" href="#">
              Privacy
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="#">
              Terms
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="#">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
