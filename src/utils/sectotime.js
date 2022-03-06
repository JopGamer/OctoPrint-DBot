export const sectotime = seconds => {
  let negative = '';
  if (seconds < 0) negative = '-';
  let sec = Math.abs(seconds);

  let hod = sec / 60 / 60;
  hod = hod.toFixed(0);
  if (hod * 60 > sec) hod--;

  let min = (sec - hod * 60 * 60) / 60;
  min = min.toFixed(0);
  if (min < 0) {
    hod--;
    min = (sec - hod * 60 * 60) / 60;
    min = min.toFixed(0);
  }
  if (hod * 60 * 60 + min * 60 > sec) min--;

  let sec2 = sec - (hod * 60 * 60 + min * 60);
  sec2 = sec2.toFixed(0);

  if (hod < 10) hod = `0${hod}`;
  if (min < 10) min = `0${min}`;
  if (sec2 < 10) sec2 = `0${sec2}`;
  return `${negative}${hod}:${min}:${sec2}`;
};
