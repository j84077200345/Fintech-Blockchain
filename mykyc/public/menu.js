$(document).ready(function(){
    document.getElementById('oname').innerHTML = localStorage.getItem('oname');
});
function reg() {
    location.href="http://localhost:3000/reg";
}
function view_all_customers() {
    location.href="http://localhost:3000/view_all_customers.html";
}
function logout(){
    alert("登出成功 !!");
    location.href="http://localhost:3000/";
}