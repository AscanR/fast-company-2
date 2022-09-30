import React from "react";
import PropTypes from "prop-types";
import { useQualities } from "../../../../hooks/useQualities";

const Quality = ({ id }) => {
    const { isLoading, getQuality } = useQualities();
    const q = getQuality(id);
    if (!isLoading) {
        return (
              <span className={"badge m-1 bg-" + q.color}>
            {q.name}
        </span>
        );
    } else return "Loading ...";
};
Quality.propTypes = {
    id: PropTypes.string.isRequired
};

export default Quality;
