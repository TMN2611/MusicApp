const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const title = $('title')
const cd = $(".cd");
const player = $(".player");
const heading = $("header h2");
const cdThum = $(".cd-thumb");
const audio = $("#audio");
const btnPlay = $(".btn-toggle-play");
const progress = $("#progress");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");
const playlist = $(".playlist")


const App = {
  currentIndex: 0,
  songs: [
    {
      name: "Despacito",
      singer: "Luis Fonsi",
      path: "./assets/music/1Despacito.mp3",
      image: "./assets/img/1LuisFonsi.jpg",
    },
    {
      name: "Hello VietNam",
      singer: "Pham Quynh Anh",
      path: "./assets/music/2HelloVietNam.mp3",
      image: "./assets/img/2PhamQuynhAnh.jpg",
    },
    {
      name: "Hey Jude",
      singer: "The Beatles",
      path: "./assets/music/3HeyJude.mp3",
      image: "./assets/img/3TheBeatles.jpg",
    },
    {
      name: "Home",
      singer: "Jordan Schor & Harley Bird",
      path: "./assets/music/4Home.mp3",
      image: "./assets/img/4JordanSchor&HarleyBird.jpg",
    },
    {
      name: "Play Date",
      singer: "Melanie Martinez",
      path: "./assets/music/5PlayDate.mp3",
      image: "./assets/img/5MelanieMartinez.jpg",
    },
    {
      name: "See You Again",
      singer: "Charlie Puth",
      path: "./assets/music/6SeeYouAgain.mp3",
      image: "./assets/img/6CharliePuth.jpg",
    },
    {
      name: "The Night",
      singer: "Avicii",
      path: "./assets/music/7TheNight.mp3",
      image: "./assets/img/7Avicii.jpg",
    },
    {
      name: "Wake Up Me",
      singer: "Avicii",
      path: "./assets/music/8WakeMeUp.mp3",
      image: "./assets/img/8Avicii.jpg",
    },
    {
      name: "Wolrd Cup Music 2010",
      singer: "K'naan",
      path: "./assets/music/9WolrdCupMusic2010.mp3",
      image: "./assets/img/9Knaan.jpg",
    },
    {
      name: "We Don't Talk Anymore",
      singer: "Charlie Puth",
      path: "./assets/music/10WeDon'tTalkAnymore.mp3",
      image: "./assets/img/10CharliePuth.jpg",
    },
  ],
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  render: function () {
    var htmls = this.songs.map((song, index) => {
      return `
            <div data-index = ${index} class="song ${index === this.currentIndex ? ' active' : ''}">
                <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>            
            `;
    });
    var playlist = (document.querySelector(".playlist").innerHTML =
      htmls.join(""));
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;

    //  xử lý zoom CD
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    const cdThumAnumate = cdThum.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumAnumate.pause();

    //  Xử lý khi click play and pause
    btnPlay.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }

    };      
    //  Khi play
    audio.onplay = function () {
      player.classList.add("playing");
      _this.isPlaying = true;
      cdThumAnumate.play();
    };
    //  Khi pause
    audio.onpause = function () {
      player.classList.remove("playing");
      _this.isPlaying = false;
      cdThumAnumate.pause();
    };
    // thời gian hiện tại
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        
        if(progressPercent == 100) {
          _this.nextSong();
        }
        progress.value = progressPercent;
      }
    };
    //  khi tua
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
      audio.play();
    };
    //  Khi next
    btnNext.onclick = function () {
      App.nextSong();
      player.classList.add("playing");
      progress.value = 0;
      audio.play();
    };
    // xử lý khi nhấn previous
    btnPrev.onclick = function () {
      App.previousSong();
      progress.value = 0;
      audio.play();
    };
    //  Xử lý khi bật / tắt random
    btnRandom.onclick = function () {
      _this.isRandom = !_this.isRandom;
      btnRandom.classList.toggle("active", _this.isRandom);
      if(_this.isRepeat) {
        btnRepeat.classList.remove("active");
      }
    };
    // Xử lý khi bật / tắt repeat
    btnRepeat.onclick = function () {
        _this.isRepeat = !_this.isRepeat;
        btnRepeat.classList.toggle("active", _this.isRepeat);
        if(_this.isRandom) {
          btnRandom.classList.remove("active");
        }

    }
    //  Xử lý khi audio end
    audio.onended = function () {
      
      if(_this.isRepeat) {
          audio.play();
      }
      else {
        btnNext.click();
      }
    }

    //  Xử lý  khi click vào playlist
    playlist.onclick = function(e){
      const songNode = e.target.closest('.song:not(.active)');
      if(
        songNode || e.target.closest('.option')
        ) {
          //  Xử lý khi click vào song 
          if(songNode) {
              console.log(songNode.dataset.index);
              _this.currentIndex = Number(songNode.dataset.index);
              _this.loadCurrentSong();
              _this.render();
              audio.play();

          }

           
          }
      else {

      }
    }
  },
  loadCurrentSong: function () {
    heading.innerText = this.currentSong.name;
    cdThum.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = `${this.currentSong.path}`;
    if(this.currentIndex > 0) {
      title.innerText = `(${heading.innerText})`
    }
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    if(this.isRandom) {
      this.playRandomSong();
     
    }
    if(this.isRepeat){
      this.currentIndex--;
      
      
    }
    this.loadCurrentSong();
    audio.play();
    this.render();
    
  },
  previousSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
    if(this.isRandom) {
      this.playRandomSong();
    }
    if(this.isRepeat){
      this.loadCurrentSong();
    }
    this.loadCurrentSong();
    this.render();
  },
  playRandomSong: function () {
      let newindex
      do {
        newindex = Math.floor(Math.random() * this.songs.length)
      }while (newindex === 0)
      this.currentIndex = newindex;
      console.log(newindex)
  },
  start: function () {
    //  Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    //  Lắng nghe và sử lý các sự kiện DOM event
    this.handleEvent();

    
    // Load thông tin bài hát đầu tiên vào UI khi chạy úng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};
App.start();

