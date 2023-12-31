/ 2. 从上到下
    let b = 0;
    while (b < edge - 1) {
      res[n - circle][b] = (n - circle) * 4 + 1 * (edge - 1) + b + 1;
      b++;
    }