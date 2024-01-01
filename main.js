// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "1 Tháng Tắm 1 Lần ",
      singer: 'Tú "Dơ"',
      path: "./music/tắm.mp3",
      image: "./image/tam.jpg",
    },
    {
      name: "Donate Cho Taoo ",
      singer: "Thầy Tú Sena",
      path: "./music/naptien.mp3",
      image: "./image/naptien.jpg",
    },
    {
      name: "Giàu vì bạn, Sang vì vợ",
      singer: 'Thảo "Khôn" - Khoa "Đần"',
      path: "./music/Thao.mp3",
      image: "./image/thao1.jpg",
    },
    {
      name: "THE PLAYAH Cover Cực Mạnh",
      singer: 'Khoa "Đá"',
      path: "./music/KhoaNgu.mp3",
      image: "./image/Khoa1.jpg",
    },
    {
      name: "SODA",
      singer: "MCK",
      path: "./music/SODA.mp3",
      image: "./image/mck.jpg",
    },
    {
      name: "Từ chối hiểu(cover)",
      singer: "Lam Thảo",
      path: "./music/Từ Chối Hiểu - Cover.mp3",
      image: "./image/LamThao.jpg",
    },
    {
      name: "Daybyday",
      singer: "SIVAN",
      path: "./music/Day By Day.mp3",
      image: "./image/sivan.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
        <div
          class="thumb"
          style="
            background-image: url('${song.image}');
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return app.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    const cdAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdAnimate.pause();
    // Xử lý khi phóng to / thu nhỏ
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    // Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // Khi bài hát được PLAY
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdAnimate.play();
    };
    // Khi bài hát bị PAUSE
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdAnimate.pause();
    };
    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua bài hát
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next bài hát
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      _this.render();
      audio.play();
      _this.scrollToActiveSong();
    };
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    // Xử lý bật / tắt random bài hát
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active");
    };

    // Xử lý next bài khi ended audio
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Xử lý lặp bài hát
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active");
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // Xử lý click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 250);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM Events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    // Render playlist
    this.render();
  },
};

app.start();
