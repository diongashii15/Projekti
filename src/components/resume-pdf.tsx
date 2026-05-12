import { Document, Page, Text, View, StyleSheet, Image, Link } from "@react-pdf/renderer";
import type { ResumeData, TemplateId } from "@/lib/resume-types";

const fmt = (d: string) => {
  if (!d) return "";
  const [y, m] = d.split("-");
  if (!m) return y || "";
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(undefined, { month: "short", year: "numeric" });
};
const range = (s: string, e: string, current: boolean) => `${fmt(s)} — ${current ? "Present" : fmt(e)}`;

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#222" },
  // modern
  modernRoot: { flexDirection: "row" },
  sidebar: { width: "34%", backgroundColor: "#141432", color: "#fff", padding: 24 },
  main: { flex: 1, padding: 28 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 700, color: "#fff" },
  nameDark: { fontSize: 22, fontWeight: 700, color: "#1a1a2e" },
  jobTitle: { fontSize: 11, marginTop: 2 },
  sectionLabelLight: { fontSize: 9, marginTop: 16, marginBottom: 6, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1.4 },
  sectionLabelDark: { fontSize: 9, marginTop: 14, marginBottom: 6, color: "#4f46e5", textTransform: "uppercase", letterSpacing: 1.4, fontWeight: 700 },
  sidebarText: { color: "#fff", marginBottom: 3 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  bold: { fontWeight: 700 },
  meta: { color: "#666", fontSize: 9 },
  company: { color: "#4f46e5", fontSize: 10, marginTop: 1 },
  desc: { marginTop: 3, color: "#444", lineHeight: 1.4 },
  // classic
  classicHeader: { borderBottomWidth: 2, borderBottomColor: "#222", paddingBottom: 8, alignItems: "center" },
  upper: { textTransform: "uppercase", letterSpacing: 2 },
  classicSection: { marginTop: 12 },
  classicSectionTitle: { fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.4, borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 2, marginBottom: 6 },
  // minimal
  minRow: { flexDirection: "row", marginBottom: 8 },
  minDate: { width: 110, fontSize: 9, color: "#888" },
  minBody: { flex: 1 },
  pill: { borderWidth: 1, borderColor: "#e5e5e5", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginRight: 4, marginBottom: 4, fontSize: 9 },
  pillRow: { flexDirection: "row", flexWrap: "wrap" },
});

export function ResumePDF({ data, template }: { data: ResumeData; template: TemplateId }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        {template === "classic" ? <ClassicPDF d={data} /> : template === "minimal" ? <MinimalPDF d={data} /> : <ModernPDF d={data} />}
      </Page>
    </Document>
  );
}

function ModernPDF({ d }: { d: ResumeData }) {
  const p = d.personal;
  return (
    <View style={s.modernRoot}>
      <View style={s.sidebar}>
        {p.avatarUrl ? <Image src={p.avatarUrl} style={s.avatar} /> : null}
        <Text style={s.name}>{p.fullName || "Your Name"}</Text>
        {p.title ? <Text style={[s.jobTitle, { color: "rgba(255,255,255,0.7)" }]}>{p.title}</Text> : null}

        <Text style={s.sectionLabelLight}>Contact</Text>
        {p.email ? <Text style={s.sidebarText}>{p.email}</Text> : null}
        {p.phone ? <Text style={s.sidebarText}>{p.phone}</Text> : null}
        {p.location ? <Text style={s.sidebarText}>{p.location}</Text> : null}
        {p.website ? <Text style={s.sidebarText}>{p.website}</Text> : null}

        {d.skills.length > 0 && (
          <>
            <Text style={s.sectionLabelLight}>Skills</Text>
            {d.skills.map((sk) => (
              <Text key={sk.id} style={s.sidebarText}>{sk.name} · {sk.level}/5</Text>
            ))}
          </>
        )}

        {d.languages.length > 0 && (
          <>
            <Text style={s.sectionLabelLight}>Languages</Text>
            {d.languages.map((l) => <Text key={l.id} style={s.sidebarText}>{l.name} — {l.proficiency}</Text>)}
          </>
        )}

        {d.certifications.length > 0 && (
          <>
            <Text style={s.sectionLabelLight}>Certifications</Text>
            {d.certifications.map((c) => (
              <View key={c.id} style={{ marginBottom: 4 }}>
                <Text style={[s.sidebarText, s.bold]}>{c.name}</Text>
                <Text style={[s.sidebarText, { fontSize: 9, color: "rgba(255,255,255,0.7)" }]}>{c.issuer} · {fmt(c.date)}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      <View style={s.main}>
        {p.summary ? (
          <>
            <Text style={s.sectionLabelDark}>Summary</Text>
            <Text style={s.desc}>{p.summary}</Text>
          </>
        ) : null}

        {d.experience.length > 0 && (
          <>
            <Text style={s.sectionLabelDark}>Experience</Text>
            {d.experience.map((e) => (
              <View key={e.id} style={{ marginBottom: 8 }}>
                <View style={s.rowBetween}>
                  <Text style={s.bold}>{e.position}</Text>
                  <Text style={s.meta}>{range(e.startDate, e.endDate, e.current)}</Text>
                </View>
                <Text style={s.company}>{e.company}</Text>
                {e.description ? <Text style={s.desc}>{e.description}</Text> : null}
              </View>
            ))}
          </>
        )}

        {d.education.length > 0 && (
          <>
            <Text style={s.sectionLabelDark}>Education</Text>
            {d.education.map((ed) => (
              <View key={ed.id} style={{ marginBottom: 6 }}>
                <View style={s.rowBetween}>
                  <Text style={s.bold}>{ed.degree}{ed.field ? `, ${ed.field}` : ""}</Text>
                  <Text style={s.meta}>{range(ed.startDate, ed.endDate, false)}</Text>
                </View>
                <Text style={s.company}>{ed.school}</Text>
                {ed.description ? <Text style={s.desc}>{ed.description}</Text> : null}
              </View>
            ))}
          </>
        )}

        {d.projects.length > 0 && (
          <>
            <Text style={s.sectionLabelDark}>Projects</Text>
            {d.projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 6 }}>
                <View style={s.rowBetween}>
                  <Text style={s.bold}>{pr.name}</Text>
                  {pr.tech ? <Text style={s.meta}>{pr.tech}</Text> : null}
                </View>
                {pr.description ? <Text style={s.desc}>{pr.description}</Text> : null}
                {pr.url ? <Link src={pr.url} style={{ color: "#4f46e5", fontSize: 9 }}>{pr.url}</Link> : null}
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );
}

function ClassicPDF({ d }: { d: ResumeData }) {
  const p = d.personal;
  const contact = [p.email, p.phone, p.location, p.website].filter(Boolean).join(" · ");
  return (
    <View style={{ padding: 36 }}>
      <View style={s.classicHeader}>
        <Text style={[s.upper, { fontSize: 18, fontWeight: 700 }]}>{p.fullName || "Your Name"}</Text>
        {p.title ? <Text style={{ marginTop: 2, color: "#555", fontSize: 11 }}>{p.title}</Text> : null}
        {contact ? <Text style={{ marginTop: 4, color: "#666", fontSize: 9 }}>{contact}</Text> : null}
      </View>

      {p.summary ? (
        <View style={s.classicSection}><Text style={s.classicSectionTitle}>Summary</Text><Text>{p.summary}</Text></View>
      ) : null}

      {d.experience.length > 0 && (
        <View style={s.classicSection}>
          <Text style={s.classicSectionTitle}>Experience</Text>
          {d.experience.map((e) => (
            <View key={e.id} style={{ marginBottom: 6 }}>
              <View style={s.rowBetween}>
                <Text style={s.bold}>{e.position}, {e.company}</Text>
                <Text style={s.meta}>{range(e.startDate, e.endDate, e.current)}</Text>
              </View>
              {e.description ? <Text style={{ marginTop: 2 }}>{e.description}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {d.education.length > 0 && (
        <View style={s.classicSection}>
          <Text style={s.classicSectionTitle}>Education</Text>
          {d.education.map((ed) => (
            <View key={ed.id} style={s.rowBetween}>
              <Text><Text style={s.bold}>{ed.degree}</Text>{ed.field ? `, ${ed.field}` : ""} — {ed.school}</Text>
              <Text style={s.meta}>{range(ed.startDate, ed.endDate, false)}</Text>
            </View>
          ))}
        </View>
      )}

      {d.skills.length > 0 && (
        <View style={s.classicSection}>
          <Text style={s.classicSectionTitle}>Skills</Text>
          <Text>{d.skills.map((x) => x.name).join(" · ")}</Text>
        </View>
      )}

      {d.projects.length > 0 && (
        <View style={s.classicSection}>
          <Text style={s.classicSectionTitle}>Projects</Text>
          {d.projects.map((pr) => (
            <View key={pr.id} style={{ marginBottom: 4 }}>
              <Text style={s.bold}>{pr.name}{pr.tech ? ` — ${pr.tech}` : ""}</Text>
              {pr.description ? <Text>{pr.description}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {d.certifications.length > 0 && (
        <View style={s.classicSection}>
          <Text style={s.classicSectionTitle}>Certifications</Text>
          {d.certifications.map((c) => <Text key={c.id}>{c.name} — {c.issuer} ({fmt(c.date)})</Text>)}
        </View>
      )}

      {d.languages.length > 0 && (
        <View style={s.classicSection}>
          <Text style={s.classicSectionTitle}>Languages</Text>
          <Text>{d.languages.map((l) => `${l.name} (${l.proficiency})`).join(" · ")}</Text>
        </View>
      )}
    </View>
  );
}

function MinimalPDF({ d }: { d: ResumeData }) {
  const p = d.personal;
  return (
    <View style={{ padding: 36 }}>
      <Text style={{ fontSize: 22, fontWeight: 700 }}>{p.fullName || "Your Name"}</Text>
      {p.title ? <Text style={{ color: "#4f46e5", marginTop: 2 }}>{p.title}</Text> : null}
      <Text style={{ color: "#666", marginTop: 4, fontSize: 9 }}>{[p.email, p.phone, p.location, p.website].filter(Boolean).join("  ·  ")}</Text>
      {p.summary ? <Text style={{ marginTop: 12, color: "#444", lineHeight: 1.45 }}>{p.summary}</Text> : null}

      {d.experience.length > 0 && (
        <>
          <Text style={[s.sectionLabelDark, { color: "#888", marginTop: 18 }]}>Experience</Text>
          {d.experience.map((e) => (
            <View key={e.id} style={s.minRow}>
              <Text style={s.minDate}>{range(e.startDate, e.endDate, e.current)}</Text>
              <View style={s.minBody}>
                <Text style={s.bold}>{e.position} · <Text style={{ color: "#666", fontWeight: 400 }}>{e.company}</Text></Text>
                {e.description ? <Text style={{ marginTop: 2, color: "#444" }}>{e.description}</Text> : null}
              </View>
            </View>
          ))}
        </>
      )}

      {d.education.length > 0 && (
        <>
          <Text style={[s.sectionLabelDark, { color: "#888", marginTop: 14 }]}>Education</Text>
          {d.education.map((ed) => (
            <View key={ed.id} style={s.minRow}>
              <Text style={s.minDate}>{range(ed.startDate, ed.endDate, false)}</Text>
              <Text style={s.minBody}><Text style={s.bold}>{ed.degree}</Text>{ed.field ? `, ${ed.field}` : ""} — {ed.school}</Text>
            </View>
          ))}
        </>
      )}

      {d.skills.length > 0 && (
        <>
          <Text style={[s.sectionLabelDark, { color: "#888", marginTop: 14 }]}>Skills</Text>
          <View style={s.pillRow}>
            {d.skills.map((x) => <Text key={x.id} style={s.pill}>{x.name}</Text>)}
          </View>
        </>
      )}

      {d.projects.length > 0 && (
        <>
          <Text style={[s.sectionLabelDark, { color: "#888", marginTop: 14 }]}>Projects</Text>
          {d.projects.map((pr) => (
            <View key={pr.id} style={{ marginBottom: 4 }}>
              <Text style={s.bold}>{pr.name}</Text>
              {pr.description ? <Text style={{ color: "#444" }}>{pr.description}</Text> : null}
            </View>
          ))}
        </>
      )}

      {(d.certifications.length > 0 || d.languages.length > 0) && (
        <View style={{ flexDirection: "row", gap: 24, marginTop: 14 }}>
          {d.certifications.length > 0 && (
            <View style={{ flex: 1 }}>
              <Text style={[s.sectionLabelDark, { color: "#888", marginTop: 0 }]}>Certifications</Text>
              {d.certifications.map((c) => <Text key={c.id}>{c.name} — {c.issuer}</Text>)}
            </View>
          )}
          {d.languages.length > 0 && (
            <View style={{ flex: 1 }}>
              <Text style={[s.sectionLabelDark, { color: "#888", marginTop: 0 }]}>Languages</Text>
              {d.languages.map((l) => <Text key={l.id}>{l.name} — {l.proficiency}</Text>)}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
