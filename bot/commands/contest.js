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
  fetch('https://api.elitebot.dev/contests/at/now')
  .then(response => response.json())
  .then(data => {
    let closestTime;
    let closestContest;
    for (const time in data.contests) {
      if ((Date.now() / 1000) - 1200 < time) {
        closestTime = new Date(time * 1000);
        closestContest = data.contests[time];
        break;
      }
    }

    let contestString = closestContest.join(", ");
    let timeRemaining = getTimeRemaining(closestTime);
    if (timeRemaining.minutes < 0) {
      return (`${chat}The current contest is ${contestString}. It will end in ${20 - timeRemaining.minutes * -1} minutes.`);
    }
    else {
      return (`${chat}The next contest is ${contestString}. It will start in ${timeRemaining.minutes} minutes.`);
    }
  })
  .catch(error => console.error('Error:', error));
}