function cus_login() {
    // var cus_address = document.getElementById('address').value;
    var cus_address = '0xF4E69F9cC45bF42ad9cA67aCDF8D46aAa0507942';
    console.log(cus_address);
    window.localStorage.setItem('cus_address', cus_address);
    location.href="http://127.0.0.1:3000/customer_submit.html"
}