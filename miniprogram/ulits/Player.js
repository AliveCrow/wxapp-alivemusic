export default class Player {
	constructor(backgroundAudioManager) {

		this.currentTime = "00:00"
		this.duration = "00:00";
		this.mode = 'normal';
		this.backgroundAudioManager = backgroundAudioManager;
		this.isPaused=true,
		this.progress = {
			value: 0,
			max: 0,
		};
		this.playingList = {
			isPlaying: {},
			willPlay: [],
			index: Number
		}
	}

	init(songData, src) {
		this.backgroundAudioManager.title = songData.name
		this.backgroundAudioManager.epname = songData.album.name
		this.backgroundAudioManager.singer = songData.singer
		this.backgroundAudioManager.coverImgUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${songData.album.mid}.jpg`
		this.backgroundAudioManager.src = src
	}



	play() {
	}

	pause() {
	}

	reset() {
	}

	pre() {
	}

	next() {
	}


}

