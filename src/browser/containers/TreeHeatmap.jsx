import React from 'react';
import {connect} from 'react-redux';

import Heatmap from '../components/Heatmap.jsx';

/**
 *
 */
class TreeHeatmap extends React.Component {
    /**
     * @return {JSX}
     */
    render() {
        const {conf, data, zoom} = this.props;

        return (
            <Heatmap conf={conf} data={data} zoom={zoom} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        conf: {
            blur: state.heatmap_conf.blur / 100,
            minOpacity: state.heatmap_conf.min_opacity / 100,
            maxOpacity: state.heatmap_conf.max_opacity / 100,
            radius: +state.heatmap_conf.radius,
        },
        data: state.heatmap_data,
        zoom: state.app.zoom,
    };
};

export default connect(
    mapStateToProps,
)(TreeHeatmap);