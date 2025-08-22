Latest open artifacts (#12): Chinese models continue to dominate throughout the summer 🦦
A new flagship Qwen model, Qwen3-235B-A22B-Instruct-2507, and a general rise in ecosystem quality in Artifacts Log 12.
Nathan Lambert and Florian Brand
Jul 22, 2025
∙ Paid

Edit 07/21: Added a note on how bad the license for the Hunyuan-A13B-Instruct model by Tencent is.
Back in February, we observed the growing presence of Chinese companies on X to spread awareness of their models as part of a concerted effort to grow their market share in the U.S. For example, in the last couple months, Nathan has gotten DMs from 3 of the leading Chinese frontier model laboratories on Twitter asking to collaborate or promote their work (and zero from Western companies).

This has only continued — even small subdivisions of Alibaba like Tongyi are growing their presence. Another direction is how Qwen has launched a new page for tinkering with their models on Qwen.ai, which feels similar in functionality to Google's AI Studio, as a landing page for those building with Qwen.

The recent Kimi K2 launch is a case study of this — days before the launch, the Kimi account messaged several people in the AI space, even smaller accounts, and offered them pre-release access to the model. This isn’t new for Western companies, but is noteworthy as it becomes standard practice internationally. The way Kimi cleverly captured Western interest is by being the only provider (to our knowledge) to offer an Anthropic-compatible API. Scripts to use K2 in Claude Code quickly emerged. With the capabilities of the model, this yielded immediate adoption and praise on social media.

Zooming out, this is part of a larger trend where the quality of the open artifacts we are covering are maturing rapidly. In terms of overall quality, this issue of Artifacts Log is the most impressive yet, and this extends far beyond text-only models. A year ago, it felt like a mix of half-baked research artifacts and interesting ideas. Today, there are viable open models for many real-world tasks.

In the last issue, we introduced more metadata for this series, highlighting the base models used to create the artifacts we highlight. We extended our database to include the rest of our issues, where you can see the original dominance of Meta’s Llama in Artifacts Log, where now Qwen has been the default for many months.


More analysis like this soon, but onto the post!

Share

Our Picks
Qwen3-235B-A22B-Instruct-2507 by Qwen (released earlier today): While the dual-thinking mode wasn't introduced by Qwen, they helped popularize it with a simple mode switch by including either /no_think or /think in the prompt. To the surprise of some, Qwen is abandoning the concept after talking to the community and released an update to the big (now non-reasoning) MoE model. The scores are impressive (beating the Kimi K2 model we recently hyped as a major release), including 41.8 on ARC-AGI.

It turns out training a hybrid reasoning model is more challenging technically than it is worth relative to the upside of downstream serving (where training two separate models, one thinker one not, is much easier).

The best part of this release is that it has come with multiple reports of strong vibe tests. Historically, Qwen has been known to be among the benchmark-maximizing labs — there are a few papers that have come out recently highlighting signs of data contamination in Qwen base models — but the Qwen models are improving in the robustness of normal testing. We’ve written multiple times on Interconnects about how labs will first shoot for strong benchmarks to get on the map, and then move to models that are more precisely those that people want to use. Quoting from our Qwen 3 post:

”We'll start to see if Qwen has taste/vibes. They have the benchmarks complete, and now we'll see how they compare to the likes of R1, o3, and Gemini 2.5 Pro for staying power at the frontier.”

Qwen team members mentioned a new flagship thinking model is on the way and joked about coding models coming soon. The evaluation scores are below relative to other models without a <think> section. Again, as we mentioned in our Kimi K2 post, these models are trained extensively with reinforcement learning still, but the goals of the model are more constrained. These instruct, non-thinking, models are best for when the user wants a fast time-to-first token or other automation tasks.

The evaluation summary is here:

image/jpeg
SmolLM3-3B by HuggingFaceTB: HuggingFace has released a new version of their SmolLM series alongside a very detailed writeup of all the decisions made, including details about all the used datasets. Similar to other models, it supports a thinking and non-thinking mode. We played around with it and were impressed by the quality, it really is a model on the level of the small Qwen3 models and comes with all artifacts released — one of the few “open-source” models today.


Kimi-K2-Instruct by moonshotai: It is hard to understate the impact of the model, which we've covered already. The new update is that they released a technical report today, with a bunch of nice methods, but nothing incredibly surprising. K2 has proven itself to be a capable model on various, unusual benchmarks, matching Opus on LMArena while becoming one of the most used models on OpenRouter.

FLUX.1-Kontext-dev by black-forest-labs: After the GPT-4o image release, a lot of people (especially on social media) claimed that omni models are the future and that specialized image models will be unable to catch up. Avid readers of the Artifacts series know that this is not the case, see Step1X Edit as an example. BFL has now released their editing model based on FLUX.1-Kontext-dev. Fun fact: FLUX.1-Kontext-dev is the model with the most fine-tunes / adapters on HuggingFace, despite its non-commercial license.

FLUX.1 [dev] Grid
Hunyuan-A13B-Instruct by tencent: Tencent releases both a 7B dense and a 80B total / 13B active MoE model. It also features 256K context, has very solid benchmark scores (including function calling). Aside from that, people actually use it and are impressed by it! We sound like a broken record, but Chinese labs and companies continue to outbid each other in the open model space with very solid models.

Edit: Unfortunately this model is up there in terms of bad licenses. A portion of it states: “You must not use, reproduce, modify, distribute, or display the Tencent Hunyuan Works, Output or results of the Tencent Hunyuan Works outside the Territory. Any such use outside the Territory is unlicensed and unauthorized under this Agreement.” Here, the territory is everywhere but the EU, UK, and SK.

Models
Flagship
ERNIE-4.5-21B-A3B-PT by baidu: Baidu followed up on their promise to release their flagship model, ERNIE, in various sizes, both dense and MoE. The models are licensed under Apache 2.0. However, the model got mixed reactions on social media, with some people being surprised with the quality, while others are disappointed with its performance on tasks outside of usual benchmarks.

pangu-pro-moe-model by IntervitensInc: A MoE trained by the Huawei Pangu team on Ascend NPUs. However, the model release is overshadowed by allegations of them being upcycled DeepSeek / Qwen models.

EXAONE-4.0-32B by LGAI-EXAONE: LG also continues to release new models. This iteration adds a dual-thinking mode, a 3:1 local:global attention and a focus on tool calling. However, it is released under a noncommercial license.

General Purpose
Apriel-Nemotron-15b-Thinker by ServiceNow-AI: ServiceNow is also joining the ever-growing list of companies training their own reasoning models.

micro-g3.3-8b-instruct-1b by ibm-ai-platform: A 1B model building upon the 8B Granite model, featuring only 3 hidden layers.

DeepSeek-TNG-R1T2-Chimera by tngtech: The German TNG has thrown the new R1 into the model soup (because DeepSeek released an updated R1 model on May 28th), improving performance over the original Chimera model even further.

Intelligence Score
AI21-Jamba-Large-1.7 by ai21labs: An update to the hybrid SSM-Transformer model series from AI21.

FlexOlmo-7x7B-1T by allenai: A new model by Ai2, where different organizations can train experts on their data to improve a shared model. The blog provides more details about the model and its training process.

Phi-4-mini-flash-reasoning by microsoft: A hybrid model to speed up inference.

OctoThinker-3B-Hybrid-Zero by OctoThinker: The OctoThinker team has released a comprehensive paper about their mid-training process.

OpenReasoning-Nemotron-32B by nvidia: A new version of NVIDIA's reasoning model, using the same prompts as the previous version, but with traces generated by R1 0528.

Multimodal
Ovis-U1-3B by AIDC-AI: Another omni model by another subdivision of Alibaba.

GLM-4.1V-9B-Thinking by THUDM: An extension of zAI's GLM-9B-0414 to also support images as inputs. This is one of the longer-tail of very strong open weight model laboratories from China.

rl
Keye-VL-8B-Preview by Kwai-Keye: A combination of Qwen3 8B and SigLIP, focusing on short-form video understanding.

LFM2-1.2B by LiquidAI: A series of hybrid models aimed at edge devices.

Devstral-Small-2507 by mistralai: An updated version of Devstral — “an agentic LLM for software engineering tasks built under a collaboration between Mistral AI and All Hands AI.”

reka-flash-3.1 by RekaAI: Reka Flash 3 was a model overlooked by many. While the blog is sparse on details, they stick to RLOO with some DAPO-like modifications.

Skywork-R1V3-38B by Skywork: Skywork continues to be a recurring guest to the series, releasing multiple models a month. Their R1V models are their multimodal reasoning models. V3 uses InternVL3 (V2 used QwQ) and refinements to post-training.

OVR-7B-RL by Kangheng: A multimodal reasoning model built on top of Qwen2.5-VL 7B.

Voxtral-Small-24B-2507 by mistralai: The first voice models from Mistral, powered by their own LLMs. They come in 3B and 24B.


canary-qwen-2.5b by nvidia: An audio model combining the speed of NVIDIA's Canary models with the quality of Qwen.

Special Purpose
llama-nemoretriever-colembed-3b-v1 by nvidia: A multimodal, multi-vector retrieval model using SigLIP and Llama 3.2. However, it is released under a noncommercial license.

t5gemma-b-b-prefixlm-it by google: Yes, it is 2025 and we are getting a modern version of T5 (Text-To-Text Transfer Transformer, 2019, encoder-decoder models). Some of the versions use Gemma 2 (2B and 9B) for the decoder part, while others are using the same sizes as mT5 and are trained from scratch, allowing an easy switch between old deployments still using T5 and those new versions. Considering that T5 still rakes in millions of downloads each month, those models could end up being similarly popular. However, these new versions are licensed under Gemma, not under Apache 2.0 like the original T5 models.

jina-embeddings-v4 by jinaai: A noncommercial, multi-modal, multi-vector embedding model.

videoprism-base-f16r288 by google: An encoder for videos.

WebSailor-3B by Alibaba-NLP: Aside from Qwen, Alibaba has other teams working on different endeavours. Wan (their video generation model team) might be the most well-known one, but Tongyi Lab is also worth watching. WebSailor is a model that focuses on web browsing.

Generation Models
Image
BRIA-3.2 by briaai: An image-generation model based entirely on licensed data from partners. There are a few other alternative models also trained on licensed data, showing that it is possible.


nai-anime-v2 by NovelAI: Last episode, we highlighted Arcee for releasing their old models. NovelAI has been doing this for a while now and it is just as commendable!

Audio
Veena by maya-research: A Text-to-Speech model for Indian languages.

Others
Skywork-Reward-V2-Llama-3.1-8B-40M by Skywork: An update to the reward models from Skywork. These are leading on most benchmarks, including the new RewardBench v2.

Kimina-Prover-72B by AI-MO: A Lean 4 generation model for proofs, built on top of Qwen2.5 72B.

Image
Arch-Router-1.5B by katanemo: A routing model based on human preferences. We expect a lot more interest here with the rumors of GPT-5 being router-based.

Confucius3-Math by netease-youdao: Yes, even NetEase, the Chinese internet conglomerate, is working on math reasoning models.

Datasets
SYNTHETIC-2-Base by PrimeIntellect: A dataset of four million verified reasoning traces by various models on diverse domains.

SUNO-1M by sleeping-ai: A collection of 1 million scraped audio samples generated by Suno.

smoltalk2 by HuggingFaceTB: The post-training dataset for SmolLM3 (including a lot of multilingual).

AM-DeepSeek-R1-0528-Distilled by a-m-team: 2.6 million traces generated with DeepSeek R1 0528.

community-alignment-dataset by facebook: A multi-lingual, multi-turn preference dataset with a permissive license.

Reminder — no audio for these posts. Previous Issues can be found here.

Keep sending us models (and datasets)! References: (Artifacts 12, 2025 artifacts, 2024 artifacts, 2023 artifacts, MMLU vs training compute model).