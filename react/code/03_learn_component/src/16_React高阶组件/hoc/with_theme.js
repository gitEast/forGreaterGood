import ThemeContext from '../context/theme-context';

function withTheme(OriginalComponent) {
  return function (props) {
    return (
      <ThemeContext.Consumer>
        {(value) => <OriginalComponent {...value} {...props} />}
      </ThemeContext.Consumer>
    );
  };
}

export default withTheme;
