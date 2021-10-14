input = [2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11];

function bubbleSort(input, curr) {
  if (curr == input.length) {
    return input;
  }
  for (let i = 0; i < input.length; i++) {
    if (input[i] > input[i + 1]) {
      let newVar = input[i];
      input[i] = input[i + 1];
      input[i + 1] = newVar;
    }
  }
  return bubbleSort(input, curr + 1);
}
console.log(bubbleSort(input, 0));
