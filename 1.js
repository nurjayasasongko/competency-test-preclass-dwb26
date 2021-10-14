const drawSikuSiku = (n) => {
  let num = 2,
    str = "";
  for (let i = 0; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      while (!prime(num)) num++;
      str += `${num++} `;
    }
    str += "\n";
  }
  console.log(str);
};

const prime = (num) => {
  let flag;
  for (let i = 2; i < num; i++) {
    //flag = num % i != 0 ? 1 : 0;
    if (num % i != 0) {
      flag = 1;
    } else {
      flag = 0;
      break;
    }
  }

  return flag == 1 || num == 2 ? true : false;
};

drawSikuSiku(5);
