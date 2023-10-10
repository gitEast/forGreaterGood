import React, { PureComponent } from 'react';

export class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      username: '',
      hobbies: [
        { value: 'sing', label: '唱', isChecked: false },
        { value: 'dance', label: '跳', isChecked: false },
        { value: 'rap', label: 'rap', isChecked: false }
      ],
      fruit: []
    };
  }

  handleFormSubmit(event) {
    event.preventDefault();
    console.log(this.state.username);
    console.log(
      this.state.hobbies
        .filter((item) => item.isChecked)
        .map((item) => item.value)
    );
    console.log(this.state.fruit);
  }

  handleUsernameChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleHobbiesChange(e, index) {
    const hobbies = [...this.state.hobbies];
    hobbies[index].isChecked = e.target.checked;
    this.setState({ hobbies });
  }

  handleFruitChange(e) {
    const options = Array.from(e.target.selectedOptions);
    const fruit = options.map((item) => item.value);
    this.setState({ fruit });

    // Array.from(iterable, mapFn)
    const fruitValues = Array.from(
      e.target.selectedOptions,
      (item) => item.value
    );
    console.log(fruitValues);
  }

  render() {
    const { username, hobbies, fruit } = this.state;

    return (
      <div>
        <form onSubmit={(e) => this.handleFormSubmit(e)}>
          <div>
            <label htmlFor="username">用户：</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => this.handleUsernameChange(e)}
            />
          </div>
          <div>
            <label>爱好：</label>
            {hobbies.map((item, index) => {
              return (
                <label key={item.value} htmlFor={item.value}>
                  <input
                    type="checkbox"
                    name={item.value}
                    id={item.value}
                    value={item.isChecked}
                    onChange={(e) => this.handleHobbiesChange(e, index)}
                  />
                  {item.label}
                </label>
              );
            })}
          </div>
          <div>
            <label>水果：</label>
            <select
              name="fruit"
              id="fruit"
              value={fruit}
              onChange={(e) => this.handleFruitChange(e)}
              multiple
            >
              <option value="apple">苹果</option>
              <option value="banana">香蕉</option>
              <option value="orange">橘子</option>
            </select>
          </div>
          <div>
            <button type="submit">提交</button>
          </div>
        </form>
      </div>
    );
  }
}

export default App;
