var floorWidthN1 = $('.floor.n1').width()
var floorWidthN2 = $('.floor.n2').width()

var slopeDeg = (function(){
  var v = $('.floor.n1').css('content')
  return parseInt(v.match(/(\d+)deg/)[1])
})()
var slopeRad = slopeDeg * Math.PI / 180

var left0 = parseInt($('.box.n1').css('left'))
var bottom0 = parseInt($('.box.n1').css('bottom'))

var g = 10//重力加速度为10
var us = [0.6, 0.4, 0.2, 0] //摩擦因素数组


var descs = ['毛巾', '木板', '玻璃', '光滑平面']
var colors = ['black', 'brown', 'gray', 'blue']
var thicks = [4, 3, ,2, 1]


var num = us.length
var boxes = []
_.times(num, function(i){
  boxes.push({
    u: us[i],
    v: 0,
    m: 10,//质量为10
    rad: slopeRad,
    left: left0,
    bottom: bottom0
  })
})


function update(box){
  var fv = (box.m * g) * Math.cos(box.rad) //对斜面的正压力
  var fh = (box.m * g) * Math.sin(box.rad) //平行于斜面向下的作用力
  var f = fv * box.u // fv * u 得摩擦力
  f = 0 // 取消切面上摩擦力
  var ah = (fh - f) / box.m //斜面上的加速度
  if (ah < 0) ah = 0
  var a = (box.m * g * box.u) / box.m //平面上的加速度
  if (box.v <= 0) {
    a = 0
    box.v = 0
  }
  if(box.bottom > 0) {
    box.v = box.v + ah/60 //计算速度
    box.left = box.left + box.v * Math.cos(box.rad)
    box.bottom = box.bottom - box.v * Math.sin(box.rad)
  } else {
    box.bottom = 0
    box.rad = 0
    box.v = box.v - a/60
    box.left = box.left + box.v
  }
}

init()


function animate(){
  requestAnimationFrame(animate)
  _.each(boxes, function(box){
    update(box)
  })
  draw()
}


function draw(){
  _.each(boxes, function(box, i){
    var deg = box.rad * 180 / Math.PI
    $('.box.n' + (i+1)).css({
      'left': box.left,
      'bottom': box.bottom,
      'transform': 'rotate('+ deg +'deg)'
    })
  })
}


function init(){
  var $tpl = $('.scene')
  $('.scenes').empty()
  _.each(boxes, function(box, i){
    var $one = $tpl.clone()
    $one.find('.box').removeClass('n1')
      .addClass('n' + (i+1))
      .css({
        'margin-bottom': thicks[i]
      })
    $one.find('.floor').css({
      'border-bottom': thicks[i] +'px solid '+ colors[i]
    })
    $one.find('.desc').text(descs[i])
    $one.find('.desc').css({
      'position': 'absolute',
      'left': '400px',
      'top': '50px'
    })
    $one.appendTo('.scenes')
  })
  draw()

  $('#start').on('click', function(){
    id = requestAnimationFrame(animate)
  })
  $('#restart').on('click', function(){
    location.reload()
  })

}
