function submit_house() {
    var fileInput = document.getElementById('uidbackup');
    var filename = fileInput.files[0].name
    window.localStorage.setItem('cus_address', cus_address);
}