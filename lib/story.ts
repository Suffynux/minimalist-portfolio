/** `speech` is what the guide says; wrap the phrase to emphasise in *asterisks*. */
export const storyScenes = [
  { id: "top", label: "Hello", color: "#5f6b3a", speech: "Hey, I’m Sufiyan. *Scroll down* and I’ll show you around." },
  { id: "about", label: "The human", color: "#f2f0e9", speech: "Short version: I like knowing *why* before I build." },
  { id: "work", label: "Project tour", color: "#293b32", speech: "Let’s start with *CEGA*." },
  { id: "services", label: "How I build", color: "#f2f0e9", speech: "The interface is only the start. Let’s look *under the hood*." },
  { id: "all-work", label: "All work", color: "#f2f0e9", speech: "Everything else I’ve shipped. *Have a look around.*" },
  { id: "contact", label: "Your turn", color: "#20231c", speech: "Your idea could be next. Or just *make me dance*." },
] as const;
export type StoryScene = typeof storyScenes[number]["id"];
