import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, Plus, Trash2, Edit3, Loader2, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { emptyResume } from "@/lib/resume-types";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — Cumulus" }] }),
});

interface ResumeRow {
  id: string;
  title: string;
  template: string;
  updated_at: string;
}

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeRow[] | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    void load();
  }, [user]);

  const load = async () => {
    const { data, error } = await supabase
      .from("resumes")
      .select("id,title,template,updated_at")
      .order("updated_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setResumes(data ?? []);
  };

  const create = async () => {
    if (!user) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("resumes")
      .insert({ user_id: user.id, title: "Untitled Resume", template: "modern", data: emptyResume() as never })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) {
      toast.error(error?.message ?? "Failed to create");
      return;
    }
    navigate({ to: "/builder/$id", params: { id: data.id } });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Resume deleted");
    setResumes((r) => r?.filter((x) => x.id !== id) ?? null);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">Your resumes</h1>
          </div>
          <Button onClick={create} disabled={creating} className="bg-gradient-primary text-primary-foreground shadow-glow">
            {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            New resume
          </Button>
        </div>

        {resumes === null ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl border border-border/60 bg-card" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <EmptyState onCreate={create} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((r) => (
              <div key={r.id} className="group relative rounded-2xl border border-border/60 bg-card p-6 shadow-card transition-all hover:border-primary/40 hover:shadow-glow">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold">{r.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{r.template} template</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Updated {new Date(r.updated_at).toLocaleDateString()}
                </div>
                <div className="mt-5 flex gap-2">
                  <Link to="/builder/$id" params={{ id: r.id }} className="flex-1">
                    <Button variant="default" size="sm" className="w-full">
                      <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(r.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/40 p-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
        <FileText className="h-6 w-6 text-primary-foreground" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold">No resumes yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">Create your first cloud-stored resume in seconds.</p>
      <Button onClick={onCreate} className="mt-6 bg-gradient-primary text-primary-foreground shadow-glow">
        <Plus className="mr-2 h-4 w-4" /> Create your first resume
      </Button>
    </div>
  );
}
