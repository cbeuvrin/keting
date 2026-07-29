import type { EnArticle } from "./types";

// Traducción/adaptación de "posicionamiento-en-chatgpt-por-que-nadie-puede-garantizarlo"
// (Supabase, ES). Cada cifra citada fue verificada contra su fuente original en el
// artículo ES y se mantiene exacta aquí — no redondear ni cambiar.
const article: EnArticle = {
    slug: "why-nobody-can-guarantee-ai-search-rankings",
    esSlug: "posicionamiento-en-chatgpt-por-que-nadie-puede-garantizarlo",
    title: "Nobody Can Guarantee You GEO Results (And the Evidence Is Pretty Conclusive)",
    excerpt:
        "The same question to ChatGPT returns the same ranking once in a thousand times. Here's what the evidence — 600 volunteers, 3,000 runs, 12,933 responses analyzed — says about ranking guarantees in AI search, and how to read a GEO proposal without getting sold smoke.",
    category: "Artificial Intelligence",
    date: "Jul 2026",
    image: "/images/blog/geo-optimization.png",
    author: "Carlos Beuvrin",
    wordCount: 1527,
    readTime: 8,
    content: `
<p>If someone is selling you <strong>"guaranteed ranking on ChatGPT,"</strong> it's worth asking one simple question before you sign anything: <strong>guaranteed measured how, and against what baseline?</strong></p>

<p>The answer usually takes the whole pitch apart. Not because GEO is entirely smoke and mirrors, but because the system that the promise of control is built on is, by design, non-deterministic. And that's not a market opinion — it's measured.</p>

<h2>First: what is GEO?</h2>

<p><strong>GEO</strong> stands for <em>Generative Engine Optimization</em>. It's the SEO equivalent for AI systems that answer with text instead of a list of links: ChatGPT, Perplexity, Claude, Google's AI Overviews. The goal is no longer to rank first — it's to get the AI to <em>mention you</em> when someone asks who to hire.</p>

<p>It's a legitimate field, and there's real work to do in it. The problem isn't GEO: it's what gets promised about GEO.</p>

<h2>The number that breaks the promise</h2>

<p>Rand Fishkin (SparkToro) and Patrick O'Donnell (Gumshoe.ai) ran the most direct experiment possible: <strong>600 volunteers ran 12 identical prompts</strong> on ChatGPT, Claude, and Google's AI, about <strong>3,000 times in total</strong>.</p>

<p>The result: the probability of getting <strong>the same list of brands twice</strong> was <strong>less than 1 in 100</strong>. The probability of getting <strong>the same list in the same order</strong> was around <strong>1 in 1,000</strong> — about 0.1%.</p>

<p>Same question. Same model. Same day. And the answer practically never repeats. Not even the length is stable: the same query would sometimes return 2 or 3 options and sometimes more than 10.</p>

<p>Now think about what that means: <strong>the full ranking shown in a report — "these five brands, in this order" — has about a 1-in-1,000 chance of happening again.</strong> That's not a metric. It's a snapshot of a die mid-air.</p>

<p>One nuance matters here, so as not to overstate the case: that 1-in-1,000 figure applies to <em>the full list in the same order</em>, not to whether an individual brand reappears. Your brand showing up again is considerably more likely than that. What collapses isn't presence: <strong>it's position</strong>.</p>

<h2>It's not a bug in the system. It's the system.</h2>

<p>The intuitive reaction is to think "fine, it's noise — enough measurements and it averages out." That's partly true, and that's exactly where the deeper problem lies.</p>

<p>A variance-components analysis across <strong>12,933 responses</strong> (GPT-5.2, Gemini 3 Flash, and Perplexity, at temperature 0.3) tried to answer exactly this: of all the variation we see in whether a brand appears or not, how much is actually attributable to the brand itself?</p>

<p>The answer is uncomfortable:</p>

<div class="table-wrap"><table>
<thead>
<tr><th>Source of variance</th><th>Weight</th></tr>
</thead>
<tbody>
<tr><td>Query language</td><td><strong>26.5%</strong></td></tr>
<tr><td>Residual (interactions + resampling)</td><td><strong>69.3%</strong></td></tr>
<tr><td>Model identity</td><td>1.6%</td></tr>
<tr><td><strong>Brand identity</strong></td><td><strong>1.5%</strong></td></tr>
<tr><td>Specific prompt</td><td>1.1%</td></tr>
</tbody>
</table></div>

<p>Brand — the one thing your agency can actually touch — explains about <strong>1.5% of the variance</strong>. A single AI response has an intraclass correlation of <strong>0.0146</strong> for discriminating between brands; the authors describe it as "almost no brand-discriminating signal."</p>

<p>In plain terms: <strong>one loose query to ChatGPT about your brand carries no useful information</strong>. Not little information. Essentially none.</p>

<p>And there's one more detail: breaking down the residual on a stability subset (7,173 responses), <strong>34.8% of the variance comes from resampling within the same prompt</strong> — the model choosing a different continuation for an identical input, even at low temperature. That's structural randomness, not a lack of optimization.</p>

<h2>What the research says about GEO tactics</h2>

<p>This is where things get genuinely interesting. A critical survey of the 2023–2026 GEO literature reviewed what the evidence actually supports.</p>

<p><strong>On the famous "+40% visibility."</strong> This is the number that shows up in almost every sales pitch, taken from GEO's foundational paper. The survey clarifies that the 40% applies <em>only</em> to a document that was already included in a fixed context of five documents handed to the generator. It doesn't measure organic discoverability. It doesn't measure traffic. The underlying experiment is real; the commercial claim "GEO increases your visibility by 40%" is classified by the survey as <strong>rejected</strong>.</p>

<p><strong>On whether "recipes" transfer.</strong> In the C-SEO Bench benchmark, <strong>only 3 of 54 method-domain combinations showed statistical significance</strong> — and none came out positive for Q&A. What works in one vertical typically doesn't work in another.</p>

<p><strong>On optimizing page content.</strong> In SAGEO Arena, optimizing the body text alone <strong>reduced</strong> top-20 presence by 9%, top-10 presence by 16%, and final citation by 6%. Apparent gains evaporated — or reversed — once the full retrieval stages were included.</p>

<p><strong>On keyword stuffing and "authoritative tone."</strong> Consistently null or negative results. Fluency and tone effects are weak and unstable.</p>

<p><strong>On how many measurements you need.</strong> Source-level Jaccard scores between days drop to <strong>0.34–0.42</strong>, which implies a minimum of <strong>7 to 8 repetitions per prompt</strong> just to get a starting baseline.</p>

<p><strong>On a measurement bias almost nobody discloses.</strong> In <strong>57.8% of repetitions, ChatGPT didn't even trigger a web search</strong>. If your tool only analyzes responses that contain citations, you're measuring a biased sample of your own performance.</p>

<p>And the survey's overall conclusion: no technique reviewed demonstrated a stable, longitudinal, cross-platform causal effect on organic discoverability or user behavior. Confidence that "more citations ⇒ more clicks, conversions, or revenue" is classified as <strong>very low</strong>.</p>

<h2>The ground shifts on its own</h2>

<p>Even if you landed a result today, it's not yours to keep.</p>

<ul>
<li><strong>Rephrasing changes everything.</strong> In a sensitivity test across 30 query pairs and seven models, on Gemini every single pair changed the cited domains when the question was rephrased.</li>
<li><strong>A vendor update rewrites the board.</strong> When a widely used engine updates its retrieval rules, results shift simultaneously for the entire user base. You had no part in that decision, and nobody warned you.</li>
<li><strong>There's no unified ranking.</strong> <strong>53% of the domains cited by Google's AI Overviews don't appear in the organic top 10.</strong> Optimizing for one doesn't get you the other.</li>
<li><strong>Any edge erodes on its own.</strong> C-SEO Bench documented decay as adoption increases: congested dynamics that approach zero-sum. When everyone applies the same tactic, the tactic stops being an advantage.</li>
</ul>

<h2>So is it all smoke and mirrors?</h2>

<p>No, and this is the point where honesty is more useful than cynicism. There's real signal beneath the noise, and some findings point in an optimistic direction:</p>

<ul>
<li>In the same Fishkin study, certain names <strong>appeared in 60%–90% of responses</strong> for a given intent. The pattern concentrated in small, consolidated markets; mass-market categories scattered into chaos. In other words: the ordering is random, but set membership can be fairly stable.</li>
<li>A Peec AI analysis of <strong>37,804 responses</strong> across five engines found that prompt phrasing matters <em>less</em> than the industry assumes: brand visibility stays stable as long as the core intent is preserved.</li>
<li>The survey classifies with <strong>moderate confidence</strong> that extractable evidence — statistics, definitions, verbatim quotes — produces gains under controlled conditions. That's not the same as a guarantee, but it's about as solid as anything on the table.</li>
</ul>

<p>None of this is a guarantee. It's something better: <strong>it's a basis for working with the right expectations</strong>.</p>

<h2>How to read a GEO proposal</h2>

<p>Red flags:</p>

<ol>
<li><strong>"We guarantee the #1 spot on ChatGPT."</strong> The full ranking repeats about 1 time in 1,000. There is no stable #1 to guarantee.</li>
<li><strong>"We'll boost your visibility by 40%."</strong> Ask which paper that number comes from and exactly what condition it applies to.</li>
<li><strong>Reports based on one query per prompt.</strong> You need a minimum of 7–8 repetitions, and multiple languages where relevant. One query is an anecdote.</li>
<li><strong>Silence on language.</strong> Language accounts for 26.5% of the variance — more than model, brand, and prompt combined. A proposal that doesn't mention it hasn't read the evidence.</li>
<li><strong>No stated baseline.</strong> Without an initial appearance rate measured with a real method, "we improved it" means nothing.</li>
</ol>

<p>What a good provider can honestly promise:</p>

<ul>
<li>Measurement with a <strong>disclosed methodology</strong>: number of repetitions, prompts, languages, engines, dates.</li>
<li><strong>Appearance rate</strong> (share of voice) as the metric, not position.</li>
<li>Work on what's actually within your control: presence and consistency in the sources these systems actually retrieve from, structured data, extractable and citable evidence, and third-party reputation.</li>
<li><strong>Confidence intervals, not point promises.</strong></li>
</ul>

<h2>The bottom line</h2>

<p>The difference between a serious provider and one selling smoke isn't technical knowledge. Often it's the same knowledge. The difference is what they do with the uncertainty: <strong>disclose it or hide it</strong>.</p>

<p>A system where the same question returns the same ranking one time in a thousand doesn't allow for position guarantees. It allows for method, honest measurement, and calibrated expectations. Anyone offering you more than that either hasn't read the evidence, or is counting on you not having read it.</p>

<h2>Sources</h2>

<ul>
<li><a href="https://searchengineland.com/ai-recommendation-lists-rarely-repeat-study-468076" target="_blank">AI recommendation lists repeat less than 1% of the time — Search Engine Land</a> (study by Rand Fishkin / SparkToro and Patrick O'Donnell / Gumshoe.ai)</li>
<li><a href="https://arxiv.org/html/2607.13304" target="_blank">Where Does the Noise Come From? A Variance-Components Decomposition of Non-Determinism in LLM Brand Answers — arXiv</a></li>
<li><a href="https://arxiv.org/html/2607.14035v1" target="_blank">Optimizing Visibility in Generative Engines: A Critical Survey of Generative Engine Optimization (2023–2026) — arXiv</a></li>
<li><a href="https://arxiv.org/html/2606.12439" target="_blank">Position: Generative Engine Optimization Creates Underexamined Risks — arXiv</a></li>
<li><a href="https://www.searchenginejournal.com/ai-prompt-intent-keywords-peec-spa/576201/" target="_blank">Prompt Tracking: Does prompt variance % impact brand mentions? — Search Engine Journal</a> (Peec AI study)</li>
<li><a href="https://arxiv.org/abs/2311.09735" target="_blank">GEO: Generative Engine Optimization — foundational paper, arXiv</a></li>
</ul>
`,
};

export default article;
