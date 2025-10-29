const obliterateItems = [
    'minecraft:carrot'
]

// Check if itemID exists within obliterateItems
function ObliterateCheck(itemID) {
    let check = false
    for (let i = 0; i < obliterateItems.length; i++) {
        let id = obliterateItems[i]
        let reg = new RegExp(id)
        if (typeof id == "string") { reg = new RegExp(`^${id}$`) }
        if (reg.test(itemID)) {
            check = true
            break
        }
    }
    return check
}

// Remove recipes
ServerEvents.recipes(event => {
    event.remove({ input: obliterateItems })
    event.remove({ output: obliterateItems })
})

// Remove tags
ServerEvents.tags('item', event => {
    event.removeAllTagsFrom(obliterateItems)
})

// Append disabled tooltip
ItemEvents.modifyTooltips(event => {
    event.add(obliterateItems, Text.red('Disabled'))
})

// Remove from recipe viewer
RecipeViewerEvents.removeEntriesCompletely('item', event => {
    event.remove(obliterateItems)
})

// Remove from loot pools
LootJS.lootTables(event => {
    event.modifyLootTables(/.*/).removeItem(obliterateItems)
})

// Destroy on interaction
BlockEvents.rightClicked(event => {
    let { block } = event
    if (ObliterateCheck(block.id)) { block.set('minecraft:air') }
})

// Destroy on block placement
BlockEvents.placed(event => {
    let { block } = event
    if (ObliterateCheck(block.id)) {
        block.set('minecraft:air')
    }
})

// Destroy on pickup
ItemEvents.canPickUp(event => {
    let { item, itemEntity } = event
    if(itemEntity.hasPickUpDelay()) return
    if (ObliterateCheck(item.id)) { item.setCount(0) }
})

// Destroy on drop
ItemEvents.dropped(event => {
    let { item } = event
    if (ObliterateCheck(item.id)) { item.setCount(0) }
})

// Destroy on inventory changed
PlayerEvents.inventoryChanged(event => {
    let { item, player } = event
    if (ObliterateCheck(item.id)) {
        player.inventory.clear(item);
    }
})