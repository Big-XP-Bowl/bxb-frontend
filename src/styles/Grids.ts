import styled, { css }from 'styled-components';

const sm = css`
  max-width: 576px;

  @media (min-width: 276px) {
    grid-template-columns: repeat(1, 1fr);
    max-width: 768px;
  }
`;

const md = css`
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 992px;
  }
`;

const lg = css`
  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
    max-width: 1200px;
  }
`;

const xl = css`
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1400px;
  }
`;

const Grid1 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  ${sm}
  ${md}
  ${lg}
  ${xl}
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  ${sm}
  ${md}
  ${lg}
`;

const GridTop = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  gap: 1rem;
  margin-bottom: 1rem;
  `;

const GridCalendarToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9abab;
  gap: 1rem;
`;

export { Grid1, Grid2, GridTop, GridCalendarToolbar };