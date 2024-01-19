function encodeSubdirectory(subdirectory) {
    return subdirectory
      .split('')
      .map(char => (char === '/' ? char : encodeURIComponent(char)))
      .join('');
  }

  console.log(encodeSubdirectory("some/sub/dir ec&&&t"))