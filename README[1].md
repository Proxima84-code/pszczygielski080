# Osmos Proxima – Technical SEO, Core Web Vitals & Edge Performance Auditor

Profesjonalna platforma inżynierska do rygorystycznego audytu Technical SEO, architektury brzegowej (Cloudflare Workers, Edge Computing), optymalizacji Core Web Vitals oraz implementacji mikropłatności Lightning L402 i protokołu Model Context Protocol (MCP).

---

## 🚀 Kluczowe Funkcjonalności

1. **Audytor Krawędziowy (Live Edge Auditor & HTTP Inspector):**
   - Odpytywanie na żywo serwerów i workerów brzegowych (domyślnie `https://osmos-proxima-agent.pszczygielski080.workers.dev/`).
   - Rzeczywisty pomiar Time to First Byte (TTFB) i inspekcja nagłówków odpowiedzi HTTP/2 oraz HTTP/3 (QUIC).
   - Walidacja typów MIME (`text/html` vs `text/plain`), dyrektyw `X-Robots-Tag`, `rel="canonical"`, `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff` oraz `Content-Security-Policy`.

2. **Dekompozycja Core Web Vitals (P1) & Laboratorium Telemetrii:**
   - **INP (Interaction to Next Paint):** rejestracja i dekompozycja 3 faz interakcji (`inputDelay`, `processingDuration`, `presentationDelay`) za pomocą `PerformanceObserver` (Event Timing API).
   - **Long Tasks Observer:** detekcja i liczenie zadań blokujących główny wątek (`> 50 ms`) oraz wzorce nieblokującej hydracji z wykorzystaniem `scheduler.yield()` i fallbacku `MessageChannel`.
   - **LCP (Largest Contentful Paint):** optymalizacja z nagłówkami `Link: ...; rel=preload` (103 Early Hints w Cloudflare), formatami AVIF/WebP oraz `fetchpriority="high"`.
   - **CLS (Cumulative Layout Shift):** geometryczne dopasowanie metryk fontów fallback (`size-adjust`, `ascent-override`, `descent-override`) eliminujące zjawisko FOUT/FOIT.
   - **Edge Telemetry Endpoint:** obsługa bezblokowej wysyłki danych analitycznych przez `navigator.sendBeacon` do `/api/telemetry/performance`.

3. **Generator Produkcyjny Cloudflare Worker (`worker.ts` & `wrangler.jsonc`):**
   - Kompletny kod workera z klasą `HTMLRewriter` (strumieniowe wstrzykiwanie canonical i Schema.org bez buforowania w RAM).
   - Obsługa dynamicznego routingu `/robots.txt` oraz `/sitemap.xml` na krawędzi sieci.
   - Obsługa kodów wycofania treści `410 Gone` oraz limitów zapytań `429 Too Many Requests` z nagłówkiem `Retry-After: 120`.
   - Krawędziowe buforowanie `caches.default` z nagłówkiem `Cache-Control: public, max-age=60, s-maxage=3600, stale-while-revalidate=86400` redukujące TTFB poniżej 20 ms.
   - Wbudowany interaktywny symulator żądań krawędziowych.

4. **Studio Schema.org JSON-LD:**
   - Walidator i generator encji zgodnych z Google Search Central (`WebSite`, `SoftwareApplication`, `Organization`, `BreadcrumbList`, `FAQPage`).
   - Podgląd wizualny formatowania w wynikach wyszukiwania Google (SERP Rich Snippets).

5. **Ekonomia Agenta & Model Context Protocol (MCP / L402):**
   - Integracja z protokołem mikropłatności L402 (Lightning Network HTTP 402 + Macaroons).
   - Specyfikacja narzędzi badawczych w formacie JSON-RPC 2.0 (`market_research_lookup`, `ecommerce_price_monitor`).
   - Gotowy wrapper klienta w języku Python dla agentów CrewAI i LangChain z automatyczną płatnością z portfela (np. NWC).
   - Interaktywny kalkulator P&L i analiza rentowności (marża EBITDA ~97,9% przy 15 000 zapytań dziennie dzięki Edge Tiered Caching).

6. **Audytor AI Gemini 3.8 Flash:**
   - Dedykowany moduł głębokiego wnioskowania technicznego generujący raporty inżynierskie w standardzie P0–P3.

---

## 🛠️ Architektura Techniczna

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend / Edge Proxy:** Express.js, Node.js (`server.ts`) zintegrowany z Vite middleware.
- **AI Engine:** `@google/genai` z modelem `gemini-3.8-flash`.
- **Runtime Krawędziowy:** Cloudflare Workers (V8 Isolate), kompatybilny z `wrangler`.

---

## 💻 Uruchomienie Lokalne

### Wymagania wstępne
- Node.js 20+ lub nowszy
- Opcjonalnie: klucz `GEMINI_API_KEY` do generowania raportów AI

### Instalacja i start

1. Zainstaluj zależności:
```bash
npm install
```

2. Skonfiguruj zmienne środowiskowe (opcjonalnie):
```bash
cp .env.example .env
# Dodaj swój klucz GEMINI_API_KEY w pliku .env
```

3. Uruchom serwer deweloperski:
```bash
npm run dev
```

Aplikacja wystartuje pod adresem: `http://localhost:3000`

### Budowanie do wersji produkcyjnej
```bash
npm run build
npm start
```

---

## 📋 Wdrożenie Cloudflare Worker (`worker.ts`)

Aby wdrożyć autonomicznego agenta brzegowego na Cloudflare Workers:

1. Przejdź do zakładki **Wdrożenie Edge (worker.ts)** w aplikacji lub skopiuj plik ze studia.
2. Zainstaluj narzędzie Wrangler:
```bash
npm install -g wrangler
```
3. Wdróż usługę na swoim koncie:
```bash
wrangler deploy
```

---

## 📄 Licencja

Projekt objęty licencją Apache-2.0.
