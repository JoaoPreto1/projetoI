const initBtn = document.querySelector('#initBtn');

initBtn.addEventListener('click', () => {
     let min = 0;
     let max = 2;
     let i = Math.floor(Math.random() * (max- min + 1) + min);
    alert(i)
 })