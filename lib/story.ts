export const storyScenes = [
  { id: "top", label: "Hello", color: "#5f6b3a", speech: "Hey, I’m Sufiyan. Scroll down — I’ll show you what I build." },
  { id: "about", label: "The human", color: "#f2f0e9", speech: "A good product starts with understanding the business behind it." },
  { id: "work", label: "Project tour", color: "#293b32", speech: "Meet CEGA. A whole national program, connected through one platform." },
  { id: "services", label: "How I build", color: "#f2f0e9", speech: "The interface is only the beginning. Let’s take a look under the hood." },
  { id: "all-work", label: "All work", color: "#f2f0e9", speech: "A few more things I’ve shipped. Go on, have a look around." },
  { id: "contact", label: "Your turn", color: "#20231c", speech: "Your idea could be next. Or you can just make me do a little dance." },
] as const;
export type StoryScene = typeof storyScenes[number]["id"];
