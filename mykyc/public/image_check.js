$(document).ready(function(){
    document.getElementById('copy').innerHTML =  '<img style="width: 100%; height: 100%;" src="/images/' + localStorage.getItem('uid_backup') + '">';
    document.getElementById('uid_copy').value = localStorage.getItem('uid_backup');
});