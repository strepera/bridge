function getTimeRemaining(endtime){
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor( (total/1000) % 60 );
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math.floor( (total/(1000*60*60)) % 24 );
    const days = Math.floor( total/(1000*60*60*24) );
   
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
}

export default async function(bot, requestedPlayer, player, chat) {
    const response = await fetch(`https://api.hypixel.net/v2/skyblock/firesales`);
    const data = await response.json();

    if (!data.success || !data.sales) return (chat + "No firesale data available.");

    const itemResponse = await fetch(`https://api.hypixel.net/v2/resources/skyblock/items`);
    const itemData = await itemResponse.json();

    let items = [];
    for (const item of data.sales) {
        for (const itemObj of itemData.items) {
            if (itemObj.id == item.item_id) {
                items.push(`${itemObj.name} [${item.price}] (${item.amount} quantity) ends in ${getTimeRemaining(new Date(item.end)).hours} hours`);
            }
        }
    }
    if (items.length != data.sales.length) {
        items = [];
        for (const item of data.sales) {
            items.push(`${item.item_id} [${item.price}] (${item.amount} quantity) ends in ${getTimeRemaining(new Date(item.end)).hours} hours`);
        }
    }

    return (chat + items.join(', '));
}