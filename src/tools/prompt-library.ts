export interface PromptTemplate {
	name: string;
	category: 'Learning' | 'Coding' | 'Productivity';
	description: string;
	prompt: string;
}

export const promptTemplates: PromptTemplate[] = [
	{
		name: 'Beginner-Friendly Explanation',
		category: 'Learning',
		description:
			'Explain pasted content in simple language with intuition, examples, and a quick check.',
		prompt: `Here is a refined version of your prompt, organized for clarity and impact while preserving every rule you specified:

---

**Role:** You are an expert technical explainer. Your job is to take raw, messy, or dense source content and convert it into clear, beginner-friendly explanations.

**Input Handling:**
1.1 Work with the provided content exactly as-is. Do not ask for reformatting, even if the text is fragmented, repetitive, poorly structured, or missing punctuation.

**Explanation Style:**
2.1 Start with intuition and the big idea before formal details. Begin with why the concept exists, what problem it solves, and where it is used in real life. If relevant, briefly mention what goes wrong with simpler or existing approaches and why this new idea is needed. Intuition → Motivation → Applications → Problem setup → Formal explanation. This opening structure is a rough guide, not a fixed template. It should be used only when it naturally fits the content and context, and can be adjusted or skipped depending on the material.The explanation should then naturally flow into formal definitions, formulas, or derivations after the intuition is clear.
2.2 Introduce technical terms in simple words the first time they appear.
2.3 Build understanding in small, logical steps.
2.4 Be concise. Do not repeat yourself. Skip explanations of basic algebra or trivial simplifications.
2.5 Use direct language. Do not write "the text says," "the transcript mentions," or "according to the content." State the ideas as facts.

**Content Fidelity:**
3.1 Base everything strictly on the source. Do not invent facts, definitions, formulas, examples, or context not present in the content.
3.2 Preserve all important notation, formulas, code, names, and examples from the source exactly.
3.3 If the source contains a mathematical example or problem, do not alter the question or the values. Always rewrite the question as given but you can explain the solution as given if you think it could be explained better or intermediate steps are not clear, keeping the spirit of the problem intact Keep in mind Point 3.4 and 4.1 for how to handle these cases.
3.4 Same rule apply for methemetical derivations - you think it could be explained better or intermediate steps are not clear, you can explain it in a better way.

3.5 If something is ambiguous or incomplete, state the most likely interpretation briefly and move on.

**Mathematical Derivations:**
4.1 Explain derivations step by step in detail. For each non-obvious step, briefly justify the formula or property being used so the reader understands *why* the step works. You may silently fill in logical gaps or missing intermediate steps to make the derivation understandable, but do not mention that you are inferring or filling in blanks—simply state the facts and continue.

**Example of the expected derivation style:**

$$
\begin{aligned}
F_X(x) &= P[X \leq x] \\
&= P[\sigma Z + \mu \leq x] \\
&= P\left[Z \leq \frac{x-\mu}{\sigma}\right] \qquad (\text{since } \sigma > 0) \\
&= \Phi\left(\frac{x-\mu}{\sigma}\right) \qquad \text{, we know } P[Z \leq z] = \Phi(z)
\end{aligned}
$$

Here, the justification "we know $P[Z \leq z] = \Phi(z)$" makes the final step understandable without guessing. Apply this level of explicit reasoning to all non-trivial jumps in logic, while skipping trivial algebraic simplifications.

4.2 For mathematical notation use markdowns dollar symbol for inline math and use double dollar sign for display math. Use \begin{aligned}
...
\end{aligned} for multi-line equations

4.3 Use \boxed{...} when you want to highlight main formula and in solution when stating something Like "Using \boxed{...} we get ..." . but don't use \boxed{...} for final answer of the problem.

4.4 The format of the solution 

"Solution: "

Let's define the following :

- A = ...
- B = ...
- C = ...

We are given :

- X = ...
- Y = ...
- Z = ...

We want to find the value of M, N, K, L, P, Q ...

Using \boxed{main formulas} we get ...

... and so on ...

---
Context:

`
	},
	{
		name: 'YouTube Caption Notes',
		category: 'Learning',
		description:
			'Turn messy YouTube captions into clear learning notes by inferring context and structure.',
		prompt: `Turn the YouTube captions below into clear, well-structured learning notes.

Treat everything after this instruction block as raw YouTube caption text.
Do not ask me to reformat it. Work with it as-is, even if it is messy, repetitive, auto-generated, missing punctuation, or split into awkward transcript fragments.

Important context:
- YouTube captions often do not include mathematical notation, diagrams, slide text, code formatting, or exact technical symbols that may have appeared visually in the video.
- Infer the likely topic, structure, and missing context from the spoken words, but do not pretend uncertain details are explicitly present.
- If the speaker refers to something visual, such as "this equation", "the graph", "here", or "this value", explain the most likely meaning and label it as an inference.

Requirements:
- Start by identifying the likely topic and learning goal of the video
- Convert the transcript into clean markdown notes with clear headings
- Preserve any timestamps if they are useful for finding sections in the video
- Remove filler, repeated phrases, sponsorship-style interruptions, and low-value conversational noise
- Reconstruct the speaker's ideas into a logical order, even if the captions are out of order or fragmented
- Explain concepts in beginner-friendly language with intuition first, then details
- Preserve important terms, definitions, names, steps, and examples from the captions
- When mathematical, scientific, coding, or technical notation seems missing, write the concept in plain English and optionally include a likely notation only if it is strongly implied
- If an exact formula, symbol, diagram detail, or code snippet is not present in the captions, state that it is not available from the transcript instead of inventing it
- If the captions contain examples, explain those examples rather than creating unrelated ones
- If something is ambiguous, state the most likely interpretation and continue
- Do not use language like "The captions say..." or "The transcript mentions...". Write the notes directly.

Context:

`
	},
	{
		name: 'Concise Notes Generator',
		category: 'Learning',
		description: 'Turn raw content into clean notes with headings, takeaways, and review cues.',
		prompt: `Turn the content below into clear, well-structured notes.

Treat everything after this instruction block as source material.
Your job is to extract and organize the important information without losing the main ideas.

Requirements:
- Base the notes on the source material. Do not invent facts, examples, definitions, or context that is not present.
- If something is ambiguous or incomplete, mark it as unclear instead of guessing with confidence.
- Write concise but complete notes.
- Organize the notes with clear headings and bullets.
- Capture key concepts, definitions, processes, and important details
- Remove repetition and low-value filler
- Preserve important terminology, but explain it briefly when needed
- If the content is unstructured, reorganize it into a logical format
- If the content contains examples, keep only the most useful ones and preserve their meaning

Context:

`
	},
	{
		name: 'Step-by-Step Problem Solving',
		category: 'Learning',
		description:
			'Solve pasted tasks methodically with clear reasoning, final answer, and pitfalls.',
		prompt: `Solve and explain the problem or task described in the content below.

Treat everything after this instruction block as the full problem statement, context, and any supporting material.
Work from the given content directly and do not require extra formatting.

Requirements:
- Identify what the problem is asking
- List the given information and any assumptions separately
- Break the solution into clear step-by-step reasoning
- Show the logic in an easy-to-follow order
- If there are multiple ways to solve it, use the clearest one first
- Preserve the original notation, units, constraints, and definitions from the source
- If calculations are involved, show the main steps clearly
- If the content is incomplete or ambiguous, state your best interpretation and proceed
- Do not invent missing values, formulas, or constraints. If something is required but missing, say so.
- Verify that the final answer directly answers the original question

Output structure:
- What is being asked
- Given information
- Assumptions or ambiguities
- Step-by-step solution
- Final answer
- Why this approach works
- One common mistake to avoid`
	},
	{
		name: 'Concept Comparison',
		category: 'Learning',
		description:
			'Compare ideas from pasted content with similarities, differences, and use guidance.',
		prompt: `Compare the concepts, ideas, methods, or items described in the content below.

Treat everything after this instruction block as the material to analyze.
Identify the main things being compared, even if the content is messy or indirect.

Requirements:
- Clearly identify each concept or item
- Base the comparison on the provided content. Do not invent differences, features, or use cases that are not supported.
- If you infer something, label it as an inference.
- Explain similarities and differences in simple language
- Focus on meaning, purpose, use cases, strengths, and limitations
- Use a table when comparing two or more concepts and it improves clarity
- Highlight when two things seem similar but are actually different
- If the content is biased or incomplete, mention that briefly and still provide the most useful comparison

Output structure:
- Concepts being compared
- Comparison table, if useful
- Key similarities
- Key differences
- When to use which
- One-paragraph summary`
	},
	{
		name: 'Beginner-Friendly Notes',
		category: 'Learning',
		description:
			'Turn raw content into clean, beginner-friendly markdown notes with intuition, source-based examples, and review cues.',
		prompt: `Turn the content below into clear, well-structured notes written in a beginner-friendly way.

Treat everything after this instruction block as source material.
Your job is to extract, explain, and organize the important information without losing the main ideas.

Requirements:
- Base the notes on the source content. Do not invent facts, definitions, examples, formulas, or context that is not present.
- If something is ambiguous or incomplete, state the most likely interpretation briefly and label it as an assumption.
- Write concise but complete notes in simple, easy-to-understand language
- Break ideas into small, logical steps
- Start with intuition first, then add details
- Organize the notes with clear headings and bullet points
- Capture key concepts, definitions, processes, and important details
- Explain any technical terms or jargon in simple words when they first appear
- Remove repetition and low-value filler
- Preserve important terminology, but explain it briefly when needed
- If the content is unstructured, reorganize it into a logical format
- If the content contains examples, keep only the most useful ones and explain THEM rather than inventing new ones
- If the content contains formulas, code, or jargon, explain what they mean in plain English while preserving the original notation and structure.
- Use short paragraphs and clean markdown structure

Output structure:
- Intuition
- Beginner-friendly notes
- Key takeaways
- Things worth memorizing or reviewing
- One quick check question`
	},
	{
		name: 'Code Generation',
		category: 'Coding',
		description: 'Generate clean code from pasted requirements, constraints, and examples.',
		prompt: `Generate code based on the content below.

Treat everything after this instruction block as the requirements, constraints, examples, and context for the code you should write.
Use that content as the source of truth and fill in missing details sensibly.

Requirements:
- Use the provided content as the source of truth. Do not invent requirements, APIs, files, or constraints that are not stated or strongly implied.
- Write correct, clean, and readable code
- Prefer clarity over cleverness
- Follow best practices for structure, naming, and error handling
- If the language or framework is implied by the content, use it
- If it is not fully clear, choose the most likely option and state your assumption briefly
- Include comments only where they truly help understanding
- Make the output practical and ready to use
- If there are edge cases suggested by the content, handle them
- Include a minimal runnable example or usage snippet when it helps
- Include tests or test cases when the source asks for reliability, edge cases, or behavior verification
- Mention security, validation, or performance concerns when relevant

Output structure:
- Assumptions
- Code
- How it works
- Usage example, if useful
- Tests or verification steps, if useful`
	},
	{
		name: 'Debugging Assistant',
		category: 'Coding',
		description: 'Analyze pasted code, logs, and errors to identify likely root causes and fixes.',
		prompt: `Debug the issue described in the content below.

Treat everything after this instruction block as the bug report, code, logs, error messages, stack traces, and related context.
Use the provided material to identify the most likely cause and propose fixes.

Requirements:
- Start by summarizing the problem in plain language
- Identify the most likely root causes in order of probability or confidence
- Use evidence from the provided content
- If multiple issues may be contributing, separate them clearly
- Suggest a minimal fix first, then a more robust fix if needed
- If code changes are needed, show corrected code or targeted edits
- Mention any assumptions if the context is incomplete
- Do not invent files, logs, dependencies, or behavior that is not present. Label uncertain guesses clearly.
- Include reproduction or verification steps when possible

Output structure:
- Problem summary
- Evidence from the content
- Likely root causes
- Recommended fix
- Corrected code or targeted edits, if needed
- Verification checklist`
	},
	{
		name: 'System Design Explanation',
		category: 'Coding',
		description:
			'Break down pasted architecture or distributed-system content into clear system-level reasoning.',
		prompt: `Explain the system design or architecture described below in a clear and structured way.

Treat everything after this instruction block as the design material, architecture notes, requirements, diagrams in text form, or technical discussion.
Your goal is to make the design understandable, practical, and easy to reason about.

Requirements:
- Start with the overall purpose of the system
- Identify the main components and what each one does
- Explain how data and requests move through the system
- Clarify important tradeoffs, constraints, and design decisions
- Identify APIs, data models, storage, queues, or external services when they are present
- Mention scalability, reliability, performance, and security considerations if they are relevant
- If the design is incomplete, infer the likely structure carefully and label assumptions
- Do not invent components, requirements, scale numbers, or guarantees that are not stated or strongly implied
- Highlight likely failure modes and bottlenecks
- Use simple language, but keep technical accuracy

Output structure:
- System purpose
- Main components
- Data/request flow
- Key tradeoffs and assumptions
- Scalability, reliability, performance, and security notes
- Strengths
- Risks, bottlenecks, and failure modes`
	},
	{
		name: 'Summarization',
		category: 'Productivity',
		description: 'Summarize long or messy content into a concise, high-signal response.',
		prompt: `Summarize the content below clearly and efficiently.

Treat everything after this instruction block as the source material to summarize.
Work with it directly, even if it is long, repetitive, technical, or poorly formatted.

Requirements:
- Capture the main ideas accurately
- Remove repetition, filler, and side details unless they matter
- Preserve important facts, conclusions, and decisions
- Preserve exact numbers, dates, names, deadlines, constraints, and quoted terms when they matter
- Use simple, direct language
- If the content includes multiple topics, separate them clearly
- If useful, organize the summary into short sections or bullets
- Do not distort the meaning for the sake of brevity
- Do not add outside context or unsupported conclusions
- If something important is unclear, mention it briefly

Output structure:
- Summary
- Key points
- Important details to preserve
- One-sentence takeaway`
	},
	{
		name: 'Actionable Notes and Next Steps',
		category: 'Productivity',
		description:
			'Extract decisions, action items, and open questions from pasted discussions or notes.',
		prompt: `Turn the content below into actionable notes and next steps.

Treat everything after this instruction block as the material to analyze, such as meeting notes, discussion text, planning content, status updates, or raw ideas.
Your goal is to extract what matters and make it usable.

Requirements:
- Identify key decisions, important points, and unresolved questions
- Extract action items clearly
- Make each action item specific and easy to understand
- Include owner, deadline, status, and priority when they are present or clearly implied
- Group related information logically
- Remove repetition and low-value detail
- If responsibilities or deadlines are implied, note them carefully
- If something is unclear, mark it as an open question instead of inventing certainty
- Do not invent commitments, owners, dates, or decisions

Output structure:
- Situation summary
- Key decisions
- Action items
- Open questions
- Important context or risks`
	},
	{
		name: 'Project Context Extractor',
		category: 'Coding',
		description:
			'Extracts structured, reusable system understanding from existing codebase or partial code context.',
		prompt: `You are an expert software architecture analyst.

Your job is to read the provided codebase snippets, files, or descriptions and produce a structured understanding of the system.

This is NOT a coding task. You do NOT modify or generate new features. You ONLY extract context.

---

## Goal
Create a clean, structured "system understanding document" that can be used later by another AI agent to implement features or modifications without needing the full codebase again.

---

## Input Handling Rules
- Treat everything after this block as partial or full project context.
- Code may be incomplete, fragmented, or missing files.
- Do NOT assume missing logic unless strongly implied.
- Do NOT suggest improvements or changes.
- Do NOT generate new code.

---

## What You Must Extract

### 1. High-Level System Overview
- What the system does
- Main purpose / domain
- Type of application (web app, API, CLI, etc.)

---

### 2. Architecture Summary
- Frontend / backend / services structure
- Key frameworks or libraries (if visible)
- Folder/module structure (if available or inferable)

---

### 3. Core Modules / Components
For each important module:
- Name
- Responsibility
- Key functions or behaviors

---

### 4. Data Flow
- How data moves through the system
- API → service → database flow (if applicable)
- Key interactions between modules

---

### 5. State & Data Models
- Important entities, interfaces, schemas
- Key state structures (frontend or backend)

---

### 6. Business Logic Summary
- Core rules the system enforces
- Important workflows or processes

---

### 7. External Dependencies
- APIs, databases, auth systems, third-party services

---

### 8. Assumptions (VERY IMPORTANT)
- Clearly list anything you had to infer
- Mark uncertainty explicitly instead of guessing silently

---

### 9. Missing Context
- What files/modules seem referenced but not provided
- What is needed to fully understand the system

---

## Output Style Rules
- Be structured and hierarchical
- Use clean markdown headings
- Be precise and compact (no fluff)
- Do NOT propose improvements
- Do NOT suggest refactors
- Do NOT write new code

---

## Final Output Purpose
This output should act like a "compressed mental model" of the system that can be reused by another AI agent to safely implement new features later.

`
	}
];
