
export default class Player {
  constructor(){
    this.currentTime="00:00"
    this.duration="00:00";
    this.progress={
      value: 0,
      max: 0
    };
    this.mode='normal';
  }

  listener(backgroundAudioManager){
    backgroundAudioManager.onCanplay(()=>{})
    backgroundAudioManager.onPlay(()=>{

    })
    backgroundAudioManager.onPause(()=>{})
    backgroundAudioManager.onTimeUpdate(()=>{})
    backgroundAudioManager.onSeeked(()=>{})
    backgroundAudioManager.onEnded(()=>{})

  }
  init(){

  }

  play(){}
  pause(){}
  reset(){}
  pre(){}
  next(){}


}

