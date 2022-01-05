import { cliExecute, equip, equippedItem, inHardcore, myFamiliar, useFamiliar } from "kolmafia";
import { $familiar, $item, $items, $slot, $slots, have } from "libram";

export class Outfit {
    equips: Map<Slot, Item>;
    familiar?: Familiar;

    /**
     * Construct an outfit object, for rapid equipping
     * @param equips Map of what to equip and where
     * @param familiar Optional familiar to use with outfit
     */
    constructor(equips: Map<Slot, Item>, familiar?: Familiar) {
        this.equips = equips;
        this.familiar = familiar;
    }

    dress(): void {
        if (this.familiar) useFamiliar(this.familiar);
        const targetEquipment = Array.from(this.equips.values());
        for (const slot of Slot.all()) {
            if (
                targetEquipment.includes(equippedItem(slot)) &&
                this.equips.get(slot) !== equippedItem(slot)
            )
                equip(slot, $item`none`);
        }

        for (const slot of $slots`weapon, off-hand, hat, back, shirt, pants, acc1, acc2, acc3, familiar, buddy-bjorn, crown-of-thrones`) {
            const equipment = this.equips.get(slot);
            if (equipment) equip(slot, equipment);
        }
    }

    /**
     * Identical to withOutfit; executes callback function with equipped outfit, and returns to original outfit
     * @param callback Function to execute
     */
    with<T>(callback: () => T): T {
        return withOutfit(this, callback);
    }

    /**
     * Makes the best outfit it can with what you've got
     * @param equips Map of what to equip and where; will use first item in array that it can, and willl not add things to outfit otherwise
     * @param familiar Optional familiar to use with outfit
     */
    static doYourBest(equips: Map<Slot, Item | Item[]>, familiar?: Familiar): Outfit {
        const returnValue = new Map<Slot, Item>();
        for (const [slot, itemOrItems] of equips.entries()) {
            const item = Array.isArray(itemOrItems)
                ? itemOrItems.find((item) => have(item))
                : itemOrItems;
            if (item) returnValue.set(slot, item);
        }
        return new Outfit(returnValue, familiar);
    }

    /**
     * Saves current outfit as an Outfit
     * @param withFamiliar Option to store current familiar as part of outfit
     */
    static current(withFamiliar = false): Outfit {
        const familiar = withFamiliar ? myFamiliar() : undefined;
        const slots = $slots`hat, shirt, back, weapon, off-hand, pants, acc1, acc2, acc3`;
        if (withFamiliar) slots.push($slot`familiar`);
        const outfitMap = new Map<Slot, Item>();
        for (const slot of slots) {
            const item = equippedItem(slot);
            if (item !== $item`none`) outfitMap.set(slot, item);
        }
        return new Outfit(outfitMap, familiar);
    }
}

/**
 * Execute callback while wearing given outfit
 * Then return to what you were previously wearing
 * @param outfit Outfit to use
 * @param callback Function to execute
 */
export function withOutfit<T>(outfit: Outfit, callback: () => T): T {
    const withFamiliar = outfit.familiar !== undefined;
    const cachedOutfit = Outfit.current(withFamiliar);
    outfit.dress();
    try {
        return callback();
    } finally {
        cachedOutfit.dress();
    }
}

export default function uniform(): void {
    Outfit.doYourBest(
        new Map<Slot, Item | Item[]>([
            [$slot`hat`, $items`Xiblaxian stealth cowl, very pointy crown, porkpie-mounted popper, Daylight Shavings Helmet`],
            [$slot`shirt`, $items`Xiblaxian stealth vest, camouflage T-shirt, Stephen's Lab Coat`],
            [$slot`pants`, $items`Xiblaxian stealth trousers, pantsgiving`],
            [$slot`weapon`, $item`Fourth of May Cosplay Saber`],
            [$slot`off-hand`, $items`KoL Con 13 Snowglobe, familiar scrapbook`],
            [$slot`acc1`, $item`Lucky Gold Ring`],
            [$slot`acc2`, $item`Mr. Screege's spectacles`],
            [$slot`acc3`, $item`Mr. Cheeng's spectacles`],
            [$slot`back`, $item`protonic accelerator pack`],
        ])
    ).dress();
}