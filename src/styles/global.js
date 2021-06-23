export const globalStyles = `:root {
  --primary-black: hsl(0, 0%, 8%);
  --primary-white: hsl(0, 0%, 100%);
  --primary-black-hover: hsl(0, 0%, 18%);
  --primary-white-hover: hsl(0, 0%, 90%);
  --border-radius: 3px;
}

*,
:after,
:before {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
}

body {
  text-rendering: optimizeSpeed;
}

@-moz-document url-prefix() {
  body {
    font-weight: lighter !important;
  }
}

body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
  color: var(--primary-black);
}
`