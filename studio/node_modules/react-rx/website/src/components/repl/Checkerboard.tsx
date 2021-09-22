import styled from 'styled-components'

const CHECKER_SIZE = 60
const CHECKER_FG = '#252525'
const CHECKER_BG = '#222'

export const Checkerboard = styled.div`
  display: flex;
  /*align-items: center;*/
  justify-content: center;
  color: #fff;
  height: calc(100% - 1.95em);
  width: 100%;
  background-color: ${CHECKER_FG};
  background-image: linear-gradient(45deg, ${CHECKER_BG} 25%, transparent 25%),
    linear-gradient(-45deg, ${CHECKER_BG} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${CHECKER_BG} 75%),
    linear-gradient(-45deg, transparent 75%, ${CHECKER_BG} 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;

  background-size: ${CHECKER_SIZE}px ${CHECKER_SIZE}px;
  background-position: 0 0, 0 ${CHECKER_SIZE / 2}px,
    ${CHECKER_SIZE / 2}px -${CHECKER_SIZE / 2}px, -${CHECKER_SIZE / 2}px 0;
`
