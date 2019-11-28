var QRCode = require('qrcode')
var canvas = document.getElementById('canvas')
var userkey = localStorage.getItem('userkey');

QRCode.toCanvas(canvas, userkey, function (error) {
  if (error) console.error(error)
  console.log(userkey);
  console.log(typeof(userkey));
})