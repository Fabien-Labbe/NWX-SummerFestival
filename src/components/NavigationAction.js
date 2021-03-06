import React from "react";
import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";
import { Flex, Text, Box } from "@chakra-ui/core";
import backToTop from "../helpers/backToTop";

const propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  exact: PropTypes.bool,
  to: PropTypes.string.isRequired
};

const defaultProps = {
  exact: false
};

const NavigationAction = ({
  className,
  exact,
  to,
  iconElement: IconElement,
  children,
  ...props
}) => {
  const location = useLocation();

  return (
    <Flex
      as={Link}
      to={to}
      color={to === location.pathname ? "white" : "brand.200"}
      flexDir="column"
      align="center"
      flexGrow="1"
      flexBasis="100%"
      p="2"
      pt="3"
      {...props}
      onClick={() => {
        if (to === location.pathname) {
          backToTop();
        }
      }}
    >
      <Box as={IconElement} size="1.6rem" />
      <Text
        fontSize="0.55rem"
        fontWeight="bold"
        textTransform="uppercase"
        mt="1"
      >
        {children}
      </Text>
    </Flex>
  );
};

export default NavigationAction;

NavigationAction.propTypes = propTypes;
NavigationAction.defaultProps = defaultProps;
