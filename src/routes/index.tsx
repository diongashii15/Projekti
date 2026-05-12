import { createFileRoute, Link } from "@tanstack/react-router";
import { Cloud, FileText, Zap, Lock, Download, Server, Database, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Cumulus — Cloud-Native Resume Builder" },
      { name: "description", content: "Build, edit and export beautiful resumes in the cloud. Serverless backend, managed database, instant PDF export." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute inset-x-0 top-0 h-[600px] bg-glow" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-glow opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Powered by serverless cloud architecture
            </div>
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">
              Resumes that ship at <span className="text-gradient">cloud speed</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Cumulus is a cloud-native resume builder. Edit in real time, autosave to a managed
              database, and export to PDF through serverless functions — no infrastructure to manage.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                  Start building free
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline">See how it works</Button>
              </a>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-4 text-center sm:gap-8">
              {[
                { v: "<100ms", l: "Autosave latency" },
                { v: "3", l: "Pro templates" },
                { v: "∞", l: "Resumes per account" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-border/60 bg-surface/40 px-4 py-5 backdrop-blur">
                  <div className="font-display text-2xl font-semibold text-gradient sm:text-3xl">{s.v}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary-glow">The cloud-native stack</p>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Built on managed services</h2>
          <p className="mt-4 text-muted-foreground">
            Every layer is serverless — frontend on the edge, stateless backend functions, managed
            Postgres, and cloud object storage. Scales from one user to millions automatically.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { i: Server, t: "Serverless functions", d: "Stateless API endpoints handle saves, PDF generation and uploads. Zero servers to maintain." },
            { i: Database, t: "Managed Postgres", d: "Resumes persist in a fully managed cloud database with automatic backups and row-level security." },
            { i: Cloud, t: "Cloud object storage", d: "Profile photos and assets live in scalable object storage with public CDN delivery." },
            { i: Lock, t: "Auth & RLS", d: "Secure email auth with per-row access policies — your data is never visible to other users." },
            { i: Zap, t: "Realtime autosave", d: "Edits stream to the database the moment you stop typing. Never lose a draft." },
            { i: Download, t: "PDF export", d: "Generate pixel-perfect PDFs on demand with serverless rendering." },
            { i: Palette, t: "Multiple templates", d: "Switch between Modern, Classic, and Minimal — same data, different look." },
            { i: FileText, t: "Sectioned editor", d: "Personal info, experience, education, skills, projects, certs and languages." },
          ].map((f) => (
            <div key={f.t} className="group rounded-2xl border border-border/60 bg-card p-6 shadow-card transition-all hover:border-primary/40 hover:shadow-glow">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <f.i className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-hero p-12 text-center shadow-glow sm:p-16">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-5xl">Ready to deploy your résumé?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Sign up free. Build in minutes. Export anywhere.</p>
            <Link to="/auth" className="mt-8 inline-block">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                Create your first resume
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        Built with TanStack Start · Lovable Cloud · React PDF
      </footer>
    </div>
  );
}
