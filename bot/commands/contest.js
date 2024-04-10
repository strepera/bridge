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
 
 export default async function(bot) {
  fetch('https://api.elitebot.dev/contests/at/now')
  .then(response => response.json())
  .then(data => {
      let now = new Date();
      let closestTime;
      let closestContest;
      for (let time in data.contests) {
          let contestTime = new Date(time * 1000);
          if (contestTime > now && (!closestTime || contestTime < closestTime)) {
              closestTime = contestTime;
              closestContest = data.contests[time];
          }
      }
      let contestString = closestContest.join(", ");
      let timeRemaining = getTimeRemaining(closestTime);
      bot.chat(`/gc The next contest is ${contestString}. It will start in ${timeRemaining.minutes} minutes.`);
      global.lastMessage = (`/gc The next contest is ${contestString}. It will start in ${timeRemaining.minutes} minutes.`);
  })
  .catch(error => console.error('Error:', error));
}