import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonInput: '',
      response: null,
      error: '',
      selectedOptions: [],
    };
  }

  handleJsonChange = (e) => this.setState({ jsonInput: e.target.value });

  handleOptionChange = (e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const selectedOptions = prevState.selectedOptions.includes(value)
        ? prevState.selectedOptions.filter(option => option !== value)
        : [...prevState.selectedOptions, value];
      return { selectedOptions };
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(this.state.jsonInput);
      const res = await axios.post('http://localhost:8000/bfhl', parsedData);
      console.log(res)
      this.updateResponse(res.data);
    } catch {
      this.setState({ error: 'Invalid JSON input' });
    }
  };

  updateResponse = (dataOptions) => {
    const { selectedOptions } = this.state;
    const filteredData = {};

    if (selectedOptions.includes('Alphabets')) filteredData.alphabets = dataOptions.alphabets || [];
    if (selectedOptions.includes('Numbers')) filteredData.numbers = dataOptions.numbers || [];
    if (selectedOptions.includes('Highest lowercase alphabet')) filteredData.highestLowercase = dataOptions.highest_lowercase_alphabet || [];

    for (const key in filteredData) {
      filteredData[key] = filteredData[key].join(', ');
    }

    this.setState({ response: filteredData });
  };

  render() {
    const { jsonInput, error, response, selectedOptions } = this.state;

    return (
      <div style={{ padding: '20px' }}>
        <h1>JSON Filter App</h1>
        <form onSubmit={this.handleSubmit}>
          <textarea
            value={jsonInput}
            onChange={this.handleJsonChange}
            rows="5"
            cols="50"
            placeholder='Enter JSON here...'
          />
          <h2>Select Options:</h2>
          {['Alphabets', 'Numbers', 'Highest lowercase alphabet'].map(option => (
            <div key={option}>
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={this.handleOptionChange}
                />
                {option}
              </label>
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {response && (
          <div>
            <h2>Filtered Response:</h2>
            {Object.entries(response).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default App;