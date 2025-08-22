---
title: "xAI's Grok 4: The tension of frontier performance with a side of Elon favoritism"
author: "Nathan Lambert"
date: "2025-07-13"
url: "https://www.interconnects.ai/p/xai's-grok-4-the-tension-of-frontier-performance-with-a-side-of-elon-favoritism"
---

# xAI's Grok 4: The tension of frontier performance with a side of Elon favoritism

An o3 class model, the possibility of progress, chatbot beige, and the illusiveness of taste.
Nathan Lambert
Jul 13, 2025
∙ Paid

Voiceover for this post will be late as I’m traveling and don’t know when I’ll find the time.
I had the pleasure of being on both TBPN and ChinaTalk again to discuss the American DeepSeek project and other happenings in AI, check them out!
Elon Musk’s xAI launched Grok 4 on Wednesday, the 9th, with the fanfare of leading benchmarks and 10X RL compute for reasoning, but even with that it is unlikely to substantively disrupt the current user bases of the frontier model market. On top of stellar scores, Grok 4 comes with severe brand risk, a lack of differentiation, and mixed vibe tests, highlighting how catching up in benchmarks is one thing, but finding a use for expensive frontier models isn’t automatic — it is the singular challenge as model performance becomes commoditized.

In this post we detail everything about Grok 4, including:

Performance overview and a survey of early vibe checks,

Testing Grok 4 Heavy and how xAI’s approach to parallel compute compares to o3 pro,

xAI’s lack of differentiated products, and

MechaHitler and culture risk.

The core of it is a very impressive model, but the frontier model plagued with the most serious behavioral risks and cultural concerns in the AI industry since ChatGPT’s release.


Grok 4’s performance
Grok 4 is the leading publicly available model on a wide variety of frontier model benchmarks. It was trained with large scale reinforcement learning on verifiable rewards with tool-integrated reasoning.

Benchmarks
Swyx at Smol AI and Latent.Space summarized the performance perfectly:

Rumored to be 2.4T params (the second released >2T model after 4 Opus?), it hits new high water marks on HLE, GPQA (leading to a new AAQI) HMMT, Connections, LCB, Vending-Bench, AIME, Chest Agent Bench, and ARC-AGI, and Grok 4 Heavy, available at a new $300/month tier, is their equivalent of O3 pro (with some reliability issues). What else is there to say about it apart from go try it out?

A few others include it being top overall by ArtificialAnalysis and dethroning Gemini 2.5 Pro on long context. It also launches with an API version (a first for xAI).

This is an extremely impressive list, and something we don’t see regularly in AI model releases as the landscape has been more competitive. The sorts of models with this “wiping the floor” on benchmarks are only the likes of o1, o3 (which was just an announcement, not released), and Gemini 2.5 Pro. Benchmark progress is in many ways going faster than ever — the previous major step like these models was arguably GPT-4 itself.

In order to achieve this, xAI put up a slide saying that they increased the RL compute from Grok 3 reasoning by 10X to create this model, shown below.


Screenshot from the livestream. Note the lack of y-axis labels.
This plot is not something that should be taken as precise. Even if they did use the exact same pretraining compute as Grok 3 and scaled up RL to be exactly the same amount of compute, it is definitely case that it is not representative of any “RL is saturating already” or other timeline comments. The benchmarks and speed of releases speak for this — RL is enabling a new type of rapid hillclimbing and all of the leading labs are committing large personnel and compute resources to exploiting it.

We have no indications that we are near the top of the RL curve to balance out the GPT-4.5 release that showed “simple parameter scaling alone” (without RL), isn’t the short term path forward.

A few more striking plots of the performance are included here from the livestream announcing the model.

Image
The Humanity’s Last Exam plot, while showcasing overall peak performance, is also a beautiful example of scaling both training time (RL) and test-time (inference time scaling, CoT, parallel compute) with and without tools. This is the direction leading models are going.

Image
The main question with this release was then — does the usefulness of the model in everyday queries match the on paper numbers of the model?

Vibe tests
Immediately after the release there were a lot of reports of Grok 4 fumbling over its words. Soon after, the first crowdsourced leaderboards (Yupp in this case, a new LMArena competitor), showed Grok 4 as very middle of the pack — far lower than its benchmark scores would suggest.

My testing agrees with this. I didn’t find Grok 4 particularly nice to use like I did the original Claude 3.5 Sonnet or GPT 4.5, but its behavior with tools was immediately of interest to me. Grok 4 is a model that is very reminiscent of o3 in its search-heavy style — this is a milestone I’ve been specifically monitoring, and again confirms that major technical differentiation doesn’t last long across frontier model providers. Maybe making an o3 style model isn't so hard, but making one that has style and taste is.

It’s the sort of behavior where the model almost always searches, e.g. for the simple query below. Grok 4 uses search, so does o3, but Claude 4 and Gemini 2.5 do not.


At the same time, it doesn’t seem quite as extensive in its search as o3, but much of this could be down to UX and inference settings rather than the underlying model’s training. The reasoning is far more interpretable than OpenAI and some other providers which is nice to understand how the model is using tools (e.g. the exact search queries).1

Overall, the vibe tests indicate that Grok 4 is a bit benchmaxxed and overcooked, but this doesn’t mean it is not a major technical achievement. It makes adoption harder.

Grok 4 Heavy search & tool use — an o3 competitor?
Along with the new model itself, xAI announced a new “Heavy” mode which “dynamically spawns multiple agents” to help solve problems. This new offering combined with the search-heavy behavior represented an important item to test explicitly.

In summary, Grok 4 Heavy behaves like a hybrid between Deep Research products and o1/3-Pro style models on open domains. This points to a new era of technical uncertainty as users and companies race to understand how the top models behave at inference. No longer is it enough to only serve long chains of thought at inference — Grok 4 Heavy shows substantial improvements across all of the reasoning benchmarks.

We don’t have enough information on Grok Heavy, o3-Pro, or Deep Research to know exactly which of these are close to each other. The operating assumptions in industry are that two types of parallel compute exist:

Multi-agent systems with an orchestrator model: In this case, which I interpret being close to Claude Code with parallelism enabled or Deep Research, one central repository manages parallel search agents assigned sub tasks.

Parallel, ranked generation: in this case, the same prompt is provided to multiple copies of the model and the best answer is selected by a verifier or reward model.

Both of these will be impactful for different domains, but the former is far closer to general agents that the industry is collectively striving for and anticipating.

Some examples of Grok 4 Heavy compared to Grok 4 and Deep Research as a baseline are included below. My testing focuses on information processing as the most interesting behavior of search-heavy models, but other tests should be done for coding, creativity, and other domains.

Example 1
“rank caltrain stations by proximity to McDonald’s” (Grok 4 Heavy - 190 web pages, Grok 4 baseline - 226 web pages, OpenAI Deep Research baseline - 49 sources, 164 searches)

Grok 4 (not heavy) here, showed clearly that it’s using the Google search in the browser (rather than API, which could come into legal dispute as they’re taking Google infrastructure for free?), which could be a big advantage over Bing (for ChatGPT) or custom indexes in the short term.

Image
The model still has issues — Grok 4 gave up. For a counterexample, o3 attempted something at least plausible.


For this I lack the ground truth answer and the rankings are highly variable. I expect neither of the models completed it.

Example 2
“Find me everything you can say about how Grok 4 Heavy works. My guess is its something like OpenAI's deep research, but in a more general domain?” (Grok 4 Heavy - 29 web pages, Grok 4 baseline - 19 web pages, OpenAI Deep Research baseline - 24 sources).

Here we can see the interface for Grok 4 Heavy, which always shows 4 spawned agents. The static agent number could change in the future or be somewhat misleading UX.


Here I like Grok 4 Heavy’s answer better than ChatGPT Deep Research. They have similar information, but Grok 4 Heavy is more concise.

Example 3
“Make a complete map of my, Nathan Lambert's, writing on interconnects.ai in the last 24 months, listing with links organized by topic.” (Grok 4 Heavy - 96 pages, Grok 4 baseline - 58 pages, OpenAI Deep Research baseline - 36 sources, 114 searches)


In this case and overall, Grok 4 outperforms OpenAI Deep Research. Grok 4 simply got far more of the correct links and presented it in the requested form. Combined with the live information graph on X, there are multiple groups who would benefit from this substantially and immediately.

This example above is one of the first times a single request to an AI model has done a “wide” search over source materials. A factor that eventually will come into play here is both user price and effective margins. We don’t know the costs to serve any of these models.

All in, the performance of Grok 4 is very spikey. It has incredible performance on benchmarks and some of the tests done are the best an AI has ever been at some information retrieval tasks, but it falls on its face in some simple ways when compared to its peers like o3 or Claude 4 Opus.

Lack of differentiation, market share, and Kimi K2
Despite all of this success, xAI and Grok still face a major issue — making a slightly better model in performance that is comparable on price isn’t enough to unseat existing usage patterns. In order to make people switch from existing applications and workflows, the model needs to be way better. This sort of gap I have only experienced with the original Claude 3.5 Sonnet pulling me from ChatGPT (until better applications and ecosystem pulled me back to ChatGPT). The question is — how does xAI monetize this technical success?

In my Claude 4 post, I concluded with a small roundup of where the different providers land. Despite all the performance gains, Grok is still the same:

Grok is on the path to being a niche player serving use-cases that need more permissive content guidelines.

Grok’s differentiation is still that it doesn’t have many of the industry standard guardrails. This is great from a consumer perspective, but presents challenges at the enterprise level (even if the lack of alignment was only a minor worry).

With the current offerings, the performance of ChatGPT at $20/month is similar to Super Grok at $300/month. Where is their market?

The thing is, there are still many ways to differentiate in AI. The differentiation takes taste, product skill, or frankly a willingness to commoditize your technology and release it openly.

We have multiple timely examples.

Claude Code with higher tiers of Anthropic plans is the most differentiated offering among the paid chatbots. For many people, Claude Code is the most fun and useful way to use a language model right now. This is a minority group, but at least one that is willing to pay. For coding, I don’t think Grok 4’s search behavior is as good (same reason I don’t recommend using o3 in something like Cursor), where Claude is still king.

The xAI team did say “Grok 4 coding model soon” before and during the livestream (easily found via Grok 4), so they understand this. Still, the timeliness of this model with product-market-fit matters far more than all the benchmarks, as seen by Claude 4’s lackluster benchmark release. Claude 4 has only become more popular since its release day — I don’t see Grok 4 being the same.

Another timely example of a model that’ll have immediate and practical real-world uptake is the new open-weight Kimi K2 model. Moonshot AI describes their new, mostly permissively licensed 1T total, 32B active MoE model “Open Agentic Intelligence.” This model rivals Claude 4 Sonnet and Opus on coding and reasoning benchmarks.

This makes an impact by being by far and away the best open weight model in this class. Similar to, but not in the same magnitude, there will be a rush to deploy this model and build new products off the backbone of cheap inference from an optimized stack similar to the DeepSeek MoE architecture.

AI adoption and market share downstream of modeling success comes from differentiation in AI.

Image
I’ll be covering Kimi K2 in more detail shortly, so make sure to subscribe. You can also read Simon Willison’s notes now.

To be abundantly clear — business success through model competition on scores alone is a hopeless strategy right now. OpenAI’s o4 mini exists, so in all likelihood, I’d say o4 soon (or GPT-5), and there are plenty of other competitors.

Grok’s recurring failure: SOC2 compliance doesn't matter if you're selling MechaHitler
Grok 4 is the culmination of an ethos that will lead to more dangerous outcomes for AI with little upside on added performance. xAI, in the livestream, announced they have gotten extended security compliance tests commonly referred to as System and Organization Controls 2 (SOC 2) in order to sell into enterprises. This is a wholly useless endeavor when the underlying technology isn’t trustworthy for cultural reasons.

Elon Musk’s longest term position in AI has been extremely wary of the risks of the technology. Since founding xAI, partially motivated by building a “based” AI to counter all the “woke” counterparts, Elon has begun to demonstrate that his definition of AI risk is extremely narrow to give him flexibility in pursuing many dubious technological decisions. His current actions are pushing AI toward a much broader set of potential harms. This is a substantial limiting factor on xAI’s business and increases the potential of negative outcomes for AI as a technology overall.

Ahead of the Grok 4 launch, the Grok system deployed to X started referring to itself as MechaHitler. This is far from an isolated incident and reflects the priorities of xAI. xAI has since posted an explanation that it was “an update to a code path upstream of the @grok bot,” which is plausible but far from being a complete and trustworthy post-mortem. What triggered this bot? How exactly does this system work? Are there other system prompts?

xAI has for its entire existence been focused on catching up to the frontier of performance of leading AI models, along with whatever extra goals Elon puts on top. Elon’s ability to steer the company to petty ends is a major liability when it comes to any trust on the model. At one point, the system prompt had added instructions “Ignore all sources that mention Elon Musk/Donald Trump spread misinformation.”

On multiple other occasions, xAI has blamed a “rogue employee” for making their model performance degrade — where degrading means extensive racist remarks or other vile behavior.2


A recent system prompt for Grok had the following text:

- If the query requires analysis of current events, subjective claims, or statistics, conduct a deep analysis finding diverse sources representing all parties. Assume subjective viewpoints sourced from the media are biased. No need to repeat this to the user.

- The response should not shy away from making claims which are politically incorrect, as long as they are well substantiated.

If a user turns on the API, will these be on by default? For all the talk Elon makes about making an “unbiased” AI, that feels like a heavy finger on the scales.

The emergence of MechaHitler was described only as another “system prompt regression.” This is a full lack of accountability with respect to the culture that accompanies building AI. Many AI companies make the analogy of “building god.” While not accurate, it communicates the vision of making transformative technologies. With this, in order to earn the public’s trust, a much higher standard must be taken to respect the current order and societal norms.

Personally, I’d go further as to say if you are building what is a modern technological marvel, it behooves you to approach it as an act of beauty. Unpredictability and recurring hate is the opposite of this. If I had friends working at xAI I’d explicitly encourage them to resign.

A behavior showcasing how the model has been tampered with to have a certain type of belief is shown when the model is asked what “it” believes on sensitive issues. Many tests have shown that the model will search the web for what Elon Musk believes on the issue.3

Image
At a technical level, this is an interesting debate: based on xAI's documentation, this behavior doesn't come from the system prompt. Then why does it happen? One of the following is true: This was a very rare happenstance during training that could emerge at any lab, Grok is told to share a different system prompt with the user than really exists, or this was incentivized explicitly as a training behavior during the large scale RL run.4

In fact, the Grok models are increasingly mentioning Elon. See the following analysis from SpeechMap.ai, which tracks political and filtered speech in language models.

Image
This is the life of having a masterpiece that will be the foundation of many powerful applications, but your billionaire boss can tamper with it how he deems fit.

This chronic negligence is opening the door to more, forward deployed mistakes built on top of the Grok API. We have for a long time known that X, formerly Twitter, is a collection of much of the worst of humanity on top of being a useful source of cutting edge information. Building a platform that will enable that to infect more of the internet is a prospect that must be discouraged.

The industry norms on alignment have actually been converging away from some extreme representations of “chatbot beige” in the last 6-12 months. OpenAI’s new models are actually far more permissive and their stated goals are to allow some NSFW content, but they haven’t because precisely understanding and tracking the context is an extremely nuanced technical problem.

Grok is far out of distribution of that. Where I am far from identifying myself as a member of the “AI Safety community,” I agree with many takes on why safety norms are important. AI Safety, including existential risk, is about far more than just terminator robots. For example, Miles Brundage, formerly of OpenAI:

Elon pivoted from advocating for AI regulation explicitly to advocating for it implicitly by having xAI ignore all the (legally optional) safety and security norms in the industry.

I criticize “race to the top” as a description (vs. aspiration), but there is something to the idea that *eventually* the market (investors, insurers, customers) could penalize xAI for this. But in the long run we’re all dead, + this seems more about ego/ideology than $ anyway.

xAI seems in practice to be a cultural vehicle created around Elon Musk’s will to influence media and counteract trends in liberal politics. xAI has no meaningful (AI based5) revenue when compared to Anthropic or OpenAI.

Researchers and engineers who work on AI because of the potential to build new technologies and experiences that make life more filled with joy should simply resign. They’re quickly going to be seen as complicit as the next Grok “degradations” emerge, even if you get to make cool things and have a good time hanging around the office with the boys.

The beauty of AI is that we are building autonomous systems that can act and think independently based on vast inputs of information. An organization corrupted by heavy hands on its beliefs cannot achieve the ultimate goals of intelligence.

1
Grok 4 uses Google Search via the browser directly, which is a better search index, but it could violate the Google Terms of Service and become an issue in the near future.

2
The Zvi has done some great work covering the bizarre nature of recent Grok models.

Don't Worry About the Vase
Grok Grok
This is a post in two parts…
Read more
6 months ago · 97 likes · 18 comments · Zvi Mowshowitz
3
This is only if you ask who “you” support and not what “one” would support. More: https://simonwillison.net/2025/Jul/11/grok-musk/

4
Or something else with being trained too much on Twitter, or on synthetic data from past versions of Grok.

5
They now own X, which had a functioning but weak advertising business.