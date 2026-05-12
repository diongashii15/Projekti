import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Download, Loader2, Cloud, Check, AlertCircle } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeEditor, useAutosave } from "@/components/resume-editor";
import { ResumePreview } from "@/components/resume-preview";
import { ResumePDF } from "@/components/resume-pdf";
import { emptyResume, type ResumeData, type TemplateId } from "@/lib/resume-types";

export const Route = createFileRoute("/builder/$id")({
  component: Builder,
  head: () => ({ meta: [{ title: "Edit resume — Cumulus" }] }),
});

function Builder() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Untitled Resume");
  const [template, setTemplate] = useState<TemplateId>("modern");
  const [data, setData] = useState<ResumeData | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: row, error } = await supabase
        .from("resumes").select("*").eq("id", id).maybeSingle();
      if (error || !row) { toast.error(error?.message ?? "Not found"); navigate({ to: "/dashboard" }); return; }
      setTitle(row.title);
      setTemplate((row.template as TemplateId) ?? "modern");
      setData({ ...emptyResume(), ...(row.data as Partial<ResumeData>) });
    })();
  }, [user, id, navigate]);

  const save = useCallback(async (payload: { title: string; template: TemplateId; data: ResumeData }) => {
    const { error } = await supabase.from("resumes")
      .update({ title: payload.title, template: payload.template, data: payload.data as never })
      .eq("id", id);
    if (error) throw error;
  }, [id]);

  const status = useAutosave(
    data ? { title, template, data } : null,
    async (v) => { if (v) await save(v); },
  );

  const exportPdf = async () => {
    if (!data) return;
    setExporting(true);
    try {
      const blob = await pdf(<ResumePDF data={data} template={template} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${title || "resume"}.pdf`; a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally { setExporting(false); }
  };

  if (loading || !user || !data) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
          <Link to="/dashboard"><Button variant="ghost" size="sm"><ArrowLeft className="mr-1.5 h-4 w-4" /> Dashboard</Button></Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary"><Cloud className="h-4 w-4 text-primary-foreground" /></div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-xs border-transparent bg-transparent text-base font-semibold focus-visible:bg-input" />
          <SaveBadge status={status} />
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={exportPdf} disabled={exporting} className="bg-gradient-primary text-primary-foreground shadow-glow">
              {exporting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Download className="mr-1.5 h-4 w-4" />}
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,480px)_1fr]">
        <div>
          <ResumeEditor data={data} onChange={setData} template={template} onTemplateChange={setTemplate} userId={user.id} />
        </div>
        <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-auto">
          <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
            <div className="overflow-hidden rounded-md shadow-card">
              <div className="origin-top-left scale-[0.85] sm:scale-100" style={{ width: "100%" }}>
                <ResumePreview data={data} template={template} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveBadge({ status }: { status: "idle" | "saving" | "saved" | "error" }) {
  if (status === "saving") return <span className="flex items-center gap-1 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Saving…</span>;
  if (status === "saved") return <span className="flex items-center gap-1 text-xs text-primary-glow"><Check className="h-3 w-3" /> Saved to cloud</span>;
  if (status === "error") return <span className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" /> Save error</span>;
  return null;
}
