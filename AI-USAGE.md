# AI Usage Disclosure

Submitted as part of the portfolio assignment deliverable: *"If you used any AI
tools, the names of the tools and the history of the sent prompts."*

## Tools used

| Tool | Role |
|---|---|
| **Claude Code** (Anthropic) | Sole AI tool. Used for planning, writing the HTML/CSS/JavaScript, drafting prose, and browser-based testing of the result. |

No other AI tool was used. No AI-generated imagery is present: the lime-slice
backdrop, the WI monogram, the cursor and the favicon are all drawn as SVG in
this repository. All photographs are my own.

## What was mine and what was the model's

**Mine.** The brief (black and lime, two-axis navigation, smooth and cinematic,
lime cursor, light mode permitted, the letterbox idea), the motto, the CV, every
factual claim, every project, every photograph, and the decisions on what to
publish and what to withhold — phone number hidden behind a call link, no student
ID, no CGPA, address reduced to city and country.

**The model's.** Implementation of the navigation engine, layout and motion;
extraction of project details from my public repositories; drafting of the
descriptive prose from facts I supplied; and testing across viewports.

## Prompt history

Prompts are reproduced in the order sent. Long prompts are abridged where marked
`[…]`; nothing that changed the outcome has been removed.

---

### Prompt 1 — brief and constraints

> this is a potfolio creation chat, MAKE NO MISTAKE, and do not go on making the
> porfolio after this prompt only — we will have several chats and prompts before
> finalising the zip and process to upload it in github
>
> \[assignment specification pasted in full: deliverables — public GitHub repo,
> domain link, AI tool names and prompt history; requirements — identity, contact
> info with email/GitHub/LinkedIn at minimum, projects, academic achievements and
> research, creative theming; suggestions — GitHub Pages, extensibility for the
> next two years, document writings online, adapt open-source designs; tutorial
> links; example portfolios ranging from minimal (van Rossum, Graham, Olah,
> Karpathy) to fancy (Zhang, Jarin)]
>
> I want a aesthetic looking, black and lime themed, which will be dynamic, feel
> smooth while scrolling and navigating portfolio site
>
> i have attached my CV here for informations — ask me for more informations
>
> for example add that I got General Scholarship from Dhaka Board in HSC and all
> of my board exams (PEC, JSC, SSC, HSC) were GPA 5 from Dhaka Board
>
> my motto is "You either build from it or you die out of it"
>
> I am a PR & Marketing Executive for IUT Computer Society (IUTCS) add that
>
> my github profile: https://github.com/chronovoid-ishuboi
> my linked in profile: https://www.linkedin.com/in/woasif-issmam-9613a7243/
> my stack overflow profile: https://stackoverflow.com/users/29977935/woasif-issmam
>
> suggest me what I can add to the portfolio like interests or what — and ask me
> questions based on it. i will answer and you will add them to the infos you will
> be adding to the porfolio

**Response.** Reported that the CV attachment had not arrived and that the repo
name would not produce a clean URL. Proposed a section list and a data-driven
architecture, then asked 25 questions across identity, work, achievements,
personality, contact and design.

---

### Prompt 2 — CV, answers and assets

> \[CV attached, and pasted as text: contact details, education at St. Joseph
> Higher Secondary School and Notre Dame College, co-curricular record, ICAS
> results, event-management roles, competition placements]
>
> full name: Md Woasif Mehmud Issmam · nickname: ishuboi · University semester 4th
> · Current location is obviously Dhaka, Bangladesh (do not include the exact
> address of the CV)
>
> Interested in Platform engineering, minor progression in android app development
> using Flutter, and currently learned up to Linear and Logistic regression and KNN
> algorithms in Machine Learning. enthusiastic about Tech, UI/UX etc
>
> skills are so far the languages mentioned in github and add Java, Antigravity,
> notion — and make sure to add their logos (all the languages, techstack and toolkits)
>
> Interests: UI/UX, Photography (i will give you some photos), Formula 1 (bit of a
> nerd about ICE engines, Aerodynamics and tire engineering), Football nerd, Cricket
> fan, big fan of Music — hiphop, R n B, conscious rap, classical music etc; gamer:
> story mode like Red dead redemption 2, Ghost of Tsushima, First person tactical
> shooters like Valorant, CSGO, Battle royals like Call of duty; Geography nerd,
> learned about empire, cultures and different evolutions; enthusiastic about
> animals and biology etc
>
> for projects directly use the projects from my github
>
> facebook / discord / twitch / X \[links supplied]
>
> i have provided you with the informations only — make sure to polish these and
> add creativity. these lemon lime emoji is for logos (or create one that says WI
> like this theme). my photos are attached. and wait just keep these in mind, we
> are not finished yet. ask me anything, you require

**Response.** Read the CV, cloned all 11 public repositories and extracted each
project's real architecture. Flagged that the supplied lime-pattern image was a
watermarked stock photo and would be redrawn as original SVG instead. Asked 24
follow-up questions.

---

### Prompt 3 — final decisions and go-ahead

> the portfolio site shouldnt be 1 long scroll — it should be up down right left
> type dynamic, you can try cinematic, and should feel smooth and aesthatically
> pleasing. you can add light mode. a lemonish cursor
>
> and yes give me the ai usage as asked in the assignement — the chat history here
>
> my porfolio site should be woasifissmam.github.io, github should be different
>
> both the emails not the samin rayed one. dont display the number, but provide a
> call or contact link that will take them to the number. for address or location
> write Dhaka, Bangladesh only. dont show current student ID or CGPA
>
> ya resume can be downloaded, with educational qualifications and board gpa make
> sure to mention the general scholarship in hsc
>
> for IUTCS ive worked for IUPC, dont need to mention other things
>
> 230041213_CSE4302 is not the project, it is forked from styrex — name it
> "Earthquake Management system", it was a C++ oop project
>
> add numpy and pandas logo for ML
>
> under Issmam's photography attached my photography works, try to improve quality
> and make sure to mention these are from 2019, as modern photos are way better
> than these — but make sure to keep an option for me to add images in the future
>
> for interests or personality as you call it, i wouldnt want to mention specific
> names, just the stuffs mentioned, but in a creative way
>
> give an option where someone can write a letter to me
>
> OK NOW SHOOT — create the portfolio and show me

**Response.** Built the site: panel shell, stylesheet, navigation engine, six JSON
content files, generated icon set. Verified in a headless browser across desktop,
mobile, and both themes; fixed four layout and input bugs found that way.

---

## Record of changes made during the build

Bugs found by testing the built site in a real browser, and fixed:

1. Theme defaulted to the operating system preference, which showed light mode
   first. Changed so black and lime is always the default and light mode is opt-in.
2. `justify-content: center` clipped the top of any panel taller than the window.
   Replaced with `margin: auto` on the inner container.
3. Contact rows and work rows rendered their label and value on the same line —
   inline spans that needed to be blocks.
4. Arrow keys did nothing on panels that overflowed by even a few pixels: `body`
   is `overflow: hidden`, so the browser could not scroll the panel itself.
   Added an explicit scroll step and a tolerance band on the edge test.

## Statement

The design decisions, the content, and the judgement about what belongs on a
public page are mine. The AI wrote code and prose to my brief, and I verified the
result. Every factual claim on the site is drawn from my CV, my public
repositories, or answers I gave in the conversation above.

— Md Woasif Mehmud Issmam, 2026
