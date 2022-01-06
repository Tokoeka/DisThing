import { Macro } from "libram";

export const delevel = Macro.skill("curse of weaksauce")
    .trySkill("micrometeor")
    .tryItem("time-spinner")
    .trySkill("summon love gnats");

export const candyblast = Macro.while_(
    '!match "Hey, some of it is even intact afterwards!"',
    Macro.trySkill("candyblast")
);

export const easyFight = Macro.trySkill("extract").trySkill("sing along");
export const defaultKill = Macro.step(delevel).step(easyFight).attack().repeat();

export const thorax = Macro.item(`clumsiness bark`).repeat();
export const spats = Macro.item([`clumsiness bark`, `clumsiness bark`]).repeat();
export const pinch = Macro.if_(`gotjump`, Macro.attack()).while_(`monsterhpabove 1`, Macro.item(`jar full of wind`).attack()).attack();
export const mammon = Macro.item([`dangerous jerkcicle`, `dangerous jerkcicle`]).repeat();
export const snitch = Macro.while_(`!pastround 5`, Macro.item([`dangerous jerkcicle`, `dangerous jerkcicle`])).attack().repeat();
export const thugs = Macro.item([`jar full of wind`, `jar full of wind`]).repeat();

export const clumGrov = Macro.step(delevel).trySkill(`Torment Plant`).step(easyFight).attack().repeat();
export const maelLove = Macro.step(delevel).trySkill(`Pinch Ghost`).step(easyFight).attack().repeat();
export const glacJerk = Macro.step(delevel).trySkill(`Tattle`).step(easyFight).attack().repeat();
