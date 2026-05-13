Cloud Resume Hub - Dokumentacioni i Projektit
Ky projekt eshte nje aplikacion web per menaxhimin e CV-ve i ndertuar me React, Vite dhe Supabase.

Teknologjite
Frontend: React 18, Vite, Tailwind CSS

Backend: Supabase (Database dhe Autentikim)

Hosting: Vercel

Struktura e Folderave
Projekti kryesor ndodhet brenda folderit: /Projekti/projekti

Konfigurimi i Variablave .env
Per te lidhur aplikacionin me databazen, krijo nje skedar me emrin .env brenda folderit /projekti dhe vendos kete tekst:

Code snippet
VITE_SUPABASE_URL="https://ekgeskwvnoldrsiathuh.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_H9yYSfdcAvUGwTbBssxMuQ_B5oVikbo"
VITE_SUPABASE_PROJECT_ID="ekgeskwvnoldrsiathuh"
Udhezimet per Instalimin
Klononi repozitorin nga GitHub:
git clone https://github.com/diongashii15/Projekti.git

Hyni ne folderin e punes:
cd Projekti/projekti

Instaloni paketat e nevojshme:
npm install

Nisni projektin ne localhost:
npm run dev

Build per Deploy
Per te krijuar versionin final per publikim ne Vercel, perdorni komanden:
npm run build

Ky proces do te gjeneroje folderin /dist i cili permban kodin e gatshem per server.

Autori
Zhvilluar nga diongashii15.
