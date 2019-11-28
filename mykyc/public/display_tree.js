var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://fintech-data.firebaseio.com/hash.json",
    "method": "GET",
    "headers": {
      "content-type": "application/json"
    },
    "processData": false
}
  
$.ajax(settings).done(function (response) {
    console.log(response);
    document.getElementById('uidHash').innerHTML = response.uid.substr(1,15) + '...';
    document.getElementById('revenueHash').innerHTML = response.revenue.substr(1,15) + '...';
    document.getElementById('rootHash').innerHTML = response.root.substr(1,15) + '...';
});

function image_check() {
  location.href = "http://127.0.0.1:3000/image_check.html"
}