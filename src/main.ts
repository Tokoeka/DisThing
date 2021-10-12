import {
  abort,
  adv1,
  availableAmount,
  buy,
  buysItem,
  cliExecute,
  equip,
  gametimeToInt,
  haveEffect,
  combatRateModifier,
  myFullness,
  myInebriety,
  myLevel,
  myMp,
  myPathId,
  mySpleenUse,
  myTurncount,
  print,
  setAutoAttack,
  retrieveItem,
  use,
  visitUrl,
  count,
  itemAmount,
  useFamiliar
} from "kolmafia";
import { $coinmaster, $effect, $item, $items, $location, $monster, $skill, $slot, get, have, set, Macro, $familiar } from "libram";
import { item } from "libram/dist/resources/2020/Guzzlr";
import { delevel, easyFight, thorax, spats, pinch, mammon, snitch, thugs, clumGrov, maelLove, glacJerk } from "./Dis-macros";

function ensureEffect(ef: Effect, turns = 1): void {
  //stolen directly from bean
  if (haveEffect(ef) < turns) {
      if (!cliExecute(ef.default) || haveEffect(ef) === 0) {
          throw `Failed to get effect ${ef.name}.`;
      }
  } else {
      print(`Already have effect ${ef.name}.`);
  }
}

function advMacroAA(
    location: Location,
    macro: Macro,
    parameter: number | (() => boolean) = 1,
    afterCombatAction?: () => void
): void {
    let n = 0;
    const condition = () => {
        return typeof parameter === "number" ? n < parameter : parameter();
    };
    macro.setAutoAttack();
    while (condition()) {
        adv1(location, -1, () => {
            return Macro.if_("!pastround 2", macro).abort().toString();
        });
        if (afterCombatAction) afterCombatAction();
        n++;
    }
}

function prepBuffs() {
	ensureEffect($effect`Empathy`, 30);
    ensureEffect($effect`Leash of Linguini`, 30);
    ensureEffect($effect`Blood Bond`, 30);
    ensureEffect($effect`Smooth Movements`, 30);
	if (get(`_feelLonelyUsed`) < 3){
		ensureEffect($effect`Feeling Lonely`);
	}
	if (get(`_powerfulGloveBatteryPowerUsed`) < 100){
		equip($slot`acc3`, $item`Powerful Glove`);
    	ensureEffect($effect`Invisible Avatar`);
	}
	ensureEffect($effect`Fresh Scent`, 30);
	ensureEffect($effect`Gummed Shoes`);
	ensureEffect($effect`Become Superficially Interested`);
	
}

function ensureItems() {
	$items`clumsiness bark, 
		jar full of wind, 
		dangerous jerkcicle`.forEach((thing) => {
			if (itemAmount(thing) < 40){
				buy(40 - itemAmount(thing), thing, 8000);
			}

		}
	);
}

function ensureNonCom() {
	const improvements = [
        () => {
            if (!have($effect`Gummed Shoes`)) {
                retrieveItem($item`shoe gum`)
                use($item`shoe gum`);
            }
        },
        () => {
			if(itemAmount($item`squeaky toy rose`) > 0){
				use($item`squeaky toy rose`)
			}
		},
        () => use($item`shady shades`),
    ];
	for (const improvement of improvements) {
        if (combatRateModifier() > -35) improvement();
    }
}

function maelstrom() {
	const zone = $location`The Maelstrom of Lovers`
	useFamiliar($familiar`disgeist`);
	advMacroAA(
		zone,
		Macro.step(maelLove),
		() => get(`lastEncounter`) !== `To Get Groped or Get Mugged?`
	);
	useFamiliar($familiar`snapper`);
	cliExecute(`snapper humanoid`);
	advMacroAA(
		zone,
		Macro.if_(`monstername "The Terrible Pinch"`, Macro.step(pinch)).step(maelLove),
		() => itemAmount($item`lecherous stone`) < 1
	);
	useFamiliar($familiar`disgeist`);
	advMacroAA(
		zone,
		Macro.step(maelLove),
		() => get(`lastEncounter`) !== `A Choice to be Made`
	);
	useFamiliar($familiar`snapper`);
	advMacroAA(
		zone,
		Macro.if_(`monstername "Thug 1 and Thug 2"`, Macro.step(thugs)).step(maelLove),
		() => itemAmount($item`jealousy stone`) < 1
	);
}

function grove() {
	const zone = $location`The Clumsiness Grove`
	useFamiliar($familiar`disgeist`);
	advMacroAA(
		zone,
		Macro.step(clumGrov),
		() => get(`lastEncounter`) !== `You Must Choose Your Destruction!`
	);
	useFamiliar($familiar`snapper`);
	cliExecute(`snapper beast`);
	advMacroAA(
		zone,
		Macro.if_(`monstername "The Thorax"`, Macro.step(thorax)).step(clumGrov),
		() => itemAmount($item`furious stone`) < 1
	);
	useFamiliar($familiar`disgeist`);
	advMacroAA(
		zone,
		Macro.step(clumGrov),
		() => get(`lastEncounter`) !== `A Test of Your Mettle`
	);
	useFamiliar($familiar`snapper`);
	advMacroAA(
		zone,
		Macro.if_(`monstername "The Bat in the Spats"`, Macro.step(thugs)).step(clumGrov),
		() => itemAmount($item`vanity stone`) < 1
	);
}

function glacier() {
	const zone = $location`The Glacier of Jerks`
	useFamiliar($familiar`disgeist`);
	advMacroAA(
		zone,
		Macro.step(glacJerk),
		() => get(`lastEncounter`) !== `Some Sounds Most Unnerving`
	);
	useFamiliar($familiar`snapper`);
	cliExecute(`snapper beast`);
	advMacroAA(
		zone,
		Macro.if_(`monstername "Mammon the Elephant"`, Macro.step(mammon)).step(glacJerk),
		() => itemAmount($item`avarice stone`) < 1
	);
	useFamiliar($familiar`disgeist`);
	advMacroAA(
		zone,
		Macro.step(glacJerk),
		() => get(`lastEncounter`) !== `A Test of Your Mettle`
	);
	useFamiliar($familiar`snapper`);
	advMacroAA(
		zone,
		Macro.if_(`monstername "The Large-Bellied Snitch"`, Macro.step(snitch)).step(glacJerk),
		() => itemAmount($item`gluttonous stone`) < 1 
	);
}

export function main(): void {
	cliExecute("ccs twiddle")
	prepBuffs();
	ensureItems();
	ensureNonCom();
	maelstrom();
	grove();
	glacier();
}
