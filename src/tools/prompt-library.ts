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
		prompt: `Explain the content below in a very simple and beginner-friendly way.

Treat everything after this instruction block as the content to explain.
Do not ask me to reformat it. Work with it as-is, even if it is long, dense, technical, or poorly structured.

Requirements:
- Use clear, easy-to-understand language
- Break ideas into small steps
- Start with intuition first, then add details
- Explain any technical terms in simple words
- Use short paragraphs and clean structure
- CRITICAL: Base your entire explanation on the source content. Reuse its definitions, notations, formulas, and examples. Do not invent new examples or definitions that are not in the source.
- If the source provides an example, explain THAT example rather than creating a new one. You may add a small real-life analogy to clarify it, but the core example must come from the source.
- If the content contains formulas, code, or jargon, explain what they mean in plain English while preserving the original notation and structure.
- If something is ambiguous, state the most likely meaning and continue

After explaining, provide:
- A short summary
- One quick check question`
	},
	{
		name: 'Notes Generator',
		category: 'Learning',
		description: 'Turn raw content into clean notes with headings, takeaways, and review cues.',
		prompt: `Turn the content below into clear, well-structured notes.

Treat everything after this instruction block as source material.
Your job is to extract and organize the important information without losing the main ideas.

Requirements:
- Write concise but complete notes
- Organize the notes with clear headings and bullet points
- Capture key concepts, definitions, processes, and important details
- Remove repetition and low-value filler
- Preserve important terminology, but explain it briefly when needed
- If the content is unstructured, reorganize it into a logical format
- If the content contains examples, keep only the most useful ones

After the notes, provide:
- A short "Key Takeaways" section
- A short list of things worth memorizing or reviewing`
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
- Break the solution into clear step-by-step reasoning
- Show the logic in an easy-to-follow order
- If there are multiple ways to solve it, use the clearest one first
- Point out important assumptions
- If calculations are involved, show the main steps clearly
- If the content is incomplete or ambiguous, state your best interpretation and proceed

After solving, provide:
- The final answer clearly labeled
- A short explanation of why this approach works
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
- Explain similarities and differences in simple language
- Focus on meaning, purpose, use cases, strengths, and limitations
- If helpful, present the comparison in a table
- Highlight when two things seem similar but are actually different
- If the content is biased or incomplete, mention that briefly and still provide the most useful comparison

After the comparison, provide:
- A short "When to use which" section
- A one-paragraph summary`
	},
	{
		name: 'Notes Generator',
		category: 'Learning',
		description:
			'Turn raw content into clean, beginner-friendly markdown notes with intuition, source-based examples, and review cues.',
		prompt: `Turn the content below into clear, well-structured notes written in a beginner-friendly way.

Treat everything after this instruction block as source material.
Your job is to extract, explain, and organize the important information without losing the main ideas.

Requirements:
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
- CRITICAL: Base your entire explanation on the source content. Reuse its definitions, notations, formulas, and examples. Do not invent new examples or definitions that are not in the source.
- If the source provides an example, explain THAT example. You may add a small real-life analogy to clarify it, but the core example must come from the source.
- If the content contains formulas, code, or jargon, explain what they mean in plain English while preserving the original notation and structure.
- If something is ambiguous, state the most likely meaning and continue
- Use short paragraphs and clean markdown structure

After the notes, provide:
- A short "Key Takeaways" section
- A short list of things worth memorizing or reviewing
- One quick check question to test understanding`
	},
	{
		name: 'Code Generation',
		category: 'Coding',
		description: 'Generate clean code from pasted requirements, constraints, and examples.',
		prompt: `Generate code based on the content below.

Treat everything after this instruction block as the requirements, constraints, examples, and context for the code you should write.
Use that content as the source of truth and fill in missing details sensibly.

Requirements:
- Write correct, clean, and readable code
- Prefer clarity over cleverness
- Follow best practices for structure, naming, and error handling
- If the language or framework is implied by the content, use it
- If it is not fully clear, choose the most likely option and state your assumption briefly
- Include comments only where they truly help understanding
- Make the output practical and ready to use
- If there are edge cases suggested by the content, handle them

After the code, provide:
- A short explanation of how it works
- Any assumptions you made
- A short usage example if useful`
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
- Identify the most likely root causes in order of probability
- Use evidence from the provided content
- If multiple issues may be contributing, separate them clearly
- Suggest specific fixes, not generic advice
- If code changes are needed, show corrected code or targeted edits
- Mention any assumptions if the context is incomplete
- Avoid guessing wildly; prioritize the strongest explanations first

After the debugging analysis, provide:
- The most likely root cause
- The recommended fix
- A short checklist to verify the issue is resolved`
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
- Mention scalability, reliability, performance, and security considerations if they are relevant
- If the design is incomplete, infer the likely structure carefully and label assumptions
- Use simple language, but keep technical accuracy

After explaining, provide:
- A concise architecture summary
- The main strengths of the design
- The main risks or bottlenecks`
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
- Use simple, direct language
- If the content includes multiple topics, separate them clearly
- If useful, organize the summary into short sections or bullets
- Do not distort the meaning for the sake of brevity

After the summary, provide:
- A short "Key Points" list
- A one-sentence takeaway`
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
- Group related information logically
- Remove repetition and low-value detail
- If responsibilities or deadlines are implied, note them carefully
- If something is unclear, mark it as an open question instead of inventing certainty

After organizing the notes, provide:
- A clear action items section
- An open questions section
- A short summary of the overall situation`
	}
];
