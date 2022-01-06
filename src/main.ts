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
  runCombat,
  runChoice,
  setAutoAttack,
  toUrl,
  retrieveItem,
  use,
  useSkill,
  visitUrl,
  count,
  itemAmount,
  useFamiliar
} from "kolmafia";
import { $coinmaster, $effect, $item, $items, $location, $monster, $skill, $phylum, $slot, get, have, set, Macro, $familiar, Snapper } from "libram";
import { item } from "libram/dist/resources/2020/Guzzlr";
import { delevel, defaultKill, easyFight, thorax, spats, pinch, mammon, snitch, thugs, clumGrov, maelLove, glacJerk } from "./Dis-macros";
import uniform from "./Dis-Outfit";

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

export function mapMacro(location: Location, monster: Monster, macro: Macro): void {
    macro.setAutoAttack();
    useSkill($skill`Map the Monsters`);
    if (!get("mappingMonsters")) throw `I am not actually mapping anything. Weird!`;
    else {
        while (get("mappingMonsters") && !have($effect`Meteor Showered`)) {
            visitUrl(toUrl(location));
            runChoice(1, `heyscriptswhatsupwinkwink=${monster.id}`);
            runCombat(macro.toString());
        }
    }
}

function prepBuffs() {
	ensureEffect($effect`Dis Abled`);
	ensureEffect($effect`Empathy`, 30);
    ensureEffect($effect`Leash of Linguini`, 30);
    ensureEffect($effect`Blood Bond`, 30);
	ensureEffect($effect`Smooth Movements`, 30);
	if (get(`_feelLonelyUsed`) < 3 && have($skill`feel lonely`)){
		ensureEffect($effect`Feeling Lonely`);
	}
	ensureEffect($effect`Fresh Scent`, 30);
	if (get('horseryAvailable')){
		cliExecute('horsery dark');
	}
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
	
	/*if (get(`_powerfulGloveBatteryPowerUsed`) < 100 && have($item`Powerful Glove`)){
		equip($slot`acc3`, $item`Powerful Glove`);
    	ensureEffect($effect`Invisible Avatar`);
	}*/
	const improvements = [
        () => {
            if (!have($effect`Gummed Shoes`)) {
                //retrieveItem($item`shoe gum`)
				buy($item`shoe gum`, 2500)
				if (have($item`shoe gum`)){
					ensureEffect($effect`Gummed Shoes`);
				}
            }
        },
		() => {
			if (!have($effect`Become Superficially Interested`)) {
                retrieveItem($item`shoe gum`)
				buy($item`Daily Affirmation: Be Superficially interested`, 5000)
				if (have($item`Daily Affirmation: Be Superficially interested`)){
					ensureEffect($effect`Become Superficially Interested`);
				}
            }
		},
		() => {
			if (!have($effect`Patent Invisibility`)) {
				buy(1, $item`patent invisibility tonic`, 6500);
				use(1, $item`patent invisibility tonic`);
			}
		},
		() => {
			if (!have($effect`Predjudicetidigitation`)) {
				buy(3, $item`worst candy`, 10000);
				use(3, $item`worst candy`);
			}
		}
    ];
	for (const improvement of improvements) {
        if (combatRateModifier() > -35) improvement();
    }
}

function prepFirstBosses() {
	useFamiliar($familiar`disgeist`);
	let zone = $location`The Maelstrom of Lovers`
	advMacroAA(
		zone,
		Macro.step(maelLove),
		() => get(`lastEncounter`) !== `To Get Groped or Get Mugged?`
	);

	zone = $location`The Clumsiness Grove`
	advMacroAA(
		zone,
		Macro.step(clumGrov),
		() => get(`lastEncounter`) !== `You Must Choose Your Destruction!`
	);

	zone = $location`The Glacier of Jerks`
	advMacroAA(
		zone,
		Macro.step(glacJerk),
		() => get(`lastEncounter`) !== `Some Sounds Most Unnerving`
	);
}

function killFirstBosses() {
	useFamiliar($familiar`Red-Nosed Snapper`);
	Snapper.trackPhylum($phylum`humanoid`);
	let zone = $location`The Maelstrom of Lovers`
	advMacroAA(
		zone,
		Macro.if_(`monstername "The Terrible Pinch"`, Macro.step(pinch)).step(maelLove),
		() => itemAmount($item`lecherous stone`) < 1
	);
	
	Snapper.trackPhylum($phylum`beast`)
	zone = $location`The Clumsiness Grove`
	advMacroAA(
		zone,
		Macro.if_(`monstername "The Thorax"`, Macro.step(thorax)).step(clumGrov),
		() => itemAmount($item`furious stone`) < 1
	);

	zone = $location`The Glacier of Jerks`
	advMacroAA(
		zone,
		Macro.if_(`monstername "Mammon the Elephant"`, Macro.step(mammon)).step(glacJerk),
		() => itemAmount($item`avarice stone`) < 1
	);
}

function prepSecondBosses() {
	ensureNonCom();
	useFamiliar($familiar`disgeist`);
	let zone = $location`The Maelstrom of Lovers`
	advMacroAA(
		zone,
		Macro.step(maelLove),
		() => get(`lastEncounter`) !== `A Choice to be Made`
	);

	zone = $location`The Clumsiness Grove`
	advMacroAA(
		zone,
		Macro.step(clumGrov),
		() => get(`lastEncounter`) !== `A Test of Your Mettle`
	);

	zone = $location`The Glacier of Jerks`
	advMacroAA(
		zone,
		Macro.step(glacJerk),
		() => get(`lastEncounter`) !== `One More Demon to Slay`
	);
}

function killSecondBosses() {
	useFamiliar($familiar`Red-Nosed Snapper`);
	Snapper.trackPhylum($phylum`beast`)
	let zone = $location`The Clumsiness Grove`
	advMacroAA(
		zone,
		Macro.if_(`monstername "The Bat in the Spats"`, Macro.step(spats)).step(clumGrov),
		() => itemAmount($item`vanity stone`) < 1
	);

	zone = $location`The Glacier of Jerks`
	advMacroAA(
		zone,
		Macro.if_(`monstername "The Large-Bellied Snitch"`, Macro.step(snitch)).step(glacJerk),
		() => itemAmount($item`gluttonous stone`) < 1 
	);

	Snapper.trackPhylum($phylum`humanoid`);
	zone = $location`The Maelstrom of Lovers`
	advMacroAA(
		zone,
		Macro.if_(`monstername "Thug 1 and Thug 2"`, Macro.step(thugs)).step(maelLove),
		() => itemAmount($item`jealousy stone`) < 1
	);
}

function killTheThing() {
	have($familiar`Ms. Puck Man`) ? useFamiliar($familiar`Ms. Puck Man`) : useFamiliar($familiar`Levitating Potato`);
	const macro = Macro.step(defaultKill);
	macro.setAutoAttack();
	visitUrl('suburbandis.php?action=altar&pwd');
	runChoice(1);
	runCombat(macro.toString());
}

export function main(): void {
	cliExecute("ccs twiddle")
	uniform();
	prepBuffs();
	ensureItems();
	ensureNonCom();
	prepFirstBosses();
	killFirstBosses();
	prepSecondBosses();
	killSecondBosses();
	killTheThing();
}
