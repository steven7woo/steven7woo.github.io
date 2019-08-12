// $(document).ready(function(){
//  $('.s-bg-image').height($(window).height());
// })
//
$(".navbar a").click(function(){
  $("body,html").animate({
   scrollTop:$("#" + $(this).data('value')).offset().top-100
  },1000)
 })
