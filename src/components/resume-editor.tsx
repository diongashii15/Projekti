import { useEffect, useMemo, useRef, useState } from "react";
import type { ResumeData, TemplateId } from "@/lib/resume-types";
import { uid } from "@/lib/resume-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  data: ResumeData;
  template: TemplateId;
  onChange: (d: ResumeData) => void;
  onTemplateChange: (t: TemplateId) => void;
  userId: string;
}

export function ResumeEditor({ data, onChange, template, onTemplateChange, userId }: Props) {
  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <TemplateSwitcher template={template} onChange={onTemplateChange} />
      <Accordion type="multiple" defaultValue={["personal", "experience"]} className="space-y-3">
        <Item id="personal" title="Personal info">
          <PersonalForm value={data.personal} onChange={(v) => update("personal", v)} userId={userId} />
        </Item>
        <Item id="experience" title="Experience">
          <ExperienceForm value={data.experience} onChange={(v) => update("experience", v)} />
        </Item>
        <Item id="education" title="Education">
          <EducationForm value={data.education} onChange={(v) => update("education", v)} />
        </Item>
        <Item id="skills" title="Skills">
          <SkillsForm value={data.skills} onChange={(v) => update("skills", v)} />
        </Item>
        <Item id="projects" title="Projects">
          <ProjectsForm value={data.projects} onChange={(v) => update("projects", v)} />
        </Item>
        <Item id="certifications" title="Certifications">
          <CertsForm value={data.certifications} onChange={(v) => update("certifications", v)} />
        </Item>
        <Item id="languages" title="Languages">
          <LanguagesForm value={data.languages} onChange={(v) => update("languages", v)} />
        </Item>
      </Accordion>
    </div>
  );
}

function Item({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={id} className="rounded-xl border border-border/60 bg-card px-4">
      <AccordionTrigger className="font-display text-base hover:no-underline">{title}</AccordionTrigger>
      <AccordionContent className="pt-2">{children}</AccordionContent>
    </AccordionItem>
  );
}

function TemplateSwitcher({ template, onChange }: { template: TemplateId; onChange: (t: TemplateId) => void }) {
  const opts: { id: TemplateId; label: string }[] = [
    { id: "modern", label: "Modern" },
    { id: "classic", label: "Classic" },
    { id: "minimal", label: "Minimal" },
  ];
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Template</Label>
      <div className="grid grid-cols-3 gap-2">
        {opts.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              template === o.id
                ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                : "border-border bg-surface text-foreground hover:border-primary/50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PersonalForm({ value, onChange, userId }: { value: ResumeData["personal"]; onChange: (v: ResumeData["personal"]) => void; userId: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const set = (k: keyof typeof value, v: string) => onChange({ ...value, [k]: v });

  const onFile = async (f: File | null) => {
    if (!f) return;
    if (f.size > 2_000_000) { toast.error("Max 2MB"); return; }
    setUploading(true);
    const path = `${userId}/${Date.now()}-${f.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from("avatars").upload(path, f, { upsert: true });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    onChange({ ...value, avatarUrl: data.publicUrl });
    setUploading(false);
    toast.success("Photo uploaded");
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2 flex items-center gap-4">
        {value.avatarUrl ? (
          <img src={value.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-border" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">No photo</div>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Upload className="mr-2 h-3.5 w-3.5" />}
          Upload photo
        </Button>
      </div>
      <Field label="Full name" value={value.fullName} onChange={(v) => set("fullName", v)} />
      <Field label="Job title" value={value.title} onChange={(v) => set("title", v)} />
      <Field label="Email" value={value.email} onChange={(v) => set("email", v)} type="email" />
      <Field label="Phone" value={value.phone} onChange={(v) => set("phone", v)} />
      <Field label="Location" value={value.location} onChange={(v) => set("location", v)} />
      <Field label="Website" value={value.website} onChange={(v) => set("website", v)} />
      <div className="sm:col-span-2">
        <Label>Summary</Label>
        <Textarea value={value.summary} onChange={(e) => set("summary", e.target.value)} rows={4} placeholder="A short professional summary…" />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* ---- list helpers ---- */
function ListShell<T extends { id: string }>({
  items, onChange, blank, render, addLabel,
}: {
  items: T[]; onChange: (items: T[]) => void; blank: () => T;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode; addLabel: string;
}) {
  const upd = (id: string, patch: Partial<T>) => onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i.id} className="relative rounded-lg border border-border bg-surface/40 p-4">
          <Button type="button" variant="ghost" size="sm" onClick={() => remove(i.id)} className="absolute right-2 top-2 h-7 w-7 p-0 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          {render(i, (patch) => upd(i.id, patch))}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, blank()])}>
        <Plus className="mr-1.5 h-3.5 w-3.5" /> {addLabel}
      </Button>
    </div>
  );
}

function ExperienceForm({ value, onChange }: { value: ResumeData["experience"]; onChange: (v: ResumeData["experience"]) => void }) {
  return (
    <ListShell items={value} onChange={onChange} addLabel="Add experience"
      blank={() => ({ id: uid(), company: "", position: "", startDate: "", endDate: "", current: false, description: "" })}
      render={(i, u) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Position" value={i.position} onChange={(v) => u({ position: v })} />
          <Field label="Company" value={i.company} onChange={(v) => u({ company: v })} />
          <div><Label>Start</Label><Input type="month" value={i.startDate} onChange={(e) => u({ startDate: e.target.value })} /></div>
          <div><Label>End</Label><Input type="month" value={i.endDate} onChange={(e) => u({ endDate: e.target.value })} disabled={i.current} /></div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch checked={i.current} onCheckedChange={(c) => u({ current: c })} />
            <span className="text-sm text-muted-foreground">I currently work here</span>
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={i.description} onChange={(e) => u({ description: e.target.value })} rows={3} />
          </div>
        </div>
      )}
    />
  );
}

function EducationForm({ value, onChange }: { value: ResumeData["education"]; onChange: (v: ResumeData["education"]) => void }) {
  return (
    <ListShell items={value} onChange={onChange} addLabel="Add education"
      blank={() => ({ id: uid(), school: "", degree: "", field: "", startDate: "", endDate: "", description: "" })}
      render={(i, u) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="School" value={i.school} onChange={(v) => u({ school: v })} />
          <Field label="Degree" value={i.degree} onChange={(v) => u({ degree: v })} />
          <Field label="Field of study" value={i.field} onChange={(v) => u({ field: v })} />
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Start</Label><Input type="month" value={i.startDate} onChange={(e) => u({ startDate: e.target.value })} /></div>
            <div><Label>End</Label><Input type="month" value={i.endDate} onChange={(e) => u({ endDate: e.target.value })} /></div>
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={i.description} onChange={(e) => u({ description: e.target.value })} rows={2} />
          </div>
        </div>
      )}
    />
  );
}

function SkillsForm({ value, onChange }: { value: ResumeData["skills"]; onChange: (v: ResumeData["skills"]) => void }) {
  return (
    <ListShell items={value} onChange={onChange} addLabel="Add skill"
      blank={() => ({ id: uid(), name: "", level: 3 })}
      render={(i, u) => (
        <div className="grid gap-3 sm:grid-cols-[1fr_200px] sm:items-end">
          <Field label="Skill" value={i.name} onChange={(v) => u({ name: v })} />
          <div>
            <Label>Level: {i.level}/5</Label>
            <Slider value={[i.level]} min={1} max={5} step={1} onValueChange={(v) => u({ level: v[0] })} />
          </div>
        </div>
      )}
    />
  );
}

function ProjectsForm({ value, onChange }: { value: ResumeData["projects"]; onChange: (v: ResumeData["projects"]) => void }) {
  return (
    <ListShell items={value} onChange={onChange} addLabel="Add project"
      blank={() => ({ id: uid(), name: "", description: "", url: "", tech: "" })}
      render={(i, u) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" value={i.name} onChange={(v) => u({ name: v })} />
          <Field label="Tech stack" value={i.tech} onChange={(v) => u({ tech: v })} />
          <div className="sm:col-span-2"><Field label="URL" value={i.url} onChange={(v) => u({ url: v })} /></div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={i.description} onChange={(e) => u({ description: e.target.value })} rows={2} />
          </div>
        </div>
      )}
    />
  );
}

function CertsForm({ value, onChange }: { value: ResumeData["certifications"]; onChange: (v: ResumeData["certifications"]) => void }) {
  return (
    <ListShell items={value} onChange={onChange} addLabel="Add certification"
      blank={() => ({ id: uid(), name: "", issuer: "", date: "", url: "" })}
      render={(i, u) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" value={i.name} onChange={(v) => u({ name: v })} />
          <Field label="Issuer" value={i.issuer} onChange={(v) => u({ issuer: v })} />
          <div><Label>Date</Label><Input type="month" value={i.date} onChange={(e) => u({ date: e.target.value })} /></div>
          <Field label="URL" value={i.url} onChange={(v) => u({ url: v })} />
        </div>
      )}
    />
  );
}

function LanguagesForm({ value, onChange }: { value: ResumeData["languages"]; onChange: (v: ResumeData["languages"]) => void }) {
  return (
    <ListShell items={value} onChange={onChange} addLabel="Add language"
      blank={() => ({ id: uid(), name: "", proficiency: "Fluent" })}
      render={(i, u) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Language" value={i.name} onChange={(v) => u({ name: v })} />
          <Field label="Proficiency" value={i.proficiency} onChange={(v) => u({ proficiency: v })} />
        </div>
      )}
    />
  );
}

/* debounced autosave hook */
export function useAutosave<T>(value: T, save: (v: T) => Promise<void>, delay = 800) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const first = useRef(true);
  const lastSaved = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (first.current) { first.current = false; lastSaved.current = value; return; }
    if (JSON.stringify(value) === JSON.stringify(lastSaved.current)) return;
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        await save(value);
        lastSaved.current = value;
        setStatus("saved");
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }, delay);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [value, save, delay]);

  return status;
}

export function useStableValue<T>(v: T) {
  return useMemo(() => v, [JSON.stringify(v)]);
}
