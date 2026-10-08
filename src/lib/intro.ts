// Runs in <head> before paint: the hero's intro wipe plays once per browser session, never for
// reduced motion. `data-intro="seen"` hides it and zeroes the entrance delay (see globals.css).
export const introBootScript = `try{var d=document.documentElement;if(sessionStorage.getItem("intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.intro="seen";sessionStorage.setItem("intro-seen","1")}catch(e){document.documentElement.dataset.intro="seen"}`;
