import styled from 'styled-components';

const AppWrapper = styled.div.attrs((props) => ({
  color: props.color || 'blue'
}))`
  color: #666;

  .section {
    font-size: ${(props) => props.size}px;
    border: 1px solid ${(props) => props.color};
  }

  .footer {
    border: 1px solid orange;
  }
`;

export default AppWrapper;
