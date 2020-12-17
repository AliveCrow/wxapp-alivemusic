import { api } from './api'

export default class Player {
	constructor() {
		this.__ = wx.getBackgroundAudioManager();
		this.currentTime = "00:00"
		this.duration = "00:00";
		this.modes = ["random", "loop", "normal"];
		this.mode = 'normal';
		this.isPaused = true;
		this.updateId = null;
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

	init(songmid) {
		wx.request({ //歌曲信息
			url: api.dev + `/song?songmid=${songmid}`,
			success: res_SongData => {
				wx.request({ //歌词请求
					url: api.dev + `/song/urls?id=${songmid}`,
					success: res_SongUrl => {
						if (JSON.stringify(res_SongUrl.data.data) == "{}") {
							wx.showToast({
								title: '歌曲需要开通绿钻或者购买',
								icon: 'none',
								duration: 2000
							})
							return
						}
						let songData = res_SongData.data.data.track_info
						this.__.title = songData.name
						this.__.epname = songData.album.name
						this.__.singer = songData.singer
						this.__.coverImgUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${songData.album.mid}.jpg`
						this.__.src = res_SongUrl.data.data[songmid]
						wx.hideLoading({
							success: () => {
								wx.navigateTo({
									url: '/pages/Play/index'
								})
							},
						})

					}
				})

			},
			fail: error => {
				wx.showToast({
					title: '接口错误',
					icon: 'fail',
					duration: 2000
				})
			}
		})
	}
	reSetSong(songmid) {

		return new Promise((resolve, reject) => {
			wx.request({
				url: api.dev + `/song?songmid=${songmid}`,
				success: (res) => {
					wx.request({
						url: api.dev + `/song/urls?id=${songmid}`,
						success: url => {
							if (JSON.stringify(url.data.data) == "{}") {
								reject()
								return
							}
							resolve({ res: res, url: url })
						},
						fail: error => {
							wx.showToast({
								title: '接口错误',
								icon: 'fail',
								duration: 2000
							})
						}
					})
				}
			})

		})

	}
	whichIsPlaying() {
		this.playingList.index = (this.playingList.willPlay.findIndex(item => this.playingList.isPlaying.track_info.mid === item.mid || this.playingList.isPlaying.track_info.mid === item.songmid))
	}
	update(time = 500, _this) {
		this.updateId = setInterval(() => {
			this.currentTime = this.formatTime(this.__.currentTime)
			this.duration = this.formatTime(this.__.duration)
			this.progress.value = Math.round(this.__.currentTime)
			_this.setData({
				currentTime: this.currentTime,
				progressValue: this.progress.value,
				['progress.value']: this.progress.value,
				['progress.max']: this.progress.max
			})
		}, time)
	}
	play() {
		this.__.play()
		this.isPaused = false
	}
	pause() {
		this.__.pause()
		this.isPaused = true
	}
	reset() {
		this.pause()
		this.__.seek(0)
		this.progress.value = 0
		this.__.play()
	}
	random() {
		this.playingList.index = parseInt(Math.random() * this.playingList.willPlay.length)
	}
	seek(value, _this) {
		this.__.pause()
		clearInterval(this.updateId)
		this.updateId = null
		//暂停后再拖动进度条,放置进度条跳动
		_this.setData({
			seek: true,
			value: value,
			['progress.value']: value,
			['progress.max']: this.progress.max,
		})
		this.progress.value = value
		this.__.seek(value)
	}
	pre() {
		this.playingList.index -= 1
		if (this.playingList.index < 0) {
			this.playingList.index = this.playingList.willPlay.length - 1
		}
		wx.showLoading({
			title: '稍等',
		})
		let songmid = this.playingList.willPlay[this.playingList.index].mid
		return songmid
	}
	next() {
		if (this.mode === "random") {
			this.random()
		} else {
			this.playingList.index += 1
			if (this.playingList.index > this.playingList.willPlay.length - 1) {
				this.playingList.index = 0
			}
		}
		wx.showLoading({
			title: '稍等',
		})

		let songmid = this.playingList.willPlay[this.playingList.index].mid ||
			this.playingList.willPlay[this.playingList.index].songmid

		return songmid
	}
	changeMode() {
		let modeIndex = this.modes.findIndex(item => item === this.mode)
		if (modeIndex < 3) {
			modeIndex += 1
			if (modeIndex === 3) {
				modeIndex = 0
			}
		}
		this.mode = this.modes[modeIndex]
	}
	formatTime(time) {
		let min = Math.floor(time / 60)
		let sec = Math.floor(time % 60)
		if (min < 10) min = '0' + min
		if (sec < 10) sec = '0' + sec
		return `${min}:${sec}`
	}


}

