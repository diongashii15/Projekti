import type { ResumeData, TemplateId } from "@/lib/resume-types";

const fmtDate = (d: string) => {
  if (!d) return "";
  const [y, m] = d.split("-");
  if (!y) return d;
  if (!m) return y;
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(undefined, { month: "short", year: "numeric" });
};

const range = (start: string, end: string, current: boolean) =>
  `${fmtDate(start)} — ${current ? "Present" : fmtDate(end)}`;

interface Props {
  data: ResumeData;
  template: TemplateId;
}

export function ResumePreview({ data, template }: Props) {
  if (template === "classic") return <Classic data={data} />;
  if (template === "minimal") return <Minimal data={data} />;
  return <Modern data={data} />;
}

/* ---------- MODERN (left sidebar) ---------- */
function Modern({ data }: { data: ResumeData }) {
  const p = data.personal;
  return (
    <div className="grid grid-cols-[34%_1fr] bg-white text-[#1a1a2e]" style={{ minHeight: 1123 }}>
      <aside className="bg-[#141432] p-8 text-white">
        {p.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.avatarUrl} alt="" className="mb-5 h-28 w-28 rounded-full object-cover ring-2 ring-white/20" />
        )}
        <h1 className="font-display text-2xl font-bold leading-tight">{p.fullName || "Your Name"}</h1>
        <p className="mt-1 text-sm text-white/70">{p.title}</p>

        <Section dark title="Contact">
          {p.email && <Row text={p.email} />}
          {p.phone && <Row text={p.phone} />}
          {p.location && <Row text={p.location} />}
          {p.website && <Row text={p.website} />}
        </Section>

        {data.skills.length > 0 && (
          <Section dark title="Skills">
            <ul className="space-y-2 text-sm">
              {data.skills.map((s) => (
                <li key={s.id}>
                  <div className="flex justify-between"><span>{s.name}</span><span className="text-white/60">{s.level}/5</span></div>
                  <div className="mt-1 h-1 w-full rounded bg-white/10">
                    <div className="h-1 rounded bg-gradient-to-r from-[#4f46e5] to-[#a78bfa]" style={{ width: `${(s.level / 5) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {data.languages.length > 0 && (
          <Section dark title="Languages">
            <ul className="space-y-1 text-sm">
              {data.languages.map((l) => (
                <li key={l.id} className="flex justify-between"><span>{l.name}</span><span className="text-white/60">{l.proficiency}</span></li>
              ))}
            </ul>
          </Section>
        )}

        {data.certifications.length > 0 && (
          <Section dark title="Certifications">
            {data.certifications.map((c) => (
              <div key={c.id} className="mb-3 text-sm">
                <div className="font-semibold">{c.name}</div>
                <div className="text-white/70">{c.issuer} · {fmtDate(c.date)}</div>
              </div>
            ))}
          </Section>
        )}
      </aside>

      <main className="p-10">
        {p.summary && (
          <Section title="Summary"><p className="text-sm leading-relaxed text-[#444]">{p.summary}</p></Section>
        )}

        {data.experience.length > 0 && (
          <Section title="Experience">
            {data.experience.map((e) => (
              <div key={e.id} className="mb-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{e.position}</h3>
                  <span className="text-xs text-[#666]">{range(e.startDate, e.endDate, e.current)}</span>
                </div>
                <div className="text-sm text-[#4f46e5]">{e.company}</div>
                {e.description && <p className="mt-1.5 whitespace-pre-line text-sm text-[#444]">{e.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {data.education.length > 0 && (
          <Section title="Education">
            {data.education.map((ed) => (
              <div key={ed.id} className="mb-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</h3>
                  <span className="text-xs text-[#666]">{range(ed.startDate, ed.endDate, false)}</span>
                </div>
                <div className="text-sm text-[#4f46e5]">{ed.school}</div>
                {ed.description && <p className="mt-1 text-sm text-[#444]">{ed.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {data.projects.length > 0 && (
          <Section title="Projects">
            {data.projects.map((pr) => (
              <div key={pr.id} className="mb-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{pr.name}</h3>
                  {pr.tech && <span className="text-xs text-[#666]">{pr.tech}</span>}
                </div>
                {pr.description && <p className="mt-1 text-sm text-[#444]">{pr.description}</p>}
                {pr.url && <a className="text-xs text-[#4f46e5]" href={pr.url}>{pr.url}</a>}
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  );
}

/* ---------- CLASSIC (centered, serif feel) ---------- */
function Classic({ data }: { data: ResumeData }) {
  const p = data.personal;
  return (
    <div className="bg-white p-12 text-[#222]" style={{ minHeight: 1123 }}>
      <header className="border-b-2 border-[#222] pb-4 text-center">
        <h1 className="font-display text-3xl font-bold tracking-wide uppercase">{p.fullName || "Your Name"}</h1>
        <p className="mt-1 text-sm tracking-wider text-[#555]">{p.title}</p>
        <p className="mt-2 text-xs text-[#666]">
          {[p.email, p.phone, p.location, p.website].filter(Boolean).join(" · ")}
        </p>
      </header>

      {p.summary && <ClassicSection title="Summary"><p className="text-sm">{p.summary}</p></ClassicSection>}

      {data.experience.length > 0 && (
        <ClassicSection title="Experience">
          {data.experience.map((e) => (
            <div key={e.id} className="mb-4">
              <div className="flex justify-between">
                <span className="font-semibold">{e.position}, {e.company}</span>
                <span className="text-xs text-[#666]">{range(e.startDate, e.endDate, e.current)}</span>
              </div>
              {e.description && <p className="mt-1 whitespace-pre-line text-sm">{e.description}</p>}
            </div>
          ))}
        </ClassicSection>
      )}

      {data.education.length > 0 && (
        <ClassicSection title="Education">
          {data.education.map((ed) => (
            <div key={ed.id} className="mb-3 flex justify-between text-sm">
              <span><span className="font-semibold">{ed.degree}</span>{ed.field && `, ${ed.field}`} — {ed.school}</span>
              <span className="text-xs text-[#666]">{range(ed.startDate, ed.endDate, false)}</span>
            </div>
          ))}
        </ClassicSection>
      )}

      {data.skills.length > 0 && (
        <ClassicSection title="Skills">
          <p className="text-sm">{data.skills.map((s) => s.name).join(" · ")}</p>
        </ClassicSection>
      )}

      {data.projects.length > 0 && (
        <ClassicSection title="Projects">
          {data.projects.map((pr) => (
            <div key={pr.id} className="mb-3">
              <div className="font-semibold">{pr.name}{pr.tech && <span className="font-normal text-[#666]"> — {pr.tech}</span>}</div>
              {pr.description && <p className="text-sm">{pr.description}</p>}
            </div>
          ))}
        </ClassicSection>
      )}

      {data.certifications.length > 0 && (
        <ClassicSection title="Certifications">
          {data.certifications.map((c) => (
            <div key={c.id} className="text-sm">{c.name} — {c.issuer} ({fmtDate(c.date)})</div>
          ))}
        </ClassicSection>
      )}

      {data.languages.length > 0 && (
        <ClassicSection title="Languages">
          <p className="text-sm">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" · ")}</p>
        </ClassicSection>
      )}
    </div>
  );
}

/* ---------- MINIMAL ---------- */
function Minimal({ data }: { data: ResumeData }) {
  const p = data.personal;
  return (
    <div className="bg-white p-12 text-[#1a1a1a]" style={{ minHeight: 1123 }}>
      <h1 className="font-display text-4xl font-bold">{p.fullName || "Your Name"}</h1>
      <p className="mt-1 text-sm text-[#4f46e5]">{p.title}</p>
      <p className="mt-2 text-xs text-[#666]">{[p.email, p.phone, p.location, p.website].filter(Boolean).join("  ·  ")}</p>

      {p.summary && <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#444]">{p.summary}</p>}

      {data.experience.length > 0 && (
        <MinSection title="Experience">
          {data.experience.map((e) => (
            <div key={e.id} className="mb-4 grid grid-cols-[140px_1fr] gap-4">
              <div className="text-xs text-[#888]">{range(e.startDate, e.endDate, e.current)}</div>
              <div>
                <div className="font-semibold">{e.position} · <span className="font-normal text-[#666]">{e.company}</span></div>
                {e.description && <p className="mt-1 whitespace-pre-line text-sm text-[#444]">{e.description}</p>}
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {data.education.length > 0 && (
        <MinSection title="Education">
          {data.education.map((ed) => (
            <div key={ed.id} className="mb-3 grid grid-cols-[140px_1fr] gap-4 text-sm">
              <div className="text-xs text-[#888]">{range(ed.startDate, ed.endDate, false)}</div>
              <div><span className="font-semibold">{ed.degree}</span>{ed.field && `, ${ed.field}`} — {ed.school}</div>
            </div>
          ))}
        </MinSection>
      )}

      {data.skills.length > 0 && (
        <MinSection title="Skills">
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span key={s.id} className="rounded-full border border-[#e5e5e5] px-3 py-1 text-xs">{s.name}</span>
            ))}
          </div>
        </MinSection>
      )}

      {data.projects.length > 0 && (
        <MinSection title="Projects">
          {data.projects.map((pr) => (
            <div key={pr.id} className="mb-3">
              <div className="font-semibold">{pr.name}</div>
              {pr.description && <p className="text-sm text-[#444]">{pr.description}</p>}
            </div>
          ))}
        </MinSection>
      )}

      {(data.certifications.length > 0 || data.languages.length > 0) && (
        <div className="mt-8 grid grid-cols-2 gap-8">
          {data.certifications.length > 0 && (
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#888]">Certifications</h2>
              {data.certifications.map((c) => <div key={c.id} className="text-sm">{c.name} — {c.issuer}</div>)}
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#888]">Languages</h2>
              {data.languages.map((l) => <div key={l.id} className="text-sm">{l.name} — {l.proficiency}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */
function Section({ title, children, dark }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section className="mb-6">
      <h2 className={`mb-3 text-xs font-semibold uppercase tracking-widest ${dark ? "text-white/60" : "text-[#4f46e5]"}`}>{title}</h2>
      {children}
    </section>
  );
}
function Row({ text }: { text: string }) {
  return <div className="mb-1 text-sm text-white/90 break-words">{text}</div>;
}
function ClassicSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 border-b border-[#ccc] pb-1 text-xs font-bold uppercase tracking-widest">{title}</h2>
      {children}
    </section>
  );
}
function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#888]">{title}</h2>
      {children}
    </section>
  );
}
