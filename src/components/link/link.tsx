import styled from "styled-components";
import { Link as GatsbyLink } from "gatsby";

const Link = styled(GatsbyLink)`
  color: white;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

export { Link };
