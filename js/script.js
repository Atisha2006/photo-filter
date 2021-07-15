  const inputs = document.querySelectorAll('.filters input');
  const img = document.querySelector('img');
  const canvas = document.querySelector('canvas');
  const buttons = document.querySelectorAll('.btn-container button.btn');
  const btnInput = document.querySelector('#btnInput');
  const btnSave = document.querySelector('.btn-save');
  const btnNext = document.querySelector('.btn-next');
  const btnReset = document.querySelector('.btn-reset');
  const blur = document.querySelector('.filters input[name=blur]');
  const invert = document.querySelector('input[name=invert]');
  const sepia = document.querySelector('.filters input[name=sepia]');
  const saturate = document.querySelector('.filters input[name=saturate]');
  const hue = document.querySelector('.filters input[name=hue]');

  function drawImage() {
    const canvasImg = new Image();
    canvasImg.src = img.src;
    img.crossOrigin = 'anonymous';
    canvasImg.onload = function() {
      canvas.width = canvasImg.width;
      canvas.height = canvasImg.height;
      const ctx = canvas.getContext("2d");
      let k;
      canvasImg.width >= canvasImg.height ? k = canvasImg.width/img.width : k = canvasImg.height/img.height;
      let filters = `blur(${k * blur.value}px) invert(${invert.value}%) sepia(${sepia.value}%) saturate(${saturate.value}%) hue-rotate(${hue.value}deg)`;
      ctx.filter = filters;
      ctx.drawImage(img, 0, 0);
    };
  }

  function resetInput(el) {
    el.value = el.getAttribute('value');
  };

  function setOutput(el) {
    el.nextElementSibling.value = el.value;
  };

  inputs.forEach((el) => {
    resetInput(el);
  });
  img.onload = function() {
    drawImage();
  };

  inputs.forEach((input) => input.addEventListener('input', (event) => {
    setOutput(event.target);
    const suffix = event.target.dataset.sizing || '';
    img.style.setProperty(`--${event.target.name}`, event.target.value + suffix);
    drawImage();
  }));

  btnInput.addEventListener('change', function(e) {
    const file = btnInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
      drawImage();
    }
    reader.readAsDataURL(file);
    e.target.value = null;
  });

  btnSave.addEventListener('click', function(e) {
    let link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  });

  let numbeImg = 0;
  let timeDay;

  btnNext.addEventListener('click', function(e) {
    const date = new Date();
    if(date.getHours() >= 6 && date.getHours() < 12) timeDay = 'morning';
    else if(date.getHours() >= 12 && date.getHours() < 18) timeDay = 'day';
    else if(date.getHours() >= 18 && date.getHours() < 24) timeDay = 'evening';
    else if(date.getHours() >= 0 && date.getHours() < 6) timeDay = 'night';
    ++numbeImg;
    if (numbeImg > 20){numbeImg = numbeImg - 20;}
    if (numbeImg < 10) { numbeImg = '0' + numbeImg;}
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeDay}/${numbeImg}.jpg`;
  });


  buttons.forEach((button) => button.addEventListener('click', (event) => {
    buttons.forEach((el) => {
      if(el.classList.contains('btn-active')) {
        el.classList.remove('btn-active');
      }
    });
    event.target.classList.add('btn-active');
  }));

  btnReset.onclick = function(event) {
    img.removeAttribute("style");
    inputs.forEach((el) => {
      resetInput(el);
      setOutput(el);
    });
    drawImage();
  };

  document.querySelector('.fullscreen').onclick = function(event) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      event.target.classList.remove('openfullscreen');
    } else {
      document.documentElement.requestFullscreen();
      event.target.classList.add('openfullscreen');
    }
  }
