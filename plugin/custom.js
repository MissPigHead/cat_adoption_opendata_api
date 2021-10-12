// typed.js for banner slogan
new Typed('.typed1', {
  strings: ['你在等我嗎？^1500 我在這裡期待給你溫暖的陪伴~ &hearts; ^4000 '],
  loop: true,
  typeSpeed: 20,
  backSpeed: 0,
  backDelay: 0,
  showCursor: false,
  fadeIn: true,
  fadeOut: true,
  fadeOutClass: 'typed-fade-out',
  fadeOutDelay: 1000,
});

// owl carousel for banner
$('.owl-carousel').owlCarousel({
  center: true,
  items: 1,
  loop: true,
  dots: true,
  autoplay: true,
});

let // 後續抓貓咪資料使用變數
  url_cat = "https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&animal_kind=貓",
  nw = new Date(),
  nwDate = nw.getDate(),
  qtyCatCard = $("#newCats").children().length,
  uCatCard = $("#newCats").children().find("div.card:hidden").length,
  vCatCard = 0,
  stCard = 0,
  page = 1;

function padLeft(num) { // 補0 至num位
  return num.toString().padStart(2, '0');
}

// 一次生成 qty 貓咪卡片，且顯示從 page*12 張的qty卡片 (取1,2,3,4最小公倍數)
function newCatCard(qty) {
  let
    newD = new Date(new Date().setDate(nwDate)),
    newYear = newD.getFullYear(),
    newMonth = newD.getMonth() + 1,
    newDate = newD.getDate(),
    Mn = padLeft(newMonth), // 從最新的month開始抓資料
    Dt = padLeft(newDate); // 從最新的date開始抓資料

  $.ajax({
    url: "api/api_CURL.php",
    method: "get",
    data: {
      url: url_cat + `&$top=100&$skip=0&animal_createtime=${newYear}/${Mn}/${Dt}`
    },
    dataType: "json",
    success: function (re) {
      if (re.length == 0) {
        // console.log(newYear + "/" + Mn + "/" + Dt, "no data")
        nwDate--; // 從最近的日期沒資料，就往前一天抓
        newCatCard(qty);
      } else {
        re.forEach(e => {
          if (e.album_file != "") { // 只抓 有照片 的資料
            qtyCatCard++;
            switch (e.animal_sex) {
              case "F":
                e.animal_sex = "母貓"
                break;
              case "M":
                e.animal_sex = "公貓"
                break;
              case "N":
                e.animal_sex = "性別不明"
                break;
            }
            if (e.animal_age == "ADULT") e.animal_age = '成貓';
            if (e.animal_age == "CHILD") e.animal_age = '幼貓';
            html = `<div class="col px-3 px-sm-2 mb-1 mb-sm-3" style="display:none">
                        <div class="card" onclick="showCatModal(${e.animal_id})" data-toggle="modal" data-target="#Modal${e.animal_id}">
                          <img src="${e.album_file}" class="card-img-top">
                          <div class="card-body">
                            <div class="card-title">
                              <span class="h5 font-weight-bold">${e.animal_colour.substr(0, e.animal_colour.indexOf('色'))}${e.animal_sex}</span>
                              <span class="text-warning">${e.animal_age} ${e.animal_id}</span></div>
                            <p class="card-text">發現地點：<span>${e.animal_foundplace.substr(0, 6)}...</span></p>
                            <p class="card-text">目前位置：<span>${e.shelter_name.substr(0, 6)}...</span></p>
                            <p class="card-text">資料建立時間：<span>${e.animal_createtime}</span></p>
                          </div>
                        </div>
                      </div>`;
            $(html).appendTo('#newCats');
          }
        })
        if (qtyCatCard < (qty + (page - 1) * 12)) {
          nwDate--;
          newCatCard(qty)
        }
      }
    }
  }).then(() => {
    showCatCard()
    vCatCard = $("#newCats").children().find("div.card:visible").length
    // console.log(`show ${page}*12 cards`, vCatCard)
  })
}

// 訂每個page為12 張卡片 (取1,2,3,4最小公倍數)
function showCatCard() {
  let p = page * 12,
    t = (page - 1) * 12;
  for (let i = t; i < p; i++) {
    $("#newCats").children().eq(i).fadeIn(1000);
  }
}

// 點選【更多貓咪】 抓新的貓咪資料進來
function addCatCard(qty) {
  nwDate--;
  page++;
  newCatCard(qty)
}

// 網頁開啟時先抓12筆資料，生成card，後續擴充功能，隨滑鼠滾動load更多資料，或點擊獲得更多
newCatCard(12);

// 點擊card 出現貓咪細節資料 放入modal顯示
function showCatModal(id) {
  $.getJSON(`${url_cat}&animal_id=${id}`)
    .done((re) => {
      // console.log(re[0]);
      let e = re[0];
      e.animal_remark != '' ? remark = `<p class="p2 font-weight-bold text-danger">${e.animal_remark}</p>` :
        remark = ''
      switch (e.animal_bodytype) {
        case "SMALL":
          e.animal_bodytype = "小型"
          break;
        case "MEDIUM":
          e.animal_bodytype = "中型"
          break;
        case "BIG":
          e.animal_bodytype = "大型"
          break;
      }
      switch (e.animal_sex) {
        case "F":
          e.animal_sex = "母貓"
          break;
        case "M":
          e.animal_sex = "公貓"
          break;
        case "N":
          e.animal_sex = "性別不明"
          break;
      }
      switch (e.animal_bacterin) {
        case "T":
          e.animal_bacterin = "已接種"
          break;
        case "F":
          e.animal_bacterin = "尚未接種"
          break;
        case "N":
          e.animal_bacterin = "待確認"
          break;
      }
      if (e.animal_age == "ADULT") e.animal_age = '成貓';
      if (e.animal_age == "CHILD") e.animal_age = '幼貓';
      e.animal_opendate = e.animal_opendate == "" ? "待開放" : e.animal_opendate
      let html =
        `<div class="modal fade" id="Modal${id}" tabindex="-1" role="dialog" aria-labelledby="ModalLabel${id}" aria-hidden="true" style="padding-right:0">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header text-center">
                  <div class="modal-title" id="ModalLabel${id}">
                    <div class="d-inline-block font-weight-bold h4 m-0 c-o-1">${e.animal_colour}${e.animal_sex}</div>&nbsp&nbsp&nbsp&nbsp
                    <div class="d-inline-block c-o-2">${e.animal_bodytype}${e.animal_age}</div>
                  </div>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <img class="card-img" src="${e.album_file}">
                  <p class="p0">ID:${e.animal_id}</p>
                  <p class="p1">發現地點：${e.animal_foundplace}</p>
                  ${remark}
                </div>
                <div class="modal-footer d-flex flex-column align-items-start">
                  <div>目前位置：<span class="font-weight-bold">${e.shelter_name}</span></div>
                  <div>地址：<span class="font-weight-bold">${e.shelter_address}</span></div>
                  <div>電話：<span class="font-weight-bold">${e.shelter_tel}</span></div>
                  <div>狂犬病疫苗：${e.animal_bacterin}</div>
                  <div>開放認養日：${e.animal_opendate}</div>
                </div>
              </div>
            </div>
          </div>`;
      $(html).appendTo("#catModal");
      $(`#Modal${id}`).modal('show')
    })
    .fail(() => {
      alert("資料來源異常，無法正常取得資料")
    })
}






let url_shelter = "https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=2thVboChxuKs";

// 選收容所區域
$("#area").change(function (e) {
  e.preventDefault();
  let v = $(this).val()
  if (v == 0) {
    $("#shelter_name option").removeClass('d-none')
  } else {
    $("#shelter_name option").addClass('d-none')
    $(`#shelter_name option.a${v}`).removeClass('d-none')
    $(`#shelter_name option[value=${v}]`).attr('selected', false)
    let shelterID=$(`#shelter_name option.a${v}`).eq(0).val()
    $("#shelter_name").val(shelterID)
    getShelter(shelterID)
  }
});

// 選收容所
$("#shelter_name").change(function (e) {
  e.preventDefault();
  let ID = $(this).val()
  getShelter(ID)
})

// 抓OpenData API 的資料 ==========================> 缺照片！！
function getShelter(ID){
  $.ajax({
    type: "get",
    url: url_shelter+"&ID="+ID,
    dataType: "json",
    success: function (re) {
      // console.log(re[0])
      let reg=new RegExp("[0-9-]{9,12}","g") // 電話的pattern
      let telAry=re[0].Phone.match(reg) // 找出符合pattern字串
      let i=a=b=0
      let code=''
      let src=`https://www.google.com/maps/embed/v1/place?q=${re[0].Lat}+${re[0].Lon}&key=AIzaSyDA7NPA6wZbyvmBhZ5_V0-O4mhHV6xYkdE`

      for (let i = 0; i < telAry.length; i++) {
        const e = telAry[i];        
        a=re[0].Phone.indexOf(e)
        code=code+`${re[0].Phone.substr(b,a-b)}`
        b=e.length
        code=code+`${i>0?"<br>":""}<a href="tel:+886${e.replace('-','').substring(1)}">${re[0].Phone.substr(a,b)}</a>`
        if(i==(telAry.length-1)){
          code=code+`${re[0].Phone.substr(a+b)}`
        }
      }
      $(".shelterT span").text(`${re[0].ShelterName}`)
      $("#shelter img").attr('src',`/img/shelter/${re[0].ID}.jpg`)
      $(".shelterAdd").html(`${re[0].Address}`)
      $(".shelterTel").html(code)
      $(".shelterTime").html(`${re[0].OpenTime}`)
      $(".shelterURL a").attr('href',`https://animal.coa.gov.tw/Frontend/PublicShelter/Detail/${re[0].ID}`)
      $(".shelterURL a span").html(`${re[0].ShelterName}`)
      $("iframe").attr("src",src)
    }
  });
}













// 控制導覽列 寬螢幕在上方，小螢幕縮為toggle
$("#nav-toggle").on("click", (event) => {
  var item = event.currentTarget;
  // console.log("OOO")
  $(".nav").toggle();
  if (item.classList.contains("act")) {
    $("#nav-toggle").removeClass("act")
    $(".toggle-line-2").toggle().fadeIn();
    $(".toggle-line-1").removeClass("toggle-line-first")
    $(".toggle-line-3").removeClass("toggle-line-last")
  } else {
    // console.log("XXX")
    $("#nav-toggle").addClass("act")
    $(".toggle-line-2").toggle();
    $(".toggle-line-1").addClass("toggle-line-first")
    $(".toggle-line-3").addClass("toggle-line-last")
  }
  mainMargin()
})

// 隨header高度，調整main的位置
function mainMargin() {
  $("main").css("margin-top", $("#header").outerHeight(true))
}

function debounce(fn, wait) {
  var timeout = null;
  return function () {
    if (timeout !== null)
      clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
  }
}
window.addEventListener('resize', debounce(mainMargin, 100));
mainMargin()

// 下方回首頁的提示 跳跳icon 要執行跳回去的高度 + icon顯示控制
function goTop() {
  let
    nowat = $(window).scrollTop(),
    height = $("#header").innerHeight() + $("#banner").innerHeight() - 100;
  // console.log(nowat,height)
  if (nowat <= height) {
    $("#scrolltop").removeClass("shown");
  } else {
    $("#scrolltop").addClass("shown");
  }
}

// 跳至指定#時 移動效果+高度控制
$("#header a, #scrolltop a").click(function () {
  let who = $(this).attr("href");
  if (who == "#") {
    who = "#banner"
  }
  let val = $(who).offset().top - $("#header").innerHeight() + 1;
  // console.log(who,val)

  $("html").animate({
    scrollTop: val
  }, 1000, "swing");
});

$(window).scroll(() => {
  goTop(); // bounce to top
  spy(); // scroll spy
});

function spy() {
  let nowat = $(window).scrollTop();
  $('section').each(function () {
    let
      id = $(this).attr('id'),
      offset = $(this).offset().top - $("#banner").innerHeight(),
      height = $(this).innerHeight();
    // console.log(id, nowat, offset, height)
    if (offset <= nowat && nowat < offset + height) {
      $("#header a").removeClass('active');
      $(`#header a[href='#${id}']`).addClass('active');
    };
  });
}