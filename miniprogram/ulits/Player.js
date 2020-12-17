import { api } from './api'

export default class Player {
	constructor(backgroundAudioManager, songmid) {
		this.songmid = songmid;
		this.currentTime = "00:00"
		this.duration = "00:00";
		this.mode = 'normal';
		this.backgroundAudioManager = backgroundAudioManager;
		this.isPaused = true,
			this.progress = {
				value: 0,
				max: 0,
			};
		this.playingList = {
			isPlaying: {},
			willPlay: [],
			index: Number
		}
		this.lyric = {
			lyric: [],
			lyricShow: [],
			lyricIn: Number,
			offsetY: "0px"
		}
	}

	init(songData, src) {
		wx.request({ //歌曲信息
			url: api.dev + `/song?songmid=${this.songmid}`,
			success: res_SongData=> {
				wx.request({ //歌词请求
					url: api.dev + `/song/urls?id=${songmid}`,
					success: res_SongLyric => {
						if(JSON.stringify(res_SongLyric.data.data)=="{}"){
							wx.showToast({
								title: '歌曲需要开通绿钻或者购买',
                icon: 'none',
                duration: 2000
							})
							this.playingList.index +=1
						}
					}
				})

			}
		})



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

