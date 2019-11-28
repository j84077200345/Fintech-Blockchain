function login() {
    // var orgname = document.getElementById('orgname').value;
    var orgname = '0xc9bBeb947f2C2d12618cbC20561B99C53CDA5AF9';
    console.log(orgname);
    window.localStorage.setItem('oname', orgname);
    location.href="http://localhost:3000/menu.html"
}