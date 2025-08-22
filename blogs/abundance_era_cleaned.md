---
title: "Latest open artifacts (#13): The abundance era of open models"
author: "Nathan Lambert"
date: "2025-08-12"
url: "https://www.interconnects.ai/p/latest-open-artifacts-(#13)-the-abundance-era-of-open-models"
---

# Latest open artifacts (#13): The abundance era of open models

There has been a major shift in the open-weight AI ecosystem over the last 12 months from a research area and emerging industry into a functioning marketplace for ideas and adoption. If you look back to a similar collection of open models from a year ago the variance in artifact quality was extremely high and the total count of meaningful releases was far lower. There were some crucial models, i.e. the Qwens and Llamas of the world, but if one lab delayed their model or didn’t release anything, we didn’t really have much to cover.

Today, when reviewing the ecosystem with the team, we see incredible quality — and even hidden gems — across the board. Releasing certain models openly has shifted from a recruiting and marketing edge to a full-on industry standard. Many people outside of Silicon Valley will just always start with an open model for their domain due to trust, low cost of entry, and many other reasons linking back to open-source software. As of writing this, the only leading AI lab to not make a meaningful open weight release (or signal they should take it seriously, e.g. xAI) is now Anthropic.

As the average model size of daily drivers across the industry plateaus, there’s even less risk of closed models “running away with it” in terms of performance relative to their open counterparts. The differentiating factor in this regime is shaping inference into new products, which can be better offloaded to the long-tail open community than skyrocketing training costs. We saw early signs of this with Qwen Coder and expect more to come.

While many of us in the AI space focus on text-only models, as they’re positioned to be the next true platform for the broad buildout of AI, the small corners of multimodal generation models and specialized information processors represent many of the strengths of the ecosystem. This series covers it all.


Artifacts Log
Our Picks
Qwen3-Coder-480B-A35B-Instruct by Qwen: Besides all the Qwen models from the last episode, Qwen just can't stop releasing new models. Qwen3 Coder comes in two different sizes — the larger of which is actually competitive with Sonnet in various tests. The model is so popular that inference providers offer subscriptions to use it akin to Claude Max to gain market share.

As we mentioned last time, Qwen is becoming increasingly professionalized and playing the Google playbook, offering 1,000-2,000 free requests per day (depending on location) for their Gemini CLI fork. Qwen thus takes coding very seriously and is certainly a credible alternative to all those closed-source models.


dots.ocr by rednote-hilab: RedNote (the Chinese version of Instagram) continues to release open models. RedNote is a somewhat surprising participant in the AI space, but goes to show how pervasive open model releases are in China. This Optical Character Recognition (OCR) model, building on top of Qwen3 1.7B, is not only relatively small (compared to other models in the 7-8B range), but it is also really good! There are multiple people independently reporting about its performance and being impressed by it. Also, check out this Twitter thread by William about his experience with fine-tuning the model.


Qwen3-4B-Instruct-2507 by Qwen: In the last episode, we highlighted the new instruct version of their large MoEs, as Qwen moves away from hybrid reasoning models. This cycle we want to highlight the new 4B versions (Instruct-2507, Thinking-2507). While everyone keeps training and releasing MoE models for very good reasons, dense models are the backbone for academic research and the local community. Qwen3 4B, especially in the instruct-only version, is a great model and I (Florian) have started using it locally for simple tasks (like translation), as the model is really capable and the overall latency is faster than sending requests to the cloud.

GLM-4.5V by zai-org: While Zhipu/Z.ai isn't exactly a newcomer to avid readers of Interconnects, the new GLM-4.5 model finally puts them into the well-deserved spotlight. Aside from LLMs, they also release a vision model, which, like many models, is a MoE-based model. The benchmark results are really impressive and are worth checking out.


Qwen-Image by Qwen: Yes, we know! Yet another Qwen model featured prominently in this series. But they are impossible to ignore, release model after model with (OSI-approved) licenses, and the models are good! For image generation, FLUX.1 dev racks up millions of downloads despite its non-commercial license. Qwen-Image uses Apache 2.0 and the outputs are really good. However, it is quite a chonky model, clocking in at 20B params (Flux.1 dev uses 13B params), which might hinder local adoption. However, there are first attempts at distillation to run it quicker.


Language Models
Flagship
Qwen3-235B-A22B-Thinking-2507 by Qwen: Qwen also released the reasoning-only version of the large MoE. With a simple config change, these models support up to 1M context.

Ling-lite-1.5-2506 by inclusionAI: A small-ish MoE model with 17B total, 2.8B active parameters, released under the MIT license.

Llama-3_3-Nemotron-Super-49B-v1_5 by nvidia: Nvidia is not just one of the few companies that still use Llama as a base model, it is also one of the few American model providers with a cadence and quality that matches Chinese companies, as this release proves yet again. Interestingly, it is way less censored than its predecessor as evaluated by SpeechMap:

Image
GLM-4.5 by zai-org: The new LLM series by Zhipu/Z.ai comes in two sizes: 355B-A32 and 106B-A12. Furthermore, they also release the base models (which is rare these days!) and a detailed paper with some very nice RL experiments. Like their previous models, it is released under the MIT license.


Qwen3-30B-A3B-Instruct-2507 by Qwen: The small MoE model also gets the same treatment as the large model: A split into a reasoning and non-reasoning version, 1M context and a performance boost across the board.

gpt-oss-20b by openai: We wrote about the implications of the model in a separate post. Aside from that, the model is different from other models and cannot be a drop-in replacement for Llama or Qwen in typical pipelines. It can be used as a substitute for o4-mini-like tasks when given appropriate tools — a reasoning engine with limited world knowledge. While the scores suggest a strong multilingual model, it fell short in our usage, with others on social media reporting similar experiences.

General Purpose
KAT-V1-40B by Kwaipilot: A hybrid reasoning model which was trained with Step-SRPO to reward the model selecting the correct reasoning mode.

Megrez2-3x7B-A3B-Preview by Infinigence: Another small MoE, trained on 5T tokens.

SmallThinker-21BA3B-Instruct by PowerInfer: Yet another MoE, focusing on edge deployments.

UIGEN-X-32B-0727 by Tesslate: A fine-tuned Qwen model for frontend generation.

AFM-4.5B by arcee-ai: A competent small model by Arcee, which we featured extensively in a previous episode.

image/png
cogito-v2-preview-deepseek-671B-MoE by deepcogito: A fine-tuned version of V3, adding a hybrid reasoning mode.

XBai-o4 by MetaStoneTec: Process reward and policy models to enable parallel test time inference and scoring of multiple traces by a generator model. This is (likely) similar to the implementation of Grok Heavy, Gemini Deep Think and GPT-5 pro.

kanana-1.5-15.7b-a3b-instruct by kakaocorp: Another small MoE model by the Korean Kakao Corp, mostly known for their chat app KakaoTalk.

Tri-70B-preview-SFT by trillionlabs: A dense 70B model. However, as it was trained on only 1.5T tokens, the performance will likely not be on par with similarly-sized models outside of benchmarks. Furthermore, it comes with a rather restrictive license.

MindLink-72B-0801 by Skywork: A fine-tuned version of Qwen2.5 72B by the Skywork team. This is “just another solid reasoning model,” as we see so many of in 2025.

Hunyuan-7B-Instruct by tencent: Dense versions of the MoE models we featured last episode. However, they share the same bad license, disallowing the usage (and sharing outputs!) of the models in the EU, UK and SK.

Multimodal
Intern-S1 by internlm: One of the first multimodal Qwen3 fine-tunes. This release from the talented InternLM team combines the large Qwen3 MoE with their own ViT.

step3 by stepfun-ai: A multi-modal MoE by StepFun, one of the Chinese AI tigers.

A.X-4.0-VL-Light by skt: A 7B VLM for the Korean language by SK Telecom.

MiMo-VL-7B-RL-2508 by XiaomiMiMo: A small update to the MiMo VL model, bumping scores across the board. Similar to the previous version, the SFT version is also available.

Benchmark Improvements
dots.vlm1.inst by rednote-hilab: RedNote, the second: This time with a VLM building on top of DeepSeek V3.

MiniCPM-V-4 by openbmb: A small vision model by the competent OpenBMB team. However, the license is rather restrictive, requiring attribution, disallowing model training and restricting commercial use (if >5,000 devices or >1M DAU) on top of usage restrictions.

Special Purpose
limbic-tool-use-0.5B-32K by quotientai: A model intended to check whether an MCP call is correct.

Llama-3.1-8B-Instruct-RoGuard-1.0 by Roblox: A classifier to check whether texts comply with the Roblox guidelines.

gliclass-edge-v3.0 by knowledgator: Encoder-only models to rival DeBERTa.

granite-guardian-3.3-8b by ibm-granite: A classifier for jailbreak attempts, RAG outputs, etc.

S1-Base-671B by ScienceOne-AI: A fine-tuned version of R1 on STEM papers.

Foundation-Sec-8B-Instruct by fdtn-ai: A fine-tuned version of Llama for cybersecurity applications.

Seed-X-Instruct-7B by ByteDance-Seed: A translation model by ByteDance Seed, which continues to release interesting papers. It will be interesting to see whether they do a YOLO run and release a single, big LLM in the future.

performance
RAG
ettin-encoder-1b by jhu-clsp: An open source alternative (yes, with data!) for ModernBERT. They also include 250+ checkpoints, so anyone can use the models from different points across the training phases.

SauerkrautLM-Multi-Reason-ModernColBERT by VAGOsolutions: A series of tiny, multilingual and multi-vector models, punching far above their weight.

NuMarkdown-8B-Thinking by numind: Another capable OCR model.

Media Generation Models
Image
Neta-Lumina by neta-art: An anime image generation model.

Ming-Lite-Omni-1.5 by inclusionAI: An update to the omni Ming model.

FLUX.1-Krea-dev by black-forest-labs: A fine-tuned FLUX.1 dev by Krea, focusing on aesthetic photography.

FLUX.1 Krea [dev] Grid
Stable-Diffusion-3.5-Small-Preview1 by kpsss34: An improved version of SD3.5, cutting down the size of T5.

X-Omni-En by X-Omni: Another small omni model.

TBAC-UniImage-3B by TencentBAC: An image generation model which can also use images as inputs.

Audio
midashenglm-7b by mispeech: An audio model by Xiaomi.

Video
HunyuanWorld-1 by tencent: While Genie 3 rightfully made headlines and is unquestionably leagues ahead of the competition, others are catching up (or at least participating).

Wan2.2-T2V-A14B-Diffusers by Wan-AI: An update to Wan, the best open video generation model.

Datasets
caselaw_access_project by common-pile: A huge dataset of legal documents, part of Common Pile.

synthcat by moondream: A synthetically generated OCR dataset, spanning 2M samples.

Nemotron-Post-Training-Dataset-v1 by nvidia: The post-training dataset for Nemotron Super 49B 1.5, featured in this episode. Given the strength of the model, this is an important dataset, featuring multiple categories, such as tool calling, chat or math.

NuminaMath-LEAN by AI-MO: 100K math competition problems formalized in Lean.

InteriorAgent by spatialverse: A 3D dataset for indoor simulation in Isaac.

DoclingMatix by HuggingFaceM4: A series of OCR datasets, spanning a whopping 20M samples in total.