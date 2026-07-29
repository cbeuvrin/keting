import type { EnArticle } from "./types";

// Adaptado (no traducción literal) de "lovable-que-es-cuanto-cuesta-y-hasta-donde-llega"
// (Supabase, ES) para un lector estadounidense evaluando Lovable. Los precios
// de Lovable ya están en USD en el original (Free/Pro $25/Business $50): no
// se convierten. El precio de la guía de costos propia sí se convierte a USD.
const article: EnArticle = {
    slug: "lovable-what-it-is-what-it-costs-and-where-it-falls-short",
    esSlug: "lovable-que-es-cuanto-cuesta-y-hasta-donde-llega",
    title: "Lovable: What It Is, What It Costs, and Where It Falls Short (An Honest AI Engineer's Take)",
    excerpt:
        "An honest 2026 guide to Lovable: what it is, real pricing (and the hidden cost of credits), what it builds well, where it hits a ceiling (security, maintenance), and when to move to engineering.",
    category: "Software Development",
    date: "Jul 2026",
    image: "",
    author: "Carlos Beuvrin",
    wordCount: 794,
    readTime: 4,
    content: `
<p><strong>Lovable</strong> is the go-to tool for building apps "without coding": you describe what you want in plain language, and it generates a working application. It's real, it's impressive — and it also has a ceiling almost nobody talks about. This is the honest guide, written by someone who builds software with AI every day.</p>

<h2>What is Lovable and how does it work?</h2>
<p>Lovable is an <strong>AI app builder</strong> — what's known as <em>vibe coding</em>: you type what you need into a chat — "an app where my clients can book appointments and pay" — and it generates a complete application: interface (React), database and user authentication (Supabase), and even deployment on your own domain. Within minutes you have something that looks and feels like a real product.</p>
<p>It runs on <strong>credits</strong>: every instruction you give it consumes credits based on complexity — how many files it touches, how tangled the logic is, whether it generates images or searches the web.</p>

<h2>How much does Lovable cost? (2026 pricing)</h2>
<ul>
<li><strong>Free — $0:</strong> about 5 messages a day and 1–2 projects. Enough to try the tool; short for building something real (an active iteration session can burn through it in 30–60 minutes).</li>
<li><strong>Pro — from $25/month (billed annually):</strong> ~100 monthly credits and several projects. The typical plan for building in earnest.</li>
<li><strong>Business — from $50/month</strong>, and <strong>Enterprise</strong> at custom pricing.</li>
</ul>
<p><strong>The hidden cost: credits fly.</strong> A basic app with user sign-up burns 30–60 credits just on the initial build; add a couple of rounds of fixes and payment integration, and the month's 100 credits are gone in the first week. Lovable's real price isn't the subscription — it's the subscription <em>times the months of iteration</em> it takes to get to something usable.</p>

<h2>What Lovable does really well</h2>
<ul>
<li><strong>Validating an idea:</strong> going from "I have an idea" to "look, it works" in an afternoon. Nothing does it faster.</li>
<li><strong>MVPs and demos</strong> to show clients or investors.</li>
<li><strong>Simple internal tools</strong> that carry low risk.</li>
<li><strong>Learning:</strong> understanding what's possible before committing to formal development.</li>
</ul>

<h2>Where it hits a ceiling (what the marketing won't tell you)</h2>
<ul>
<li><strong>Maintenance.</strong> The generated code grows messy. By month three, every new change breaks something old, and the AI "fixes" one thing by breaking another. Without someone who understands the code, you're stuck in a patch cycle.</li>
<li><strong>Security.</strong> Lovable generates the database, but the <em>access rules</em> (who can read and write what) are often left misconfigured. There are Lovable-built apps exposing customer data without their owners knowing.</li>
<li><strong>The final 20%.</strong> Billing, edge cases, integrations with your real operation — exactly what turns a demo into a business — is where AI alone stalls.</li>
<li><strong>Long-term cost.</strong> Between the subscription, extra credits, and months of iteration, a "cheap" project can end up costing what a small professional build would — without the solidity.</li>
</ul>

<h2>How does it compare to v0, Bolt, or Replit?</h2>
<p>Lovable is the most complete option for non-technical founders (a full app with database and login). <strong>v0</strong> wins if you only need interfaces; <strong>Bolt</strong> is faster for disposable prototypes; <strong>Replit</strong> makes sense for internal tools with hosting included. We covered the full comparison in our <a href="/en/blog/can-i-build-my-app-or-website-with-ai-alone-vibe-coding">vibe coding guide</a>.</p>

<h2>When to move from Lovable to engineering</h2>
<p>The signal is clear: <strong>when the app stops being an experiment and starts having real users, payments, or data.</strong> At that point, what you built in Lovable is an excellent prototype — not a finished product. At <a href="/en/desarrollo-de-software">Keting Media</a> we use AI across our entire process (that's why we build fast), but directed by engineering: architecture, reviewed security, and code that holds up as it grows. And we increasingly do <strong>Lovable project rescues</strong>: we audit what was generated, save what's useful, and rebuild it on a solid foundation.</p>

<h2>Frequently asked questions</h2>
<p><strong>Is Lovable free?</strong> It has a free tier (~5 messages/day), useful for testing. To build something real you'll need Pro (from $25/month) and likely extra credits.</p>
<p><strong>Can I use Lovable in Spanish?</strong> Yes — it understands instructions in Spanish without issue, though the interface and documentation are in English.</p>
<p><strong>Does it work for an app with payments?</strong> It can integrate them, but that's exactly where the most security and billing mistakes show up. With real money involved, have an engineer review it before launch.</p>
<p><strong>Is it safe for production?</strong> For low-risk projects, acceptable. For customer data, payments, or critical operations: only with an engineering review (access rules, backups, monitoring).</p>
<p><strong>I built my app in Lovable and want to take it seriously — is that possible?</strong> Yes. The code is yours (it can be exported to GitHub), and an engineering team can audit it and evolve it — or rebuild on what you learned. It's one of the services we get asked for most these days.</p>
`,
};

export default article;
