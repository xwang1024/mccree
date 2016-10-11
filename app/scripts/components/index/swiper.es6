'use strict';

module.exports = (function initSwiper() {
  var canContinue = true;
  var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 24,
    speed: 600,
    roundLengths: true,
    //值为true时，Swiper会四舍五入宽度和高度。
    autoplay: 3000,

    pagination: '.swiper-pagination',
    paginationClickable: true,
    onSlideChangeStart: function(swiper) {
      $(".swiper-slide-active").css("opacity", "0.6");
      $(".swiper-slide-active").animate({
        opacity: "1"
      },
      600);
      var allSlides = $(".swiper-wrapper").children();
      for (var i = 0; i < allSlides.length; i++) {
        if ($(allSlides[i]).hasClass("swiper-slide-active") == false) {
          $(allSlides[i]).animate({
            opacity: "0.6"
          },
          600);
        }
      }
    },

  });
  $("#js-swiper-prev").click(function() {
    mySwiper.stopAutoplay();
    $(this).animate({
      left: "-80px"
    },
    200);
    $(this).animate({
      left: "-70px"
    },
    200);
    mySwiper.slidePrev();
    if (canContinue) {
      mySwiper.startAutoplay();
    }

  });
  $("#js-swiper-next").click(function() {
    mySwiper.stopAutoplay();
    $(this).animate({
      right: "-80px"
    },
    200);
    $(this).animate({
      right: "-70px"
    },
    200);
    mySwiper.slideNext();
    if (canContinue) {
      mySwiper.startAutoplay();
    }
  });
  $(".swiper-wrapper,#js-swiper-prev,#js-swiper-next").hover(function() {
    mySwiper.stopAutoplay();
    canContinue = false;
  },
  function() {
    mySwiper.startAutoplay();
    canContinue = true;
  })
})();