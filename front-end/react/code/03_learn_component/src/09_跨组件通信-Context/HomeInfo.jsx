import ThemeContext from './context/theme-context';

function HomeInfo() {
  return (
    <div>
      <h4>Home Info</h4>
      <ThemeContext.Consumer>
        {({ color, fontSize }) => {
          return (
            <span>
              info -- color: {color}, font-size: {fontSize}
            </span>
          );
        }}
      </ThemeContext.Consumer>
    </div>
  );
}

export default HomeInfo;
